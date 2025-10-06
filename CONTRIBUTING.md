# Contributing to Storybook Addon Baseline

Thank you for your interest in contributing! 🎉

## Development Setup

```bash
# Clone the repository
git clone https://github.com/cajpany/storybook-baseline-addon.git
cd storybook-baseline-addon

# Install dependencies
cd addon
npm install

# Start Storybook in development mode
npm run storybook

# Run tests
npm test

# Build the addon
npm run build
```

## Project Structure

```
addon/
├── src/
│   ├── analyzer/        # CSS and JS parsing logic
│   ├── components/      # React components for UI
│   ├── constants.ts     # Constants and feature definitions
│   ├── baseline.ts      # Baseline computation logic
│   └── withGlobals.ts   # Decorator implementation
├── .storybook/          # Storybook configuration
│   └── stories/         # Example stories
└── package.json
```

## Making Changes

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Add tests** for new features
5. **Run tests:** `npm test`
6. **Build:** `npm run build`
7. **Commit:** `git commit -m "feat: add new feature"`
8. **Push:** `git push origin feature/my-feature`
9. **Open a Pull Request**

## Commit Convention

We use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `test:` - Test updates

## Adding New Features

### Adding a New CSS Feature

1. Add to `src/constants.ts` in `FEATURE_DEFINITIONS`
2. Add tests in `src/analyzer/__tests__/`
3. Update documentation

### Adding Framework Support

See `docs/planning/` for implementation plans:
- `VUE_SUPPORT_PLAN.md` - Vue implementation guide
- `STYLED_COMPONENTS_PLAN.md` - React CSS-in-JS guide

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- vue-analyzer.test.ts
```

## Documentation

- **README.md** - User-facing documentation
- **CHANGELOG.md** - Version history
- **docs/planning/** - Implementation plans and guides

## Questions?

Open an issue on GitHub: https://github.com/cajpany/storybook-baseline-addon/issues

Thank you for contributing! 🙏
