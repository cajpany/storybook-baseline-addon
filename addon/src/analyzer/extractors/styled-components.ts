import type { Node } from "@babel/types";

export interface StyledComponentsPattern {
  type: "styled" | "css" | "createGlobalStyle" | "keyframes";
  cssContent: string;
  location?: {
    line: number;
    column: number;
  };
}

/**
 * Check if a node is a styled-components import
 */
export function isStyledComponentsImport(node: any): boolean {
  if (node.type !== "ImportDeclaration") {
    return false;
  }

  const source = node.source?.value;
  return source === "styled-components" || source === "@emotion/styled";
}

/**
 * Extract CSS from styled-components patterns
 */
export function extractStyledComponents(
  ast: Node,
  traverse: any
): StyledComponentsPattern[] {
  const patterns: StyledComponentsPattern[] = [];
  let hasStyledImport = false;

  // Check for styled-components import
  traverse(ast, {
    ImportDeclaration(path: any) {
      if (isStyledComponentsImport(path.node)) {
        hasStyledImport = true;
      }
    },
  });

  if (!hasStyledImport) {
    return patterns;
  }

  // Extract styled.button`...` and styled(Component)`...`
  traverse(ast, {
    TaggedTemplateExpression(path: any) {
      const tag = path.node.tag;
      let isStyled = false;
      let type: StyledComponentsPattern["type"] = "styled";

      // Check for styled.button or styled.div
      if (
        tag.type === "MemberExpression" &&
        tag.object.type === "Identifier" &&
        tag.object.name === "styled"
      ) {
        isStyled = true;
        type = "styled";
      }

      // Check for styled(Component)
      if (
        tag.type === "CallExpression" &&
        tag.callee.type === "Identifier" &&
        tag.callee.name === "styled"
      ) {
        isStyled = true;
        type = "styled";
      }

      // Check for css`...`
      if (tag.type === "Identifier" && tag.name === "css") {
        isStyled = true;
        type = "css";
      }

      // Check for createGlobalStyle`...`
      if (tag.type === "Identifier" && tag.name === "createGlobalStyle") {
        isStyled = true;
        type = "createGlobalStyle";
      }

      // Check for keyframes`...`
      if (tag.type === "Identifier" && tag.name === "keyframes") {
        isStyled = true;
        type = "keyframes";
      }

      if (isStyled) {
        const quasi = path.node.quasi;
        const cssContent = extractCSSFromTemplateLiteral(quasi);

        if (cssContent.trim()) {
          patterns.push({
            type,
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
 * Extract CSS from template literal, handling interpolations
 */
function extractCSSFromTemplateLiteral(quasi: any): string {
  const parts: string[] = [];

  quasi.quasis.forEach((quasiElement: any, index: number) => {
    parts.push(quasiElement.value.raw);

    // Add placeholder for interpolations (dynamic values)
    if (index < quasi.expressions.length) {
      const expr = quasi.expressions[index];
      
      // Try to detect what kind of interpolation it is
      if (expr.type === "ArrowFunctionExpression" || expr.type === "FunctionExpression") {
        parts.push("/* dynamic function */");
      } else if (expr.type === "MemberExpression") {
        parts.push("/* dynamic property */");
      } else {
        parts.push("/* dynamic */");
      }
    }
  });

  return parts.join("");
}

/**
 * Get a descriptive name for the pattern type
 */
export function getPatternTypeName(type: StyledComponentsPattern["type"]): string {
  switch (type) {
    case "styled":
      return "styled component";
    case "css":
      return "css helper";
    case "createGlobalStyle":
      return "global styles";
    case "keyframes":
      return "keyframes animation";
    default:
      return "unknown";
  }
}
