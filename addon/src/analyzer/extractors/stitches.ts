import type { Node } from "@babel/types";
import { flatObjectToCSS } from "../utils/objectToCSS";

export interface StitchesPattern {
  type: "styled" | "css" | "globalCss";
  cssContent: string;
  hasVariants: boolean;
  location?: {
    line: number;
    column: number;
  };
}

/**
 * Check if a node is a Stitches import
 */
export function isStitchesImport(node: any): boolean {
  if (node.type !== "ImportDeclaration") {
    return false;
  }

  const source = node.source?.value;
  return source === "@stitches/react" || source === "@stitches/core";
}

/**
 * Extract CSS from Stitches patterns
 */
export function extractStitches(ast: Node, traverse: any): StitchesPattern[] {
  const patterns: StitchesPattern[] = [];
  let hasStitchesImport = false;

  // Check for Stitches import
  traverse(ast, {
    ImportDeclaration(path: any) {
      if (isStitchesImport(path.node)) {
        hasStitchesImport = true;
      }
    },
  });

  if (!hasStitchesImport) {
    return patterns;
  }

  // Extract from styled('button', { ... })
  traverse(ast, {
    CallExpression(path: any) {
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "styled" &&
        path.node.arguments.length >= 2 &&
        path.node.arguments[1].type === "ObjectExpression"
      ) {
        const styleObj = path.node.arguments[1];
        const { css, hasVariants } = extractFromStitchesObject(styleObj);

        if (css.trim()) {
          patterns.push({
            type: "styled",
            cssContent: css,
            hasVariants,
            location: path.node.loc
              ? {
                  line: path.node.loc.start.line,
                  column: path.node.loc.start.column,
                }
              : undefined,
          });
        }
      }

      // Extract from css({ ... })
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "css" &&
        path.node.arguments.length >= 1 &&
        path.node.arguments[0].type === "ObjectExpression"
      ) {
        const styleObj = path.node.arguments[0];
        const { css, hasVariants } = extractFromStitchesObject(styleObj);

        if (css.trim()) {
          patterns.push({
            type: "css",
            cssContent: css,
            hasVariants,
            location: path.node.loc
              ? {
                  line: path.node.loc.start.line,
                  column: path.node.loc.start.column,
                }
              : undefined,
          });
        }
      }

      // Extract from globalCss({ ... })
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "globalCss" &&
        path.node.arguments.length >= 1 &&
        path.node.arguments[0].type === "ObjectExpression"
      ) {
        const styleObj = path.node.arguments[0];
        const { css } = extractFromStitchesObject(styleObj);

        if (css.trim()) {
          patterns.push({
            type: "globalCss",
            cssContent: css,
            hasVariants: false,
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
 * Extract CSS from Stitches object, handling variants
 */
function extractFromStitchesObject(obj: any): { css: string; hasVariants: boolean } {
  const baseStyles: Record<string, any> = {};
  let hasVariants = false;

  obj.properties.forEach((prop: any) => {
    if (prop.type === "ObjectProperty") {
      const key = getPropertyKey(prop.key);

      // Skip variants, compoundVariants, defaultVariants
      if (key === "variants" || key === "compoundVariants" || key === "defaultVariants") {
        hasVariants = true;
        return;
      }

      const value = getPropertyValue(prop.value);
      if (key && value !== null) {
        baseStyles[key] = value;
      }
    }
  });

  const css = flatObjectToCSS(baseStyles);
  return { css, hasVariants };
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
 * Handles Stitches tokens like $space$4
 */
function getPropertyValue(node: any): string | number | boolean | null {
  if (node.type === "StringLiteral") {
    // Check if it's a Stitches token (e.g., '$space$4')
    const value = node.value;
    if (typeof value === "string" && value.startsWith("$")) {
      // Skip tokens for now - they require theme context
      return null;
    }
    return value;
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
 * Get a descriptive name for the pattern type
 */
export function getPatternTypeName(type: StitchesPattern["type"]): string {
  switch (type) {
    case "styled":
      return "styled component";
    case "css":
      return "css() function";
    case "globalCss":
      return "global styles";
    default:
      return "unknown";
  }
}
