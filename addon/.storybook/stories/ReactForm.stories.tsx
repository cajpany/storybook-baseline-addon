import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Styled-components code for React Form
const styledFormCode = `
import styled from 'styled-components';

const FormContainer = styled.form\`
  container-type: inline-size;
  max-width: 600px;
  margin: 0 auto;
\`;

const FormGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @container (max-width: 500px) {
    grid-template-columns: 1fr;
  }
\`;

const FormGroup = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  @supports (grid-template-rows: subgrid) {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 2;
  }
\`;

const Label = styled.label\`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
\`;

const Input = styled.input\`
  padding-inline: 1rem;
  padding-block: 0.75rem;
  
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  
  font-family: inherit;
  font-size: 1rem;
  
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px color-mix(in srgb, #667eea 20%, transparent);
  }
  
  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
  
  &:invalid {
    border-color: #ef4444;
  }
  
  &:valid {
    border-color: #10b981;
  }
\`;

const TextArea = styled.textarea\`
  padding-inline: 1rem;
  padding-block: 0.75rem;
  
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  
  font-family: inherit;
  font-size: 1rem;
  
  min-height: 120px;
  resize: vertical;
  
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px color-mix(in srgb, #667eea 20%, transparent);
  }
  
  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
\`;

const SubmitButton = styled.button\`
  grid-column: 1 / -1;
  
  padding-inline: 2rem;
  padding-block: 1rem;
  
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px color-mix(in srgb, #667eea 30%, transparent);
  }
  
  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 4px;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  \${FormContainer}:has(input:invalid) & {
    opacity: 0.6;
    cursor: not-allowed;
  }
\`;
\`;

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
      autoDetectJS: true,
      jsSource: styledFormCode,
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
      autoDetectJS: true,
      jsSource: styledFormCode,
    },
  },
};

export const WithValidation: Story = {
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: styledFormCode,
    },
  },
};
