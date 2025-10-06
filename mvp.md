# Baseline Storybook Plugin - MVP Plan

## Project Overview
A Storybook addon that integrates Baseline data to help component library maintainers and consumers understand browser compatibility at the component level.

---

## Tech Stack

### **Core Technologies**
- **Storybook 9.1** *(July 2025 release)* – Current stable, includes improved testing APIs and addon ergonomics
- **TypeScript 5.9.3** – Latest compiler with deferred imports and Node 20 support
- **React 19.2.0** *(October 2025 release)* – Current stable React runtime for manager UI components
- **web-features 3.3.0** – Latest Baseline dataset from the WebDX team

### **Build & Development**
- **Vite 7.1.9** – Fast dev/build tooling aligned with Storybook 9
- **Storybook Addon Kit (main branch, Storybook 9.1)** – Official scaffolding template
- **Vitest 3.2.4** – Test runner compatible with Vite 7
- **ESLint 9.36.0 + Prettier 3.6.2** – Latest linting and formatting toolchain

### **Analysis Tools**
- **PostCSS 8.5.6** – CSS AST parsing
- **@babel/parser 7.28.4** – JS/JSX parsing for feature extraction
- **css-tree 3.1.0** – Detailed CSS AST analysis utilities
- **Cheerio 1.1.2 / JSDOM 27.0.0** – HTML parsing options as needed

---

## Architecture

### **Addon Structure**
```
storybook-addon-baseline/
├── src/
│   ├── preset.ts           # Storybook preset configuration
│   ├── manager.tsx         # Addon UI (panel/toolbar)
│   ├── preview.ts          # Story decorator/wrapper
│   ├── analyzer/           # Feature detection engine
│   │   ├── css-analyzer.ts
│   │   ├── js-analyzer.ts
│   │   └── html-analyzer.ts
│   ├── baseline/           # Baseline data integration
│   │   ├── data-loader.ts
│   │   └── matcher.ts
│   ├── components/         # UI components
│   │   ├── BaselinePanel.tsx
│   │   ├── BaselineBadge.tsx
│   │   └── CompatibilityMatrix.tsx
│   └── types/
├── package.json
└── README.md
```

---

## MVP Features (Phase 1)

### **1. Baseline Badge Display** ✅
**What:** Visual badge showing component's Baseline status
- Display badge in Storybook docs page
- Show "Baseline 2024", "Baseline 2023", "Not Baseline", etc.
- Color-coded indicators (green/yellow/red)
- Tooltip with details on hover

**How:**
- Use Storybook's `parameters` API to attach Baseline metadata
- Render badge in docs addon block
- Manual annotation initially (developers specify features used)

### **2. Feature Detection Panel** ✅
**What:** Dedicated panel showing detected web features
- List all web features used in component
- Show each feature's Baseline status
- Link to MDN/web.dev for each feature
- Group by category (CSS, JS, HTML)

**How:**
- Create custom Storybook panel addon
- Static analysis of component source code
- Display results in collapsible sections

### **3. Basic CSS Feature Detection** ✅
**What:** Automatically detect CSS features used
- Parse component CSS/styled-components
- Match against web-features data
- Identify properties, selectors, at-rules

**How:**
- Use PostCSS to parse CSS
- Extract features (e.g., `container-queries`, `subgrid`, `:has()`)
- Map to web-features IDs
- Cache results for performance

### **4. Configuration System** ✅
**What:** Allow users to set Baseline target
- Global config in `.storybook/main.js`
- Per-component override via parameters
- Choose target year (2023, 2024, 2025, etc.)

**Example:**
```js
// .storybook/main.js
export default {
  addons: [
    {
      name: 'storybook-addon-baseline',
      options: {
        baselineTarget: '2024', // or 'widely-available'
        warnOnNonBaseline: true,
      }
    }
  ]
}
```

---

## User Workflows

### **Workflow 1: Component Author**
1. Write component with modern CSS (e.g., container queries)
2. Open Storybook
3. See Baseline panel showing detected features
4. Badge shows "Not Baseline" (red)
5. Click feature to see browser support details
6. Decide: add fallback, change approach, or accept limitation

### **Workflow 2: Component Consumer**
1. Browse component library in Storybook
2. Filter components by "Baseline 2024" using toolbar
3. See only components safe for their target browsers
4. Check compatibility matrix before using component
5. Make informed decisions about adoption

### **Workflow 3: Library Maintainer**
1. Run Storybook build
2. Generate compatibility report (JSON/HTML)
3. See which components need updates
4. Track Baseline adoption over time
5. Set goals for next release

---

## Implementation Phases

### **Phase 1: Foundation (MVP)** - Week 1 ✅ COMPLETED
- [x] Set up Storybook addon boilerplate
- [x] Integrate web-features package
- [x] Create basic Baseline badge component
- [x] Implement manual feature annotation
- [x] Add configuration system
- [x] Create simple panel UI

**Deliverable:** Working addon with manual annotations ✅

### **Phase 2: CSS Detection** - Week 2 ✅ COMPLETED
- [x] Build CSS parser using PostCSS
- [x] Create feature detection rules
- [x] Map CSS features to web-features IDs
- [ ] Handle styled-components/CSS-in-JS (out of scope for MVP)
- [ ] Add caching layer (pending - Task 5)
- [x] Test with real components

**Deliverable:** Automatic CSS feature detection ✅

### **Phase 3: Enhanced UI** - Week 3
- [ ] Build compatibility matrix view
- [ ] Add filtering/search in panel
- [ ] Create toolbar for filtering stories
- [ ] Add warning system for non-Baseline features
- [ ] Improve badge design and placement
- [ ] Add export functionality

**Deliverable:** Full-featured UI

### **Phase 4: Polish & Documentation** - Week 4
- [ ] Write comprehensive README
- [ ] Create example Storybook instance
- [ ] Add demo video
- [ ] Performance optimization
- [ ] Error handling
- [ ] Publish to npm

**Deliverable:** Production-ready addon

---

## Data Flow

```
Component Source Code
        ↓
   [Analyzer Engine]
   - Parse CSS/JS/HTML
   - Extract features
        ↓
   [Feature Matcher]
   - Match to web-features
   - Get Baseline status
        ↓
   [Baseline Data]
   - Status (Newly/Widely/Not)
   - Browser support
   - MDN links
        ↓
   [Storybook UI]
   - Badge display
   - Panel details
   - Filtering
```

---

## Key Technical Challenges

### **1. Feature Detection Accuracy**
**Challenge:** Mapping code to web-features IDs
**Solution:**
- Start with high-confidence mappings (CSS properties)
- Use heuristics for complex features
- Allow manual overrides
- Build detection rules iteratively

### **2. Performance**
**Challenge:** Analyzing code shouldn't slow Storybook
**Solution:**
- Cache analysis results
- Run analysis in worker thread
- Lazy load panel data
- Only analyze visible stories

### **3. CSS-in-JS Support**
**Challenge:** Multiple styling approaches (styled-components, Emotion, CSS Modules)
**Solution:**
- Focus on CSS Modules first (most common)
- Add styled-components support
- Document limitations
- Provide manual annotation fallback

### **4. Baseline Data Updates**
**Challenge:** web-features package updates frequently
**Solution:**
- Bundle specific version with addon
- Allow users to update independently
- Cache data locally
- Provide update notifications

---

## MVP Scope Decisions

### **✅ In Scope**
- CSS feature detection (properties, selectors, at-rules)
- Manual feature annotation
- Baseline badge display
- Basic panel UI
- Configuration system
- Storybook 7+ support

### **❌ Out of Scope (Future)**
- JavaScript API detection (complex)
- HTML feature detection
- Automated testing integration
- CI/CD reporting
- Multi-framework support (Vue, Angular, Svelte)
- Real-time browser testing

---

## Success Metrics

### **For Hackathon**
- ✅ Working demo with 5+ example components
- ✅ Automatic CSS feature detection
- ✅ Clean, intuitive UI
- ✅ Good documentation
- ✅ Compelling 3-minute video

### **For Production**
- 100+ npm downloads in first month
- 5+ GitHub stars
- Positive feedback from Storybook community
- Adoption by at least one popular component library

---

## Example Component Annotation

```tsx
// Button.tsx
import React from 'react';
import './Button.css';

export const Button = ({ children }) => (
  <button className="button">{children}</button>
);

// Button.stories.tsx
export default {
  component: Button,
  parameters: {
    baseline: {
      // Manual override (optional)
      features: ['container-queries', 'css-nesting'],
      target: '2024',
    }
  }
};
```

---

## Next Steps

1. ~~**Validate Approach**~~ ✅ - Review this plan, adjust priorities
2. ~~**Set Up Project**~~ ✅ - Initialize addon with Storybook Addon Kit
3. ~~**Spike: Feature Detection**~~ ✅ - Prototype CSS parsing (1-2 hours)
4. ~~**Build MVP**~~ ✅ - Focus on Phase 1 features first
5. **Add Caching & Performance** 🔄 - Task 5: Implement caching layer and config toggles
6. **Test with Real Components** - Use popular libraries (MUI, Chakra UI)
7. **Polish UI** - Phase 3 enhancements (filtering, matrix view, export)
8. **Documentation & Demo** - Phase 4 deliverables
9. **Iterate** - Gather feedback, refine UX

---

## Questions to Consider

1. **Should we support Storybook 7 or only 8+?** (Recommend 8+ only for simplicity)
2. **Manual vs automatic detection priority?** (Start manual, add auto detection incrementally)
3. **How to handle polyfills?** (Detect but mark as "polyfilled" status)
4. **Should we analyze dependencies?** (No for MVP, too complex)
5. **Export format for reports?** (JSON first, HTML later)

**Ready to start building?** Let me know if you want to adjust the plan or dive into implementation!