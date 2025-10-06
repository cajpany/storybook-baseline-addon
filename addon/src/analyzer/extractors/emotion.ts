import type { Node } from "@babel/types";
import { flatObjectToCSS } from "../utils/objectToCSS";

export interface EmotionPattern {
  type: "css-prop-object" | "css-prop-template" | "css-function" | "styled" | "global";
  cssContent: string;
  location?: {
    line: number;
    column: number;
  };
}

/**
 * Check if a node is an Emotion import
 */
export function isEmotionImport(node: any): boolean {
  if (node.type !== "ImportDeclaration") {
    return false;
  }

  const source = node.source?.value;
  return (
    source === "@emotion/react" ||
    source === "@emotion/styled" ||
    source === "@emotion/css"
  );
}

/**
 * Extract CSS from Emotion patterns
 */
export function extractEmotion(ast: Node, traverse: any): EmotionPattern[] {
  const patterns: EmotionPattern[] = [];
  let hasEmotionImport = false;

  // Check for Emotion import
  traverse(ast, {
    ImportDeclaration(path: any) {
      if (isEmotionImport(path.node)) {
        hasEmotionImport = true;
      }
    },
  });

  if (!hasEmotionImport) {
    return patterns;
  }

  // Extract from JSX css prop with object
  traverse(ast, {
    JSXAttribute(path: any) {
      if (
        path.node.name.type === "JSXIdentifier" &&
        path.node.name.name === "css" &&
        path.node.value?.type === "JSXExpressionContainer"
      ) {
        const expression = path.node.value.expression;

        // Handle object expression: css={{ ... }}
        if (expression.type === "ObjectExpression") {
          const cssContent = extractFromObjectExpression(expression);
          if (cssContent.trim()) {
            patterns.push({
              type: "css-prop-object",
              cssContent,
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
            patterns.push({
              type: "css-prop-template",
              cssContent,
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

  // Extract from css() function
  traverse(ast, {
    CallExpression(path: any) {
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "css"
      ) {
        // css({ ... })
        if (
          path.node.arguments.length >= 1 &&
          path.node.arguments[0].type === "ObjectExpression"
        ) {
          const cssContent = extractFromObjectExpression(path.node.arguments[0]);
          if (cssContent.trim()) {
            patterns.push({
              type: "css-function",
              cssContent,
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

  // Extract from styled.div`...` (similar to styled-components)
  traverse(ast, {
    TaggedTemplateExpression(path: any) {
      const tag = path.node.tag;

      // Check for styled.button or styled(Component)
      if (
        (tag.type === "MemberExpression" &&
          tag.object.type === "Identifier" &&
          tag.object.name === "styled") ||
        (tag.type === "CallExpression" &&
          tag.callee.type === "Identifier" &&
          tag.callee.name === "styled")
      ) {
        const cssContent = extractCSSFromTemplateLiteral(path.node.quasi);
        if (cssContent.trim()) {
          patterns.push({
            type: "styled",
            cssContent,
            location: path.node.loc
              ? {
                  line: path.node.loc.start.line,
                  column: path.node.loc.start.column,
                }
              : undefined,
          });
        }
      }

      // Check for Global component
      if (tag.type === "Identifier" && tag.name === "Global") {
        const cssContent = extractCSSFromTemplateLiteral(path.node.quasi);
        if (cssContent.trim()) {
          patterns.push({
            type: "global",
            cssContent,
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

  return patterns;
}

/**
 * Extract CSS from object expression
 */
function extractFromObjectExpression(obj: any): string {
  const styleObj: Record<string, any> = {};

  obj.properties.forEach((prop: any) => {
    if (prop.type === "ObjectProperty") {
      const key = getPropertyKey(prop.key);
      const value = getPropertyValue(prop.value);

      if (key && value !== null) {
        styleObj[key] = value;
      }
    }
  });

  return flatObjectToCSS(styleObj);
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
function getPropertyValue(node: any): string | number | boolean | null {
  if (node.type === "StringLiteral") {
    return node.value;
  }
  if (node.type === "NumericLiteral") {
    return node.value;
  }
  if (node.type === "BooleanLiteral") {
    return node.value;
  }
  // Skip complex expressions
  return null;
}

/**
 * Extract CSS from template literal
 */
function extractCSSFromTemplateLiteral(quasi: any): string {
  const parts: string[] = [];

  quasi.quasis.forEach((quasiElement: any, index: number) => {
    parts.push(quasiElement.value.raw);

    if (index < quasi.expressions.length) {
      parts.push("/* dynamic */");
    }
  });

  return parts.join("");
}

/**
 * Get a descriptive name for the pattern type
 */
export function getPatternTypeName(type: EmotionPattern["type"]): string {
  switch (type) {
    case "css-prop-object":
      return "css prop (object)";
    case "css-prop-template":
      return "css prop (template)";
    case "css-function":
      return "css() function";
    case "styled":
      return "styled component";
    case "global":
      return "Global component";
    default:
      return "unknown";
  }
}
