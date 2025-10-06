import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Advanced styled-components example with modern CSS features
const advancedStyledCode = `
import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes\`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
\`;

const Card = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  container-type: inline-size;
  aspect-ratio: 16 / 9;
  
  background: linear-gradient(135deg, oklch(0.7 0.2 180) 0%, oklch(0.5 0.2 270) 100%);
  backdrop-filter: blur(10px);
  
  animation: \${fadeIn} 0.3s ease-out;
  
  @container (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
  
  &:has(> .featured) {
    grid-template-columns: 2fr 1fr;
  }
  
  &:focus-visible {
    outline: 2px solid color-mix(in oklch, currentColor 50%, transparent);
  }
  
  @supports (backdrop-filter: blur(10px)) {
    background: color-mix(in srgb, white 20%, transparent);
  }
\`;

const sharedStyles = css\`
  padding-block: 1rem;
  padding-inline: 2rem;
  margin-block-start: 0.5rem;
  inset-block-start: 0;
  
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
  
  mask-image: linear-gradient(to bottom, black 90%, transparent);
  mix-blend-mode: multiply;
\`;
`;

// React component for display
const AdvancedCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
    }}
  >
    {children}
  </div>
);

const meta: Meta<typeof AdvancedCard> = {
  title: 'CSS-in-JS Examples/Advanced Styled Components',
  component: AdvancedCard,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: advancedStyledCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AdvancedCard>;

export const ModernCSSFeatures: Story = {
  args: {
    children: 'Advanced CSS Features Demo',
  },
};

export const WithConfiguration: Story = {
  args: {
    children: 'With CSS-in-JS Config',
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: advancedStyledCode,
      cssInJS: {
        enabled: true,
        libraries: ['styled-components'],
        showSource: true,
      },
    },
  },
};

export const DisabledCSSinJS: Story = {
  args: {
    children: 'CSS-in-JS Disabled',
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: advancedStyledCode,
      cssInJS: {
        enabled: false,
      },
    },
  },
};
