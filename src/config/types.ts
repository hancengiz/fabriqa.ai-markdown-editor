/**
 * Configuration file structure for Fabriqa Markdown Editor
 * Located at .vscode/markdown-extension-config.json
 */

export interface MarkdownConfig {
  sections: ConfigSection[];
}

export interface ConfigSection {
  id: string;
  title: string;
  collapsed?: boolean;
  files?: string[];  // Explicit file paths
  filePatterns?: string[];  // Glob patterns like "specs/**/*.md"
  description?: string;
}

export interface ValidatedConfig {
  sections: ValidatedSection[];
  errors: ConfigError[];
}

export interface ValidatedSection {
  id: string;
  title: string;
  collapsed: boolean;
  files: ResolvedFile[];
  description?: string;
}

export interface ResolvedFile {
  relativePath: string;
  absolutePath: string;
  exists: boolean;
  displayName: string;
}

export interface ConfigError {
  section?: string;
  file?: string;
  message: string;
  type: 'warning' | 'error';
}

/**
 * Default configuration sections
 * Uses glob patterns to auto-discover markdown files
 */
export const DEFAULT_SECTIONS: ConfigSection[] = [
  {
    id: 'specs',
    title: 'SPECS',
    collapsed: false,
    filePatterns: ['specs/**/*.md']
  }
];
