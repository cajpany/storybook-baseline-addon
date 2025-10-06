import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Styled-components code for React Card
const styledCardCode = `
import styled from 'styled-components';

const Card = styled.div\`
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: clamp(0.5rem, 2vw, 1rem);
  
  container-type: inline-size;
  container-name: card;
  
  padding: 1.5rem;
  background: linear-gradient(135deg, oklch(0.95 0.02 180) 0%, oklch(0.98 0.01 270) 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px color-mix(in srgb, black 10%, transparent);
  
  aspect-ratio: 3 / 4;
  max-width: 400px;
  
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px color-mix(in srgb, black 15%, transparent);
  }
\`;

const CardHeader = styled.header\`
  padding-block-end: 1rem;
  border-block-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  
  h3 {
    margin: 0;
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
\`;

const CardBody = styled.div\`
  padding-block: 1rem;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, currentColor 30%, transparent);
    border-radius: 4px;
  }
\`;

const CardFooter = styled.footer\`
  padding-block-start: 1rem;
  border-block-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
\`;

const Button = styled.button\`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  padding-inline: 1.5rem;
  padding-block: 0.75rem;
  
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  
  font-weight: 600;
  cursor: pointer;
  
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
\`;

@container card (min-width: 300px) {
  \${CardHeader} h3 {
    font-size: 1.75rem;
  }
}

@supports (backdrop-filter: blur(10px)) {
  \${Card} {
    backdrop-filter: blur(10px);
  }
}
\`;

// React component
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
    }}
  >
    <header style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: 0, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {title}
      </h3>
    </header>
    <div style={{ padding: '1rem 0' }}>{children}</div>
    <footer style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
      <button style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
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
      autoDetectJS: true,
      jsSource: styledCardCode,
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
    children: 'Demonstrates: grid, container-queries, oklch, color-mix, clamp, logical properties, aspect-ratio, backdrop-filter',
  },
};

export const Interactive: Story = {
  args: {
    title: 'Interactive Card',
    children: 'Hover over this card to see the transform effect!',
  },
};
