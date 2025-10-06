import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Stitches example
const stitchesCode = `
import { styled, css } from '@stitches/react';

const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '12px 24px',
  
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  
  fontSize: '14px',
  fontWeight: 600,
  
  cursor: 'pointer',
  transition: 'all 0.2s',
  
  '&:hover': {
    backgroundColor: '#2563eb',
    transform: 'translateY(-2px)',
  },
  
  '&:focus-visible': {
    outline: '2px solid #3b82f6',
    outlineOffset: '2px',
  },
  
  variants: {
    size: {
      small: {
        padding: '8px 16px',
        fontSize: '12px',
      },
      large: {
        padding: '16px 32px',
        fontSize: '16px',
      },
    },
    variant: {
      primary: {
        backgroundColor: '#3b82f6',
      },
      secondary: {
        backgroundColor: '#64748b',
      },
    },
  },
  
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
  },
});

const cardStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  padding: '1.5rem',
  
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});
`;

// React component for display
const StitchesButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '12px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const meta: Meta<typeof StitchesButton> = {
  title: 'CSS-in-JS Examples/Stitches Button',
  component: StitchesButton,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: stitchesCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StitchesButton>;

export const Primary: Story = {
  args: {
    children: 'Stitches Button',
  },
};

export const WithVariants: Story = {
  args: {
    children: 'With Variants (skipped)',
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: stitchesCode,
      cssInJS: {
        libraries: ['stitches'],
      },
    },
  },
};
