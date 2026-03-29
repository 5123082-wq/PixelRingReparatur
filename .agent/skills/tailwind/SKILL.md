---
name: Tailwind CSS Expert
description: Expert guide for building modern, responsive user interfaces with Tailwind CSS utility-first framework. Covers v4.1+ features.
---

# Tailwind CSS Development Patterns

Expert guide for building modern, responsive user interfaces with the Tailwind CSS utility-first framework. Covers v4+ features including CSS-first configuration, custom utilities, and enhanced developer experience.

## Key Principles
- **Utility-first Workflow**: Design directly in markup.
- **Mobile-first**: Always begin styling with a mobile-first approach, progressively adding breakpoints (`sm:`, `md:`, `lg:`).
- **Consistency**: Centralize your tokens and theming via CSS configuration (`@theme` in Tailwind CSS v4.x).
- **Component Abstraction**: Abstract common UI patterns into reusable components in your JS framework, rather than relying solely on `@apply`.
- **Accessibility (A11y)**: Use ARIA attributes and semantic HTML in conjunction with Tailwind utility classes.

## Features specific to Tailwind CSS v4.x
1. **Zero-Configuration and CSS-First**: Employs `@import "tailwindcss";` and `@theme` blocks inside standard `.css` files.
2. **Lightning Fast**: JIT compiler speed significantly upgraded in v4 using a new Rust-based engine (if supported) or Lightning CSS.
3. **No tailwind.config.js Required**: Customization happens natively in stylesheet via CSS variables.

## Example Patterns

### Responsive Typography
```html
<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">Responsive Heading</h1>
<p class="text-left md:text-center">Left aligned on mobile, centered on tablet+</p>
```

### Flexbox and Grid Patterns
```html
<!-- Flex Pattern -->
<div class="flex flex-col md:flex-row gap-4 items-center justify-between">
  <div>Item 1 (Above on mobile, Left on Desktop)</div>
  <div>Item 2 (Below on mobile, Right on Desktop)</div>
</div>

<!-- Modern Auto-Fit Grid -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <!-- Automatically fits columns based on container width -->
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### Component Driven Patterns (React)
Instead of huge strings, utilize template literals dynamically matching state or props:

```tsx
function Button({ variant = 'primary', size = 'md', children }: { variant?: 'primary' | 'secondary'; size?: 'sm' | 'md' | 'lg'; children: React.ReactNode;}) {
  const baseClasses = 'font-semibold rounded transition duration-200';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </button>
  );
}
```

### Styling with CSS-first Configurations (Tailwind v4)
```css
/* src/global.css */
@import "tailwindcss";

@theme {
  --color-brand-50: #f0f9ff;
  --color-brand-500: #3b82f6;
  --color-brand-900: #1e3a8a;
  --font-display: "Inter", system-ui, sans-serif;
  --spacing-128: 32rem;
}

/* Custom Utilities definition */
@utility content-auto {
  content-visibility: auto;
}
```

## Advanced Patterns
- **Hover parent, affect child**: Use the `group` class on the parent and `group-hover:` on children elements.
- **Dark Mode**: Integrate via `.dark` class targeting configurations, allowing seamless theme switching. Example: `bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`.
- **Peer modifiers**: Target structural siblings using `peer` class on antecedent elements and `peer-focus:` or `peer-checked:` on subsequent elements (ideal for custom radio/check boxes without JS).
