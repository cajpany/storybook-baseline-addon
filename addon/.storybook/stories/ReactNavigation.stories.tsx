import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

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
      features: ['flexbox', 'gap', 'has', 'is', 'where', 'focus-visible', 'focus-within'],
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
      features: ['flexbox', 'gap', 'has', 'is', 'where', 'focus-visible', 'focus-within', 'logical-properties'],
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
      features: ['flexbox', 'gap', 'container-queries'],
    },
  },
};
