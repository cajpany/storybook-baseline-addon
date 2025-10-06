import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Vue with vue-styled-components (CSS-in-JS)
// Note: Using manual feature annotation to avoid template literal parsing issues
const vueStyledFeatures = [
  'grid',
  'logical-properties',
  'container-queries',
];

// React component for display
const VueStyledComponents = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: '1.5rem',
      padding: '2rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
    }}
  >
    {children}
  </div>
);

const meta: Meta<typeof VueStyledComponents> = {
  title: 'Vue Examples/Vue Styled Components',
  component: VueStyledComponents,
  parameters: {
    baseline: {
      target: '2024',
      features: vueStyledFeatures,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VueStyledComponents>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <header style={{ paddingBottom: '1rem', borderBottom: '2px solid #e5e7eb' }}>
          <h2>Card Title</h2>
        </header>
        <div style={{ padding: '1rem 0', lineHeight: 1.6, color: '#6b7280' }}>
          <p>This demonstrates vue-styled-components (CSS-in-JS for Vue)</p>
        </div>
        <footer style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '2px solid #e5e7eb' }}>
          <button style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Click Me
          </button>
        </footer>
      </>
    ),
  },
};

export const CSSinJSDetection: Story = {
  args: {
    children: 'Demonstrates CSS-in-JS features with vue-styled-components',
  },
  parameters: {
    baseline: {
      target: '2024',
      features: vueStyledFeatures,
    },
  },
};
