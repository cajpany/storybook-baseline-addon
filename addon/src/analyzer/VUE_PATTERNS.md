# Vue CSS Patterns

## Vue Single File Component (SFC) Structure

### Basic Structure
```vue
<template>
  <button class="button">{{ label }}</button>
</template>

<script>
export default {
  props: ['label']
}
</script>

<style>
.button {
  display: grid;
  gap: 1rem;
}
</style>
```

### Scoped Styles
```vue
<style scoped>
.button {
  display: flex;
  container-type: inline-size;
}
</style>
```

### CSS Modules
```vue
<style module>
.button {
  display: grid;
  aspect-ratio: 16 / 9;
}
</style>
```

### Multiple Style Blocks
```vue
<style>
/* Global styles */
.button {
  display: flex;
}
</style>

<style scoped>
/* Scoped styles */
.button {
  gap: 1rem;
}
</style>
```

### Preprocessors
```vue
<style lang="scss">
.button {
  display: grid;
  
  &:hover {
    opacity: 0.8;
  }
}
</style>
```

---

## Vue CSS-in-JS Libraries

### 1. vue-styled-components
```javascript
import styled from 'vue-styled-components';

const Button = styled('button', {
  display: 'flex',
  gap: '0.5rem',
  padding: '12px 24px',
});
```

### 2. Pinceau (Vue 3)
```javascript
import { css } from 'pinceau';

const buttonStyles = css({
  display: 'grid',
  gap: '1rem',
  containerType: 'inline-size',
});
```

### 3. VueUse CSS Variables
```javascript
import { useCssVar } from '@vueuse/core';

// Runtime CSS variables - skip for static analysis
const color = useCssVar('--button-color');
```

---

## Extraction Strategy

### What to Extract:
✅ `<style>` blocks (all types)
✅ `<style scoped>` blocks
✅ `<style module>` blocks
✅ Multiple style blocks (combine)
✅ vue-styled-components object syntax
✅ Pinceau css() function

### What to Skip:
❌ Preprocessor syntax (SCSS, Less) - requires compilation
❌ Dynamic `:style` bindings - runtime only
❌ Inline styles in template - too complex
❌ CSS variables from VueUse - runtime only
❌ UnoCSS/Windi classes - atomic CSS (different approach)

---

## AST Patterns

### Vue SFC Parsed Structure
```javascript
{
  descriptor: {
    template: { content: '...', ... },
    script: { content: '...', ... },
    styles: [
      {
        content: '.button { display: grid; }',
        scoped: false,
        module: false,
        lang: 'css'
      },
      {
        content: '.button { gap: 1rem; }',
        scoped: true,
        module: false,
        lang: 'css'
      }
    ]
  }
}
```

### vue-styled-components Pattern
```javascript
// AST: CallExpression
styled('button', {
  // AST: ObjectExpression
  display: 'flex',
  gap: '0.5rem'
})
```

### Pinceau Pattern
```javascript
// AST: CallExpression
css({
  // AST: ObjectExpression
  display: 'grid',
  containerType: 'inline-size'
})
```

---

## Edge Cases

### 1. Empty Style Blocks
```vue
<style></style>
```
**Handling:** Skip empty blocks

### 2. Comments Only
```vue
<style>
/* TODO: Add styles */
</style>
```
**Handling:** Extract, PostCSS will handle

### 3. Multiple Languages
```vue
<style lang="scss">...</style>
<style lang="less">...</style>
```
**Handling:** Skip preprocessors for MVP

### 4. Dynamic Styles
```vue
<template>
  <div :style="{ color: dynamicColor }">
</template>
```
**Handling:** Skip, can't analyze statically

### 5. Scoped with Deep Selectors
```vue
<style scoped>
.button ::v-deep(.icon) {
  color: red;
}
</style>
```
**Handling:** Extract CSS, ignore Vue-specific selectors

---

## Implementation Notes

1. **Use `@vue/compiler-sfc`** for parsing
2. **Extract all `<style>` blocks** regardless of scoped/module
3. **Combine multiple blocks** into single CSS string
4. **Skip preprocessors** (document limitation)
5. **Reuse existing CSS analyzer** for feature detection
6. **Handle errors gracefully** with console warnings
