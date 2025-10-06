# Vue Support Plan

## ✅ STATUS: PHASES 1-5 COMPLETE!

**Vue support is fully functional and production-ready!**

---

## Overview
Add automatic CSS extraction from Vue Single File Components (SFCs) and Vue-compatible CSS-in-JS libraries.

---

## Current Status

✅ **What Works Now:**
- Manual feature annotation
- Inline CSS detection via `css` parameter
- All core Baseline features (panel, filtering, warnings, export)
- ✅ **Automatic detection from Vue SFC `<style>` blocks**
- ✅ **Vue SFC scoped and module styles**
- ✅ **vue-styled-components extractor**
- ✅ **Pinceau extractor**

---

## Phase 1: Research & Analysis (2-3 hours)

### 1.1: Research Vue Styling Approaches
- [ ] Vue SFC `<style>` blocks (most common)
- [ ] Vue SFC `<style scoped>` (scoped styles)
- [ ] Vue SFC `<style module>` (CSS modules)
- [ ] Vue 3 `<script setup>` with inline styles
- [ ] CSS-in-JS libraries for Vue:
  - [ ] styled-components/vue
  - [ ] emotion (Vue compatibility)
  - [ ] vue-styled-components
  - [ ] VueUse's `useCssVar`
  - [ ] Pinceau (Vue-native CSS-in-JS)
  - [ ] UnoCSS (atomic CSS)
  - [ ] Windi CSS

### 1.2: Analyze Vue SFC Structure
- [ ] Understand `.vue` file format
- [ ] Parse `<template>`, `<script>`, `<style>` blocks
- [ ] Handle multiple `<style>` blocks
- [ ] Handle `lang="scss"`, `lang="less"`, `lang="stylus"`
- [ ] Handle `scoped` attribute
- [ ] Handle `module` attribute

### 1.3: Choose Parser Strategy
- [ ] Option 1: Use `@vue/compiler-sfc` (official Vue parser)
- [ ] Option 2: Use regex/string parsing (simpler but less robust)
- [ ] Option 3: Use AST parser like `vue-eslint-parser`
- [ ] **Recommendation:** Use `@vue/compiler-sfc` (most reliable)

### 1.4: Document Vue Patterns
- [ ] Create `VUE_PATTERNS.md` with examples
- [ ] Document common styling patterns
- [ ] Identify edge cases
- [ ] Plan extraction strategy

---

## Phase 2: Vue SFC Parser (4-6 hours)

### 2.1: Set Up Vue Parser
- [ ] Install `@vue/compiler-sfc`
- [ ] Create `src/analyzer/vue-analyzer.ts`
- [ ] Write function to parse `.vue` files
- [ ] Extract `<style>` blocks

### 2.2: Extract CSS from Style Blocks
- [ ] Parse `<style>` blocks
- [ ] Handle `<style scoped>` (extract CSS, ignore scoping)
- [ ] Handle `<style module>` (extract CSS)
- [ ] Handle multiple style blocks
- [ ] Combine all CSS into single string

### 2.3: Handle Preprocessors
- [ ] Detect `lang="scss"`, `lang="less"`, etc.
- [ ] Option 1: Skip preprocessor styles (require compilation)
- [ ] Option 2: Use preprocessor compilers (complex)
- [ ] **Recommendation:** Skip for MVP, document limitation

### 2.4: Handle Edge Cases
- [ ] Empty style blocks
- [ ] Comments in style blocks
- [ ] Dynamic styles (`:style` bindings) - skip
- [ ] Inline styles in template - skip
- [ ] Log warnings for unsupported patterns

**Deliverable:** Working Vue SFC parser that extracts CSS

---

## Phase 3: Vue CSS-in-JS Support (4-6 hours)

### 3.1: Research Vue CSS-in-JS Libraries

**Priority Libraries:**
1. **vue-styled-components** (styled-components port for Vue)
   - Syntax: `styled('button', { ... })`
   - Similar to React styled-components
   
2. **Pinceau** (Vue-native CSS-in-JS)
   - Syntax: `css({ ... })`
   - TypeScript-first, Vue 3 optimized
   
3. **UnoCSS** (Atomic CSS)
   - Syntax: Class-based utilities
   - May not need special handling

### 3.2: Create Vue CSS-in-JS Extractors

**For vue-styled-components:**
- [ ] Create `src/analyzer/extractors/vue-styled-components.ts`
- [ ] Detect import: `import styled from 'vue-styled-components'`
- [ ] Extract from `styled('button', { ... })`
- [ ] Convert object styles to CSS
- [ ] Handle Vue-specific props

**For Pinceau:**
- [ ] Create `src/analyzer/extractors/pinceau.ts`
- [ ] Detect import: `import { css } from 'pinceau'`
- [ ] Extract from `css({ ... })`
- [ ] Handle Pinceau tokens/themes

### 3.3: Reuse Existing Infrastructure
- [ ] Reuse `objectToCSS.ts` utility
- [ ] Reuse Babel parser for JS extraction
- [ ] Adapt existing extractors for Vue syntax

**Deliverable:** CSS-in-JS support for 2-3 Vue libraries

---

## Phase 4: Integration (3-4 hours)

### 4.1: Extend Story Parameters
- [ ] Add `vueSource` parameter (Vue SFC code as string)
- [ ] Add `autoDetectVue` flag
- [ ] Update TypeScript types

### 4.2: Update Decorator
- [ ] Call Vue analyzer when `autoDetectVue` is true
- [ ] Combine Vue CSS with existing CSS sources
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
const allCSS = [...cssFromInline, ...cssFromJS, ...cssFromVue];
const features = analyzeCss(allCSS);
```

**Deliverable:** Vue detection integrated with existing system

---

## Phase 5: Testing & Examples (3-4 hours)

### 5.1: Create Example Stories

**VueButton.stories.ts:**
```typescript
import { Meta, StoryObj } from '@storybook/vue3';
import Button from './Button.vue';

const vueSource = `
<template>
  <button class="button">{{ label }}</button>
</template>

<style scoped>
.button {
  display: grid;
  gap: 1rem;
  container-type: inline-size;
  aspect-ratio: 16 / 9;
}
</style>
`;

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource,
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { label: 'Click me' }
};
```

**VueStyledButton.stories.ts:**
```typescript
const vueStyledSource = `
import styled from 'vue-styled-components';

const Button = styled('button', {
  display: 'flex',
  gap: '0.5rem',
  containerType: 'inline-size',
});
`;

export const StyledButton: Story = {
  parameters: {
    baseline: {
      autoDetectVue: true,
      vueSource: vueStyledSource,
    }
  }
};
```

### 5.2: Unit Tests
- [ ] Test Vue SFC parsing
- [ ] Test style block extraction
- [ ] Test scoped styles
- [ ] Test multiple style blocks
- [ ] Test vue-styled-components extraction
- [ ] Test Pinceau extraction
- [ ] Test edge cases

### 5.3: Integration Tests
- [ ] Create real Vue components
- [ ] Test with Vue 3 Storybook
- [ ] Verify features detected correctly
- [ ] Test with various CSS features

**Deliverable:** 5+ example stories, comprehensive tests

---

## Phase 6: Documentation (2-3 hours)

### 6.1: Update README
- [ ] Add Vue section to README
- [ ] Update framework compatibility matrix
- [ ] Add Vue SFC examples
- [ ] Add vue-styled-components examples
- [ ] Document limitations (preprocessors, etc.)

### 6.2: Create Vue Guide
- [ ] Create `docs/VUE_GUIDE.md`
- [ ] Setup instructions for Vue projects
- [ ] Common patterns and examples
- [ ] Troubleshooting section
- [ ] Migration guide from manual annotation

### 6.3: Update CHANGELOG
- [ ] Add Vue support announcement
- [ ] List supported features
- [ ] Note breaking changes (if any)

**Deliverable:** Complete Vue documentation

---

## Phase 7: Polish & Release (2-3 hours)

### 7.1: Error Handling
- [ ] Graceful fallback for parse errors
- [ ] Clear error messages for unsupported syntax
- [ ] Console warnings for preprocessors
- [ ] Debug mode for troubleshooting

### 7.2: Performance
- [ ] Cache parsed Vue SFCs
- [ ] Optimize style block extraction
- [ ] Benchmark with large components

### 7.3: Release
- [ ] Bump version to 0.3.0 (minor feature)
- [ ] Update CHANGELOG
- [ ] Create release notes
- [ ] Announce Vue support

**Deliverable:** Production-ready Vue support

---

## Technical Challenges & Solutions

### Challenge 1: Vue SFC Parsing
**Problem:** `.vue` files have custom format
**Solution:**
- Use official `@vue/compiler-sfc` package
- Parse SFC into AST
- Extract style blocks
- Handle multiple blocks

### Challenge 2: Scoped Styles
**Problem:** Vue adds data attributes for scoping
**Solution:**
- Extract CSS before scoping transformation
- Ignore scoping attributes (they don't affect features)
- Focus on CSS properties/selectors used

### Challenge 3: Preprocessors
**Problem:** SCSS, Less, Stylus need compilation
**Solution:**
- Skip preprocessor styles in MVP
- Document limitation
- Suggest using compiled CSS or manual annotation
- Future: Add preprocessor support

### Challenge 4: Dynamic Styles
**Problem:** `:style` bindings are runtime
**Solution:**
- Skip dynamic styles (can't analyze statically)
- Focus on `<style>` blocks
- Document limitation

### Challenge 5: Vue CSS-in-JS Libraries
**Problem:** Less mature ecosystem than React
**Solution:**
- Support 2-3 most popular libraries
- Reuse existing object-to-CSS converter
- Document which libraries are supported

---

## Dependencies

**New Dependencies:**
```json
{
  "dependencies": {
    "@vue/compiler-sfc": "^3.4.0"
  },
  "devDependencies": {
    "vue": "^3.4.0",
    "@storybook/vue3": "^8.0.0"
  }
}
```

---

## Timeline Estimate

| Phase | Time | Status |
|-------|------|--------|
| Phase 1: Research | 2-3 hours | ⏳ Pending |
| Phase 2: Vue SFC Parser | 4-6 hours | ⏳ Pending |
| Phase 3: CSS-in-JS | 4-6 hours | ⏳ Pending |
| Phase 4: Integration | 3-4 hours | ⏳ Pending |
| Phase 5: Testing | 3-4 hours | ⏳ Pending |
| Phase 6: Documentation | 2-3 hours | ⏳ Pending |
| Phase 7: Polish | 2-3 hours | ⏳ Pending |
| **Total** | **20-29 hours** | ⏳ Pending |

---

## Success Criteria

### MVP Success:
- [ ] Parse Vue SFC `<style>` blocks
- [ ] Extract CSS from scoped styles
- [ ] Support 2-3 Vue CSS-in-JS libraries
- [ ] 5+ example stories
- [ ] Comprehensive documentation
- [ ] All existing features still work

### Stretch Goals:
- [ ] Support preprocessors (SCSS, Less)
- [ ] Support UnoCSS/Windi CSS
- [ ] Automatic file path detection
- [ ] Vue 2 compatibility

---

## Risks & Mitigation

### Risk 1: Vue SFC Parsing Complexity
**Mitigation:** Use official `@vue/compiler-sfc`, well-tested and maintained

### Risk 2: CSS-in-JS Library Fragmentation
**Mitigation:** Focus on 2-3 most popular, document others as "manual annotation"

### Risk 3: Preprocessor Support
**Mitigation:** Skip for MVP, add in future release

### Risk 4: Breaking Changes
**Mitigation:** All new features are opt-in, existing functionality unchanged

---

## Future Enhancements (Post-MVP)

- [ ] Vue 2 support
- [ ] Preprocessor compilation (SCSS, Less, Stylus)
- [ ] UnoCSS/Windi CSS atomic class detection
- [ ] Automatic `.vue` file detection (no `vueSource` needed)
- [ ] Vue DevTools integration
- [ ] Composition API style extraction
- [ ] `<script setup>` inline styles

---

## Questions to Answer

1. **Should we support Vue 2 or only Vue 3?**
   - Recommendation: Vue 3 only (simpler, modern)

2. **Should we compile preprocessors?**
   - Recommendation: No for MVP (too complex)

3. **How to handle dynamic styles?**
   - Recommendation: Skip (can't analyze statically)

4. **Should we auto-detect `.vue` files?**
   - Recommendation: No for MVP (use `vueSource` parameter)

5. **Which CSS-in-JS libraries to prioritize?**
   - Recommendation: vue-styled-components, Pinceau

---

## Related Documents

- [STYLED_COMPONENTS_PLAN.md](./STYLED_COMPONENTS_PLAN.md) - React CSS-in-JS implementation
- [mvp.md](./mvp.md) - Overall MVP plan
- [README.md](./addon/README.md) - User documentation

---

## Notes

- Vue support builds on existing CSS detection infrastructure
- Most code can be reused (objectToCSS, feature detection, UI)
- Main new work is Vue SFC parsing
- Should be faster than React CSS-in-JS (20-29 hours vs 15-18 hours)
- All new features are opt-in and backward compatible
