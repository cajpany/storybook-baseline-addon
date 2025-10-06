import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import type { Node } from "@babel/types";

// Handle both ESM and CJS imports
const traverse = (traverseModule as any).default || traverseModule;

export interface AngularAnalyzerOptions {
  sourcePath: string;
  filename?: string;
}

export interface ExtractedAngularCSS {
  css: string;
  source: "angular-component" | "ng-emotion" | "unknown";
  encapsulation?: string;
  location?: {
    line: number;
    column: number;
  };
}

export interface AngularAnalyzerResult {
  source: string;
  extractedStyles: ExtractedAngularCSS[];
  errors: string[];
}

/**
 * Parse Angular component and extract CSS from styles array
 */
export function parseAngularComponent(
  code: string,
  options: AngularAnalyzerOptions
): AngularAnalyzerResult {
  const result: AngularAnalyzerResult = {
    source: options.sourcePath,
    extractedStyles: [],
    errors: [],
  };

  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "decorators-legacy"],
    });

    traverse(ast, {
      Decorator(path: any) {
        if (isComponentDecorator(path.node)) {
          const styles = extractStylesFromDecorator(path.node);
          result.extractedStyles.push(...styles);
        }
      },
    });

    if (result.extractedStyles.length === 0) {
      // Check if styleUrls is used
      const hasStyleUrls = code.includes("styleUrls");
      if (hasStyleUrls) {
        result.errors.push(
          "Component uses 'styleUrls' - external CSS files not supported. Use inline 'styles' array or manual annotation."
        );
      }
    }
  } catch (error) {
    result.errors.push(
      `Failed to parse Angular component ${options.sourcePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return result;
}

/**
 * Check if a decorator is a Component decorator
 */
function isComponentDecorator(decorator: any): boolean {
  if (decorator.expression.type === "CallExpression") {
    const callee = decorator.expression.callee;
    return callee.type === "Identifier" && callee.name === "Component";
  }
  return false;
}

/**
 * Extract styles from Component decorator
 */
function extractStylesFromDecorator(decorator: any): ExtractedAngularCSS[] {
  const extracted: ExtractedAngularCSS[] = [];

  if (
    decorator.expression.type !== "CallExpression" ||
    decorator.expression.arguments.length === 0
  ) {
    return extracted;
  }

  const configObject = decorator.expression.arguments[0];
  if (configObject.type !== "ObjectExpression") {
    return extracted;
  }

  let encapsulation: string | undefined;

  // First pass: find encapsulation mode
  configObject.properties.forEach((prop: any) => {
    if (prop.type === "ObjectProperty" || prop.type === "Property") {
      const keyName = prop.key.name || prop.key.value;

      if (keyName === "encapsulation") {
        if (prop.value.type === "MemberExpression") {
          encapsulation = prop.value.property.name;
        }
      }
    }
  });

  // Second pass: extract styles with encapsulation info
  configObject.properties.forEach((prop: any) => {
    if (prop.type === "ObjectProperty" || prop.type === "Property") {
      const keyName = prop.key.name || prop.key.value;

      // Extract styles array
      if (keyName === "styles" && prop.value.type === "ArrayExpression") {
        prop.value.elements.forEach((element: any, index: number) => {
          const css = extractCSSFromElement(element);
          if (css) {
            extracted.push({
              css,
              source: "angular-component",
              encapsulation,
              location: element.loc
                ? {
                    line: element.loc.start.line,
                    column: element.loc.start.column,
                  }
                : undefined,
            });
          }
        });
      }
    }
  });

  return extracted;
}

/**
 * Extract CSS string from array element (StringLiteral or TemplateLiteral)
 */
function extractCSSFromElement(element: any): string | null {
  if (!element) {
    return null;
  }

  // Handle string literal
  if (element.type === "StringLiteral") {
    return element.value.trim();
  }

  // Handle template literal
  if (element.type === "TemplateLiteral") {
    // Combine all quasis (static parts)
    const css = element.quasis.map((quasi: any) => quasi.value.raw).join("");
    return css.trim();
  }

  return null;
}

/**
 * Combine multiple extracted CSS strings into one
 */
export function combineAngularCSS(extracted: ExtractedAngularCSS[]): string {
  return extracted.map((item) => item.css).join("\n\n");
}

/**
 * Get a descriptive name for the source type
 */
export function getSourceTypeName(
  source: ExtractedAngularCSS["source"]
): string {
  switch (source) {
    case "angular-component":
      return "Angular Component";
    case "ng-emotion":
      return "ng-emotion";
    default:
      return "unknown";
  }
}
