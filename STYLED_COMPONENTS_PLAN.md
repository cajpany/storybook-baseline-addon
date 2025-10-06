# Styled-Components/CSS-in-JS Support Plan

## Overview
Add automatic CSS extraction from styled-components, Emotion, and other CSS-in-JS libraries to eliminate manual CSS annotation.

---

## Phase 1: Research & Setup (2-3 hours)

### 1.1: Research CSS-in-JS Libraries
- [ ] Audit popular CSS-in-JS libraries and their syntax
  - styled-components (template literals)
  - Emotion (both template literals and object styles)
  - Stitches (object styles)
  - Linaria (zero-runtime)
  - Vanilla Extract (TypeScript-based)
- [ ] Document common patterns for each library
- [ ] Identify which libraries are most used in Storybook projects

### 1.2: Analyze AST Requirements
- [ ] Research Babel/TypeScript AST parsing for JavaScript
- [ ] Identify AST node types for:
  - Tagged template literals (`` styled.button`...` ``)
  - Object expressions (`css={{ ... }}`)
  - Function calls (`css(...)`)
- [ ] Test AST parsing with sample code snippets

### 1.3: Design Detection Strategy
- [ ] Decide: Parse story files directly OR hook into Storybook's module system
- [ ] Design fallback strategy when detection fails
- [ ] Plan configuration options (enable/disable per library)

---

## Phase 2: JavaScript/TypeScript Parser (4-6 hours)

### 2.1: Set Up Babel Parser
- [ ] Install `@babel/parser` and `@babel/traverse`
- [ ] Create `src/analyzer/js-analyzer.ts`
- [ ] Write function to parse JavaScript/TypeScript files
- [ ] Handle both `.js`, `.jsx`, `.ts`, `.tsx` extensions

### 2.2: Extract Template Literals
- [ ] Traverse AST to find tagged template expressions
- [ ] Identify styled-components patterns:
  - `styled.div`...``
  - `styled(Component)`...``
  - `styled('div')`...``
- [ ] Extract CSS string from template literal
- [ ] Handle interpolations (skip dynamic values)

### 2.3: Extract Object Styles
- [ ] Traverse AST to find object expressions
- [ ] Identify Emotion/Stitches patterns:
  - `css={{ ... }}`
  - `styled('div', { ... })`
- [ ] Convert object notation to CSS string
  - `{ display: 'grid' }` → `display: grid;`
  - Handle camelCase → kebab-case conversion
  - Handle numeric values (add `px` where needed)

### 2.4: Handle Edge Cases
- [ ] Skip commented-out code
- [ ] Handle multi-line template literals
- [ ] Handle nested template literals
- [ ] Handle dynamic props (`${props => ...}`)
- [ ] Log warnings for unparseable patterns

---

## Phase 3: Integration with Existing Analyzer (3-4 hours)

### 3.1: Extend Story Parameters
- [ ] Add new parameter: `parameters.baseline.autoDetectJS: boolean`
- [ ] Add parameter: `parameters.baseline.jsFiles: string[]` (file paths)
- [ ] Update TypeScript types in `src/types.ts`

### 3.2: Story File Detection
- [ ] Use Storybook's module system to get story file path
- [ ] Option 1: Parse story file directly
- [ ] Option 2: Use webpack/vite loader to extract styles at build time
- [ ] Implement file reading and caching

### 3.3: Combine CSS Sources
- [ ] Merge extracted JS styles with inline CSS
- [ ] Deduplicate CSS rules
- [ ] Pass combined CSS to existing PostCSS analyzer
- [ ] Update `withGlobals.ts` to call JS analyzer

### 3.4: Update Detection Flow
```typescript
// Pseudo-code
const cssFromInline = parameters.baseline.css;
const cssFromJS = parameters.baseline.autoDetectJS 
  ? extractFromStoryFile(context.componentId)
  : [];
const allCSS = [...cssFromInline, ...cssFromJS];
const features = analyzeCss(allCSS);
```

---

## Phase 4: Library-Specific Extractors (6-8 hours)

### 4.1: Styled-Components Extractor
- [ ] Create `src/analyzer/extractors/styled-components.ts`
- [ ] Detect import: `import styled from 'styled-components'`
- [ ] Extract from `styled.div`...`` pattern
- [ ] Extract from `styled(Component)`...`` pattern
- [ ] Handle `css` helper: `css`...``
- [ ] Handle `createGlobalStyle`
- [ ] Write unit tests

### 4.2: Emotion Extractor
- [ ] Create `src/analyzer/extractors/emotion.ts`
- [ ] Detect imports: `@emotion/react`, `@emotion/styled`
- [ ] Extract from `css={{ ... }}` (object notation)
- [ ] Extract from `css`...`` (template literal)
- [ ] Extract from `styled.div`...`` (similar to styled-components)
- [ ] Handle `Global` component
- [ ] Write unit tests

### 4.3: Stitches Extractor
- [ ] Create `src/analyzer/extractors/stitches.ts`
- [ ] Detect import: `@stitches/react`
- [ ] Extract from `styled('div', { ... })`
- [ ] Handle variants and compound variants
- [ ] Convert Stitches tokens to CSS
- [ ] Write unit tests

### 4.4: Generic Object-to-CSS Converter
- [ ] Create `src/analyzer/utils/objectToCSS.ts`
- [ ] Convert camelCase to kebab-case
- [ ] Handle vendor prefixes (`WebkitTransform` → `-webkit-transform`)
- [ ] Handle numeric values (add units)
- [ ] Handle arrays (multiple values)
- [ ] Handle nested selectors
- [ ] Write comprehensive unit tests

---

## Phase 5: Configuration & Error Handling (2-3 hours)

### 5.1: Add Configuration Options
- [ ] `baseline.cssInJS.enabled: boolean` (default: true)
- [ ] `baseline.cssInJS.libraries: string[]` (whitelist)
- [ ] `baseline.cssInJS.ignoreInterpolations: boolean`
- [ ] Document configuration in README

### 5.2: Error Handling
- [ ] Gracefully handle parse errors
- [ ] Log warnings for unsupported syntax
- [ ] Fallback to manual annotation on failure
- [ ] Add debug mode for troubleshooting

### 5.3: Performance Optimization
- [ ] Cache parsed AST per file
- [ ] Only re-parse when file changes
- [ ] Limit parsing to story files (not entire codebase)
- [ ] Add performance metrics logging

---

## Phase 6: Testing & Documentation (4-5 hours)

### 6.1: Unit Tests
- [ ] Test styled-components extraction
- [ ] Test Emotion extraction (both syntaxes)
- [ ] Test Stitches extraction
- [ ] Test object-to-CSS conversion
- [ ] Test edge cases (nested, dynamic, comments)
- [ ] Aim for 80%+ code coverage

### 6.2: Integration Tests
- [ ] Create sample stories with styled-components
- [ ] Create sample stories with Emotion
- [ ] Create sample stories with Stitches
- [ ] Verify features are detected correctly
- [ ] Test with real-world component libraries

### 6.3: Documentation
- [ ] Update README with CSS-in-JS support section
- [ ] Add examples for each library
- [ ] Document limitations and known issues
- [ ] Add troubleshooting guide
- [ ] Update migration guide for users

### 6.4: Example Stories
- [ ] Create `StyledButton.stories.tsx` (styled-components)
- [ ] Create `EmotionButton.stories.tsx` (Emotion)
- [ ] Create `StitchesButton.stories.tsx` (Stitches)
- [ ] Show auto-detection working
- [ ] Show manual override when needed

---

## Phase 7: Polish & Release (2-3 hours)

### 7.1: User Experience
- [ ] Add loading indicator during parsing
- [ ] Show "Analyzing styled-components..." message
- [ ] Display parse errors in panel (not just console)
- [ ] Add "Detected from styled-components" badge

### 7.2: Backward Compatibility
- [ ] Ensure existing inline CSS still works
- [ ] Don't break manual annotations
- [ ] Make CSS-in-JS detection opt-in initially
- [ ] Provide migration path

### 7.3: Release
- [ ] Update CHANGELOG
- [ ] Bump version to 0.2.0 (minor feature)
- [ ] Create release notes
- [ ] Announce in Storybook Discord/Twitter

---

## Technical Challenges & Solutions

### Challenge 1: Dynamic Styles
**Problem:** `styled.div\`color: ${props => props.color};\``
**Solution:** 
- Skip interpolations, only extract static CSS
- Log warning: "Dynamic styles detected, may affect accuracy"
- Suggest manual annotation for dynamic features

### Challenge 2: Theme Variables
**Problem:** `styled.div\`color: ${theme.colors.primary};\``
**Solution:**
- Extract property name only: `color: <dynamic>;`
- Detect property is used, but not specific value
- Good enough for feature detection (we care about `color`, not the value)

### Challenge 3: File Path Resolution
**Problem:** How to get story file path in decorator?
**Solution:**
- Use `context.parameters.__meta` (Storybook internal)
- OR: Use webpack/vite plugin to inject file path
- OR: Require manual `jsFiles` parameter

### Challenge 4: Build Performance
**Problem:** Parsing every story file on every render
**Solution:**
- Parse at build time (webpack/vite loader)
- Cache parsed results in memory
- Only re-parse on file change (watch mode)

---

## Estimated Timeline

- **Phase 1**: 2-3 hours (Research)
- **Phase 2**: 4-6 hours (Parser)
- **Phase 3**: 3-4 hours (Integration)
- **Phase 4**: 6-8 hours (Library extractors)
- **Phase 5**: 2-3 hours (Config & errors)
- **Phase 6**: 4-5 hours (Testing & docs)
- **Phase 7**: 2-3 hours (Polish)

**Total: 23-32 hours (~3-4 days of focused work)**

---

## Success Criteria

✅ Auto-detect CSS from styled-components without manual annotation
✅ Support Emotion (both syntaxes)
✅ Support Stitches
✅ Graceful fallback when detection fails
✅ No breaking changes to existing functionality
✅ 80%+ test coverage
✅ Comprehensive documentation with examples

---

## Future Enhancements (Post-MVP)

- Support for CSS Modules (extract from `.module.css` files)
- Support for Sass/Less (compile to CSS first)
- Support for Tailwind (extract from className)
- Support for Linaria (zero-runtime CSS-in-JS)
- Support for Vanilla Extract
- Browser extension for live detection
- VS Code extension for inline warnings

---

## Decision: Build Now or Later?

**Arguments FOR building now:**
- Significantly improves DX for styled-components users
- Reduces manual work
- More accurate detection

**Arguments AGAINST building now:**
- MVP is functional without it
- Complex feature (23-32 hours)
- Manual annotation works as workaround
- Can be v0.2.0 feature

**Recommendation:** 
Ship MVP (v0.1.0) without this, gather user feedback, then build CSS-in-JS support for v0.2.0 based on demand.
