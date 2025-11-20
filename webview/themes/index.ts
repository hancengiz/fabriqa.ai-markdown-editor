import { Theme, ThemeInfo } from './types';
import { vscodeLightTheme } from './vscode-light';

/**
 * Available themes
 * Add new themes here as they are created
 */
const themes: Record<string, ThemeInfo> = {
  'vscode-light': vscodeLightTheme,
  // Future themes can be added here:
  // 'vscode-dark': vscodeDarkTheme,
  // 'custom': customTheme,
};

/**
 * Current active theme
 * Can be changed to support theme switching
 */
let currentTheme: ThemeInfo = vscodeLightTheme;

/**
 * Get the current active theme
 */
export function getCurrentTheme(): Theme {
  return currentTheme.theme;
}

/**
 * Get theme info (includes metadata)
 */
export function getCurrentThemeInfo(): ThemeInfo {
  return currentTheme;
}

/**
 * Switch to a different theme
 * @param themeId - The ID of the theme to switch to
 * @returns true if theme was switched, false if theme not found
 */
export function setTheme(themeId: string): boolean {
  const theme = themes[themeId];
  if (theme) {
    currentTheme = theme;
    return true;
  }
  return false;
}

/**
 * Get all available themes
 */
export function getAvailableThemes(): ThemeInfo[] {
  return Object.values(themes);
}

/**
 * Register a custom theme
 * This allows users to provide their own theme
 * @param themeInfo - The theme to register
 */
export function registerCustomTheme(themeInfo: ThemeInfo): void {
  themes[themeInfo.id] = themeInfo;
}

/**
 * Helper function to generate CSS variables from theme
 * Can be used to inject theme colors as CSS custom properties
 */
export function generateCSSVariables(theme: Theme): string {
  return `
    /* Background colors */
    --bg-default: ${theme.bgColor.default};
    --bg-muted: ${theme.bgColor.muted};
    --bg-neutral: ${theme.bgColor.neutral};
    --bg-attention: ${theme.bgColor.attention};

    /* Foreground colors */
    --fg-default: ${theme.fgColor.default};
    --fg-muted: ${theme.fgColor.muted};
    --fg-accent: ${theme.fgColor.accent};
    --fg-success: ${theme.fgColor.success};
    --fg-attention: ${theme.fgColor.attention};
    --fg-danger: ${theme.fgColor.danger};
    --fg-done: ${theme.fgColor.done};

    /* Border colors */
    --border-default: ${theme.borderColor.default};
    --border-muted: ${theme.borderColor.muted};
    --border-accent: ${theme.borderColor.accent};
    --border-success: ${theme.borderColor.success};
    --border-attention: ${theme.borderColor.attention};
    --border-danger: ${theme.borderColor.danger};
    --border-done: ${theme.borderColor.done};

    /* Code colors */
    --code-bg: ${theme.code.background};
    --code-text: ${theme.code.text};
    --code-inline-bg: ${theme.code.inlineBackground};

    /* Blockquote colors */
    --blockquote-bg: ${theme.blockquote.background};
    --blockquote-text: ${theme.blockquote.text};
    --blockquote-border: ${theme.blockquote.border};

    /* Checkbox colors */
    --checkbox-border: ${theme.checkbox.border};
    --checkbox-bg: ${theme.checkbox.background};
    --checkbox-checked-bg: ${theme.checkbox.checkedBackground};
    --checkbox-checked-border: ${theme.checkbox.checkedBorder};
    --checkbox-checkmark: ${theme.checkbox.checkmark};

    /* Editor UI */
    --editor-bg: ${theme.editor.background};
    --editor-fg: ${theme.editor.foreground};
    --editor-selection: ${theme.editor.selection};
    --editor-active-line: ${theme.editor.activeLine};
    --editor-cursor: ${theme.editor.cursor};
    --editor-line-number: ${theme.editor.lineNumber};
    --editor-active-line-number: ${theme.editor.activeLineNumber};

    /* Links */
    --link-default: ${theme.link.default};
    --link-hover: ${theme.link.hover};

    /* Headings */
    --heading-color: ${theme.heading.color};

    /* Focus */
    --focus-outline: ${theme.focus.outline};
  `;
}

// Export the current theme as default
export { getCurrentTheme as default };

// Export types
export * from './types';
