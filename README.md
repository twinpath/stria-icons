# Stria Icons

The Essential Stroke for Modern Interfaces.

Stria is a unified visual language of pixel-perfect SVG icons, built with absolute geometric precision and zero dependency bloat.

## Ecosystem Packages

This monorepo compiles and distributes Stria Icons to various ecosystems:

| Package | Registry | Target Environment | Installation |
| :--- | :--- | :--- | :--- |
| `stria-icons` | npm | Core Vectors, CSS, Sprites, Vanilla JS | `npm install stria-icons` |
| `@stria-icons/react` | npm | React / Next.js / Inertia React | `npm install @stria-icons/react` |
| `stria/blade-icons` | Packagist | Laravel Blade components | `composer require stria/blade-icons` |

## Usage Examples

### 1. Plain HTML / Vanilla JS
Using the lightweight self-executing script (replacer utility):

```html
<script src="https://cdn.jsdelivr.net/npm/stria-icons@latest/dist/umd/stria.min.js"></script>

<!-- Add elements with the data-stria attribute -->
<i data-stria="user" data-stria-style="solid"></i>
<i data-stria="home" data-stria-style="regular"></i>

<script>
  stria.replace();
</script>
```

Using CSS Masking:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/stria-icons@latest/dist/css/stria.min.css">

<!-- Use the utility classes -->
<i class="stria-solid stria-user"></i>
```

### 2. React
```jsx
import { User, Home } from '@stria-icons/react';

function App() {
  return (
    <div>
      <User size={24} color="blue" />
      <Home size={20} />
    </div>
  );
}
```

### 3. Laravel Blade
```blade
{{-- Render as a Blade component --}}
<x-stria-solid-user class="w-5 h-5 text-gray-600" />

{{-- Render as a directive --}}
@stria('user', 'solid', ['class' => 'w-5 h-5'])
```

## Licenses

- Code (compiler toolchain, wrappers, build scripts): MIT License
- Icon designs (SVGs in `/icons` directory): CC BY 4.0
