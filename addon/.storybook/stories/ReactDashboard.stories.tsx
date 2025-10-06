import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const ReactDashboard: React.FC = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gridTemplateRows: 'auto 1fr',
      gap: '1.5rem',
      minHeight: '400px',
      padding: '1.5rem',
      background: '#f9fafb',
    }}
  >
    <aside
      style={{
        gridRow: '1 / -1',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Menu</h3>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a href="#" style={{ padding: '0.75rem 1rem', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontWeight: 500 }}>
          Dashboard
        </a>
        <a href="#" style={{ padding: '0.75rem 1rem', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontWeight: 500 }}>
          Analytics
        </a>
        <a href="#" style={{ padding: '0.75rem 1rem', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontWeight: 500 }}>
          Settings
        </a>
      </nav>
    </aside>

    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Dashboard</h1>
      <button style={{ padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        New Item
      </button>
    </header>

    <main
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      }}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
          }}
        >
          <h3>Card {i}</h3>
          <p>Content goes here</p>
        </div>
      ))}
    </main>
  </div>
);

const meta: Meta<typeof ReactDashboard> = {
  title: 'React Examples/React Dashboard',
  component: ReactDashboard,
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'flexbox', 'gap', 'container-queries', 'aspect-ratio', 'has', 'is'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReactDashboard>;

export const Primary: Story = {};

export const ComplexLayout: Story = {
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'gap', 'container-queries'],
    },
  },
};

export const ResponsiveGrid: Story = {
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'gap', 'flexbox'],
    },
  },
};
