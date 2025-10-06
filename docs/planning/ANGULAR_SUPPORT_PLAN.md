# Angular Support Plan

## Overview
Add automatic CSS extraction from Angular components (inline styles, styleUrls, and Angular CSS-in-JS solutions).

---

## Current Status

✅ **What Works Now:**
- Manual feature annotation
- Inline CSS detection via `css` parameter
- All core Baseline features (panel, filtering, warnings, export)

❌ **What Doesn't Work:**
- Automatic detection from Angular component styles
- Angular component inline styles
- Angular CSS-in-JS libraries

---

## Phase 1: Research & Analysis (2-3 hours)

### 1.1: Research Angular Styling Approaches
- [ ] Component inline styles (`styles: ['...']`)
- [ ] Component style arrays (`styles: ['...', '...']`)
- [ ] External stylesheets (`styleUrls: ['...']`)
- [ ] ViewEncapsulation modes:
  - [ ] Emulated (default, scoped with attributes)
  - [ ] None (global styles)
  - [ ] ShadowDom (native Shadow DOM)
- [ ] Angular Material theming
- [ ] CSS-in-JS libraries for Angular:
  - [ ] ng-emotion (Emotion for Angular)
  - [ ] angular-styled-components
  - [ ] @angular/cdk (CDK styling utilities)

### 1.2: Analyze Angular Component Structure
- [ ] Understand `@Component` decorator
- [ ] Parse `styles` property (string array)
- [ ] Parse `styleUrls` property (file paths - skip for MVP)
- [ ] Handle template strings in styles
- [ ] Handle ViewEncapsulation modes

### 1.3: Choose Parser Strategy
- [ ] Option 1: Use TypeScript AST parser
- [ ] Option 2: Use Angular compiler API
- [ ] Option 3: Regex/string parsing
- [ ] **Recommendation:** TypeScript AST + Babel parser (reuse existing)

### 1.4: Document Angular Patterns
- [ ] Create `ANGULAR_PATTERNS.md` with examples
- [ ] Document common styling patterns
- [ ] Identify edge cases
- [ ] Plan extraction strategy

**Deliverable:** Complete research document

---

## Phase 2: Angular Component Parser (4-6 hours)

### 2.1: Set Up Angular Parser
- [ ] Use existing Babel parser (no new dependencies!)
- [ ] Create `src/analyzer/angular-analyzer.ts`
- [ ] Write function to parse Angular components
- [ ] Extract `styles` array from `@Component` decorator

### 2.2: Extract CSS from Styles Property
- [ ] Parse `@Component({ styles: [...] })` decorator
- [ ] Extract string array from styles property
- [ ] Handle single string vs array of strings
- [ ] Handle template literals in styles
- [ ] Combine all styles into single CSS string

### 2.3: Handle ViewEncapsulation
- [ ] Detect ViewEncapsulation mode
- [ ] Extract CSS regardless of encapsulation
- [ ] Ignore Angular-specific selectors (`:host`, `::ng-deep`)
- [ ] Log info about encapsulation mode

### 2.4: Handle Edge Cases
- [ ] Empty styles array
- [ ] Comments in styles
- [ ] Dynamic styles (skip - runtime only)
- [ ] styleUrls (skip for MVP - requires file system access)
- [ ] Log warnings for unsupported patterns

### 2.5: Create Unit Tests
- [ ] Test basic styles extraction
- [ ] Test styles array with multiple strings
- [ ] Test ViewEncapsulation modes
- [ ] Test empty styles
- [ ] Test edge cases
- [ ] 10+ test cases

**Deliverable:** Working Angular component parser that extracts CSS

---

## Phase 3: Angular CSS-in-JS Support (3-4 hours)

### 3.1: Research Angular CSS-in-JS Libraries

**Priority Libraries:**
1. **ng-emotion** (Emotion for Angular)
   - Syntax: Similar to React Emotion
   - Object syntax support
   
2. **angular-styled-components** (if exists)
   - Syntax: Similar to styled-components
   
3. **Angular Material Theming**
   - Skip for MVP (requires theme context)

### 3.2: Create Angular CSS-in-JS Extractors

**For ng-emotion:**
- [ ] Create `src/analyzer/extractors/ng-emotion.ts`
- [ ] Detect import: `import { css } from 'ng-emotion'`
- [ ] Extract from `css({ ... })`
- [ ] Reuse existing Emotion extractor logic
- [ ] Convert object styles to CSS

### 3.3: Reuse Existing Infrastructure
- [ ] Reuse `objectToCSS.ts` utility
- [ ] Reuse Babel parser
- [ ] Adapt existing extractors for Angular syntax

**Deliverable:** CSS-in-JS support for 1-2 Angular libraries

---

## Phase 4: Integration (3-4 hours)

### 4.1: Extend Story Parameters
- [ ] Add `angularSource` parameter (Angular component code as string)
- [ ] Add `autoDetectAngular` flag
- [ ] Update TypeScript types

### 4.2: Update Decorator
- [ ] Call Angular analyzer when `autoDetectAngular` is true
- [ ] Combine Angular CSS with existing CSS sources
- [ ] Deduplicate features

### 4.3: Update Detection Flow
```typescript
// Pseudo-code
const cssFromInline = parameters.baseline.css;
const cssFromJS = parameters.baseline.autoDetectJS 
  ? extractFromJS(parameters.jsSource)
  : [];
const cssFromVue = parameters.baseline.autoDetectVue
  ? extractFromVue(parameters.vueSource)
  : [];
const cssFromAngular = parameters.baseline.autoDetectAngular
  ? extractFromAngular(parameters.angularSource)
  : [];
const allCSS = [...cssFromInline, ...cssFromJS, ...cssFromVue, ...cssFromAngular];
```

**Deliverable:** Angular detection integrated with existing system

---

## Phase 5: Testing & Examples (3-4 hours)

### 5.1: Create Example Stories

**AngularButton.stories.ts:**
```typescript
import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const angularSource = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  template: '<button class="button">{{ label }}</button>',
  styles: [\`
    .button {
      display: grid;
      gap: 1rem;
      container-type: inline-size;
      aspect-ratio: 16 / 9;
      
      padding: 12px 24px;
      background: linear-gradient(135deg, #dd0031 0%, #c3002f 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    
    .button:hover {
      transform: scale(1.05);
    }
    
    .button:focus-visible {
      outline: 2px solid #dd0031;
      outline-offset: 2px;
    }
  \`]
})
export class ButtonComponent {
  @Input() label: string = 'Click me';
}
`;

export const Primary: Story = {
  parameters: {
    baseline: {
      autoDetectAngular: true,
      angularSource,
    }
  }
};
```

**AngularCard.stories.ts:**
```typescript
const angularCardSource = `
@Component({
  selector: 'app-card',
  template: '...',
  styles: [\`
    .card {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: clamp(0.5rem, 2vw, 1rem);
      
      container-type: inline-size;
      aspect-ratio: 3 / 4;
      
      padding: 1.5rem;
      background: oklch(0.95 0.02 180);
      border-radius: 12px;
    }
    
    @container (min-width: 300px) {
      .card {
        padding: 2rem;
      }
    }
  \`],
  encapsulation: ViewEncapsulation.Emulated
})
export class CardComponent {}
`;
```

**AngularForm.stories.ts:**
```typescript
const angularFormSource = `
@Component({
  selector: 'app-form',
  template: '...',
  styles: [\`
    .form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      container-type: inline-size;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    input:focus-visible {
      outline: 2px solid #dd0031;
      outline-offset: 2px;
    }
    
    input:invalid {
      border-color: #ef4444;
    }
    
    .form:has(input:invalid) button {
      opacity: 0.6;
      cursor: not-allowed;
    }
  \`]
})
export class FormComponent {}
`;
```

### 5.2: Unit Tests
- [ ] Test Angular component parsing (10+ test cases)
- [ ] Test styles array extraction
- [ ] Test multiple styles strings
- [ ] Test ViewEncapsulation modes
- [ ] Test edge cases

### 5.3: Integration Tests
- [ ] Create example Angular stories (3-5 stories)
- [ ] Test with Angular components
- [ ] Verify features detected correctly
- [ ] Test with various CSS features

**Deliverable:** 3-5 example stories, 10+ unit tests

---

## Phase 6: Documentation (2-3 hours)

### 6.1: Update README
- [ ] Add Angular section to README
- [ ] Update framework compatibility matrix
- [ ] Add Angular component examples
- [ ] Add API documentation for autoDetectAngular and angularSource
- [ ] Document limitations (styleUrls, etc.)

### 6.2: Create Angular Guide
- [ ] Examples in README cover common patterns
- [ ] ANGULAR_PATTERNS.md documents technical details

### 6.3: Update CHANGELOG
- [ ] Add Angular support announcement (v0.4.0)
- [ ] List supported features
- [ ] No breaking changes

**Deliverable:** Complete Angular documentation

---

## Phase 7: Polish & Release (2-3 hours)

### 7.1: Error Handling
- [ ] Graceful fallback for parse errors
- [ ] Clear error messages for unsupported syntax
- [ ] Console warnings for styleUrls
- [ ] Full error handling in detectFeaturesFromAngular

### 7.2: Performance
- [ ] Parsing is fast (no caching needed for MVP)
- [ ] Efficient styles extraction

### 7.3: Release
- [ ] Bump version to 0.4.0
- [ ] Update CHANGELOG
- [ ] Create release notes
- [ ] All code complete and tested

**Deliverable:** Production-ready Angular support

---

## Technical Challenges & Solutions

### Challenge 1: Angular Component Parsing
**Problem:** Need to parse TypeScript decorators
**Solution:**
- Use existing Babel parser with TypeScript plugin
- Parse `@Component` decorator
- Extract `styles` property from decorator arguments

### Challenge 2: ViewEncapsulation
**Problem:** Angular has different encapsulation modes
**Solution:**
- Extract CSS regardless of encapsulation
- Ignore Angular-specific selectors (`:host`, `::ng-deep`, `:host-context`)
- Document that we analyze the raw CSS

### Challenge 3: styleUrls (External Files)
**Problem:** Components reference external CSS files
**Solution:**
- Skip for MVP (requires file system access)
- Document limitation
- Suggest using inline styles or manual annotation

### Challenge 4: Angular Material Theming
**Problem:** Material themes use SCSS mixins
**Solution:**
- Skip for MVP (requires SCSS compilation)
- Document limitation
- Suggest manual annotation for Material components

---

## Angular-Specific Patterns

### Pattern 1: Basic Component
```typescript
@Component({
  selector: 'app-button',
  template: '<button>Click</button>',
  styles: [`
    button {
      display: grid;
      gap: 1rem;
    }
  `]
})
```

### Pattern 2: Multiple Style Strings
```typescript
@Component({
  selector: 'app-card',
  template: '...',
  styles: [
    `
    .card {
      display: grid;
    }
    `,
    `
    .card-header {
      padding: 1rem;
    }
    `
  ]
})
```

### Pattern 3: ViewEncapsulation
```typescript
@Component({
  selector: 'app-button',
  template: '...',
  styles: [`...`],
  encapsulation: ViewEncapsulation.Emulated // or None, ShadowDom
})
```

### Pattern 4: Host Selectors (Angular-specific)
```typescript
@Component({
  styles: [`
    :host {
      display: block;
    }
    
    :host-context(.dark) {
      background: black;
    }
    
    ::ng-deep .child {
      color: red;
    }
  `]
})
```

**Handling:** Extract CSS, ignore Angular-specific selectors

---

## Implementation Strategy

### What to Extract:
✅ `styles` array from `@Component` decorator
✅ All strings in styles array
✅ Template literals in styles
✅ Multiple style strings (combine)

### What to Skip:
❌ `styleUrls` - requires file system access
❌ SCSS/Less in styles - requires compilation
❌ Angular Material themes - too complex
❌ Dynamic styles - runtime only
❌ `:host`, `::ng-deep` selectors - Angular-specific

### Reuse from Vue/React:
✅ Babel parser (already installed)
✅ objectToCSS utility
✅ CSS analyzer
✅ Feature detection engine
✅ UI components

---

## AST Patterns

### Angular Component Decorator
```javascript
// AST Structure
{
  type: "CallExpression",
  callee: { name: "Component" },
  arguments: [
    {
      type: "ObjectExpression",
      properties: [
        {
          key: { name: "styles" },
          value: {
            type: "ArrayExpression",
            elements: [
              { type: "StringLiteral", value: ".button { display: grid; }" },
              { type: "TemplateLiteral", ... }
            ]
          }
        }
      ]
    }
  ]
}
```

### Detection Pattern
```javascript
// Look for:
1. Decorator named "Component"
2. Object argument with "styles" property
3. Array value containing strings/template literals
4. Extract and combine all CSS strings
```

---

## Timeline Estimate

| Phase | Time | Status |
|-------|------|--------|
| Phase 1: Research | 2-3 hours | ⏳ Pending |
| Phase 2: Angular Parser | 4-6 hours | ⏳ Pending |
| Phase 3: CSS-in-JS | 3-4 hours | ⏳ Pending |
| Phase 4: Integration | 3-4 hours | ⏳ Pending |
| Phase 5: Testing | 3-4 hours | ⏳ Pending |
| Phase 6: Documentation | 2-3 hours | ⏳ Pending |
| Phase 7: Polish | 2-3 hours | ⏳ Pending |
| **Total** | **19-27 hours** | ⏳ Pending |

**Expected Efficiency:** 4-6 hours actual (similar to Vue, 5-7x faster due to code reuse)

---

## Success Criteria

### MVP Success:
- [ ] Parse Angular `@Component` decorator
- [ ] Extract CSS from `styles` array
- [ ] Handle multiple style strings
- [ ] Support 1-2 Angular CSS-in-JS libraries
- [ ] 3-5 example stories
- [ ] Comprehensive documentation
- [ ] All existing features still work

### Stretch Goals:
- [ ] Support `styleUrls` (requires file system access)
- [ ] Support Angular Material theming
- [ ] Support SCSS/Less in styles
- [ ] Angular-specific selector handling

---

## Risks & Mitigation

### Risk 1: Decorator Parsing Complexity
**Mitigation:** Use Babel parser with TypeScript plugin (already in use)

### Risk 2: styleUrls Require File System
**Mitigation:** Skip for MVP, document limitation, suggest inline styles

### Risk 3: Angular Material Complexity
**Mitigation:** Skip for MVP, suggest manual annotation for Material components

### Risk 4: ViewEncapsulation Affects CSS
**Mitigation:** Extract raw CSS, document that we analyze pre-encapsulation styles

---

## Code Reuse from Vue/React

### Already Built (Reusable):
- ✅ Babel parser with TypeScript support
- ✅ objectToCSS utility
- ✅ CSS analyzer (40+ features)
- ✅ Feature detection engine
- ✅ UI components (panel, filtering, export)
- ✅ Decorator integration pattern

### New Code Needed:
- Angular component parser (~200 lines)
- Angular-specific extractors (~100 lines)
- Unit tests (~200 lines)
- Example stories (~300 lines)
- Documentation updates (~100 lines)

**Total New Code:** ~900 lines (similar to Vue)

---

## Example Implementation

### Angular Analyzer (Pseudo-code)
```typescript
export function parseAngularComponent(
  code: string,
  options: AngularAnalyzerOptions
): AngularAnalyzerResult {
  const result = {
    source: options.sourcePath,
    extractedStyles: [],
    errors: [],
  };

  try {
    const ast = parse(code, { 
      sourceType: 'module',
      plugins: ['typescript', 'decorators-legacy']
    });

    traverse(ast, {
      Decorator(path) {
        if (isComponentDecorator(path.node)) {
          const styles = extractStylesFromDecorator(path.node);
          result.extractedStyles.push(...styles);
        }
      }
    });
  } catch (error) {
    result.errors.push(`Failed to parse: ${error.message}`);
  }

  return result;
}

function extractStylesFromDecorator(decorator) {
  // Find styles property in decorator argument
  // Extract array of strings
  // Combine into single CSS string
  // Return ExtractedAngularCSS[]
}
```

---

## Comparison with Vue Implementation

### Similarities:
- Both use component-based styling
- Both support scoped styles (Vue scoped, Angular ViewEncapsulation)
- Both can have multiple style blocks
- Both skip preprocessors for MVP
- Both reuse existing infrastructure

### Differences:
- **Vue:** Uses `@vue/compiler-sfc` (official parser)
- **Angular:** Uses Babel with TypeScript (already installed)
- **Vue:** `<style>` blocks in SFC
- **Angular:** `styles` array in decorator
- **Vue:** Template syntax with `{{ }}`
- **Angular:** Template syntax with `{{ }}`

### Implementation Complexity:
- **Vue:** Medium (new parser needed)
- **Angular:** Low (reuse existing Babel parser)

**Expected Time:** 4-6 hours (similar to Vue)

---

## API Design

### New Parameters

```typescript
interface BaselineStoryParameters {
  // ... existing parameters
  autoDetectAngular?: boolean;
  angularSource?: string;
}
```

### Usage Example

```typescript
export const MyButton: Story = {
  parameters: {
    baseline: {
      target: '2024',
      autoDetectAngular: true,
      angularSource: buttonComponentCode,
    }
  }
};
```

---

## Dependencies

### Already Installed:
- ✅ `@babel/parser` (TypeScript support)
- ✅ `@babel/traverse`
- ✅ `@babel/types`
- ✅ `postcss`
- ✅ `web-features`

### New Dependencies:
- ❌ None needed! (Reuse existing Babel parser)

**Advantage:** No new dependencies, smaller bundle size

---

## Limitations (MVP)

### Not Supported:
- ❌ `styleUrls` (external CSS files)
- ❌ SCSS/Less in styles
- ❌ Angular Material theming
- ❌ Dynamic styles (runtime)
- ❌ `:host`, `::ng-deep` selectors (Angular-specific)

### Workarounds:
- Use inline `styles` array
- Use compiled CSS (not SCSS)
- Use manual annotation for complex cases

---

## Testing Strategy

### Unit Tests:
- Parse basic component
- Parse styles array
- Parse multiple style strings
- Parse template literals
- Handle ViewEncapsulation
- Handle empty styles
- Handle invalid syntax
- 10+ test cases

### Integration Tests:
- Create real Angular components
- Test with Angular Storybook
- Verify features detected correctly
- Test with various CSS features

---

## Documentation Plan

### README Updates:
```markdown
### Using with Angular

Angular components are fully supported:

\`\`\`typescript
// Button.stories.ts
const angularSource = \`
@Component({
  selector: 'app-button',
  template: '<button>{{ label }}</button>',
  styles: [\\\`
    .button {
      display: grid;
      gap: 1rem;
      container-type: inline-size;
    }
  \\\`]
})
export class ButtonComponent {}
\`;

export const Primary: Story = {
  parameters: {
    baseline: {
      autoDetectAngular: true,
      angularSource,
    }
  }
};
\`\`\`
```

---

## Release Plan

### Version: 0.4.0 (Minor)
- New feature: Angular support
- No breaking changes
- Backward compatible

### Announcement:
```
🎉 storybook-addon-baseline v0.4.0 is here!

New: Angular component support!

✅ React + CSS-in-JS
✅ Vue SFC
✅ Angular components (NEW!)
✅ 40+ CSS features
✅ All frameworks

npm install storybook-addon-baseline
```

---

## Notes

- Angular support builds on Vue/React infrastructure
- Most code can be reused (parser, objectToCSS, feature detection)
- Main new work is Angular decorator parsing
- Should be faster than Vue (4-6 hours vs 20-27 hours planned)
- All new features are opt-in and backward compatible
- No new dependencies needed!

---

## Related Documents

- [mvp.md](./mvp.md) - Overall MVP plan
- [VUE_SUPPORT_PLAN.md](./VUE_SUPPORT_PLAN.md) - Vue implementation (reference)
- [STYLED_COMPONENTS_PLAN.md](./STYLED_COMPONENTS_PLAN.md) - React CSS-in-JS (reference)
- [README.md](../addon/README.md) - User documentation

---

## Implementation Checklist

### Before Starting:
- [ ] Review Vue implementation for patterns
- [ ] Review Babel parser usage in js-analyzer.ts
- [ ] Understand Angular decorator structure
- [ ] Set up Angular Storybook for testing

### During Implementation:
- [ ] Follow test-driven development
- [ ] Reuse existing utilities
- [ ] Keep code DRY
- [ ] Document edge cases

### Before Release:
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Example stories working
- [ ] No breaking changes
- [ ] Version bumped to 0.4.0

---

## 🎯 Estimated Timeline

**Optimistic:** 4-6 hours (with code reuse)
**Realistic:** 8-10 hours (with testing and docs)
**Pessimistic:** 15-20 hours (if unexpected issues)

**Most Likely:** 5-7 hours (based on Vue experience)

---

## Next Steps

1. ✅ Review this plan
2. ⏳ Start Phase 1: Research Angular patterns
3. ⏳ Create ANGULAR_PATTERNS.md
4. ⏳ Implement angular-analyzer.ts
5. ⏳ Add tests
6. ⏳ Create example stories
7. ⏳ Update documentation
8. ⏳ Release v0.4.0

**Ready to start when you are!** 🚀
