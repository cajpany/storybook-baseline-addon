import { describe, it, expect } from "vitest";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

describe("AST Exploration for CSS-in-JS", () => {
  it("parses styled-components template literal", () => {
    const code = `
      import styled from 'styled-components';
      const Button = styled.button\`
        display: grid;
        container-type: inline-size;
      \`;
    `;

    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    let foundTaggedTemplate = false;
    let cssContent = "";

    traverse(ast, {
      TaggedTemplateExpression(path) {
        const tag = path.node.tag;
        
        // Check if it's styled.button or styled(Component)
        if (
          (tag.type === "MemberExpression" &&
            tag.object.type === "Identifier" &&
            tag.object.name === "styled") ||
          (tag.type === "CallExpression" &&
            tag.callee.type === "Identifier" &&
            tag.callee.name === "styled")
        ) {
          foundTaggedTemplate = true;
          
          // Extract CSS from template literal
          const quasi = path.node.quasi;
          cssContent = quasi.quasis.map((q) => q.value.raw).join("");
        }
      },
    });

    expect(foundTaggedTemplate).toBe(true);
    expect(cssContent).toContain("display: grid");
    expect(cssContent).toContain("container-type: inline-size");
  });

  it("parses Emotion object syntax", () => {
    const code = `
      /** @jsxImportSource @emotion/react */
      const Button = () => (
        <button css={{ display: 'grid', containerType: 'inline-size' }}>
          Click me
        </button>
      );
    `;

    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    let foundCssProp = false;
    const cssProperties: Record<string, string> = {};

    traverse(ast, {
      JSXAttribute(path) {
        if (
          path.node.name.type === "JSXIdentifier" &&
          path.node.name.name === "css" &&
          path.node.value?.type === "JSXExpressionContainer"
        ) {
          const expression = path.node.value.expression;
          
          if (expression.type === "ObjectExpression") {
            foundCssProp = true;
            
            expression.properties.forEach((prop) => {
              if (
                prop.type === "ObjectProperty" &&
                prop.key.type === "Identifier" &&
                prop.value.type === "StringLiteral"
              ) {
                cssProperties[prop.key.name] = prop.value.value;
              }
            });
          }
        }
      },
    });

    expect(foundCssProp).toBe(true);
    expect(cssProperties.display).toBe("grid");
    expect(cssProperties.containerType).toBe("inline-size");
  });

  it("parses Stitches styled function", () => {
    const code = `
      import { styled } from '@stitches/react';
      const Button = styled('button', {
        display: 'grid',
        containerType: 'inline-size',
      });
    `;

    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    let foundStitches = false;
    const cssProperties: Record<string, string> = {};

    traverse(ast, {
      CallExpression(path) {
        if (
          path.node.callee.type === "Identifier" &&
          path.node.callee.name === "styled" &&
          path.node.arguments.length >= 2 &&
          path.node.arguments[1].type === "ObjectExpression"
        ) {
          foundStitches = true;
          
          const styleObj = path.node.arguments[1];
          styleObj.properties.forEach((prop) => {
            if (
              prop.type === "ObjectProperty" &&
              prop.key.type === "Identifier" &&
              prop.value.type === "StringLiteral"
            ) {
              cssProperties[prop.key.name] = prop.value.value;
            }
          });
        }
      },
    });

    expect(foundStitches).toBe(true);
    expect(cssProperties.display).toBe("grid");
    expect(cssProperties.containerType).toBe("inline-size");
  });

  it("skips dynamic interpolations in template literals", () => {
    const code = `
      const Button = styled.button\`
        display: grid;
        color: \${props => props.color};
        padding: 16px;
      \`;
    `;

    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    let cssContent = "";
    let hasInterpolations = false;

    traverse(ast, {
      TaggedTemplateExpression(path) {
        const quasi = path.node.quasi;
        
        // Check for interpolations
        if (quasi.expressions.length > 0) {
          hasInterpolations = true;
        }
        
        // Extract only static parts
        cssContent = quasi.quasis.map((q) => q.value.raw).join("/* DYNAMIC */");
      },
    });

    expect(hasInterpolations).toBe(true);
    expect(cssContent).toContain("display: grid");
    expect(cssContent).toContain("padding: 16px");
    expect(cssContent).toContain("/* DYNAMIC */"); // Placeholder for interpolation
  });
});
