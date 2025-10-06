# Deployment Guide

This guide explains how to publish the Storybook Addon Baseline to npm and make it available to developers worldwide.

---

## 📦 Publishing Overview

**Where to Publish:**
- **npm Registry** - https://www.npmjs.com/ (required)
- **Storybook Addon Catalog** - https://storybook.js.org/addons (automatic)

**What Developers Get:**
- Install via `npm install storybook-addon-baseline`
- Discover via Storybook addon catalog
- Use in their Storybook projects

---

## 🚀 Step-by-Step Publishing

### Step 1: Pre-Publishing Checklist

Before publishing, ensure everything is ready:

- [ ] All features are tested and working
- [ ] README.md is comprehensive and up-to-date
- [ ] CHANGELOG.md exists and documents changes
- [ ] LICENSE file exists (MIT recommended)
- [ ] package.json has correct metadata
- [ ] GitHub repository is created and public
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Version number is correct

### Step 2: Update package.json

Ensure your `addon/package.json` has the correct metadata:

```json
{
  "name": "storybook-addon-baseline",
  "version": "0.3.0",
  "description": "Automatically detect and display browser compatibility for your Storybook components using Baseline data. Supports React, Vue, and all frameworks.",
  "keywords": [
    "storybook",
    "addon",
    "baseline",
    "browser-compatibility",
    "web-features",
    "css-detection",
    "css-in-js",
    "styled-components",
    "emotion",
    "vue",
    "react",
    "a11y",
    "accessibility"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/storybook-addon-baseline"
  },
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "homepage": "https://github.com/YOUR_USERNAME/storybook-addon-baseline#readme",
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/storybook-addon-baseline/issues"
  },
  "storybook": {
    "displayName": "Baseline",
    "supportedFrameworks": [
      "react",
      "vue",
      "angular",
      "web-components",
      "html",
      "svelte"
    ],
    "icon": "https://user-images.githubusercontent.com/YOUR_ICON.png"
  }
}
```

**Important Fields:**
- `name`: Package name on npm (must be unique)
- `version`: Semantic version (0.3.0 for Vue support)
- `description`: Short description (< 140 chars)
- `keywords`: For discoverability in npm and Storybook catalog
- `repository`: Your GitHub repo URL
- `storybook.displayName`: Name shown in Storybook UI
- `storybook.supportedFrameworks`: Which frameworks work

### Step 3: Create/Update LICENSE

Create `addon/LICENSE` file:

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Step 4: Create CHANGELOG.md

Create `addon/CHANGELOG.md`:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-01-XX

### Added
- Vue Single File Component (SFC) support
- Vue scoped and module styles extraction
- vue-styled-components extractor
- Pinceau extractor
- `autoDetectVue` and `vueSource` parameters
- 3 Vue example stories
- Vue documentation in README

### Changed
- Updated framework compatibility matrix
- Improved error handling in parsers

## [0.2.0] - 2025-01-XX

### Added
- CSS-in-JS support for React
- styled-components extractor
- Emotion extractor (object + template syntax)
- Stitches extractor
- `autoDetectJS` and `jsSource` parameters
- Expanded feature detection to 40+ CSS features
- 5 CSS-in-JS example stories

### Changed
- Enhanced UI with filtering, search, warnings
- Added export functionality (JSON, CSV, HTML)
- Improved browser compatibility matrix

## [0.1.0] - 2025-01-XX

### Added
- Initial release
- Manual feature annotation
- Automatic CSS detection
- Baseline panel with browser compatibility
- Toolbar integration
- Support for all Storybook frameworks
```

### Step 5: Check Package Name Availability

```bash
# Check if name is available
npm search storybook-addon-baseline

# If taken, try alternatives:
# - @your-username/storybook-addon-baseline (scoped)
# - storybook-baseline-addon
# - baseline-storybook-addon
```

### Step 6: Create npm Account

If you don't have an npm account:

1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email

### Step 7: Login to npm

```bash
cd addon
npm login

# Enter your credentials:
# Username: your-username
# Password: your-password
# Email: your-email@example.com
```

### Step 8: Build the Addon

```bash
# Make sure you're in the addon directory
cd addon

# Install dependencies
npm install

# Run tests
npm test

# Build the addon
npm run build

# Verify dist/ folder exists with compiled files
ls -la dist/
```

### Step 9: Test Locally (Optional but Recommended)

Before publishing, test the addon in a real project:

```bash
# In addon directory, create a tarball
npm pack

# This creates: storybook-addon-baseline-0.3.0.tgz

# In a test Storybook project
npm install /path/to/storybook-addon-baseline-0.3.0.tgz

# Test it works, then remove
npm uninstall storybook-addon-baseline
```

### Step 10: Publish to npm

```bash
# Dry run first (see what will be published)
npm publish --dry-run

# Review the output, then publish for real
npm publish

# If using a scoped package (@username/package)
npm publish --access public
```

**Success!** Your addon is now live at:
- https://www.npmjs.com/package/storybook-addon-baseline

---

## 🔄 Publishing Updates

### Versioning Strategy

Use semantic versioning (semver):

- **Patch** (0.3.0 → 0.3.1): Bug fixes, no new features
- **Minor** (0.3.0 → 0.4.0): New features, backward compatible
- **Major** (0.3.0 → 1.0.0): Breaking changes

### Publishing a New Version

```bash
# 1. Make your changes and commit them
git add .
git commit -m "feat: add new feature"

# 2. Update version in package.json
npm version patch   # for bug fixes
npm version minor   # for new features
npm version major   # for breaking changes

# This creates a git tag automatically

# 3. Push to GitHub
git push origin main --tags

# 4. Build and publish
npm run build
npm publish

# 5. Update CHANGELOG.md
# Add entry for the new version

# 6. Create GitHub release
# Go to GitHub > Releases > Create new release
# Use the tag created by npm version
```

---

## 📊 Storybook Addon Catalog

Your addon will automatically appear in the Storybook catalog within 24 hours of publishing to npm.

**Catalog URL:** https://storybook.js.org/addons/storybook-addon-baseline

**What Gets Indexed:**
- Package name and description
- README.md content
- Download statistics
- GitHub stars
- Supported frameworks
- Keywords/tags
- Last updated date

**To Optimize Catalog Listing:**
1. Write a clear, comprehensive README
2. Add relevant keywords to package.json
3. Include screenshots/GIFs in README
4. Add badges (npm version, downloads, etc.)
5. Keep the addon updated

---

## 👨‍💻 How Developers Will Use Your Addon

### Installation

```bash
npm install --save-dev storybook-addon-baseline
# or
yarn add -D storybook-addon-baseline
# or
pnpm add -D storybook-addon-baseline
```

### Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs',
    'storybook-addon-baseline', // 👈 Your addon
  ],
};

export default config;
```

### Usage in Stories

**React with CSS-in-JS:**
```typescript
export const MyButton: Story = {
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: styledComponentsCode,
    }
  }
};
```

**Vue with SFC:**
```typescript
export const MyButton: Story = {
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueSFCCode,
    }
  }
};
```

**Manual Annotation (All Frameworks):**
```typescript
export const MyButton: Story = {
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'container-queries', 'flexbox-gap'],
    }
  }
};
```

---

## 🤖 Automated Publishing with GitHub Actions

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: |
          cd addon
          npm install
      
      - name: Run tests
        run: |
          cd addon
          npm test
      
      - name: Build
        run: |
          cd addon
          npm run build
      
      - name: Publish to npm
        run: |
          cd addon
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

**Setup:**
1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Create a new token with "Automation" type
3. Go to your GitHub repo > Settings > Secrets
4. Add secret: `NPM_TOKEN` with your npm token

**Usage:**
```bash
# Create and push a tag
npm version minor
git push origin main --tags

# GitHub Actions will automatically publish
```

---

## 📈 Post-Publishing Tasks

### 1. Add Badges to README

```markdown
[![npm version](https://badge.fury.io/js/storybook-addon-baseline.svg)](https://www.npmjs.com/package/storybook-addon-baseline)
[![Downloads](https://img.shields.io/npm/dm/storybook-addon-baseline.svg)](https://www.npmjs.com/package/storybook-addon-baseline)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### 2. Deploy Demo Storybook

Deploy your addon's Storybook to show it in action:

**Option A: Chromatic (Recommended)**
```bash
npm install --save-dev chromatic
npx chromatic --project-token=YOUR_TOKEN
```

**Option B: GitHub Pages**
```bash
npm run build-storybook
# Deploy storybook-static/ to GitHub Pages
```

Add link to README:
```markdown
## Demo

See the addon in action: [Live Demo](https://your-demo-url.com)
```

### 3. Announce Your Addon

**Twitter:**
```
🎉 Just published storybook-addon-baseline!

Automatically detect browser compatibility for your Storybook components using Baseline data.

✅ React + CSS-in-JS
✅ Vue SFC
✅ 40+ CSS features
✅ All frameworks

npm install storybook-addon-baseline

#Storybook #WebDev
```

**Dev.to Article:**
Write a tutorial showing how to use your addon

**Storybook Discord:**
Share in #addons channel: https://discord.gg/storybook

**Reddit:**
- r/reactjs
- r/vuejs
- r/webdev

### 4. Monitor Usage

Track your addon's adoption:
- npm downloads: https://npm-stat.com/charts.html?package=storybook-addon-baseline
- GitHub stars and issues
- Storybook catalog views

---

## 🔧 Troubleshooting

### "Package name already taken"

Use a scoped package:
```bash
npm publish --access public
# Package name: @your-username/storybook-addon-baseline
```

### "You must verify your email"

Check your email and click the verification link from npm.

### "Build fails"

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### "Tests fail"

Fix tests before publishing:
```bash
npm test
# Fix any failing tests
```

### "Permission denied"

Make sure you're logged in:
```bash
npm whoami
# If not logged in:
npm login
```

---

## 📋 Pre-Publish Checklist

Use this checklist before every publish:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] README.md is up to date
- [ ] CHANGELOG.md has new version entry
- [ ] Version number is bumped in package.json
- [ ] All changes are committed to git
- [ ] GitHub repository is up to date
- [ ] LICENSE file exists
- [ ] No sensitive data in code
- [ ] Dependencies are up to date
- [ ] Tested in a real Storybook project
- [ ] Screenshots/GIFs in README (if applicable)

---

## 🎯 Success Metrics

Track these metrics after publishing:

**Week 1:**
- [ ] 10+ npm downloads
- [ ] Appears in Storybook catalog
- [ ] 5+ GitHub stars

**Month 1:**
- [ ] 100+ npm downloads
- [ ] 25+ GitHub stars
- [ ] First community issue/PR

**Month 3:**
- [ ] 500+ npm downloads
- [ ] 50+ GitHub stars
- [ ] Featured in Storybook blog/newsletter

---

## 📚 Additional Resources

- **npm Documentation:** https://docs.npmjs.com/
- **Storybook Addon Kit:** https://storybook.js.org/docs/addons/addon-kit
- **Storybook Addon Catalog:** https://storybook.js.org/docs/addons/addon-catalog
- **Semantic Versioning:** https://semver.org/
- **GitHub Actions:** https://docs.github.com/en/actions

---

## 🆘 Getting Help

If you encounter issues:

1. **Storybook Discord:** https://discord.gg/storybook (#addons channel)
2. **GitHub Discussions:** Create a discussion in your repo
3. **Stack Overflow:** Tag with `storybook` and `npm`

---

## 🎉 You're Ready!

Your addon is ready to be published and shared with the world!

**Quick Publish Commands:**
```bash
cd addon
npm login
npm run build
npm publish
```

Good luck! 🚀
