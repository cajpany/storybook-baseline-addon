<!-- README START -->

# Storybook Addon Baseline

> Automatically detect and display browser compatibility for your Storybook components using [Baseline](https://web.dev/baseline) data.

## Features

- 🎯 **Automatic CSS Feature Detection** - Detects 40+ modern CSS features from your components
- 💅 **CSS-in-JS Support** - Works with styled-components, Emotion, and Stitches
- 🌐 **Browser Compatibility Matrix** - Shows which browsers support each feature
- 🎨 **Enhanced UI** - Filtering, search, warnings, and export functionality
- ⚙️ **Configurable** - Set Baseline targets (2024, 2023, etc.) globally or per-story
- 📊 **Export Reports** - Export compatibility data as JSON, CSV, or HTML

## Installation

First, install the package:

```sh
npm install --save-dev storybook-addon-baseline
# or
yarn add -D storybook-addon-baseline
# or
pnpm add -D storybook-addon-baseline
```

Then, register it as an addon in `.storybook/main.ts`:

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs',
    'storybook-addon-baseline', // 👈 Add the addon here
  ],
};

export default config;
```

## Usage

### Basic Usage (Automatic CSS Detection)

The addon automatically detects CSS features from your component styles:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    baseline: {
      target: '2024', // Set Baseline target
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Click me',
  },
  parameters: {
    baseline: {
      css: `
        .button {
          display: grid;
          container-type: inline-size;
          gap: 1rem;
        }
      `,
    }
  }
};
```

### CSS-in-JS Support

The addon supports styled-components, Emotion, and Stitches:

#### Styled-Components

```tsx
import styled from 'styled-components';

const styledCode = `
  const Button = styled.button\`
    display: grid;
    gap: 1rem;
    container-type: inline-size;
    
    &:has(> .icon) {
      padding-left: 48px;
    }
  \`;
`;

export const StyledButton: Story = {
  parameters: {
    baseline: {
      autoDetectJS: true,
      jsSource: styledCode,
    }
  }
};
```

#### Emotion

```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const emotionCode = `
  const styles = css({
    display: 'flex',
    gap: '0.5rem',
    containerType: 'inline-size',
  });
`;

export const EmotionButton: Story = {
  parameters: {
    baseline: {
      autoDetectJS: true,
      jsSource: emotionCode,
    }
  }
};
```

#### Stitches

```tsx
import { styled } from '@stitches/react';

const stitchesCode = `
  const Button = styled('button', {
    display: 'grid',
    gap: '1rem',
    padding: '12px 24px',
  });
`;

export const StitchesButton: Story = {
  parameters: {
    baseline: {
      autoDetectJS: true,
      jsSource: stitchesCode,
    }
  }
};
```

### Manual Feature Annotation

You can also manually specify features:

```tsx
export const MyStory: Story = {
  parameters: {
    baseline: {
      features: ['grid', 'container-queries', 'has'],
      target: '2024',
    }
  }
};
```

### Configuration Options

Configure the addon globally or per-story:

```tsx
parameters: {
  baseline: {
    // Baseline target year
    target: '2024' | '2023' | '2022' | 'widely-available' | 'newly-available',
    
    // Manual feature list
    features: ['grid', 'flexbox', 'container-queries'],
    
    // Inline CSS for detection
    css: '.button { display: grid; }',
    
    // Enable/disable automatic CSS detection
    autoDetect: true,
    
    // Enable/disable CSS-in-JS detection
    autoDetectJS: true,
    
    // JavaScript source code for CSS-in-JS
    jsSource: 'const Button = styled.button`...`;',
    
    // CSS-in-JS configuration
    cssInJS: {
      enabled: true,
      libraries: ['styled-components', 'emotion', 'stitches', 'all'],
      showSource: true,
    },
    
    // Warning configuration
    warnOnNonBaseline: true,
    ignoreWarnings: false,
  }
}
```

## Features

### Detected CSS Features (40+)

The addon automatically detects these CSS features:

**Layout & Spacing:**
- `grid`, `flexbox`, `subgrid`
- `gap`, `flexbox-gap`
- `aspect-ratio`, `inset`
- Logical properties (`margin-block`, `padding-inline`, etc.)

**Container Queries:**
- `container-queries`
- `container-type`, `container-name`

**Modern Selectors:**
- `:has()`, `:is()`, `:where()`
- `:focus-visible`, `:focus-within`
- `:nth-child(of)`

**Color Functions:**
- `oklch`, `oklab`
- `color-mix()`, `color()`
- `lab()`, `lch()`, `hwb()`

**CSS Functions:**
- `clamp()`, `min()`, `max()`

**Visual Effects:**
- `backdrop-filter`, `mix-blend-mode`
- `css-masks`, `clip-path`
- `filters`

**Scroll & Interaction:**
- `scroll-behavior`, `scroll-snap`
- `overscroll-behavior`

**Transforms & Animation:**
- `transforms2d`
- Individual transform properties (`rotate`, `scale`, `translate`)

**At-Rules:**
- `@container`, `@supports`, `@layer`
- `@property`, `@scope`, `@starting-style`

**And more!**

### UI Features

- **Baseline Panel** - Shows all detected features with their Baseline status
- **Browser Compatibility Matrix** - Expandable grid showing browser support
- **Search & Filtering** - Filter by feature name or support level
- **Warning System** - Alerts when non-Baseline features are detected
- **Export** - Download reports as JSON, CSV, or HTML
- **Toolbar Integration** - Quick Baseline target selection

## API

### Parameters

All parameters are set under the `baseline` namespace:

#### `target`
**Type:** `string`  
**Default:** `'2024'`  
**Options:** `'2024'`, `'2023'`, `'2022'`, `'widely-available'`, `'newly-available'`

Sets the Baseline target for compatibility checking.

#### `features`
**Type:** `string[]`  
**Default:** `[]`

Manually specify which web features are used. Takes priority over auto-detection.

#### `css`
**Type:** `string | string[]`  
**Default:** `undefined`

Inline CSS code for automatic feature detection.

#### `autoDetect`
**Type:** `boolean`  
**Default:** `true`

Enable/disable automatic CSS feature detection.

#### `autoDetectJS`
**Type:** `boolean`  
**Default:** `false`

Enable CSS-in-JS detection. Requires `jsSource` parameter.

#### `jsSource`
**Type:** `string`  
**Default:** `undefined`

JavaScript/TypeScript source code containing CSS-in-JS styles.

#### `cssInJS`
**Type:** `CSSinJSConfig`  
**Default:** `{ enabled: true }`

Configuration for CSS-in-JS detection:
- `enabled`: Enable/disable CSS-in-JS detection
- `libraries`: Whitelist specific libraries
- `showSource`: Display source library in UI

#### `warnOnNonBaseline`
**Type:** `boolean`  
**Default:** `true`

Show warnings when non-Baseline features are detected.

#### `ignoreWarnings`
**Type:** `boolean`  
**Default:** `false`

Suppress all warnings for this story.

## Development

```sh
# Install dependencies
npm install

# Start Storybook in development mode
npm run storybook

# Build the addon
npm run build

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

## Credits

- Built with [Storybook Addon Kit](https://github.com/storybookjs/addon-kit)
- Uses [web-features](https://github.com/web-platform-dx/web-features) data
- Inspired by [Baseline](https://web.dev/baseline) initiative

<!-- README END -->

### Development scripts

- `npm run start` runs babel in watch mode and starts Storybook
- `npm run build` build and package your addon code

### Switch from TypeScript to JavaScript

Don't want to use TypeScript? We offer a handy eject command: `npm run eject-ts`

This will convert all code to JS. It is a destructive process, so we recommended running this before you start writing any code.

## What's included?

![Demo](https://user-images.githubusercontent.com/42671/107857205-e7044380-6dfa-11eb-8718-ad02e3ba1a3f.gif)

The addon code lives in `src`. It demonstrates all core addon related concepts. The three [UI paradigms](https://storybook.js.org/docs/react/addons/addon-types#ui-based-addons)

- `src/Tool.tsx`
- `src/Panel.tsx`
- `src/Tab.tsx`

Which, along with the addon itself, are registered in `src/manager.ts`.

Managing State and interacting with a story:

- `src/withGlobals.ts` & `src/Tool.tsx` demonstrates how to use `useGlobals` to manage global state and modify the contents of a Story.
- `src/withRoundTrip.ts` & `src/Panel.tsx` demonstrates two-way communication using channels.
- `src/Tab.tsx` demonstrates how to use `useParameter` to access the current story's parameters.

Your addon might use one or more of these patterns. Feel free to delete unused code. Update `src/manager.ts` and `src/preview.ts` accordingly.

Lastly, configure you addon name in `src/constants.ts`.

### Bundling

Addons can interact with a Storybook project in multiple ways. It is recommended to familiarize yourself with [the basics](https://storybook.js.org/docs/react/addons/introduction) before getting started.

- Manager entries are used to add UI or behavior to the Storybook manager UI.
- Preview entries are used to add UI or behavior to the preview iframe where stories are rendered.
- Presets are used to modify the Storybook configuration, similar to how [users can configure their `main.ts` configurations](https://storybook.js.org/docs/react/api/main-config).

Since each of these places represents a different environment with different features and modules, it is also recommended to split and build your modules accordingly. This addon-kit comes with a preconfigured [bundling configuration](./tsup.config.ts) that supports this split, and you are free to modify and extend it as needed.

You can define which modules match which environments in the [`package.json#bundler`](./package.json) property:

- `exportEntries` is a list of module entries that users can manually import from anywhere they need to. For example, you could have decorators that users need to import into their `preview.ts` file or utility functions that can be used in their `main.ts` files.
- `managerEntries` is a list of module entries meant only for the manager UI. These modules will be bundled to ESM and won't include types since they are mostly loaded by Storybook directly.
- `previewEntries` is a list of module entries meant only for the preview UI. These modules will be bundled to ESM and won't include types since they are mostly loaded by Storybook directly.

Manager and preview entries are only used in the browser so they only output ESM modules. Export entries could be used both in the browser and in Node depending on their use case, so they both output ESM and CJS modules.

#### Globalized packages

Storybook provides a predefined set of packages that are available in the manager UI and the preview UI. In the final bundle of your addon, these packages should not be included. Instead, the imports should stay in place, allowing Storybook to replace those imports with the actual packages during the Storybook build process.

The list of packages differs between the manager and the preview, which is why there is a slight difference between `managerEntries` and `previewEntries`. Most notably, `react` and `react-dom` are prebundled in the manager but not in the preview. This means that your manager entries can use React to build UI without bundling it or having a direct reference to it. Therefore, it is safe to have React as a `devDependency` even though you are using it in production. _Requiring React as a peer dependency would unnecessarily force your users to install React._

An exception to this rule is if you are using React to inject UI into the preview, which does not come prebundled with React. In such cases, you need to move `react` and `react-dom` to a peer dependency. However, we generally advise against this pattern since it would limit the usage of your addon to React-based Storybooks.

### Metadata

Storybook addons are listed in the [catalog](https://storybook.js.org/addons) and distributed via npm. The catalog is populated by querying npm's registry for Storybook-specific metadata in `package.json`. This project has been configured with sample data. Learn more about available options in the [Addon metadata docs](https://storybook.js.org/docs/react/addons/addon-catalog#addon-metadata).

## Documentation

To help the community use your addon and understand its capabilities, please document it thoroughly.

To get started, replace this README with the content in this sample template.

### Sample documentation template

````md
# My Addon

## Installation

First, install the package.

```sh
npm install --save-dev my-addon
```

Then, register it as an addon in `.storybook/main.js`.

```ts
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  // ...rest of config
  addons: [
    '@storybook/addon-docs'
    'my-addon', // 👈 register the addon here
  ],
};

export default config;
```

## Usage

The primary way to use this addon is to define the `exampleParameter` parameter. You can do this the
component level, as below, to affect all stories in the file, or you can do it for a single story.

```ts
// Button.stories.ts

// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    myAddon: {
      exampleParameter: true,
      // See API section below for available parameters
    }
  }
};

export default meta;
```

Another way to use the addon is...

## API

### Parameters

This addon contributes the following parameters to Storybook, under the `myAddon` namespace:

#### `disable`

Type: `boolean`

Disable this addon's behavior. This parameter is most useful to allow overriding at more specific
levels. For example, if this parameter is set to true at the project level, it could then be
re-enabled by setting it to false at the meta (component) or story level.

### Options

When registering this addon, you can configure it with the following options, which are passed when
registering the addon, like so:

```ts
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from "@storybook/your-framework";

const config: StorybookConfig = {
  // ...rest of config
  addons: [
    "@storybook/addon-docs",
    {
      name: "my-addon",
      options: {
        // 👈 options for my-addon go here
      },
    },
  ],
};

export default config;
```

#### `useExperimentalBehavior`

Type: `boolean`

Enable experimental behavior to...
````

## Release Management

### Setup

This project is configured to use [auto](https://github.com/intuit/auto) for release management. It generates a changelog and pushes it to both GitHub and npm. Therefore, you need to configure access to both:

- [`NPM_TOKEN`](https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-access-tokens) Create a token with both _Read and Publish_ permissions.
- [`GH_TOKEN`](https://github.com/settings/tokens) Create a token with the `repo` scope.

Then open your `package.json` and edit the following fields:

- `name`
- `author`
- `repository`

#### Local

To use `auto` locally create a `.env` file at the root of your project and add your tokens to it:

```bash
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

Lastly, **create labels on GitHub**. You’ll use these labels in the future when making changes to the package.

```bash
npx auto create-labels
```

If you check on GitHub, you’ll now see a set of labels that `auto` would like you to use. Use these to tag future pull requests.

#### GitHub Actions

This template comes with GitHub actions already set up to publish your addon anytime someone pushes to your repository.

Go to `Settings > Secrets`, click `New repository secret`, and add your `NPM_TOKEN`.

### Creating a release

To create a release locally you can run the following command, otherwise the GitHub action will make the release for you.

```sh
npm run release
```

That will:

- Build and package the addon code
- Bump the version
- Push a release to GitHub and npm
- Push a changelog to GitHub
