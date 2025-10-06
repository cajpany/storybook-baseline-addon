# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-01-XX

### Added - Vue Support 🎉

**Vue Single File Component (SFC) Support:**
- Vue SFC parser using `@vue/compiler-sfc`
- Automatic CSS extraction from `<style>` blocks
- Support for `<style scoped>` and `<style module>`
- Multiple style blocks handling
- Preprocessor detection with warnings (SCSS, Less, Stylus)

**Vue CSS-in-JS Support:**
- vue-styled-components extractor
- Pinceau extractor
- Object syntax to CSS conversion
- `autoDetectVue` and `vueSource` parameters

**Example Stories:**
- 5 Vue example stories (VueButton, VueCard, VueNavigation, VueForm, VueStyledComponents)
- 11 total Vue stories demonstrating modern CSS features

**Documentation:**
- Complete Vue support documentation in README
- VUE_SUPPORT_PLAN.md with implementation details
- Framework compatibility matrix updated

### Changed

- Updated framework compatibility matrix (Vue now fully supported)
- Improved error handling in parsers
- Enhanced console warnings for unsupported features
- Version bumped to 0.3.0

### Fixed

- Vue SFC parser error handling improved
- Template literal parsing errors resolved
- Browser compatibility data display issues fixed

## [0.2.0] - 2025-01-XX

### Added - CSS-in-JS Support 🎨

**React CSS-in-JS Support:**
- styled-components extractor (template literals)
- Emotion extractor (object + template syntax)
- Stitches extractor (object syntax)
- `autoDetectJS` and `jsSource` parameters
- `cssInJS` configuration object

**Enhanced Feature Detection:**
- Expanded from 15 to 40+ CSS features
- Added: gap, aspect-ratio, logical properties, oklch, color-mix, clamp
- Added: :has(), :is(), :where(), :focus-visible, :focus-within
- Added: container-queries, backdrop-filter, subgrid
- Added: scroll-snap, overscroll-behavior, css-masks

**Example Stories:**
- 5 React CSS-in-JS example stories
- 5 Vue example stories
- 26 total example stories

**Utilities:**
- `objectToCSS` utility for converting JS objects to CSS
- `camelToKebab` conversion
- Unit handling for numeric values
- Nested selector support

### Changed

- Enhanced UI with better filtering
- Improved search functionality
- Better browser compatibility matrix display
- Updated documentation with CSS-in-JS examples

### Fixed

- Browser support data access bug
- Feature detection accuracy improvements

## [0.1.0] - 2025-01-XX

### Added - Initial Release 🚀

**Core Features:**
- Manual feature annotation via `features` parameter
- Automatic CSS detection from inline CSS
- Baseline panel showing detected features
- Browser compatibility matrix
- Toolbar integration for Baseline target selection

**UI Features:**
- Feature list with Baseline status (WIDELY, NEWLY, NOT)
- Search and filtering by support level
- Warning system for non-Baseline features
- Export functionality (JSON, CSV, HTML)
- Collapsible browser compatibility matrix

**Configuration:**
- `target` parameter (2024, 2023, 2022, widely-available, newly-available)
- `features` parameter for manual annotation
- `css` parameter for inline CSS
- `autoDetect` parameter for automatic detection
- `warnOnNonBaseline` parameter
- `ignoreWarnings` parameter

**Framework Support:**
- React
- Vue
- Angular
- Svelte
- Web Components
- All Storybook-supported frameworks

**Documentation:**
- Comprehensive README
- MVP plan
- Example stories

### Technical

- Built with TypeScript
- Uses `web-features` package for Baseline data
- PostCSS for CSS parsing
- Babel for JavaScript parsing
- Storybook 8+ compatibility

---

## Upgrade Guide

### From 0.2.0 to 0.3.0

**New Features:**
- Vue SFC support via `autoDetectVue` and `vueSource` parameters
- No breaking changes - fully backward compatible

**Example:**
```typescript
// New Vue SFC support
export const MyStory: Story = {
  parameters: {
    baseline: {
      autoDetectVue: true,
      vueSource: vueComponentCode,
    }
  }
};
```

### From 0.1.0 to 0.2.0

**New Features:**
- CSS-in-JS support via `autoDetectJS` and `jsSource` parameters
- 40+ CSS features now detected
- No breaking changes - fully backward compatible

**Example:**
```typescript
// New CSS-in-JS support
export const MyStory: Story = {
  parameters: {
    baseline: {
      autoDetectJS: true,
      jsSource: styledComponentsCode,
    }
  }
};
```

---

## Links

- [npm package](https://www.npmjs.com/package/storybook-addon-baseline)
- [GitHub repository](https://github.com/cajpany/storybook-baseline-addon)
- [Storybook addon catalog](https://storybook.js.org/addons/storybook-addon-baseline)
- [Baseline initiative](https://web.dev/baseline)
- [web-features package](https://github.com/web-platform-dx/web-features)
