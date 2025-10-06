import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Example styled-components code (as a string for demonstration)
const styledComponentsCode = `
import styled from 'styled-components';

const Button = styled.button\`
  display: grid;
  container-type: inline-size;
  gap: 1rem;
  padding: 16px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:has(> .icon) {
    padding-left: 48px;
  }
  
  &:hover {
    transform: scale(1.05);
  }
\`;
`;

// Regular React component for display
const StyledButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      display: 'grid',
      gap: '1rem',
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const meta: Meta<typeof StyledButton> = {
  title: 'CSS-in-JS Examples/Styled Components Button',
  component: StyledButton,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: styledComponentsCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StyledButton>;

export const Primary: Story = {
  args: {
    children: 'Click me!',
  },
};

export const WithManualAnnotation: Story = {
  args: {
    children: 'Manual + Auto Detection',
  },
  parameters: {
    baseline: {
      target: '2024',
      features: ['flexbox'], // Manual annotation
      autoDetectJS: true,
      jsSource: styledComponentsCode, // Auto-detection from JS
    },
  },
};
