# Angular CSS Patterns

## Angular Component Structure

### Basic Component with Inline Styles
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  template: '<button class="button">{{ label }}</button>',
  styles: [`
    .button {
      display: grid;
      gap: 1rem;
      container-type: inline-size;
    }
  `]
})
export class ButtonComponent {
  @Input() label: string = 'Click me';
}
```

### Multiple Style Strings
```typescript
@Component({
  selector: 'app-card',
  template: '...',
  styles: [
    `
    .card {
      display: grid;
      grid-template-rows: auto 1fr auto;
    }
    `,
    `
    .card-header {
      padding: 1rem;
      border-bottom: 1px solid #ccc;
    }
    `,
    `
    .card-footer {
      padding: 1rem;
      background: #f5f5f5;
    }
    `
  ]
})
export class CardComponent {}
```

### ViewEncapsulation Modes
```typescript
import { Component, ViewEncapsulation } from '@angular/core';

// Emulated (default) - scoped with attributes
@Component({
  selector: 'app-button',
  template: '...',
  styles: [`...`],
  encapsulation: ViewEncapsulation.Emulated
})

// None - global styles
@Component({
  selector: 'app-button',
  template: '...',
  styles: [`...`],
  encapsulation: ViewEncapsulation.None
})

// ShadowDom - native Shadow DOM
@Component({
  selector: 'app-button',
  template: '...',
  styles: [`...`],
  encapsulation: ViewEncapsulation.ShadowDom
})
```

### External Stylesheets (styleUrls)
```typescript
@Component({
  selector: 'app-button',
  template: '...',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {}
```
**Note:** Requires file system access - skip for MVP

---

## Angular-Specific Selectors

### :host Selector
```typescript
@Component({
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
    
    :host(.active) {
      background: blue;
    }
  `]
})
```
**Handling:** Extract CSS, ignore `:host` (Angular-specific)

### :host-context Selector
```typescript
@Component({
  styles: [`
    :host-context(.dark-theme) {
      background: black;
      color: white;
    }
  `]
})
```
**Handling:** Extract CSS, ignore `:host-context` (Angular-specific)

### ::ng-deep Selector
```typescript
@Component({
  styles: [`
    ::ng-deep .child-component {
      color: red;
    }
  `]
})
```
**Handling:** Extract CSS, ignore `::ng-deep` (deprecated anyway)

---

## Angular CSS-in-JS Libraries

### 1. ng-emotion (if exists)
```typescript
import { css } from 'ng-emotion';

const buttonStyles = css({
  display: 'grid',
  gap: '1rem',
  containerType: 'inline-size',
});
```

### 2. Angular CDK Styling
```typescript
import { CdkPortal } from '@angular/cdk/portal';

// CDK doesn't provide CSS-in-JS, just utilities
// Skip for MVP
```

### 3. Angular Material Theming
```scss
@use '@angular/material' as mat;

$theme: mat.define-light-theme(...);
```
**Note:** Requires SCSS compilation - skip for MVP

---

## Extraction Strategy

### What to Extract:
✅ `styles` array from `@Component` decorator
✅ All strings in styles array
✅ Template literals in styles
✅ Multiple style strings (combine)
✅ Standard CSS features

### What to Skip:
❌ `styleUrls` - requires file system access
❌ SCSS/Less in styles - requires compilation
❌ Angular Material themes - too complex
❌ Dynamic styles - runtime only
❌ `:host`, `::ng-deep`, `:host-context` - Angular-specific
❌ `@angular/cdk` utilities - not CSS

---

## AST Patterns

### Component Decorator Structure
```javascript
{
  type: "Decorator",
  expression: {
    type: "CallExpression",
    callee: { name: "Component" },
    arguments: [
      {
        type: "ObjectExpression",
        properties: [
          {
            key: { name: "selector" },
            value: { value: "app-button" }
          },
          {
            key: { name: "template" },
            value: { value: "..." }
          },
          {
            key: { name: "styles" },
            value: {
              type: "ArrayExpression",
              elements: [
                { type: "StringLiteral", value: ".button { ... }" },
                { type: "TemplateLiteral", ... }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

### Detection Logic
```typescript
1. Find Decorator nodes
2. Check if decorator name is "Component"
3. Get first argument (config object)
4. Find "styles" property
5. Extract array elements (strings/template literals)
6. Combine all CSS strings
7. Parse with existing CSS analyzer
```

---

## Edge Cases

### 1. Empty Styles Array
```typescript
@Component({
  styles: []
})
```
**Handling:** Skip, no CSS to extract

### 2. No Styles Property
```typescript
@Component({
  selector: 'app-button',
  template: '...'
})
```
**Handling:** Skip, no CSS to extract

### 3. styleUrls Only
```typescript
@Component({
  styleUrls: ['./button.css']
})
```
**Handling:** Skip, log warning about limitation

### 4. Mixed styles and styleUrls
```typescript
@Component({
  styles: [`...`],
  styleUrls: ['./button.css']
})
```
**Handling:** Extract from styles, ignore styleUrls

### 5. Template Literals with Interpolation
```typescript
const color = 'blue';
@Component({
  styles: [`
    .button {
      color: ${color}; // Dynamic - can't analyze
    }
  `]
})
```
**Handling:** Extract CSS, leave interpolation as-is (will be invalid CSS, but parser handles it)

### 6. Comments in Styles
```typescript
@Component({
  styles: [`
    /* TODO: Add more styles */
    .button {
      display: grid;
    }
  `]
})
```
**Handling:** Extract, PostCSS will handle comments

---

## Implementation Notes

1. **Use existing Babel parser** (already installed)
2. **Add TypeScript + decorators plugins** (already configured)
3. **Extract all strings from styles array**
4. **Combine into single CSS string**
5. **Reuse existing CSS analyzer** for feature detection
6. **Handle errors gracefully** with console warnings
7. **No new dependencies needed!**

---

## Comparison with Vue

### Similarities:
- Component-based styling
- Multiple style blocks
- Scoped styles (Vue scoped vs Angular ViewEncapsulation)
- Skip preprocessors for MVP

### Differences:
- **Vue:** `<style>` blocks in SFC → needs `@vue/compiler-sfc`
- **Angular:** `styles` array in decorator → use existing Babel parser
- **Angular:** Simpler (no new dependencies!)

### Implementation Advantage:
Angular is **easier** than Vue because:
- ✅ No new parser needed
- ✅ Reuse existing Babel parser
- ✅ Similar to React CSS-in-JS extraction
- ✅ Fewer edge cases

**Expected Time:** 4-6 hours (faster than Vue's 3-4 hours!)

---

## Testing Strategy

### Unit Tests (10+ cases):
1. Extract from basic styles array
2. Extract from multiple style strings
3. Extract from template literals
4. Handle empty styles array
5. Handle no styles property
6. Handle ViewEncapsulation modes
7. Handle Angular-specific selectors
8. Handle invalid syntax
9. Handle comments
10. Handle mixed styles/styleUrls

### Integration Tests:
1. Create Angular button story
2. Create Angular card story
3. Create Angular form story
4. Verify features detected correctly
5. Test with various CSS features

---

## Success Metrics

### MVP Complete When:
- ✅ Parse `@Component` decorator
- ✅ Extract from `styles` array
- ✅ Handle multiple style strings
- ✅ 3-5 example stories
- ✅ 10+ unit tests
- ✅ Documentation complete
- ✅ All existing features work

### Stretch Goals (Future):
- ⏭️ Support `styleUrls` (requires file system)
- ⏭️ Support Angular Material theming
- ⏭️ Support SCSS in styles
- ⏭️ Handle `:host` selectors intelligently

---

## Ready to Implement!

This plan is based on successful Vue implementation and should be even faster due to:
- No new dependencies
- Reuse existing Babel parser
- Similar to React CSS-in-JS patterns
- Well-understood decorator parsing

**Let's start with Phase 1!** 🚀
