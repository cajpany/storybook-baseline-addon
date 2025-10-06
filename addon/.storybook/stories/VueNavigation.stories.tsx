import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Vue navigation with advanced selectors
const vueNavCode = `
<template>
  <nav class="navigation">
    <ul class="nav-list">
      <li v-for="item in items" :key="item.id" class="nav-item">
        <a :href="item.href" class="nav-link">{{ item.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  items: Array
})
</script>

<style scoped>
.navigation {
  display: flex;
  container-type: inline-size;
  
  padding-inline: 2rem;
  padding-block: 1rem;
  
  background: white;
  border-block-end: 1px solid #e5e7eb;
  
  position: sticky;
  inset-block-start: 0;
  z-index: 100;
}

.nav-list {
  display: flex;
  gap: 2rem;
  
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  
  padding-inline: 1rem;
  padding-block: 0.5rem;
  
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #667eea;
}

.nav-link:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Advanced selector: :has() */
.nav-item:has(> .nav-link:hover) {
  background: linear-gradient(to bottom, transparent 0%, #f3f4f6 100%);
}

/* Advanced selector: :is() */
.nav-link:is(:hover, :focus-visible) {
  transform: translateY(-1px);
}

/* Advanced selector: :where() for low specificity */
:where(.nav-link) {
  user-select: none;
}

/* Advanced selector: :not() with list */
.nav-item:not(:first-child, :last-child) {
  margin-inline: 0.5rem;
}

/* Advanced selector: :nth-child(of) */
.nav-item:nth-child(2n of .nav-item) {
  /* Even items */
}

/* Advanced selector: :focus-within */
.navigation:focus-within {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

@container (max-width: 600px) {
  .nav-list {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-item:not(:first-child, :last-child) {
    margin-inline: 0;
  }
}

@supports selector(:has(> *)) {
  .navigation {
    /* Enhanced styles when :has() is supported */
    backdrop-filter: blur(10px);
  }
}
</style>
`;

// React component for display
const VueNavigation = () => (
  <nav
    style={{
      display: 'flex',
      padding: '1rem 2rem',
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
    }}
  >
    <ul style={{ display: 'flex', gap: '2rem', margin: 0, padding: 0, listStyle: 'none' }}>
      <li><a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Home</a></li>
      <li><a href="#" style={{ color: '#374151', textDecoration: 'none' }}>About</a></li>
      <li><a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Contact</a></li>
    </ul>
  </nav>
);

const meta: Meta<typeof VueNavigation> = {
  title: 'Vue Examples/Vue Navigation',
  component: VueNavigation,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueNavCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VueNavigation>;

export const Primary: Story = {};

export const AdvancedSelectors: Story = {
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueNavCode,
    },
  },
};
