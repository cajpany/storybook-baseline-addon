import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Example Vue SFC code (as a string for demonstration)
const vueSFCCode = `
<template>
  <button class="button">{{ label }}</button>
</template>

<script>
export default {
  props: ['label']
}
</script>

<style scoped>
.button {
  display: grid;
  gap: 1rem;
  container-type: inline-size;
  aspect-ratio: 16 / 9;
  
  padding: 12px 24px;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.button:hover {
  transform: scale(1.05);
}

.button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
`;

// React component for display (simulating Vue button)
const VueButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      display: 'grid',
      gap: '1rem',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #42b883 0%, #35495e 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const meta: Meta<typeof VueButton> = {
  title: 'Vue Examples/Vue Button',
  component: VueButton,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueSFCCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VueButton>;

export const Primary: Story = {
  args: {
    children: 'Vue Button',
  },
};

export const WithMultipleStyles: Story = {
  args: {
    children: 'Multiple Style Blocks',
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: `
<template>
  <button class="button">Click me</button>
</template>

<style>
/* Global styles */
.button {
  display: flex;
  align-items: center;
}
</style>

<style scoped>
/* Scoped styles */
.button {
  gap: 0.5rem;
  container-type: inline-size;
}
</style>
      `,
    },
  },
};

export const WithManualAnnotation: Story = {
  args: {
    children: 'Manual + Auto Detection',
  },
  parameters: {
    baseline: {
      target: '2024',
      features: ['subgrid'], // Manual annotation
      autoDetectVue: true,
      vueSource: vueSFCCode, // Auto-detection from Vue
    },
  },
};
