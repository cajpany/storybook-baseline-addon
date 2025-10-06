import { describe, it, expect } from "vitest";
import { parseVueSFC, combineVueCSS } from "../vue-analyzer";

describe("vue-analyzer", () => {
  describe("parseVueSFC", () => {
    it("extracts CSS from basic <style> block", () => {
      const vueCode = `
<template>
  <button class="button">Click me</button>
</template>

<style>
.button {
  display: grid;
  gap: 1rem;
}
</style>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[0].css).toContain("gap: 1rem");
      expect(result.extractedStyles[0].source).toBe("vue-sfc");
      expect(result.extractedStyles[0].scoped).toBe(false);
    });

    it("extracts CSS from scoped <style> block", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<style scoped>
.button {
  container-type: inline-size;
}
</style>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].scoped).toBe(true);
      expect(result.extractedStyles[0].css).toContain("container-type");
    });

    it("extracts CSS from module <style> block", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<style module>
.button {
  aspect-ratio: 16 / 9;
}
</style>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].module).toBe(true);
      expect(result.extractedStyles[0].css).toContain("aspect-ratio");
    });

    it("extracts CSS from multiple <style> blocks", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<style>
.button {
  display: flex;
}
</style>

<style scoped>
.button {
  gap: 0.5rem;
}
</style>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.extractedStyles).toHaveLength(2);
      expect(result.extractedStyles[0].css).toContain("display: flex");
      expect(result.extractedStyles[0].scoped).toBe(false);
      expect(result.extractedStyles[1].css).toContain("gap: 0.5rem");
      expect(result.extractedStyles[1].scoped).toBe(true);
    });

    it("skips empty <style> blocks", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<style></style>
<style>   </style>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.extractedStyles).toHaveLength(0);
    });

    it("skips preprocessor styles and logs warning", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<style lang="scss">
.button {
  display: grid;
  
  &:hover {
    opacity: 0.8;
  }
}
</style>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.extractedStyles).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("preprocessors not supported");
    });

    it("handles Vue SFC with no styles", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<script>
export default {
  name: 'Button'
}
</script>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.extractedStyles).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it("handles invalid Vue SFC gracefully", () => {
      const vueCode = `
<template>
  <button>Unclosed button
</template>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      // Should not throw, but may have parse errors
      expect(result).toBeDefined();
    });

    it("detects vue-styled-components usage", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<script>
import styled from 'vue-styled-components';

const Button = styled('button', {
  display: 'flex'
});
</script>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.errors.some((e) => e.includes("CSS-in-JS"))).toBe(true);
    });

    it("detects Pinceau usage", () => {
      const vueCode = `
<template>
  <button>Click me</button>
</template>

<script setup>
import { css } from 'pinceau';

const styles = css({
  display: 'grid'
});
</script>
      `;

      const result = parseVueSFC(vueCode, { sourcePath: "Button.vue" });

      expect(result.errors.some((e) => e.includes("CSS-in-JS"))).toBe(true);
    });
  });

  describe("combineVueCSS", () => {
    it("combines multiple CSS strings", () => {
      const extracted = [
        {
          css: ".button { display: flex; }",
          source: "vue-sfc" as const,
          scoped: false,
          module: false,
          lang: "css",
        },
        {
          css: ".button { gap: 1rem; }",
          source: "vue-sfc" as const,
          scoped: true,
          module: false,
          lang: "css",
        },
      ];

      const combined = combineVueCSS(extracted);

      expect(combined).toContain("display: flex");
      expect(combined).toContain("gap: 1rem");
      expect(combined).toContain("\n\n");
    });

    it("handles empty array", () => {
      const combined = combineVueCSS([]);
      expect(combined).toBe("");
    });
  });
});
