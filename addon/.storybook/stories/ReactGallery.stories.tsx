import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Emotion code for React Gallery
const emotionGalleryCode = `
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const galleryStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: 'clamp(1rem, 3vw, 2rem)',
  
  padding: '2rem',
  containerType: 'inline-size',
  
  '@container (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
});

const imageCardStyles = css({
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: 'span 3',
  
  background: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  
  aspectRatio: '4 / 5',
  
  transition: 'transform 0.3s, box-shadow 0.3s',
  
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
  },
  
  '&:has(> button:focus-visible)': {
    outline: '2px solid #667eea',
    outlineOffset: '4px',
  },
});

const imageWrapperStyles = css({
  position: 'relative',
  aspectRatio: '16 / 9',
  overflow: 'hidden',
  
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  
  '&:hover img': {
    transform: 'scale(1.1)',
  },
});

const imageOverlayStyles = css({
  position: 'absolute',
  insetBlockStart: 0,
  insetInlineStart: 0,
  insetBlockEnd: 0,
  insetInlineEnd: 0,
  
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  background: 'color-mix(in srgb, black 50%, transparent)',
  backdropFilter: 'blur(4px)',
  
  opacity: 0,
  transition: 'opacity 0.3s',
  
  '&:hover': {
    opacity: 1,
  },
});

const cardContentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  
  paddingInline: '1.5rem',
  paddingBlock: '1rem',
});

const cardTitleStyles = css({
  margin: 0,
  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
  fontWeight: 600,
  color: '#1f2937',
});

const cardDescriptionStyles = css({
  margin: 0,
  fontSize: '0.875rem',
  color: '#6b7280',
  lineHeight: 1.5,
});

const cardFooterStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  
  paddingInline: '1.5rem',
  paddingBlock: '1rem',
  borderBlockStart: '1px solid #e5e7eb',
});

const likeButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  
  background: 'transparent',
  color: '#6b7280',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  
  fontWeight: 500,
  cursor: 'pointer',
  
  transition: 'all 0.2s',
  
  '&:hover': {
    background: '#f3f4f6',
    borderColor: '#667eea',
    color: '#667eea',
  },
  
  '&:focus-visible': {
    outline: '2px solid #667eea',
    outlineOffset: '2px',
  },
});

@supports (grid-template-rows: subgrid) {
  .gallery {
    display: grid;
    gridTemplateRows: 'auto 1fr auto',
  }
}
\`;

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
        }}
      >
        <div
          style={{
            aspectRatio: '16 / 9',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        <div style={{ padding: '1rem 1.5rem' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
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
      autoDetectJS: true,
      jsSource: emotionGalleryCode,
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
};

export const WithSubgrid: Story = {
  args: {
    items: defaultItems,
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectJS: true,
      jsSource: emotionGalleryCode,
    },
  },
};
