import * as vscode from 'vscode';
import { MarkdownTreeProvider } from './providers/MarkdownTreeProvider';
import { MarkdownEditorProvider } from './providers/MarkdownEditorProvider';
import { ConfigManager } from './config/ConfigManager';
import { registerCommands } from './commands';
import { Logger } from './utils/Logger';
import { WebviewLogger } from './utils/WebviewLogger';

let treeProvider: MarkdownTreeProvider | undefined;
let treeView: vscode.TreeView<any> | undefined;
let editorProvider: MarkdownEditorProvider | undefined;

export function activate(context: vscode.ExtensionContext): void {
  console.log("[Extension] ========== ACTIVATION STARTED ==========");
  Logger.info('fabriqa Markdown Editor activating...');

  // Check if a workspace folder is open - if not, exit gracefully
  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    Logger.info('No workspace folder is open. fabriqa Markdown Editor requires a workspace to function.');
    console.log("[Extension] No workspace folder open - extension will activate when a workspace is opened");
    return;
  }

  // Initialize webview logger (only active in debug mode)
  WebviewLogger.initialize(context);

  try {
    // Initialize configuration manager
    console.log("[Extension] Creating ConfigManager...");
    const configManager = new ConfigManager();
    console.log("[Extension] ConfigManager created");

    // Create tree provider for sidebar
    treeProvider = new MarkdownTreeProvider(configManager);
    treeView = vscode.window.createTreeView('fabriqa.markdownTree', {
      treeDataProvider: treeProvider,
      showCollapseAll: true
    });
    context.subscriptions.push(treeView);

    // Register custom editor provider
    editorProvider = new MarkdownEditorProvider(context, configManager);
    context.subscriptions.push(
      vscode.window.registerCustomEditorProvider(
        'fabriqa.markdownEditor',
        editorProvider,
        {
          webviewOptions: {
            retainContextWhenHidden: true,
          },
          supportsMultipleEditorsPerDocument: false,
        }
      )
    );

    // Register commands
    registerCommands(context, treeProvider, treeView, editorProvider, configManager);

    // Watch for config file changes
    setupFileWatchers(context, treeProvider, configManager);

    console.log("[Extension] ========== ACTIVATION COMPLETE ==========");
    Logger.info('fabriqa Markdown Editor activated successfully');
  } catch (error) {
    Logger.error('Failed to activate fabriqa Markdown Editor', error);
    vscode.window.showErrorMessage(`Failed to activate fabriqa Markdown Editor: ${error}`);
  }
}

export function deactivate(): void {
  Logger.info('fabriqa Markdown Editor deactivating...');

  // Dispose providers
  if (editorProvider) {
    editorProvider.dispose();
  }

  treeProvider = undefined;
  editorProvider = undefined;
}

function setupFileWatchers(
  context: vscode.ExtensionContext,
  treeProvider: MarkdownTreeProvider,
  configManager: ConfigManager
): void {
  // Watch for settings changes (folderPatterns)
  const settingsWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('fabriqa.folderPatterns')) {
      Logger.info('Folder patterns setting changed, refreshing tree view');
      configManager.reload();
      treeProvider.refresh();
    }
  });

  context.subscriptions.push(settingsWatcher);

  // Watch for markdown file changes
  const mdWatcher = vscode.workspace.createFileSystemWatcher('**/*.md');

  mdWatcher.onDidCreate((uri) => {
    Logger.info(`Markdown file created: ${uri.fsPath}`);
    configManager.reload();
    treeProvider.refresh();
  });

  mdWatcher.onDidDelete((uri) => {
    Logger.info(`Markdown file deleted: ${uri.fsPath}`);
    configManager.reload();
    treeProvider.refresh();
  });

  // Note: We don't need to refresh tree on file content changes
  // Only on create/delete which affects the file list

  context.subscriptions.push(mdWatcher);
}
