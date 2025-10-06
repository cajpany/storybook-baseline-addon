import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Advanced Vue SFC with modern CSS features
const vueCardCode = `
<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div class="card-footer">
      <button class="btn">Learn More</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['title'])
</script>

<style scoped>
.card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: clamp(0.5rem, 2vw, 1rem);
  
  container-type: inline-size;
  container-name: card;
  
  padding: 1.5rem;
  background: linear-gradient(135deg, oklch(0.95 0.02 180) 0%, oklch(0.98 0.01 270) 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px color-mix(in srgb, black 10%, transparent);
  
  aspect-ratio: 3 / 4;
  max-width: 400px;
}

.card-header {
  padding-block-end: 1rem;
  border-block-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

.card-header h3 {
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-body {
  padding-block: 1rem;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
}

.card-footer {
  padding-block-start: 1rem;
  border-block-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  padding-inline: 1.5rem;
  padding-block: 0.75rem;
  
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  
  font-weight: 600;
  cursor: pointer;
  
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

@container card (min-width: 300px) {
  .card {
    grid-template-rows: auto 1fr auto;
  }
  
  .card-header h3 {
    font-size: 1.75rem;
  }
}

@supports (backdrop-filter: blur(10px)) {
  .card {
    backdrop-filter: blur(10px);
  }
}
</style>
`;

// React component for display
const VueCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: '1rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
    }}
  >
    {children}
  </div>
);

const meta: Meta<typeof VueCard> = {
  title: 'Vue Examples/Vue Card',
  component: VueCard,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueCardCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VueCard>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <div>
          <h3>Card Title</h3>
        </div>
        <div>Card content goes here</div>
        <div>
          <button>Learn More</button>
        </div>
      </>
    ),
  },
};

export const WithModernCSS: Story = {
  args: {
    children: 'Demonstrates: grid, container-queries, oklch, color-mix, clamp, logical properties',
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueCardCode,
    },
  },
};
