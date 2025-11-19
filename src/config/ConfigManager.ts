import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Logger } from '../utils/Logger';
import {
  MarkdownConfig,
  ValidatedConfig,
  ValidatedSection,
  ResolvedFile,
  ConfigError,
  DEFAULT_SECTIONS
} from './types';

export class ConfigManager {
  private config: ValidatedConfig;
  private configPath: string;
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = this.getWorkspaceRoot();
    this.configPath = this.getConfigFilePath();
    this.config = this.loadConfig();
  }

  /**
   * Get the workspace root directory
   */
  private getWorkspaceRoot(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('No workspace folder is open');
    }
    return workspaceFolders[0].uri.fsPath;
  }

  /**
   * Get the path to the config file
   */
  public getConfigPath(): string {
    return this.configPath;
  }

  /**
   * Get the full path to the config file
   */
  private getConfigFilePath(): string {
    const configSetting = vscode.workspace.getConfiguration('fabriqa').get<string>('configFile');
    const relativePath = configSetting || '.vscode/markdown-extension-config.json';
    return relativePath;
  }

  /**
   * Load and validate the configuration
   * Priority: .fabriqa.sidebar.yml > .vscode/markdown-extension-config.json > VS Code settings > defaults
   */
  private loadConfig(): ValidatedConfig {
    // 1. Try .fabriqa.sidebar.yml in project root (highest priority)
    const yamlConfigPath = path.join(this.workspaceRoot, '.fabriqa.sidebar.yml');
    if (fs.existsSync(yamlConfigPath)) {
      try {
        Logger.info('Loading configuration from .fabriqa.sidebar.yml');
        const fileContent = fs.readFileSync(yamlConfigPath, 'utf-8');
        const rawConfig = yaml.load(fileContent) as MarkdownConfig;
        return this.validateConfigAsync(rawConfig);
      } catch (error) {
        Logger.error('Failed to load .fabriqa.sidebar.yml', error);
        vscode.window.showErrorMessage(`Failed to load .fabriqa.sidebar.yml: ${error}`);
      }
    }

    // 2. Try .vscode/markdown-extension-config.json (backward compatibility)
    const absoluteConfigPath = path.join(this.workspaceRoot, this.configPath);
    if (fs.existsSync(absoluteConfigPath)) {
      try {
        Logger.info('Loading configuration from .vscode/markdown-extension-config.json');
        const fileContent = fs.readFileSync(absoluteConfigPath, 'utf-8');
        const rawConfig: MarkdownConfig = JSON.parse(fileContent);
        return this.validateConfigAsync(rawConfig);
      } catch (error) {
        Logger.error('Failed to load config file', error);
        vscode.window.showErrorMessage(`Failed to load Fabriqa config file: ${error}`);
      }
    }

    // 3. Try VS Code settings
    const vscodeConfig = vscode.workspace.getConfiguration('fabriqa');
    const sidebarSections = vscodeConfig.get<any[]>('sidebarSections');

    if (sidebarSections && sidebarSections.length > 0) {
      Logger.info('Loading configuration from VS Code settings');
      return this.validateConfigAsync({ sections: sidebarSections });
    }

    // 4. Use defaults
    Logger.info('Using default configuration');
    return this.createDefaultConfig();
  }

  /**
   * Create default configuration
   */
  private createDefaultConfig(): ValidatedConfig {
    return this.validateConfigAsync({ sections: DEFAULT_SECTIONS });
  }

  /**
   * Validate configuration and resolve file paths (synchronous version using glob)
   */
  private validateConfigAsync(rawConfig: MarkdownConfig): ValidatedConfig {
    const errors: ConfigError[] = [];
    const validatedSections: ValidatedSection[] = [];

    if (!rawConfig.sections || !Array.isArray(rawConfig.sections)) {
      errors.push({
        message: 'Config must have a "sections" array',
        type: 'error'
      });
      return { sections: [], errors };
    }

    for (const section of rawConfig.sections) {
      // Validate section structure
      if (!section.id || !section.title) {
        errors.push({
          section: section.id || 'unknown',
          message: 'Section must have "id" and "title" fields',
          type: 'error'
        });
        continue;
      }

      const resolvedFiles: ResolvedFile[] = [];

      // Support filePatterns (glob patterns)
      if (section.filePatterns && Array.isArray(section.filePatterns)) {
        for (const pattern of section.filePatterns) {
          const matchedFiles = this.resolveGlobPattern(pattern);
          resolvedFiles.push(...matchedFiles);
        }
      }

      // Support explicit files array
      if (section.files && Array.isArray(section.files)) {
        for (const filePath of section.files) {
          const resolved = this.resolveFilePath(filePath);
          resolvedFiles.push(resolved);

          if (!resolved.exists) {
            errors.push({
              section: section.id,
              file: filePath,
              message: `File not found: ${filePath}`,
              type: 'warning'
            });
          }
        }
      }

      validatedSections.push({
        id: section.id,
        title: section.title,
        collapsed: section.collapsed ?? false,
        files: resolvedFiles,
        description: section.description
      });
    }

    return {
      sections: validatedSections,
      errors
    };
  }

  /**
   * Resolve glob pattern to list of files
   */
  private resolveGlobPattern(pattern: string): ResolvedFile[] {
    const files: ResolvedFile[] = [];

    try {
      // Simple glob implementation for patterns like "specs/**/*.md"
      const parts = pattern.split('/');
      const basePath = parts[0];
      const isRecursive = parts.includes('**');
      const filePattern = parts[parts.length - 1];

      const searchPath = path.join(this.workspaceRoot, basePath);

      if (!fs.existsSync(searchPath)) {
        return files;
      }

      const matchFiles = (dir: string, recursive: boolean = false) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && (recursive || isRecursive)) {
            matchFiles(fullPath, true);
          } else if (entry.isFile()) {
            // Check if file matches pattern (simple match for *.md)
            if (filePattern === '*.md' && entry.name.endsWith('.md')) {
              const relativePath = path.relative(this.workspaceRoot, fullPath);
              files.push({
                relativePath,
                absolutePath: fullPath,
                exists: true,
                displayName: entry.name
              });
            } else if (entry.name === filePattern) {
              const relativePath = path.relative(this.workspaceRoot, fullPath);
              files.push({
                relativePath,
                absolutePath: fullPath,
                exists: true,
                displayName: entry.name
              });
            }
          }
        }
      };

      matchFiles(searchPath);

      // Sort files by path for consistent ordering
      files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
    } catch (error) {
      Logger.error(`Failed to resolve glob pattern ${pattern}`, error);
    }

    return files;
  }

  /**
   * Resolve a relative file path to absolute and check if it exists
   */
  private resolveFilePath(relativePath: string): ResolvedFile {
    const absolutePath = path.isAbsolute(relativePath)
      ? relativePath
      : path.join(this.workspaceRoot, relativePath);

    const exists = fs.existsSync(absolutePath);
    const displayName = path.basename(relativePath); // Keep .md extension

    return {
      relativePath,
      absolutePath,
      exists,
      displayName
    };
  }

  /**
   * Get the current configuration
   */
  public getConfig(): ValidatedConfig {
    return this.config;
  }

  /**
   * Reload the configuration from disk
   */
  public reload(): void {
    Logger.info('Reloading configuration');
    this.config = this.loadConfig();

    if (this.config.errors.length > 0) {
      const errorCount = this.config.errors.filter(e => e.type === 'error').length;
      const warningCount = this.config.errors.filter(e => e.type === 'warning').length;

      if (errorCount > 0) {
        vscode.window.showErrorMessage(
          `Fabriqa config has ${errorCount} error(s) and ${warningCount} warning(s). Check output for details.`
        );
      } else if (warningCount > 0) {
        vscode.window.showWarningMessage(
          `Fabriqa config has ${warningCount} warning(s). Check output for details.`
        );
      }

      // Log all errors and warnings
      for (const error of this.config.errors) {
        const prefix = error.section ? `[${error.section}]` : '';
        const fileInfo = error.file ? ` ${error.file}:` : '';
        if (error.type === 'error') {
          Logger.error(`${prefix}${fileInfo} ${error.message}`);
        } else {
          Logger.warn(`${prefix}${fileInfo} ${error.message}`);
        }
      }
    }
  }

  /**
   * Create a new config file with default sections
   */
  public async createDefaultConfigFile(): Promise<void> {
    const absoluteConfigPath = path.join(this.workspaceRoot, this.configPath);
    const configDir = path.dirname(absoluteConfigPath);

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Create default config
    const defaultConfig: MarkdownConfig = {
      sections: DEFAULT_SECTIONS
    };

    // Write to file
    fs.writeFileSync(
      absoluteConfigPath,
      JSON.stringify(defaultConfig, null, 2),
      'utf-8'
    );

    Logger.info(`Created default config file at ${absoluteConfigPath}`);
    vscode.window.showInformationMessage(
      'Created default Fabriqa configuration file'
    );

    // Reload config
    this.reload();
  }
}
