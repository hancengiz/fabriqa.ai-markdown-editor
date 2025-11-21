import { ThemeInfo } from './types';

/**
 * VS Code Light Theme
 * Based on VS Code's default light theme colors
 * This theme can be used as a base for other light themes
 */
export const vscodeLightTheme: ThemeInfo = {
  id: 'vscode-light',
  name: 'VS Code Light',
  type: 'light',
  theme: {
    // Background colors
    bgColor: {
      default: '#ffffff',
      muted: '#f6f8fa',      // Light gray for code blocks, blockquotes
      neutral: '#f3f3f3',    // Slightly darker gray
      attention: '#fff8c5',  // Yellow for warnings
    },

    // Foreground/text colors
    fgColor: {
      default: '#1f2328',    // Main text color
      muted: '#656d76',      // Secondary text (blockquotes, etc)
      accent: '#0969da',     // Links, accents
      success: '#1a7f37',    // Success messages
      attention: '#9a6700',  // Warnings
      danger: '#e51400',     // Errors
      done: '#8250df',       // Completed items
    },

    // Border colors
    borderColor: {
      default: '#d0d7de',    // Default borders
      muted: '#d8dee4',      // Subtle borders
      accent: '#0969da',     // Accent borders
      success: '#1a7f37',    // Success borders
      attention: '#9a6700',  // Warning borders
      danger: '#e51400',     // Error borders
      done: '#8250df',       // Done borders
    },

    // Code colors
    code: {
      background: '#f6f8fa',      // Code block background
      text: '#1f2328',            // Code text color
      inlineBackground: '#f6f8fa', // Inline code background
    },

    // Blockquote colors
    blockquote: {
      background: '#f6f8fa',  // Light gray background
      text: '#656d76',        // Muted text
      border: '#d0d7de',      // Left border
    },

    // Checkbox colors (Obsidian-style)
    checkbox: {
      border: '#d0d0d0',          // Light gray border
      background: '#ffffff',       // White background
      checkedBackground: '#6c63ff', // Purple when checked
      checkedBorder: '#6c63ff',     // Purple border when checked
      checkmark: '#ffffff',         // White checkmark
    },

    // Editor UI
    editor: {
      background: '#ffffff',
      foreground: '#000000',
      selection: '#add6ff',
      activeLine: '#f5f5f5',
      cursor: '#000000',
      lineNumber: '#999999',
      activeLineNumber: '#000000',
    },

    // Links
    link: {
      default: '#006ab1',
      hover: '#0969da',
    },

    // Headings
    heading: {
      color: '#1f2328',
    },

    // Focus
    focus: {
      outline: '#0969da',
    },

    // GitHub Alerts/Admonitions (GitHub-flavored markdown)
    alert: {
      note: {
        background: '#ddf4ff',
        border: '#0969da',
        icon: '#0969da',
      },
      tip: {
        background: '#dafbe1',
        border: '#1a7f37',
        icon: '#1a7f37',
      },
      important: {
        background: '#f6e3ff',
        border: '#8250df',
        icon: '#8250df',
      },
      warning: {
        background: '#fff8c5',
        border: '#9a6700',
        icon: '#9a6700',
      },
      caution: {
        background: '#ffebe9',
        border: '#d1242f',
        icon: '#d1242f',
      },
    },
  },
};
