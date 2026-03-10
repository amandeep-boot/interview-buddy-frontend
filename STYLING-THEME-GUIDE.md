# Styling & Theming Guide for Interview Buddy Frontend

## Overview
This project uses **Tailwind CSS** for utility-first styling and **next-themes** for dark/light theme switching. Colors and other themeable properties are managed using CSS variables, which are toggled based on the current theme.

---

## 1. Tailwind CSS Setup
- Tailwind is configured in `tailwind.config.ts`.
- The `darkMode` option is set to `class`, meaning the `dark` class on the `<html>` element enables dark mode.
- Custom colors in Tailwind use CSS variables (e.g., `--background`, `--foreground`).

**Example from `tailwind.config.ts`:**
```ts
const config = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ...other colors
      },
    },
  },
  // ...
}
```

---

## 2. CSS Variables for Themes
- Defined in `app/globals.css` under `:root` (light) and `.dark` (dark).
- These variables control background, text, and component colors.

**Example from `globals.css`:**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... */
}
.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

---

## 3. Theme Switching with next-themes
- The `ThemeProvider` from `next-themes` wraps your app (see `app/layout.tsx`).
- It toggles the `dark` class on `<html>` based on user/system preference.
- Use the `useTheme` hook to read or set the theme in components.

**Example usage:**
```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();

// To switch theme:
setTheme('light'); // or 'dark', or 'system'
```

---

## 4. Writing Theme-Aware Styles
- **Always use Tailwind classes that map to CSS variables** for backgrounds, text, borders, etc.
- Avoid hardcoded colors like `bg-black` or `text-white`.
- Use:
  - `bg-background` for backgrounds
  - `text-foreground` for text
  - `border-border` for borders
  - etc.

**Example:**
```tsx
<div className="bg-background text-foreground border-border border p-4">
  This box adapts to light/dark mode!
</div>
```

---

## 5. Adding New Themeable Components
1. Use Tailwind classes that reference your CSS variables.
2. If you need a new color, add a CSS variable in `globals.css` and reference it in `tailwind.config.ts`.
3. Use the `useTheme` hook if you want to let users toggle the theme.

**Example: Custom Card**
```tsx
<div className="bg-card text-card-foreground rounded-lg shadow p-6">
  Themed card content
</div>
```

---

## 6. Debugging Theme Issues
- If a component does not change with the theme, check for hardcoded colors.
- Ensure you are using the correct Tailwind class (e.g., `bg-background` not `bg-black`).
- Make sure the `ThemeProvider` is wrapping your app and `attribute="class"` is set.

---

## 7. Useful References
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [next-themes Docs](https://github.com/pacocoursey/next-themes)

---

## Summary Table
| Use for         | Tailwind Class     | CSS Variable         |
|-----------------|-------------------|---------------------|
| Background      | bg-background     | --background        |
| Foreground/Text | text-foreground   | --foreground        |
| Card            | bg-card           | --card              |
| Card Text       | text-card-foreground | --card-foreground |
| Border          | border-border     | --border            |

---

By following these conventions, your app will be fully theme-aware and easy to maintain!
