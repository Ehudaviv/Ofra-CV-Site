# Responsive Layout Utilities

This document describes the responsive layout utilities available in the portfolio website. These utilities support requirements 8.1, 8.2, and 8.3 for responsive design across all screen sizes.

## Overview

The responsive layout system provides:
- **Breakpoint mixins** for mobile-first responsive design
- **Container utilities** for content width management
- **Grid utilities** for flexible layouts
- **RTL/LTR directional styles** for bilingual support
- **Utility classes** for common layout patterns

## Breakpoints

The system uses five breakpoints covering 320px to 2560px:

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `mobile` | 320px | Base styles (mobile-first) |
| `tablet` | 768px | Tablet and up |
| `desktop` | 1024px | Desktop and up |
| `wide` | 1440px | Wide screens |
| `ultra` | 2560px | Ultra-wide screens |

### Breakpoint Mixins

Use these mixins in your Sass files:

```scss
@import './styles/mixins.scss';

.my-component {
  // Mobile styles (default)
  padding: 16px;
  
  // Tablet and up
  @include tablet {
    padding: 24px;
  }
  
  // Desktop and up
  @include desktop {
    padding: 32px;
  }
}
```

Available mixins:
- `@include mobile { ... }` - 320px and up
- `@include tablet { ... }` - 768px and up
- `@include desktop { ... }` - 1024px and up
- `@include wide { ... }` - 1440px and up
- `@include ultra { ... }` - 2560px and up
- `@include breakpoint($width) { ... }` - Custom breakpoint
- `@include max-width($width) { ... }` - Max-width media query

## Container Utilities

Containers center content and provide responsive padding:

### Sass Mixins

```scss
.my-section {
  @include container;        // Standard container (max-width: 1200px)
  @include container-narrow; // Narrow container (max-width: 800px)
  @include container-wide;   // Wide container (max-width: 1440px)
}
```

### CSS Classes

```html
<div class="container">Standard container</div>
<div class="container-narrow">Narrow container</div>
<div class="container-wide">Wide container</div>
```

## Grid Utilities

### Sass Mixins

```scss
// Fixed column grid
.gallery {
  @include grid(3, 16px); // 3 columns with 16px gap
}

// Auto-fit grid (responsive)
.cards {
  @include grid-auto-fit(250px); // Min 250px per column
}

// Auto-fill grid
.items {
  @include grid-auto-fill(200px, 16px); // Min 200px, 16px gap
}

// Responsive gallery grid (1/2/3/4 columns)
.photo-gallery {
  @include gallery-grid;
}
```

### CSS Classes

```html
<!-- Fixed columns -->
<div class="grid grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Responsive gallery grid -->
<div class="grid-responsive">
  <div>Photo 1</div>
  <div>Photo 2</div>
  <div>Photo 3</div>
</div>

<!-- Auto-fit grid -->
<div class="grid-auto-fit">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

## RTL/LTR Directional Styles

Support for Hebrew (RTL) and English (LTR) text directions:

### Sass Mixins

```scss
.navigation {
  // Applies only in RTL mode
  @include rtl {
    border-right: 1px solid #ccc;
  }
  
  // Applies only in LTR mode
  @include ltr {
    border-left: 1px solid #ccc;
  }
}

// Directional spacing (automatically flips for RTL)
.card {
  @include padding-start(16px);  // Left in LTR, right in RTL
  @include padding-end(16px);    // Right in LTR, left in RTL
  @include margin-start(8px);
  @include margin-end(8px);
}

// Directional text alignment
.content {
  @include text-start; // Left in LTR, right in RTL
}

// Directional float
.sidebar {
  @include float-start; // Left in LTR, right in RTL
}
```

### CSS Classes

```html
<div class="ps-4 pe-4">Directional padding</div>
<div class="ms-auto">Margin start auto</div>
<div class="text-start">Directional text alignment</div>
<div class="float-start">Directional float</div>
```

## Flexbox Utilities

### Sass Mixins

```scss
.header {
  @include flex-center;   // Center both axes
  @include flex-between;  // Space-between with center alignment
}
```

### CSS Classes

```html
<div class="flex flex-center">Centered content</div>
<div class="flex flex-between">Space between items</div>
<div class="flex flex-column">Vertical layout</div>
<div class="flex items-center justify-between">Custom flex</div>
```

## Responsive Visibility

Hide or show elements at different breakpoints:

### Sass Mixins

```scss
.mobile-menu {
  @include show-mobile-only; // Visible only on mobile
}

.desktop-nav {
  @include hide-mobile; // Hidden on mobile
}
```

### CSS Classes

```html
<div class="hide-mobile">Desktop only</div>
<div class="show-mobile-only">Mobile only</div>
<div class="hide-tablet-up">Mobile only (alternative)</div>
<div class="hide-desktop-up">Mobile and tablet only</div>
```

## Spacing Utilities

### Responsive Section Padding

```scss
.section {
  @include responsive-padding-y; // Vertical padding that scales
  @include responsive-padding-x; // Horizontal padding that scales
}
```

### CSS Classes

```html
<section class="section-padding">
  <!-- Responsive padding applied -->
</section>

<!-- Manual spacing -->
<div class="mt-4 mb-8">Margin top 16px, bottom 32px</div>
<div class="p-6">Padding 24px all sides</div>
```

## Typography Utilities

### Responsive Font Sizes

```scss
.heading {
  @include responsive-font-size(
    $font-size-2xl,  // Mobile
    $font-size-3xl,  // Tablet
    $font-size-4xl   // Desktop
  );
}
```

### CSS Classes

```html
<div class="text-center">Centered text</div>
<div class="text-start">Directional start alignment</div>
<div class="text-end">Directional end alignment</div>
<div class="truncate">Text with ellipsis...</div>
```

## Accessibility Utilities

```scss
.skip-link {
  @include visually-hidden; // Hidden but accessible to screen readers
}

.button {
  &:focus {
    @include focus-outline; // Accessible focus indicator
  }
}
```

### CSS Classes

```html
<a href="#main" class="sr-only">Skip to main content</a>
<button class="focus-outline">Accessible button</button>
```

## Common Patterns

### Responsive Gallery (Requirement 8.3)

```scss
.exhibition-gallery {
  @include gallery-grid;
  
  .gallery-item {
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: $border-radius-md;
  }
}
```

Result:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Wide: 4 columns

### Mobile Navigation (Requirement 8.2)

```scss
.navigation {
  // Mobile: Hamburger menu
  @include max-width($breakpoint-tablet - 1px) {
    .nav-menu {
      display: none;
      
      &.is-open {
        display: flex;
        flex-direction: column;
      }
    }
  }
  
  // Desktop: Horizontal menu
  @include tablet {
    .nav-menu {
      display: flex;
      flex-direction: row;
    }
    
    .hamburger {
      display: none;
    }
  }
}
```

### Bilingual Layout

```scss
.about-section {
  @include container;
  @include responsive-padding-y;
  
  .bio-text {
    @include text-start;
    
    @include rtl {
      font-family: $font-hebrew;
    }
  }
  
  .photo {
    @include float-start;
    @include margin-end($spacing-6);
  }
}
```

## Best Practices

1. **Mobile-First**: Write base styles for mobile, then use breakpoint mixins to enhance for larger screens
2. **Use Mixins in Components**: Import mixins in component Sass files for scoped styles
3. **Use Classes for Utilities**: Apply utility classes directly in JSX for common patterns
4. **Directional Properties**: Always use directional mixins (start/end) instead of left/right for RTL support
5. **Test Across Breakpoints**: Verify layouts work at 320px, 768px, 1024px, 1440px, and 2560px
6. **Semantic HTML**: Use utility classes to enhance semantic HTML, not replace it

## Requirements Coverage

- ✅ **Requirement 8.1**: Responsive layout adapts from 320px to 2560px
- ✅ **Requirement 8.2**: Mobile-friendly navigation support via breakpoint mixins
- ✅ **Requirement 8.3**: Gallery grid adjusts columns for optimal viewing

## Examples

See the following components for usage examples:
- `src/components/Navigation/Navigation.module.scss` - Mobile navigation
- `src/components/Gallery/Gallery.module.scss` - Responsive gallery grid
- `src/components/AboutSection/AboutSection.module.scss` - RTL/LTR layout
