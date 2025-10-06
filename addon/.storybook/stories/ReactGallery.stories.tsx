import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  likes: number;
}

interface GalleryProps {
  items: GalleryItem[];
}

const ReactGallery: React.FC<GalleryProps> = ({ items }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '2rem',
      padding: '2rem',
    }}
  >
    {items.map((item) => (
      <div
        key={item.id}
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s',
          aspectRatio: '4 / 5',
        }}
      >
        <div
          style={{
            aspectRatio: '16 / 9',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        <div style={{ padding: '1rem 1.5rem' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 600 }}>
            {item.title}
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            {item.description}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <button
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ❤️ {item.likes}
          </button>
        </div>
      </div>
    ))}
  </div>
);

const meta: Meta<typeof ReactGallery> = {
  title: 'React Examples/React Gallery',
  component: ReactGallery,
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'gap', 'aspect-ratio', 'clamp', 'subgrid', 'backdrop-filter', 'logical-properties', 'has'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReactGallery>;

const defaultItems: GalleryItem[] = [
  { id: '1', title: 'Mountain View', description: 'Beautiful mountain landscape', likes: 42 },
  { id: '2', title: 'Ocean Sunset', description: 'Stunning sunset over the ocean', likes: 38 },
  { id: '3', title: 'City Lights', description: 'Urban cityscape at night', likes: 56 },
  { id: '4', title: 'Forest Path', description: 'Peaceful forest trail', likes: 29 },
];

export const Primary: Story = {
  args: {
    items: defaultItems,
  },
};

export const MasonryLayout: Story = {
  args: {
    items: defaultItems,
  },
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'gap', 'aspect-ratio'],
    },
  },
};

export const WithSubgrid: Story = {
  args: {
    items: defaultItems,
  },
  parameters: {
    baseline: {
      target: '2024',
      features: ['grid', 'gap', 'subgrid', 'aspect-ratio', 'clamp'],
    },
  },
};
