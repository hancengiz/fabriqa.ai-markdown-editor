# Theme System

This directory contains the centralized theme system for the markdown editor.

## Structure

- `types.ts` - TypeScript interfaces for theme structure
- `vscode-light.ts` - Light theme based on VS Code's default light theme
- `index.ts` - Theme manager with functions to get/set themes

## Usage

### Getting the current theme

```typescript
import { getCurrentTheme } from './themes';

const theme = getCurrentTheme();
const backgroundColor = theme.bgColor.default; // '#ffffff'
const codeBackground = theme.code.background;  // '#f6f8fa'
```

### Using theme colors in components

```typescript
import { getCurrentTheme } from './themes';

const theme = getCurrentTheme();

// In inline styles
const styles = {
  backgroundColor: theme.code.background,
  color: theme.code.text,
  border: `1px solid ${theme.borderColor.default}`,
};

// In CodeMirror theme
EditorView.theme({
  '&': {
    color: theme.editor.foreground,
    backgroundColor: theme.editor.background
  },
  '.cm-content': {
    caretColor: theme.editor.cursor
  }
});
```

### Switching themes

```typescript
import { setTheme } from './themes';

// Switch to dark theme (when implemented)
setTheme('vscode-dark');

// Switch back to light
setTheme('vscode-light');
```

### Creating a custom theme

```typescript
import { ThemeInfo, registerCustomTheme } from './themes';

const myCustomTheme: ThemeInfo = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  type: 'custom',
  theme: {
    bgColor: {
      default: '#f0f0f0',
      // ... other colors
    },
    // ... rest of theme definition
  },
};

// Register the theme
registerCustomTheme(myCustomTheme);

// Switch to it
setTheme('my-custom-theme');
```

### Reading from VS Code's theme (future enhancement)

```typescript
// This could be implemented in the future to read actual VS Code theme
import * as vscode from 'vscode';

function getVSCodeThemeColors(): Theme {
  const colors = vscode.window.activeColorTheme;

  return {
    bgColor: {
      default: colors.get('editor.background') || '#ffffff',
      // ... map VS Code colors to our theme structure
    },
    // ...
  };
}
```

## Adding a new theme

1. Create a new file (e.g., `vscode-dark.ts`)
2. Define the theme following the `ThemeInfo` interface
3. Import it in `index.ts`
4. Add it to the `themes` record

Example:

```typescript
// vscode-dark.ts
import { ThemeInfo } from './types';

export const vscodeDarkTheme: ThemeInfo = {
  id: 'vscode-dark',
  name: 'VS Code Dark',
  type: 'dark',
  theme: {
    bgColor: {
      default: '#1e1e1e',
      muted: '#2d2d2d',
      // ...
    },
    // ... all other colors
  },
};
```

```typescript
// index.ts
import { vscodeDarkTheme } from './vscode-dark';

const themes: Record<string, ThemeInfo> = {
  'vscode-light': vscodeLightTheme,
  'vscode-dark': vscodeDarkTheme, // Add here
};
```

## Benefits

1. **Centralized**: All colors in one place
2. **Type-safe**: TypeScript ensures you use valid colors
3. **Easy to extend**: Add new themes by creating new files
4. **Flexible**: Can read from VS Code or use custom colors
5. **Future-proof**: Easy to add dark mode support

## Migration

To migrate existing code to use the theme system:

### Before
```typescript
const backgroundColor = '#f6f8fa';
const textColor = '#1f2328';
```

### After
```typescript
import { getCurrentTheme } from './themes';

const theme = getCurrentTheme();
const backgroundColor = theme.code.background;
const textColor = theme.code.text;
```
