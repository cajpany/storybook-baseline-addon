# CSS-in-JS Library Patterns

## 1. styled-components

### Installation
```bash
npm install styled-components
```

### Pattern 1: Tagged Template Literal
```typescript
import styled from 'styled-components';

const Button = styled.button`
  display: grid;
  container-type: inline-size;
  color: ${props => props.primary ? 'blue' : 'gray'};
`;
```

**AST Pattern:**
- Import: `styled-components`
- Node Type: `TaggedTemplateExpression`
- Tag: `MemberExpression` (styled.button) or `CallExpression` (styled(Component))
- Quasi: `TemplateLiteral`

### Pattern 2: Styled with Component
```typescript
const StyledButton = styled(Button)`
  display: flex;
`;
```

### Pattern 3: css Helper
```typescript
import { css } from 'styled-components';

const styles = css`
  display: grid;
  gap: 1rem;
`;
```

### Pattern 4: createGlobalStyle
```typescript
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    display: flex;
  }
`;
```

---

## 2. Emotion

### Installation
```bash
npm install @emotion/react @emotion/styled
```

### Pattern 1: css Prop (Object)
```typescript
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

<div css={{ display: 'grid', gap: '1rem' }}>
```

**AST Pattern:**
- JSX Attribute: `css`
- Value: `ObjectExpression`

### Pattern 2: css Prop (Template Literal)
```typescript
<div css={css`
  display: grid;
  gap: 1rem;
`}>
```

**AST Pattern:**
- JSX Attribute: `css`
- Value: `TaggedTemplateExpression`

### Pattern 3: styled (Similar to styled-components)
```typescript
import styled from '@emotion/styled';

const Button = styled.button`
  display: grid;
`;
```

### Pattern 4: Object Styles
```typescript
const styles = {
  button: {
    display: 'grid',
    containerType: 'inline-size',
  }
};
```

---

## 3. Stitches

### Installation
```bash
npm install @stitches/react
```

### Pattern 1: styled Function
```typescript
import { styled } from '@stitches/react';

const Button = styled('button', {
  display: 'grid',
  containerType: 'inline-size',
});
```

**AST Pattern:**
- Import: `@stitches/react`
- Node Type: `CallExpression`
- Callee: `styled`
- Arguments: [element, objectExpression]

### Pattern 2: css Function
```typescript
import { css } from '@stitches/react';

const buttonClass = css({
  display: 'grid',
  gap: '$4', // token
});
```

### Pattern 3: Variants
```typescript
const Button = styled('button', {
  display: 'grid',
  variants: {
    size: {
      small: { padding: '8px' },
      large: { padding: '16px' },
    }
  }
});
```

---

## 4. Linaria

### Installation
```bash
npm install @linaria/core @linaria/react
```

### Pattern: Tagged Template (Zero-runtime)
```typescript
import { css } from '@linaria/core';
import { styled } from '@linaria/react';

const Button = styled.button`
  display: grid;
`;

const className = css`
  display: flex;
`;
```

**Note:** Linaria extracts CSS at build time, similar to styled-components syntax.

---

## 5. Vanilla Extract

### Installation
```bash
npm install @vanilla-extract/css
```

### Pattern: TypeScript-based
```typescript
import { style } from '@vanilla-extract/css';

export const button = style({
  display: 'grid',
  containerType: 'inline-size',
});
```

**Note:** Vanilla Extract uses `.css.ts` files, not runtime CSS-in-JS.

---

## Detection Priority

### High Priority (Most Common)
1. **styled-components** - Most popular, template literals
2. **Emotion** - Popular, both object and template syntax
3. **Stitches** - Growing adoption, object-based

### Medium Priority
4. **Linaria** - Zero-runtime, similar to styled-components
5. **CSS Modules** - Not CSS-in-JS, but common pattern

### Low Priority (Out of Scope)
- **Vanilla Extract** - Build-time only, separate files
- **JSS** - Older, declining usage
- **Aphrodite** - Older, declining usage

---

## Common Patterns to Extract

### 1. Tagged Template Literals
```typescript
styled.button`CSS HERE`
styled(Component)`CSS HERE`
css`CSS HERE`
```

### 2. Object Expressions
```typescript
css={{ property: 'value' }}
styled('button', { property: 'value' })
```

### 3. Dynamic Values (Skip)
```typescript
color: ${props => props.color}  // SKIP - dynamic
color: ${theme.colors.primary}  // SKIP - dynamic
```

### 4. Static Values (Extract)
```typescript
display: grid;                   // EXTRACT
containerType: 'inline-size';    // EXTRACT
gap: 1rem;                       // EXTRACT
```

---

## Object-to-CSS Conversion Rules

### CamelCase to Kebab-case
```typescript
containerType → container-type
gridTemplateColumns → grid-template-columns
WebkitTransform → -webkit-transform
```

### Numeric Values
```typescript
padding: 16 → padding: 16px
lineHeight: 1.5 → line-height: 1.5
zIndex: 10 → z-index: 10
```

### Array Values
```typescript
margin: [0, 'auto'] → margin: 0 auto
```

### Nested Selectors
```typescript
{
  display: 'grid',
  '&:hover': {
    opacity: 0.8
  }
}
→
display: grid;
&:hover {
  opacity: 0.8;
}
```

---

## AST Node Types Reference

### For Template Literals
- `TaggedTemplateExpression`
  - `tag`: Identifier or MemberExpression
  - `quasi`: TemplateLiteral
    - `quasis`: Array of TemplateElement
    - `expressions`: Array of Expression (interpolations)

### For Object Expressions
- `ObjectExpression`
  - `properties`: Array of ObjectProperty
    - `key`: Identifier or StringLiteral
    - `value`: Literal, Identifier, or Expression

### For JSX
- `JSXAttribute`
  - `name`: JSXIdentifier
  - `value`: JSXExpressionContainer
    - `expression`: ObjectExpression or TaggedTemplateExpression

---

## Implementation Strategy

### Phase 1: styled-components (Template Literals)
- Easiest to parse
- Most common
- Clear patterns

### Phase 2: Emotion (Object Syntax)
- Requires object-to-CSS conversion
- Handle camelCase
- Handle numeric values

### Phase 3: Stitches (Object Syntax)
- Similar to Emotion
- Handle tokens ($4 → actual value)
- Skip variants for MVP

### Phase 4: Linaria (If Time Permits)
- Similar to styled-components
- Zero-runtime, but same syntax
