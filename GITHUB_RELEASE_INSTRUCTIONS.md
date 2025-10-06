# GitHub Release Instructions for v0.4.0

## Step 1: Create Git Tag

```bash
cd /Users/himeshp/apps/hackthons/google-baseline/storybook-baseline
git tag -a v0.4.0 -m "Release v0.4.0 - Angular Support"
git push origin v0.4.0
```

## Step 2: Create GitHub Release

1. Go to: https://github.com/cajpany/storybook-baseline-addon/releases/new

2. **Choose a tag:** Select `v0.4.0` (or create it)

3. **Release title:** 
   ```
   🅰️ v0.4.0 - Angular Support
   ```

4. **Description:** Copy content from `RELEASE_NOTES_v0.4.0.md`

5. Click **"Publish release"**

---

## Quick Copy-Paste for GitHub Release

### Title:
```
🅰️ v0.4.0 - Angular Support
```

### Description:
```markdown
We're excited to announce **Angular support** in Storybook Addon Baseline! This release adds automatic CSS extraction from Angular components, making it the third major framework fully supported.

## 🎉 What's New

### Angular Component Support

Automatically detect CSS features from Angular components:

\`\`\`typescript
const angularSource = \`
@Component({
  selector: 'app-button',
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

**Features:**
- ✅ Extracts CSS from \`@Component\` decorator \`styles\` array
- ✅ Supports multiple style strings
- ✅ Detects ViewEncapsulation modes (Emulated, None, ShadowDom)
- ✅ Handles template literals in styles
- ✅ Warns about \`styleUrls\` usage
- ✅ No new dependencies (reuses existing Babel parser)

## 📊 Framework Support Matrix

| Framework | CSS-in-JS | Component Styles | Status |
|-----------|-----------|------------------|--------|
| **React** | styled-components, Emotion, Stitches | ✅ | Full Support |
| **Vue** | vue-styled-components, Pinceau | Vue SFC | Full Support |
| **Angular** | - | Component styles | **NEW!** ✅ |
| **Svelte** | - | - | Planned |

## 📈 Stats

- **31 example stories** across 3 frameworks
- **67 unit tests** (all passing)
- **40+ CSS features** detected
- **No breaking changes** - fully backward compatible

## 🚀 Installation

\`\`\`bash
npm install --save-dev storybook-addon-baseline@0.4.0
\`\`\`

## 📝 Full Changelog

### Added
- Angular component parser with \`@Component\` decorator support
- \`autoDetectAngular\` and \`angularSource\` parameters
- ViewEncapsulation mode detection
- 2 Angular example stories (AngularButton, AngularCard)
- ANGULAR_PATTERNS.md documentation
- ANGULAR_SUPPORT_PLAN.md implementation guide

### Changed
- Updated framework compatibility matrix
- Enhanced error handling in all parsers
- Improved console warnings

### Fixed
- Babel traverse import compatibility for ESM/CJS modules

## 🙏 Thank You

Thank you for using Storybook Addon Baseline! If you find this addon helpful, please:
- ⭐ Star the repo
- 🐛 Report issues
- 💡 Suggest features
- 🤝 Contribute

## 📚 Resources

- [Documentation](https://github.com/cajpany/storybook-baseline-addon#readme)
- [npm Package](https://www.npmjs.com/package/storybook-addon-baseline)
- [Storybook Catalog](https://storybook.js.org/addons/storybook-addon-baseline)
- [Report Issues](https://github.com/cajpany/storybook-baseline-addon/issues)

**Previous Releases:**
- v0.3.0 - Vue Support
- v0.2.0 - CSS-in-JS Support
- v0.1.0 - Initial Release
```

---

## Step 3: Announce on Social Media (Optional)

### Twitter/X:
```
🎉 Just released storybook-addon-baseline v0.4.0!

New: Angular component support! 🅰️

✅ React + CSS-in-JS
✅ Vue SFC
✅ Angular components (NEW!)
✅ 40+ CSS features
✅ Browser compatibility

npm install storybook-addon-baseline

#Storybook #Angular #WebDev
```

### Dev.to Article (Optional):
Title: "Announcing Angular Support in Storybook Addon Baseline v0.4.0"

---

## Verification

After publishing:
- ✅ Check GitHub release page
- ✅ Verify npm package updated
- ✅ Wait 24 hours for Storybook catalog update
- ✅ Monitor for issues

---

## Rollback (If Needed)

If issues are found:
```bash
npm unpublish storybook-addon-baseline@0.4.0 --force
git tag -d v0.4.0
git push origin :refs/tags/v0.4.0
```

**Note:** npm unpublish only works within 72 hours of publishing.
