import { describe, it, expect } from "vitest";
import {
  camelToKebab,
  addUnits,
  valueToCss,
  objectToCSS,
  flatObjectToCSS,
} from "../objectToCSS";

describe("objectToCSS utilities", () => {
  describe("camelToKebab", () => {
    it("converts camelCase to kebab-case", () => {
      expect(camelToKebab("backgroundColor")).toBe("background-color");
      expect(camelToKebab("fontSize")).toBe("font-size");
      expect(camelToKebab("marginTop")).toBe("margin-top");
    });

    it("handles vendor prefixes", () => {
      expect(camelToKebab("WebkitTransform")).toBe("-webkit-transform");
      expect(camelToKebab("MozAppearance")).toBe("-moz-appearance");
      expect(camelToKebab("msFlexDirection")).toBe("-ms-flex-direction");
    });

    it("handles already kebab-case strings", () => {
      expect(camelToKebab("display")).toBe("display");
      expect(camelToKebab("grid-template-columns")).toBe("grid-template-columns");
    });
  });

  describe("addUnits", () => {
    it("adds px to numeric values by default", () => {
      expect(addUnits("padding", 16)).toBe("16px");
      expect(addUnits("margin", 20)).toBe("20px");
      expect(addUnits("width", 100)).toBe("100px");
    });

    it("does not add units to unitless properties", () => {
      expect(addUnits("opacity", 0.5)).toBe("0.5");
      expect(addUnits("z-index", 10)).toBe("10");
      expect(addUnits("font-weight", 700)).toBe("700");
      expect(addUnits("line-height", 1.5)).toBe("1.5");
      expect(addUnits("flex", 1)).toBe("1");
    });
  });

  describe("valueToCss", () => {
    it("handles string values", () => {
      expect(valueToCss("red", "color")).toBe("red");
      expect(valueToCss("1rem", "padding")).toBe("1rem");
    });

    it("handles numeric values", () => {
      expect(valueToCss(16, "padding")).toBe("16px");
      expect(valueToCss(0.8, "opacity")).toBe("0.8");
    });

    it("handles boolean values", () => {
      expect(valueToCss(true, "display")).toBe("true");
      expect(valueToCss(false, "display")).toBe("false");
    });

    it("handles array values", () => {
      expect(valueToCss([0, "auto"], "margin")).toBe("0px auto");
      expect(valueToCss(["1fr", "2fr"], "grid-template-columns")).toBe("1fr 2fr");
    });

    it("returns null for null/undefined", () => {
      expect(valueToCss(null, "color")).toBe(null);
      expect(valueToCss(undefined, "color")).toBe(null);
    });

    it("returns null for complex objects", () => {
      expect(valueToCss({ nested: "value" }, "color")).toBe(null);
      expect(valueToCss(() => "red", "color")).toBe(null);
    });
  });

  describe("flatObjectToCSS", () => {
    it("converts simple object to CSS", () => {
      const obj = {
        display: "grid",
        gap: "1rem",
        padding: 16,
      };

      const css = flatObjectToCSS(obj);
      expect(css).toContain("display: grid;");
      expect(css).toContain("gap: 1rem;");
      expect(css).toContain("padding: 16px;");
    });

    it("handles camelCase properties", () => {
      const obj = {
        backgroundColor: "red",
        fontSize: 14,
      };

      const css = flatObjectToCSS(obj);
      expect(css).toContain("background-color: red;");
      expect(css).toContain("font-size: 14px;");
    });

    it("handles vendor prefixes", () => {
      const obj = {
        WebkitTransform: "scale(1.1)",
        MozAppearance: "none",
      };

      const css = flatObjectToCSS(obj);
      expect(css).toContain("-webkit-transform: scale(1.1);");
      expect(css).toContain("-moz-appearance: none;");
    });

    it("skips null/undefined values", () => {
      const obj = {
        display: "grid",
        color: null,
        background: undefined,
      };

      const css = flatObjectToCSS(obj);
      expect(css).toContain("display: grid;");
      expect(css).not.toContain("color");
      expect(css).not.toContain("background");
    });
  });

  describe("objectToCSS", () => {
    it("converts object with nested selectors", () => {
      const obj = {
        display: "grid",
        gap: "1rem",
        "&:hover": {
          opacity: 0.8,
        },
      };

      const css = objectToCSS(obj);
      expect(css).toContain("display: grid;");
      expect(css).toContain("gap: 1rem;");
      expect(css).toContain("&:hover {");
      expect(css).toContain("opacity: 0.8;");
      expect(css).toContain("}");
    });

    it("handles multiple nesting levels", () => {
      const obj = {
        display: "flex",
        "& > div": {
          padding: 8,
          "&:first-child": {
            marginTop: 0,
          },
        },
      };

      const css = objectToCSS(obj);
      expect(css).toContain("display: flex;");
      expect(css).toContain("& > div {");
      expect(css).toContain("padding: 8px;");
      expect(css).toContain("&:first-child {");
      expect(css).toContain("margin-top: 0px;");
    });

    it("handles media queries", () => {
      const obj = {
        display: "grid",
        "@media (min-width: 768px)": {
          gridTemplateColumns: "1fr 1fr",
        },
      };

      const css = objectToCSS(obj);
      expect(css).toContain("display: grid;");
      expect(css).toContain("@media (min-width: 768px) {");
      expect(css).toContain("grid-template-columns: 1fr 1fr;");
    });
  });
});
