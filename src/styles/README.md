# Yemenite-Inspired Theme Configuration

This directory contains the complete theme configuration for the portfolio website, inspired by traditional Yemenite art with warm, inviting colors and elegant typography.

## Files Overview

### `variables.scss`
Contains all Sass variables for the theme including:
- **Color Palette**: Warm terracotta, deep blue, gold, and cream colors
- **Typography**: Font families, sizes, weights, line heights, and letter spacing
- **Spacing System**: 8px-based spacing scale
- **Breakpoints**: Responsive design breakpoints (mobile to ultra-wide)
- **Border Radius**: Consistent corner rounding values
- **Shadows**: Elevation system with multiple shadow levels
- **Transitions**: Animation timing values
- **Z-Index**: Layering system for overlays and modals

### `theme.scss`
Converts Sass variables to CSS custom properties (CSS variables) for:
- Runtime access in JavaScript
- Dynamic theming capabilities
- RTL/LTR language support
- Global element styling (body, headings, links, code)

### `mixins.scss`
Provides reusable Sass mixins for:
- **Responsive Design**: Mobile-first breakpoint mixins
- **RTL/LTR Support**: Directional padding, margin, text alignment, and float
- **Containers**: Standard, narrow, and wide container layouts
- **Typography**: Heading and body text styles
- **Visual Effects**: Cards, focus outlines, truncation
- **Layout Utilities**: Flexbox and grid helpers
- **Responsive Utilities**: Hide/show elements at breakpoints, responsive spacing

### `utilities.scss`
Provides ready-to-use CSS utility classes for:
- **Containers**: `.container`, `.container-narrow`, `.container-wide`
- **Grid Layouts**: `.grid`, `.grid-cols-*`, `.grid-responsive`, `.grid-auto-fit`
- **Flexbox**: `.flex`, `.flex-center`, `.flex-between`, `.flex-column`
- **Spacing**: Margin and padding utilities (`.m-4`, `.p-6`, etc.)
- **Typography**: Text alignment, transformation, truncation
- **Display**: Show/hide utilities, responsive visibility
- **Accessibility**: `.sr-only`, `.focus-outline`
- **RTL/LTR**: Directional utilities (`.ps-4`, `.ms-auto`, etc.)

### `index.scss`
Main entry point that imports the theme, utilities, and applies global reset styles.

## Usage Examples

### Using Sass Variables

```scss
@import '../styles/variables.scss';

.my-component {
  background-color: $color-primary;
  padding: $spacing-4;
  border-radius: $border-radius-md;
  
  @include tablet {
    padding: $spacing-6;
  }
}
```

### Using CSS Custom Properties

```scss
.my-component {
  background-color: var(--color-primary);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

### Using in TypeScript/React

```typescript
import { theme, getCSSVariable } from '../types/theme';

// Access theme values programmatically
const primaryColor = theme.colors.primary;

// Get computed CSS variable value
const accentColor = getCSSVariable('color-accent');
```

### Responsive Design

```scss
@import '../styles/mixins.scss';

.gallery {
  @include grid-auto-fit(250px);
  
  @include mobile {
    gap: var(--spacing-2);
  }
  
  @include tablet {
    gap: var(--spacing-4);
  }
  
  @include desktop {
    gap: var(--spacing-6);
  }
}
```

### RTL/LTR Support

```scss
@import '../styles/mixins.scss';

.navigation {
  @include padding-start($spacing-4);
  @include text-start;
  
  .nav-item {
    @include margin-end($spacing-2);
  }
}
```

This automatically flips for RTL languages (Hebrew):
- `padding-start` becomes `padding-right` in RTL
- `text-start` becomes `text-align: right` in RTL
- `margin-end` becomes `margin-left` in RTL

### Container Layouts

```scss
@import '../styles/mixins.scss';

.section {
  @include container;
  padding-top: var(--section-padding-mobile);
  
  @include tablet {
    padding-top: var(--section-padding-tablet);
  }
  
  @include desktop {
    padding-top: var(--section-padding-desktop);
  }
}
```

### Typography Styles

```scss
@import '../styles/mixins.scss';

.article-title {
  @include heading-1;
  margin-bottom: var(--spacing-6);
}

.article-content {
  @include body-text;
}
```

### Card Components

```scss
@import '../styles/mixins.scss';

.card {
  @include card;
  
  &:focus {
    @include focus-outline;
  }
}
```

## Color Palette

### Primary Colors (Terracotta)
- `$color-primary` / `--color-primary`: #d4704f
- `$color-primary-light` / `--color-primary-light`: #e89478
- `$color-primary-dark` / `--color-primary-dark`: #b85a3d

### Secondary Colors (Deep Blue)
- `$color-secondary` / `--color-secondary`: #2c5f7d
- `$color-secondary-light` / `--color-secondary-light`: #4a7a96
- `$color-secondary-dark` / `--color-secondary-dark`: #1e4456

### Accent Colors (Gold)
- `$color-accent` / `--color-accent`: #d4a574
- `$color-accent-light` / `--color-accent-light`: #e6c199
- `$color-accent-dark` / `--color-accent-dark`: #b8895a

### Background Colors (Cream)
- `$color-background` / `--color-background`: #f5f0e8
- `$color-background-light` / `--color-background-light`: #faf7f2
- `$color-background-dark` / `--color-background-dark`: #e8dfd0

### Text Colors (Brown)
- `$color-text` / `--color-text`: #3d2817
- `$color-text-light` / `--color-text-light`: #6b5444
- `$color-text-muted` / `--color-text-muted`: #9a8577

## Typography

### Font Families
- **Headings**: Georgia, Times New Roman, serif
- **Body**: System font stack (San Francisco, Segoe UI, Roboto, etc.)
- **Hebrew**: Arial, Helvetica, Noto Sans Hebrew, David Libre
- **Code**: Courier New, Courier, monospace

### Font Sizes
- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)
- `md`: 1rem (16px) - base size
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 1.875rem (30px)
- `4xl`: 2.25rem (36px)
- `5xl`: 3rem (48px)

## Spacing System

Based on 8px unit:
- `spacing-1`: 4px
- `spacing-2`: 8px
- `spacing-3`: 12px
- `spacing-4`: 16px
- `spacing-5`: 20px
- `spacing-6`: 24px
- `spacing-8`: 32px
- `spacing-10`: 40px
- `spacing-12`: 48px
- `spacing-16`: 64px
- `spacing-20`: 80px
- `spacing-24`: 96px

## Breakpoints

- **Mobile**: 320px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Wide**: 1440px
- **Ultra**: 2560px

## Best Practices

1. **Use CSS Custom Properties in Components**: They can be accessed in JavaScript and support dynamic theming.

2. **Use Sass Variables in Mixins**: They provide better compile-time optimization.

3. **Mobile-First Approach**: Start with mobile styles and use `@include tablet`, `@include desktop` for larger screens.

4. **RTL Support**: Always use directional mixins (`padding-start`, `margin-end`, etc.) instead of left/right.

5. **Consistent Spacing**: Use the spacing scale variables instead of arbitrary pixel values.

6. **Semantic Colors**: Use color names that describe their purpose (primary, secondary, accent) rather than their appearance.

7. **Accessibility**: Ensure sufficient color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text).

## Validation

The theme meets the following requirements:
- ✅ **Requirement 7.1**: Warm color palette inspired by Yemenite art
- ✅ **Requirement 7.2**: Yemenite art design elements in visual theme
- ✅ **Requirement 7.3**: Consistent typography across all sections
- ✅ **Requirement 7.5**: Sufficient color contrast for accessibility
- ✅ **Requirement 8.1**: Responsive layout adapts from 320px to 2560px
- ✅ **Requirement 8.2**: Mobile-friendly navigation support via breakpoint mixins
- ✅ **Requirement 8.3**: Gallery grid adjusts columns for optimal viewing

## Additional Documentation

- **[RESPONSIVE_LAYOUT.md](./RESPONSIVE_LAYOUT.md)**: Comprehensive guide to responsive layout utilities, breakpoints, and patterns
- **[examples/](./examples/)**: Example components demonstrating usage of layout utilities
