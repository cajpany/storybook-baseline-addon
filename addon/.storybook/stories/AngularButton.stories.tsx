import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Angular component code (as string for demonstration)
const angularButtonCode = `
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: '<button class="button">{{ label }}</button>',
  styles: [\`
    .button {
      display: grid;
      gap: 1rem;
      container-type: inline-size;
      aspect-ratio: 16 / 9;
      
      padding: 12px 24px;
      background: linear-gradient(135deg, #dd0031 0%, #c3002f 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      
      transition: transform 0.2s;
    }
    
    .button:hover {
      transform: scale(1.05);
    }
    
    .button:focus-visible {
      outline: 2px solid #dd0031;
      outline-offset: 2px;
    }
  \`]
})
export class ButtonComponent {
  @Input() label: string = 'Click me';
}
`;

// React component for display (simulating Angular button)
const AngularButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      display: 'grid',
      gap: '1rem',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #dd0031 0%, #c3002f 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const meta: Meta<typeof AngularButton> = {
  title: 'Angular Examples/Angular Button',
  component: AngularButton,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectAngular: true,
      angularSource: angularButtonCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AngularButton>;

export const Primary: Story = {
  args: {
    children: 'Angular Button',
  },
};

export const WithViewEncapsulation: Story = {
  args: {
    children: 'Emulated Encapsulation',
  },
  parameters: {
    baseline: {
      target: '2024',
      autoDetectAngular: true,
      angularSource: `
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  template: '<button>Click me</button>',
  styles: [\`
    .button {
      display: flex;
      gap: 0.5rem;
      container-type: inline-size;
    }
  \`],
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonComponent {}
      `,
    },
  },
};

export const WithManualAnnotation: Story = {
  args: {
    children: 'Manual + Auto Detection',
  },
  parameters: {
    baseline: {
      target: '2024',
      features: ['subgrid'], // Manual annotation
      autoDetectAngular: true,
      angularSource: angularButtonCode, // Auto-detection from Angular
    },
  },
};
