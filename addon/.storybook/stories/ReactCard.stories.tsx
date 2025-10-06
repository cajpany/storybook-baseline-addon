import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// React Card component
const ReactCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
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
      aspectRatio: '3 / 4',
    }}
  >
    <header style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ 
        margin: 0, 
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent',
        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)'
      }}>
        {title}
      </h3>
    </header>
    <div style={{ padding: '1rem 0' }}>{children}</div>
    <footer style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
      <button style={{ 
        padding: '0.75rem 1.5rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        fontWeight: 600, 
        cursor: 'pointer' 
      }}>
        Learn More
      </button>
    </footer>
  </div>
);

const meta: Meta<typeof ReactCard> = {
  title: 'React Examples/React Card',
  component: ReactCard,
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'aspect-ratio', 'clamp'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReactCard>;

export const Primary: Story = {
  args: {
    title: 'Card Title',
    children: 'This is a beautiful card component with modern CSS features.',
  },
};

export const WithModernCSS: Story = {
  args: {
    title: 'Modern CSS Features',
    children: 'Demonstrates: grid, aspect-ratio, clamp, gradients',
  },
};

export const Interactive: Story = {
  args: {
    title: 'Interactive Card',
    children: 'A responsive card with modern layout!',
  },
};
