import { describe, it, expect } from "vitest";

import { parseJavaScript, combineExtractedCSS } from "../js-analyzer";

describe("js-analyzer", () => {
  describe("styled-components template literals", () => {
    it("extracts CSS from styled.button", () => {
      const code = `
        import styled from 'styled-components';
        const Button = styled.button\`
          display: grid;
          container-type: inline-size;
        \`;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].source).toBe("styled-components");
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[0].css).toContain("container-type: inline-size");
    });

    it("extracts CSS from styled(Component)", () => {
      const code = `
        const StyledButton = styled(Button)\`
          display: flex;
          gap: 1rem;
        \`;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].css).toContain("display: flex");
      expect(result.extractedStyles[0].css).toContain("gap: 1rem");
    });

    it("handles interpolations by adding placeholders", () => {
      const code = `
        const Button = styled.button\`
          display: grid;
          color: \${props => props.color};
          padding: 16px;
        \`;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[0].css).toContain("/* dynamic */");
      expect(result.extractedStyles[0].css).toContain("padding: 16px");
    });

    it("extracts from css helper", () => {
      const code = `
        import { css } from 'styled-components';
        const styles = css\`
          display: grid;
          gap: 1rem;
        \`;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].css).toContain("display: grid");
    });
  });

  describe("Emotion object syntax", () => {
    it("extracts CSS from css prop with object", () => {
      const code = `
        const Button = () => (
          <button css={{ display: 'grid', containerType: 'inline-size' }}>
            Click me
          </button>
        );
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].source).toBe("emotion");
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[0].css).toContain("container-type: inline-size");
    });

    it("extracts CSS from css prop with template literal", () => {
      const code = `
        import { css } from '@emotion/react';
        const Button = () => (
          <button css={css\`
            display: grid;
            gap: 1rem;
          \`}>
            Click me
          </button>
        );
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].source).toBe("emotion");
      expect(result.extractedStyles[0].css).toContain("display: grid");
    });

    it("extracts from css() function with object", () => {
      const code = `
        import { css } from '@emotion/react';
        const buttonStyles = css({
          display: 'grid',
          gap: '1rem',
        });
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[0].css).toContain("gap: 1rem");
    });
  });

  describe("Stitches object syntax", () => {
    it("extracts CSS from styled function", () => {
      const code = `
        import { styled } from '@stitches/react';
        const Button = styled('button', {
          display: 'grid',
          containerType: 'inline-size',
        });
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].source).toBe("stitches");
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[0].css).toContain("container-type: inline-size");
    });
  });

  describe("object to CSS conversion", () => {
    it("converts camelCase to kebab-case", () => {
      const code = `
        const styles = css({
          containerType: 'inline-size',
          gridTemplateColumns: '1fr 1fr',
        });
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles[0].css).toContain("container-type");
      expect(result.extractedStyles[0].css).toContain("grid-template-columns");
    });

    it("handles vendor prefixes", () => {
      const code = `
        const styles = css({
          WebkitTransform: 'scale(1.1)',
          MozAppearance: 'none',
        });
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles[0].css).toContain("-webkit-transform");
      expect(result.extractedStyles[0].css).toContain("-moz-appearance");
    });

    it("handles numeric values", () => {
      const code = `
        const styles = css({
          padding: 16,
          opacity: 0.8,
          zIndex: 10,
        });
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles[0].css).toContain("padding: 16");
      expect(result.extractedStyles[0].css).toContain("opacity: 0.8");
      expect(result.extractedStyles[0].css).toContain("z-index: 10");
    });
  });

  describe("multiple extractions", () => {
    it("extracts from multiple styled components", () => {
      const code = `
        const Button = styled.button\`
          display: grid;
        \`;
        
        const Card = styled.div\`
          display: flex;
        \`;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(2);
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[1].css).toContain("display: flex");
    });

    it("combines extracted CSS", () => {
      const code = `
        const Button = styled.button\`
          display: grid;
        \`;
        
        const Card = styled.div\`
          display: flex;
        \`;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });
      const combined = combineExtractedCSS(result.extractedStyles);

      expect(combined).toContain("display: grid");
      expect(combined).toContain("display: flex");
    });
  });

  describe("error handling", () => {
    it("handles invalid JavaScript gracefully", () => {
      const code = `
        const Button = styled.button\`
          display: grid
        // Missing closing backtick
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Failed to parse");
    });

    it("returns empty array for files with no CSS-in-JS", () => {
      const code = `
        const Button = () => <button>Click me</button>;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("location tracking", () => {
    it("tracks location of extracted styles", () => {
      const code = `
        const Button = styled.button\`
          display: grid;
        \`;
      `;

      const result = parseJavaScript(code, { sourcePath: "test.tsx" });

      expect(result.extractedStyles[0].location).toBeDefined();
      expect(result.extractedStyles[0].location?.line).toBeGreaterThan(0);
    });
  });
});
