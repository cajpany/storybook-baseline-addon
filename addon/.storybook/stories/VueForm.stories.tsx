import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Vue form with CSS Grid and modern features
const vueFormCode = `
<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form-grid">
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" type="text" v-model="formData.name" />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="formData.email" />
      </div>
      
      <div class="form-group full-width">
        <label for="message">Message</label>
        <textarea id="message" v-model="formData.message"></textarea>
      </div>
      
      <button type="submit" class="submit-btn">Submit</button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', formData)
}
</script>

<style scoped>
.form {
  container-type: inline-size;
  max-width: 600px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input,
textarea {
  padding-inline: 1rem;
  padding-block: 0.75rem;
  
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  
  font-family: inherit;
  font-size: 1rem;
  
  transition: all 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px color-mix(in srgb, #667eea 20%, transparent);
}

input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  grid-column: 1 / -1;
  
  padding-inline: 2rem;
  padding-block: 1rem;
  
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px color-mix(in srgb, #667eea 30%, transparent);
}

.submit-btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 4px;
}

.submit-btn:active {
  transform: translateY(0);
}

/* Container query for responsive layout */
@container (max-width: 500px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* Subgrid support */
@supports (grid-template-rows: subgrid) {
  .form-group {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 2;
  }
}

/* Form validation states */
input:invalid {
  border-color: #ef4444;
}

input:valid {
  border-color: #10b981;
}

/* :has() for form state */
.form:has(input:invalid) .submit-btn {
  opacity: 0.6;
  cursor: not-allowed;
}

.form:has(input:focus) {
  /* Enhanced form when any input is focused */
}
</style>
`;

// React component for display
const VueForm = () => (
  <form
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
        <input type="text" style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
        <input type="email" style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Message</label>
        <textarea style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #e5e7eb', borderRadius: '8px', minHeight: '120px' }} />
      </div>
      <button type="submit" style={{ gridColumn: '1 / -1', padding: '1rem 2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
        Submit
      </button>
    </div>
  </form>
);

const meta: Meta<typeof VueForm> = {
  title: 'Vue Examples/Vue Form',
  component: VueForm,
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueFormCode,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VueForm>;

export const Primary: Story = {};

export const ResponsiveGrid: Story = {
  parameters: {
    baseline: {
      target: '2024',
      autoDetectVue: true,
      vueSource: vueFormCode,
    },
  },
};
