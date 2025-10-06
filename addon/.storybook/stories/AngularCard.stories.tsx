import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Angular card component with modern CSS
const angularCardCode = `
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <header class="card-header">
        <h3>{{ title }}</h3>
      </header>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <footer class="card-footer">
        <button class="btn">Learn More</button>
      </footer>
    </div>
  \`,
  styles: [\`
    .card {
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
    }
    
    .card-header {
      padding-block-end: 1rem;
      border-block-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }
    
    .card-header h3 {
      margin: 0;
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      background: linear-gradient(90deg, #dd0031 0%, #c3002f 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .card-body {
      padding-block: 1rem;
      overflow-y: auto;
    }
    
    .card-footer {
      padding-block-start: 1rem;
      border-block-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      
      padding-inline: 1.5rem;
      padding-block: 0.75rem;
      
      background: linear-gradient(135deg, #dd0031 0%, #c3002f 100%);
      color: white;
      border: none;
      border-radius: 8px;
      
      font-weight: 600;
      cursor: pointer;
    }
    
    @container card (min-width: 300px) {
      .card-header h3 {
        font-size: 1.75rem;
      }
    }
  \`]
})
export class CardComponent {
  @Input() title: string = 'Card Title';
}
`;

// React component for display
const AngularCard = ({ children }: { children: React.ReactNode }) => (
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
    {children}
  </div>
);

const meta: Meta<typeof AngularCard> = {
  title: 'Angular Examples/Angular Card',
  component: AngularCard,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectAngular: true,
      angularSource: angularCardCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AngularCard>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <header style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <h3>Card Title</h3>
        </header>
        <div>Card content goes here</div>
        <footer style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <button style={{ padding: '0.75rem 1.5rem', background: '#dd0031', color: 'white', border: 'none', borderRadius: '8px' }}>
            Learn More
          </button>
        </footer>
      </>
    ),
  },
};

export const WithModernCSS: Story = {
  args: {
    children: 'Demonstrates: grid, container-queries, oklch, color-mix, clamp, logical properties',
  },
};
