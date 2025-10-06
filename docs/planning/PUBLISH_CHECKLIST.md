# Publishing Checklist

## Before Publishing

### 1. Update package.json with Your Information

Replace these placeholders in `addon/package.json`:

```json
"repository": {
  "url": "https://github.com/YOUR_USERNAME/storybook-addon-baseline"
},
"homepage": "https://github.com/YOUR_USERNAME/storybook-addon-baseline#readme",
"bugs": {
  "url": "https://github.com/YOUR_USERNAME/storybook-addon-baseline/issues"
},
"author": "Your Name <your.email@example.com>",
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `storybook-addon-baseline`
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/storybook-addon-baseline.git
   git branch -M main
   git push -u origin main
   ```

### 3. Check Package Name Availability

```bash
npm search storybook-addon-baseline
```

If taken, consider:
- `@your-username/storybook-addon-baseline` (scoped)
- Different name

### 4. Create npm Account

- Go to https://www.npmjs.com/signup
- Or login: `npm login`

---

## Publishing Steps

### Step 1: Build

```bash
cd addon
npm install
npm run build
```

### Step 2: Test Build

```bash
# Verify dist/ folder exists
ls -la dist/

# Check what will be published
npm publish --dry-run
```

### Step 3: Login to npm

```bash
npm login
# Enter username, password, email
```

### Step 4: Publish

```bash
npm publish
```

**Success!** Your addon is now live at:
- https://www.npmjs.com/package/storybook-addon-baseline

---

## Post-Publishing

### 1. Verify Publication

- Check npm: https://www.npmjs.com/package/storybook-addon-baseline
- Wait 24 hours for Storybook catalog: https://storybook.js.org/addons

### 2. Add Badges to README

```markdown
[![npm version](https://badge.fury.io/js/storybook-addon-baseline.svg)](https://www.npmjs.com/package/storybook-addon-baseline)
[![Downloads](https://img.shields.io/npm/dm/storybook-addon-baseline.svg)](https://www.npmjs.com/package/storybook-addon-baseline)
```

### 3. Announce

- Twitter with #Storybook
- Dev.to article
- Storybook Discord: https://discord.gg/storybook
- Reddit: r/reactjs, r/vuejs, r/webdev

---

## Future Updates

### To Publish a New Version

```bash
# Update version
npm version patch  # 0.3.0 -> 0.3.1 (bug fixes)
npm version minor  # 0.3.0 -> 0.4.0 (new features)
npm version major  # 0.3.0 -> 1.0.0 (breaking changes)

# Build and publish
npm run build
npm publish

# Push tags
git push origin main --tags
```

---

## Current Status

✅ **Ready to Publish!**

**Version:** 0.3.0
**Features:**
- React CSS-in-JS support (styled-components, Emotion, Stitches)
- Vue SFC support (vue-styled-components, Pinceau)
- 40+ CSS features detected
- 26 example stories
- Comprehensive documentation

**What's Included:**
- ✅ Automatic CSS detection
- ✅ CSS-in-JS detection
- ✅ Vue SFC detection
- ✅ Browser compatibility matrix
- ✅ Filtering, search, warnings
- ✅ Export functionality
- ✅ All frameworks supported

---

## Quick Publish Command

```bash
cd addon
npm run build
npm publish
```

That's it! 🚀
