import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '../utils/Logger';
import {
  ValidatedConfig,
  ValidatedSection,
  ResolvedFile
} from './types';

export class ConfigManager {
  private config: ValidatedConfig;
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = this.getWorkspaceRoot();
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
   * Get folder patterns from VS Code settings
   */
  private getFolderPatterns(): Array<{ name: string; pattern: string }> {
    const config = vscode.workspace.getConfiguration('fabriqa');
    const defaultPatterns = [{ name: 'Markdown Files', pattern: '**/*.md' }];

    const rawPatterns = config.get<unknown>('folderPatterns', defaultPatterns);

    // Handle case where patterns might be in old format or invalid
    if (!Array.isArray(rawPatterns)) {
      Logger.warn('folderPatterns is not an array, using default');
      return defaultPatterns;
    }

    // Validate and convert each pattern
    const validPatterns: Array<{ name: string; pattern: string }> = [];

    for (const item of rawPatterns) {
      if (typeof item === 'string') {
        // Old format: convert string to object
        validPatterns.push({
          name: this.inferNameFromPattern(item),
          pattern: item
        });
      } else if (item && typeof item === 'object' && 'name' in item && 'pattern' in item) {
        // New format: validate name and pattern exist
        const obj = item as { name: unknown; pattern: unknown };
        if (typeof obj.name === 'string' && typeof obj.pattern === 'string') {
          validPatterns.push({ name: obj.name, pattern: obj.pattern });
        } else {
          Logger.warn(`Invalid pattern object: ${JSON.stringify(item)}`);
        }
      } else {
        Logger.warn(`Invalid pattern item: ${JSON.stringify(item)}`);
      }
    }

    return validPatterns.length > 0 ? validPatterns : defaultPatterns;
  }

  /**
   * Infer a display name from a glob pattern (for backward compatibility)
   */
  private inferNameFromPattern(pattern: string): string {
    // Extract folder name from pattern like "specs/**/*.md" -> "Specs"
    const parts = pattern.split('/');
    if (parts.length > 1 && parts[0] !== '**') {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return 'Markdown Files';
  }

  /**
   * Load configuration from VS Code settings
   */
  private loadConfig(): ValidatedConfig {
    const folderPatterns = this.getFolderPatterns();
    Logger.info(`Loading folder patterns from settings: ${JSON.stringify(folderPatterns)}`);

    const sections: ValidatedSection[] = [];

    // Create a section for each pattern
    for (const patternConfig of folderPatterns) {
      if (!patternConfig.name || !patternConfig.pattern) {
        Logger.warn(`Skipping invalid pattern config: ${JSON.stringify(patternConfig)}`);
        continue;
      }

      const matchedFiles = this.resolveGlobPattern(patternConfig.pattern);

      // Create section ID from name (lowercase, replace spaces with dashes)
      const sectionId = patternConfig.name.toLowerCase().replace(/\s+/g, '-');

      const section: ValidatedSection = {
        id: sectionId,
        title: patternConfig.name,
        collapsed: false,
        files: matchedFiles
      };

      sections.push(section);
      Logger.info(`Section "${patternConfig.name}": found ${matchedFiles.length} files`);
    }

    return {
      sections,
      errors: []
    };
  }

  /**
   * Remove duplicate files by absolute path
   */
  private removeDuplicates(files: ResolvedFile[]): ResolvedFile[] {
    const seen = new Set<string>();
    return files.filter(file => {
      if (seen.has(file.absolutePath)) {
        return false;
      }
      seen.add(file.absolutePath);
      return true;
    });
  }

  /**
   * Resolve glob pattern to list of files
   */
  private resolveGlobPattern(pattern: string): ResolvedFile[] {
    const files: ResolvedFile[] = [];

    try {
      // Handle patterns like "specs/**/*.md", "docs/*.md", "**/*.md"
      const parts = pattern.split('/');
      const isRecursive = parts.includes('**');
      const filePattern = parts[parts.length - 1];

      // Get the base path (everything before ** or the file pattern)
      let basePath = '';
      for (const part of parts) {
        if (part === '**' || part.includes('*')) {
          break;
        }
        basePath = basePath ? `${basePath}/${part}` : part;
      }

      const searchPath = basePath
        ? path.join(this.workspaceRoot, basePath)
        : this.workspaceRoot;

      if (!fs.existsSync(searchPath)) {
        Logger.warn(`Path does not exist: ${searchPath}`);
        return files;
      }

      const matchFiles = (dir: string, recursive: boolean = false) => {
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              // Skip hidden directories and node_modules
              if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                continue;
              }
              if (recursive || isRecursive) {
                matchFiles(fullPath, true);
              }
            } else if (entry.isFile()) {
              // Check if file matches pattern
              if (this.matchesFilePattern(entry.name, filePattern)) {
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
        } catch (err) {
          Logger.warn(`Failed to read directory ${dir}: ${err}`);
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
   * Check if a filename matches a glob pattern
   */
  private matchesFilePattern(filename: string, pattern: string): boolean {
    // Handle *.md pattern
    if (pattern === '*.md') {
      return filename.endsWith('.md');
    }
    // Handle exact filename match
    if (pattern === filename) {
      return true;
    }
    // Handle other patterns with *
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(filename);
    }
    return false;
  }

  /**
   * Get the current configuration
   */
  public getConfig(): ValidatedConfig {
    return this.config;
  }

  /**
   * Reload the configuration
   */
  public reload(): void {
    Logger.info('Reloading configuration from settings');
    this.config = this.loadConfig();
  }

  /**
   * Get the config path (kept for compatibility, but no longer used for JSON file)
   * @deprecated This method is kept for backward compatibility
   */
  public getConfigPath(): string {
    return '.vscode/fabriqa-markdown-editor-config.json';
  }
}
