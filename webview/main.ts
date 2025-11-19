import { EditorView } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { foldGutter, indentOnInput, syntaxHighlighting as syntaxHighlightingFacet, bracketMatching } from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { livePreviewPlugin } from './editors/livePreviewMode';
import { readingModePlugin } from './editors/readingMode';

// Basic setup extensions (equivalent to basicSetup)
const basicExtensions = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...completionKeymap,
    ...lintKeymap
  ])
];

// Type definitions for VS Code API
declare const acquireVsCodeApi: any;

/**
 * Editor modes
 */
type EditorMode = 'livePreview' | 'source' | 'reading';

/**
 * VS Code webview API
 */
const vscode = acquireVsCodeApi();

/**
 * Compartments for dynamic reconfiguration
 */
const modeCompartment = new Compartment();
const themeCompartment = new Compartment();

/**
 * Editor instance
 */
let editorView: EditorView | null = null;
let currentMode: EditorMode = 'livePreview';
let currentContent: string = '';
let isUpdatingFromVSCode = false;

/**
 * Initialize the editor
 */
function initializeEditor(): void {
  const container = document.getElementById('editor');
  if (!container) {
    logError('Editor container not found');
    return;
  }

  // Get initial mode from body data attribute
  const bodyElement = document.body;
  const initialMode = (bodyElement.dataset.mode as EditorMode) || 'livePreview';
  const initialTheme = bodyElement.dataset.theme || 'dark';

  currentMode = initialMode;

  try {
    // Create editor state
    const startState = EditorState.create({
      doc: '',
      extensions: [
        ...basicExtensions,
        markdown(),
        modeCompartment.of(getModeExtensions(initialMode)),
        themeCompartment.of(getThemeExtensions(initialTheme)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isUpdatingFromVSCode) {
            // Notify VS Code of changes
            const content = update.state.doc.toString();
            sendMessage({
              type: 'edit',
              content
            });
          }
        }),
        EditorView.lineWrapping,
      ]
    });

    // Create editor view
    editorView = new EditorView({
      state: startState,
      parent: container
    });

    log(`Editor initialized in ${initialMode} mode`);

    // Notify VS Code that webview is ready
    sendMessage({ type: 'ready' });
  } catch (error) {
    logError('Failed to initialize editor', error);
    showError('Failed to initialize editor. Check console for details.');
  }
}

/**
 * Get extensions for a specific mode
 */
function getModeExtensions(mode: EditorMode): any[] {
  switch (mode) {
    case 'livePreview':
      return [livePreviewPlugin];
    case 'source':
      return []; // No special extensions for source mode
    case 'reading':
      return [readingModePlugin, EditorView.editable.of(false)];
    default:
      return [];
  }
}

/**
 * Get theme extensions
 */
function getThemeExtensions(theme: string): any[] {
  // Use VS Code's CSS variables for theming
  return [
    syntaxHighlighting(defaultHighlightStyle),
    EditorView.theme({
      '&': {
        color: 'var(--vscode-editor-foreground)',
        backgroundColor: 'var(--vscode-editor-background)'
      },
      '.cm-content': {
        caretColor: 'var(--vscode-editorCursor-foreground)'
      },
      '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: 'var(--vscode-editorCursor-foreground)'
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: 'var(--vscode-editor-selectionBackground)'
      }
    })
  ];
}

/**
 * Switch editor mode
 */
function switchMode(newMode: EditorMode): void {
  if (!editorView) {
    logError('Cannot switch mode: editor not initialized');
    return;
  }

  if (currentMode === newMode) {
    return;
  }

  try {
    log(`Switching from ${currentMode} to ${newMode} mode`);

    // Update mode compartment
    editorView.dispatch({
      effects: modeCompartment.reconfigure(getModeExtensions(newMode))
    });

    currentMode = newMode;
    log(`Switched to ${newMode} mode`);
  } catch (error) {
    logError('Failed to switch mode', error);
    sendMessage({
      type: 'error',
      message: `Failed to switch to ${newMode} mode`,
      error
    });
  }
}

/**
 * Update editor content
 */
function updateContent(content: string): void {
  if (!editorView) {
    logError('Cannot update content: editor not initialized');
    return;
  }

  if (currentContent === content) {
    return;
  }

  try {
    isUpdatingFromVSCode = true;
    currentContent = content;

    // Replace entire document
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: content
      }
    });

    isUpdatingFromVSCode = false;
  } catch (error) {
    isUpdatingFromVSCode = false;
    logError('Failed to update content', error);
  }
}

/**
 * Update theme
 */
function updateTheme(theme: string): void {
  if (!editorView) {
    return;
  }

  try {
    editorView.dispatch({
      effects: themeCompartment.reconfigure(getThemeExtensions(theme))
    });

    document.body.dataset.theme = theme;
    log(`Theme updated to ${theme}`);
  } catch (error) {
    logError('Failed to update theme', error);
  }
}

/**
 * Handle messages from VS Code
 */
function handleMessage(event: MessageEvent): void {
  const message = event.data;

  switch (message.type) {
    case 'update':
      updateContent(message.content);
      break;

    case 'switchMode':
      switchMode(message.mode);
      break;

    case 'themeChange':
      updateTheme(message.theme);
      break;

    default:
      log(`Unknown message type: ${message.type}`);
  }
}

/**
 * Send message to VS Code
 */
function sendMessage(message: any): void {
  vscode.postMessage(message);
}

/**
 * Log message to VS Code output
 */
function log(message: string): void {
  console.log(`[Webview] ${message}`);
  sendMessage({
    type: 'log',
    message
  });
}

/**
 * Log error to VS Code output
 */
function logError(message: string, error?: any): void {
  console.error(`[Webview] ${message}`, error);
  sendMessage({
    type: 'error',
    message,
    error: error ? error.toString() : undefined
  });
}

/**
 * Show error message in editor
 */
function showError(message: string): void {
  const container = document.getElementById('editor');
  if (container) {
    container.innerHTML = `
      <div class="error">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEditor);
} else {
  initializeEditor();
}

/**
 * Listen for messages from VS Code
 */
window.addEventListener('message', handleMessage);
