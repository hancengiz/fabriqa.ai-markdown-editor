/**
 * Theme color definitions
 * All colors used in the editor should be defined here
 */
export interface Theme {
  // Background colors
  bgColor: {
    default: string;
    muted: string;
    neutral: string;
    attention: string;
  };

  // Foreground/text colors
  fgColor: {
    default: string;
    muted: string;
    accent: string;
    success: string;
    attention: string;
    danger: string;
    done: string;
  };

  // Border colors
  borderColor: {
    default: string;
    muted: string;
    accent: string;
    success: string;
    attention: string;
    danger: string;
    done: string;
  };

  // Code/syntax highlighting colors
  code: {
    background: string;
    text: string;
    inlineBackground: string;
  };

  // Blockquote colors
  blockquote: {
    background: string;
    text: string;
    border: string;
  };

  // Checkbox colors
  checkbox: {
    border: string;
    background: string;
    checkedBackground: string;
    checkedBorder: string;
    checkmark: string;
  };

  // Editor UI colors
  editor: {
    background: string;
    foreground: string;
    selection: string;
    activeLine: string;
    cursor: string;
    lineNumber: string;
    activeLineNumber: string;
  };

  // Link colors
  link: {
    default: string;
    hover: string;
  };

  // Heading colors (can be different per heading level)
  heading: {
    color: string;
  };

  // Focus/outline colors
  focus: {
    outline: string;
  };
}

/**
 * Theme metadata
 */
export interface ThemeInfo {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'custom';
  theme: Theme;
}
