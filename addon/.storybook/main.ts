import { defineMain } from "@storybook/react-vite/node";

const config = defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)", "./.storybook/stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-docs", "./local-preset.cjs"],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    // Define process.env for browser compatibility
    config.define = {
      ...config.define,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    };
    return config;
  },
});

export default config;
