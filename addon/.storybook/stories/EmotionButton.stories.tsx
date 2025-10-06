import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Example Emotion code (as a string for demonstration)
const emotionCode = `
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const Button = () => (
  <button css={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    containerType: 'inline-size',
    padding: '12px 24px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
  }}>
    Emotion Button
  </button>
);
`;

// Regular React component for display
const EmotionButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '12px 24px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
    }}
  >
    {children}
  </button>
);

const meta: Meta<typeof EmotionButton> = {
  title: 'CSS-in-JS Examples/Emotion Button',
  component: EmotionButton,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: emotionCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmotionButton>;

export const Primary: Story = {
  args: {
    children: 'Emotion Button',
  },
};

export const ObjectSyntax: Story = {
  args: {
    children: 'Object Syntax',
  },
  parameters: {
    baseline: {
      autoDetectJS: true,
      jsSource: `
        const styles = css({
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        });
      `,
    },
  },
};
