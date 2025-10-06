import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const ReactForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            Name
          </label>
          <input
            type="text"
            required
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            Email
          </label>
          <input
            type="email"
            required
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            Message
          </label>
          <textarea
            required
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
              minHeight: '120px',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            gridColumn: '1 / -1',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

const meta: Meta<typeof ReactForm> = {
  title: 'React Examples/React Form',
  component: ReactForm,
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'flexbox', 'gap', 'container-queries', 'logical-properties', 'color-mix', 'has'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReactForm>;

export const Primary: Story = {};

export const ResponsiveGrid: Story = {
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'gap', 'container-queries'],
    },
  },
};

export const WithValidation: Story = {
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'gap', 'has', 'focus-visible'],
    },
  },
};
