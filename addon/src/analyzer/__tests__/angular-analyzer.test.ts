import { describe, it, expect } from "vitest";
import { parseAngularComponent, combineAngularCSS } from "../angular-analyzer";

describe("angular-analyzer", () => {
  describe("parseAngularComponent", () => {
    it("extracts CSS from basic styles array", () => {
      const angularCode = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  template: '<button>Click me</button>',
  styles: [\`
    .button {
      display: grid;
      gap: 1rem;
    }
  \`]
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[0].css).toContain("gap: 1rem");
      expect(result.extractedStyles[0].source).toBe("angular-component");
    });

    it("extracts CSS from multiple style strings", () => {
      const angularCode = `
@Component({
  selector: 'app-card',
  template: '...',
  styles: [
    \`.card { display: grid; }\`,
    \`.card-header { padding: 1rem; }\`
  ]
})
export class CardComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "card.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(2);
      expect(result.extractedStyles[0].css).toContain("display: grid");
      expect(result.extractedStyles[1].css).toContain("padding: 1rem");
    });

    it("handles ViewEncapsulation.Emulated", () => {
      const angularCode = `
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  template: '...',
  styles: [\`
    .button {
      container-type: inline-size;
    }
  \`],
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].encapsulation).toBe("Emulated");
      expect(result.extractedStyles[0].css).toContain("container-type");
    });

    it("handles ViewEncapsulation.None", () => {
      const angularCode = `
@Component({
  selector: 'app-button',
  template: '...',
  styles: [\`.button { display: flex; }\`],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].encapsulation).toBe("None");
    });

    it("handles ViewEncapsulation.ShadowDom", () => {
      const angularCode = `
@Component({
  selector: 'app-button',
  template: '...',
  styles: [\`.button { aspect-ratio: 16 / 9; }\`],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].encapsulation).toBe("ShadowDom");
      expect(result.extractedStyles[0].css).toContain("aspect-ratio");
    });

    it("handles empty styles array", () => {
      const angularCode = `
@Component({
  selector: 'app-button',
  template: '...',
  styles: []
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(0);
    });

    it("handles component with no styles property", () => {
      const angularCode = `
@Component({
  selector: 'app-button',
  template: '<button>Click me</button>'
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it("warns about styleUrls usage", () => {
      const angularCode = `
@Component({
  selector: 'app-button',
  template: '...',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("styleUrls");
    });

    it("extracts styles even when styleUrls is present", () => {
      const angularCode = `
@Component({
  selector: 'app-button',
  template: '...',
  styles: [\`.button { display: grid; }\`],
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(1);
      expect(result.extractedStyles[0].css).toContain("display: grid");
    });

    it("handles Angular-specific selectors", () => {
      const angularCode = `
@Component({
  selector: 'app-button',
  template: '...',
  styles: [\`
    :host {
      display: block;
    }
    
    :host-context(.dark) {
      background: black;
    }
    
    ::ng-deep .child {
      color: red;
    }
    
    .button {
      display: grid;
    }
  \`]
})
export class ButtonComponent {}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(1);
      // Should extract all CSS including Angular-specific selectors
      expect(result.extractedStyles[0].css).toContain(":host");
      expect(result.extractedStyles[0].css).toContain("display: grid");
    });

    it("handles invalid TypeScript gracefully", () => {
      const angularCode = `
@Component({
  selector: 'app-button'
  template: '...' // Missing comma
  styles: []
})
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("handles component with no decorator", () => {
      const angularCode = `
export class ButtonComponent {
  label = 'Click me';
}
      `;

      const result = parseAngularComponent(angularCode, {
        sourcePath: "button.component.ts",
      });

      expect(result.extractedStyles).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("combineAngularCSS", () => {
    it("combines multiple CSS strings", () => {
      const extracted = [
        {
          css: ".button { display: flex; }",
          source: "angular-component" as const,
        },
        {
          css: ".button { gap: 1rem; }",
          source: "angular-component" as const,
        },
      ];

      const combined = combineAngularCSS(extracted);

      expect(combined).toContain("display: flex");
      expect(combined).toContain("gap: 1rem");
      expect(combined).toContain("\n\n");
    });

    it("handles empty array", () => {
      const combined = combineAngularCSS([]);
      expect(combined).toBe("");
    });
  });
});
