import type { Node } from "@babel/types";
import { flatObjectToCSS } from "../utils/objectToCSS";

export interface VueStyledPattern {
  type: "styled" | "css";
  cssContent: string;
  location?: {
    line: number;
    column: number;
  };
}

/**
 * Check if a node is a vue-styled-components import
 */
export function isVueStyledImport(node: any): boolean {
  if (node.type !== "ImportDeclaration") {
    return false;
  }

  const source = node.source?.value;
  return source === "vue-styled-components";
}

/**
 * Extract CSS from vue-styled-components patterns
 */
export function extractVueStyled(
  ast: Node,
  traverse: any
): VueStyledPattern[] {
  const patterns: VueStyledPattern[] = [];
  let hasVueStyledImport = false;

  // Check for vue-styled-components import
  traverse(ast, {
    ImportDeclaration(path: any) {
      if (isVueStyledImport(path.node)) {
        hasVueStyledImport = true;
      }
    },
  });

  if (!hasVueStyledImport) {
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
        const css = extractFromObjectExpression(styleObj);

        if (css.trim()) {
          patterns.push({
            type: "styled",
            cssContent: css,
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
  return null;
}
