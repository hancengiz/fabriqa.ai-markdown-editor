import { ThemeInfo } from './types';

/**
 * VS Code Dark Theme
 * Based on VS Code's default dark theme colors
 * Provides a dark color palette for comfortable night-time editing
 */
export const vscodeDarkTheme: ThemeInfo = {
  id: 'vscode-dark',
  name: 'VS Code Dark',
  type: 'dark',
  theme: {
    // Background colors
    bgColor: {
      default: '#1e1e1e',
      muted: '#252526',      // Slightly lighter for code blocks, blockquotes
      neutral: '#2d2d30',    // Even lighter gray
      attention: '#3d3d00',  // Dark yellow for warnings
    },

    // Foreground/text colors
    fgColor: {
      default: '#d4d4d4',    // Main text color
      muted: '#858585',      // Secondary text (blockquotes, etc)
      accent: '#4fc1ff',     // Links, accents (bright blue)
      success: '#4ec9b0',    // Success messages (teal)
      attention: '#dcdcaa',  // Warnings (yellow)
      danger: '#f48771',     // Errors (salmon)
      done: '#c586c0',       // Completed items (purple)
    },

    // Border colors
    borderColor: {
      default: '#3e3e42',    // Default borders
      muted: '#2d2d30',      // Subtle borders
      accent: '#4fc1ff',     // Accent borders
      success: '#4ec9b0',    // Success borders
      attention: '#dcdcaa',  // Warning borders
      danger: '#f48771',     // Error borders
      done: '#c586c0',       // Done borders
    },

    // Code colors
    code: {
      background: '#252526',      // Code block background
      text: '#d4d4d4',            // Code text color
      inlineBackground: '#2d2d30', // Inline code background
    },

    // Blockquote colors
    blockquote: {
      background: '#252526',  // Dark gray background
      text: '#858585',        // Muted text
      border: '#3e3e42',      // Left border
    },

    // Checkbox colors (Obsidian-style for dark theme)
    checkbox: {
      border: '#5a5a5a',          // Medium gray border
      background: '#252526',       // Dark background
      checkedBackground: '#7c6bff', // Purple when checked (brighter for dark)
      checkedBorder: '#7c6bff',     // Purple border when checked
      checkmark: '#ffffff',         // White checkmark
    },

    // Editor UI
    editor: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      selection: '#264f78',
      activeLine: '#282828',
      cursor: '#aeafad',
      lineNumber: '#858585',
      activeLineNumber: '#c6c6c6',
    },

    // Links
    link: {
      default: '#3794ff',
      hover: '#4fc1ff',
    },

    // Headings
    heading: {
      color: '#d4d4d4',
    },

    // Focus
    focus: {
      outline: '#007fd4',
    },

    // GitHub Alerts/Admonitions (GitHub-flavored markdown - dark variants)
    alert: {
      note: {
        background: '#1a2b3d',
        border: '#4fc1ff',
        icon: '#4fc1ff',
      },
      tip: {
        background: '#1a2e23',
        border: '#4ec9b0',
        icon: '#4ec9b0',
      },
      important: {
        background: '#2d1f3d',
        border: '#c586c0',
        icon: '#c586c0',
      },
      warning: {
        background: '#3d3d1a',
        border: '#dcdcaa',
        icon: '#dcdcaa',
      },
      caution: {
        background: '#3d1f1f',
        border: '#f48771',
        icon: '#f48771',
      },
    },
  },
};
