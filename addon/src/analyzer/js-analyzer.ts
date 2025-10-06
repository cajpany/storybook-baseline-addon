import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import type { Node } from "@babel/types";

// Handle both ESM and CJS imports
const traverse = (traverseModule as any).default || traverseModule;

export interface JsAnalyzerOptions {
  sourcePath: string;
  sourceType?: "module" | "script";
  libraries?: Array<"styled-components" | "emotion" | "stitches" | "all">;
  ignoreInterpolations?: boolean;
}

export interface ExtractedCSS {
  css: string;
  source: "styled-components" | "emotion" | "stitches" | "unknown";
  location?: {
    line: number;
    column: number;
  };
}

export interface JsAnalyzerResult {
  source: string;
  extractedStyles: ExtractedCSS[];
  errors: string[];
}

/**
 * Parse JavaScript/TypeScript file and extract CSS from CSS-in-JS libraries
 */
export function parseJavaScript(
  code: string,
  options: JsAnalyzerOptions
): JsAnalyzerResult {
  const result: JsAnalyzerResult = {
    source: options.sourcePath,
    extractedStyles: [],
    errors: [],
  };

  try {
    const ast = parse(code, {
      sourceType: options.sourceType || "module",
      plugins: [
        "typescript",
        "jsx",
        "decorators-legacy",
        "classProperties",
        "objectRestSpread",
      ],
      sourceFilename: options.sourcePath,
    });

    // Extract from styled-components and similar libraries
    extractFromTaggedTemplates(ast, result);

    // Extract from Emotion object syntax
    extractFromObjectExpressions(ast, result);

    // Extract from JSX css prop
    extractFromJSXAttributes(ast, result);
  } catch (error) {
    result.errors.push(
      `Failed to parse ${options.sourcePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return result;
}

/**
 * Extract CSS from tagged template literals (styled-components, Linaria)
 */
function extractFromTaggedTemplates(ast: Node, result: JsAnalyzerResult): void {
  traverse(ast, {
    TaggedTemplateExpression(path) {
      const tag = path.node.tag;
      let isStyledComponent = false;
      let source: ExtractedCSS["source"] = "unknown";

      // Check for styled.button or styled(Component)
      if (tag.type === "MemberExpression") {
        if (
          tag.object.type === "Identifier" &&
          (tag.object.name === "styled" || tag.object.name === "css")
        ) {
          isStyledComponent = true;
          source = "styled-components";
        }
      } else if (tag.type === "CallExpression") {
        if (
          tag.callee.type === "Identifier" &&
          (tag.callee.name === "styled" || tag.callee.name === "css")
        ) {
          isStyledComponent = true;
          source = "styled-components";
        }
      } else if (tag.type === "Identifier") {
        if (tag.name === "css") {
          isStyledComponent = true;
          source = "emotion";
        }
      }

      if (isStyledComponent) {
        const quasi = path.node.quasi;
        const cssContent = extractCSSFromTemplateLiteral(quasi);

        if (cssContent.trim()) {
          result.extractedStyles.push({
            css: cssContent,
            source,
            location: path.node.loc
              ? {
                  line: path.node.loc.start.line,
                  column: path.node.loc.start.column,
                }
              : undefined,
          });
        }
      }
    },
  });
}

/**
 * Extract CSS from template literal, handling interpolations
 */
function extractCSSFromTemplateLiteral(quasi: any): string {
  const parts: string[] = [];

  quasi.quasis.forEach((quasiElement: any, index: number) => {
    parts.push(quasiElement.value.raw);

    // Add placeholder for interpolations (dynamic values)
    if (index < quasi.expressions.length) {
      parts.push("/* dynamic */");
    }
  });

  return parts.join("");
}

/**
 * Extract CSS from object expressions (Stitches, Emotion object syntax)
 */
function extractFromObjectExpressions(ast: Node, result: JsAnalyzerResult): void {
  traverse(ast, {
    CallExpression(path) {
      // Check for styled('button', { ... }) pattern (Stitches)
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "styled" &&
        path.node.arguments.length >= 2 &&
        path.node.arguments[1].type === "ObjectExpression"
      ) {
        const styleObj = path.node.arguments[1];
        const css = objectToCSS(styleObj);

        if (css.trim()) {
          result.extractedStyles.push({
            css,
            source: "stitches",
            location: path.node.loc
              ? {
                  line: path.node.loc.start.line,
                  column: path.node.loc.start.column,
                }
              : undefined,
          });
        }
      }

      // Check for css({ ... }) pattern (Emotion, Stitches)
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "css" &&
        path.node.arguments.length >= 1 &&
        path.node.arguments[0].type === "ObjectExpression"
      ) {
        const styleObj = path.node.arguments[0];
        const css = objectToCSS(styleObj);

        if (css.trim()) {
          result.extractedStyles.push({
            css,
            source: "emotion",
            location: path.node.loc
              ? {
                  line: path.node.loc.start.line,
                  column: path.node.loc.start.column,
                }
              : undefined,
          });
        }
      }
    },
  });
}

/**
 * Extract CSS from JSX css prop (Emotion)
 */
function extractFromJSXAttributes(ast: Node, result: JsAnalyzerResult): void {
  traverse(ast, {
    JSXAttribute(path) {
      if (
        path.node.name.type === "JSXIdentifier" &&
        path.node.name.name === "css" &&
        path.node.value?.type === "JSXExpressionContainer"
      ) {
        const expression = path.node.value.expression;

        // Handle object expression: css={{ ... }}
        if (expression.type === "ObjectExpression") {
          const css = objectToCSS(expression);

          if (css.trim()) {
            result.extractedStyles.push({
              css,
              source: "emotion",
              location: path.node.loc
                ? {
                    line: path.node.loc.start.line,
                    column: path.node.loc.start.column,
                  }
                : undefined,
            });
          }
        }

        // Handle tagged template: css={css`...`}
        if (expression.type === "TaggedTemplateExpression") {
          const cssContent = extractCSSFromTemplateLiteral(expression.quasi);

          if (cssContent.trim()) {
            result.extractedStyles.push({
              css: cssContent,
              source: "emotion",
              location: path.node.loc
                ? {
                    line: path.node.loc.start.line,
                    column: path.node.loc.start.column,
                  }
                : undefined,
            });
          }
        }
      }
    },
  });
}

/**
 * Convert JavaScript object to CSS string
 */
function objectToCSS(obj: any): string {
  const cssLines: string[] = [];

  if (obj.type !== "ObjectExpression") {
    return "";
  }

  obj.properties.forEach((prop: any) => {
    if (prop.type === "ObjectProperty") {
      const key = getPropertyKey(prop.key);
      const value = getPropertyValue(prop.value);

      if (key && value !== null) {
        // Convert camelCase to kebab-case
        const cssProperty = camelToKebab(key);
        cssLines.push(`${cssProperty}: ${value};`);
      }
    }
  });

  return cssLines.join("\n");
}

/**
 * Get property key from AST node
 */
function getPropertyKey(node: any): string | null {
  if (node.type === "Identifier") {
    return node.name;
  }
  if (node.type === "StringLiteral") {
    return node.value;
  }
  return null;
}

/**
 * Get property value from AST node
 */
function getPropertyValue(node: any): string | null {
  if (node.type === "StringLiteral") {
    return node.value;
  }
  if (node.type === "NumericLiteral") {
    // Add 'px' for numeric values (except unitless properties)
    const unitlessProperties = [
      "opacity",
      "z-index",
      "font-weight",
      "line-height",
      "flex",
      "flex-grow",
      "flex-shrink",
      "order",
    ];
    return `${node.value}`;
  }
  if (node.type === "BooleanLiteral") {
    return node.value.toString();
  }
  // Skip complex expressions (functions, identifiers, etc.)
  return null;
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  // Handle vendor prefixes (WebkitTransform -> -webkit-transform)
  if (/^[A-Z]/.test(str)) {
    str = `-${str}`;
  }

  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Combine multiple CSS strings into one
 */
export function combineExtractedCSS(extracted: ExtractedCSS[]): string {
  return extracted.map((item) => item.css).join("\n\n");
}
