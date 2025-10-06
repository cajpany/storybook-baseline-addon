import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Emotion code for React Navigation
const emotionNavCode = `
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const navigationStyles = css({
  display: 'flex',
  containerType: 'inline-size',
  
  paddingInline: '2rem',
  paddingBlock: '1rem',
  
  background: 'white',
  borderBlockEnd: '1px solid #e5e7eb',
  
  position: 'sticky',
  insetBlockStart: 0,
  zIndex: 100,
  
  '&:focus-within': {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
});

const navListStyles = css({
  display: 'flex',
  gap: '2rem',
  
  margin: 0,
  padding: 0,
  listStyle: 'none',
  
  '@container (max-width: 600px)': {
    flexDirection: 'column',
    gap: '0.5rem',
  },
});

const navItemStyles = css({
  position: 'relative',
  
  '&:not(:first-child, :last-child)': {
    marginInline: '0.5rem',
  },
  
  '&:has(> a:hover)': {
    background: 'linear-gradient(to bottom, transparent 0%, #f3f4f6 100%)',
  },
});

const navLinkStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  
  color: '#374151',
  textDecoration: 'none',
  fontWeight: 500,
  
  borderRadius: '6px',
  transition: 'all 0.2s',
  
  '&:hover': {
    background: '#f3f4f6',
    color: '#667eea',
  },
  
  '&:focus-visible': {
    outline: '2px solid #667eea',
    outlineOffset: '2px',
  },
  
  '&:is(:hover, :focus-visible)': {
    transform: 'translateY(-1px)',
  },
});

const Navigation = ({ items }) => (
  <nav css={navigationStyles}>
    <ul css={navListStyles}>
      {items.map((item) => (
        <li key={item.id} css={navItemStyles}>
          <a href={item.href} css={navLinkStyles}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
\`;

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavItem[];
}

const ReactNavigation: React.FC<NavigationProps> = ({ items }) => (
  <nav
    style={{
      display: 'flex',
      padding: '1rem 2rem',
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}
  >
    <ul style={{ display: 'flex', gap: '2rem', margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const meta: Meta<typeof ReactNavigation> = {
  title: 'React Examples/React Navigation',
  component: ReactNavigation,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: emotionNavCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReactNavigation>;

const defaultItems: NavItem[] = [
  { id: '1', label: 'Home', href: '#home' },
  { id: '2', label: 'About', href: '#about' },
  { id: '3', label: 'Services', href: '#services' },
  { id: '4', label: 'Contact', href: '#contact' },
];

export const Primary: Story = {
  args: {
    items: defaultItems,
  },
};

export const AdvancedSelectors: Story = {
  args: {
    items: defaultItems,
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: emotionNavCode,
    },
  },
};

export const Responsive: Story = {
  args: {
    items: defaultItems,
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: emotionNavCode,
    },
  },
};
