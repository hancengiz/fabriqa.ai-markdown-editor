import { ViewPlugin, EditorView } from '@codemirror/view';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Reading Mode Plugin
 * Renders markdown as HTML (read-only view)
 */
export const readingModePlugin = ViewPlugin.fromClass(
  class {
    private htmlContainer: HTMLDivElement | null = null;
    private view: EditorView | null = null;

    constructor(view: EditorView) {
      this.view = view;
      this.renderHTML(view);
    }

    update(update: any) {
      if (update.docChanged) {
        this.renderHTML(update.view);
      }
    }

    destroy() {
      // Restore CodeMirror content visibility
      if (this.view) {
        const cmContent = this.view.dom.querySelector('.cm-content');
        if (cmContent) {
          (cmContent as HTMLElement).style.display = '';
        }
      }

      // Remove HTML container
      if (this.htmlContainer) {
        this.htmlContainer.remove();
        this.htmlContainer = null;
      }

      this.view = null;
    }

    renderHTML(view: EditorView) {
      const markdown = view.state.doc.toString();

      try {
        // Convert markdown to HTML
        const rawHtml = marked.parse(markdown) as string;

        // Sanitize HTML to prevent XSS (allow input for checkboxes)
        const cleanHtml = DOMPurify.sanitize(rawHtml, {
          ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'strong', 'em', 'u', 's',
            'a', 'ul', 'ol', 'li',
            'blockquote', 'code', 'pre',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'img', 'hr', 'input'
          ],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'type', 'checked', 'disabled']
        });

        // Create or update HTML container
        if (!this.htmlContainer) {
          this.htmlContainer = document.createElement('div');
          this.htmlContainer.className = 'reading-mode-content';

          // Apply markdown-preview-enhanced inspired styling
          const style = document.createElement('style');
          style.textContent = `
            .reading-mode-content {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              padding: 16px 32px;
              margin: 0;
              line-height: 1.6;
              color: var(--vscode-editor-foreground);
              background-color: var(--vscode-editor-background);
              font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif;
              font-size: 16px;
              overflow: auto;
              box-sizing: border-box;
              word-wrap: break-word;
            }

            .reading-mode-content > :first-child {
              margin-top: 0 !important;
            }

            /* Headings */
            .reading-mode-content h1,
            .reading-mode-content h2,
            .reading-mode-content h3,
            .reading-mode-content h4,
            .reading-mode-content h5,
            .reading-mode-content h6 {
              line-height: 1.2;
              margin-top: 1em;
              margin-bottom: 16px;
              color: var(--vscode-editor-foreground);
              font-weight: 600;
            }

            .reading-mode-content h1 {
              font-size: 2.25em;
              font-weight: 300;
              padding-bottom: 0.3em;
            }

            .reading-mode-content h2 {
              font-size: 1.75em;
              font-weight: 400;
              padding-bottom: 0.3em;
            }

            .reading-mode-content h3 {
              font-size: 1.5em;
              font-weight: 500;
            }

            .reading-mode-content h4 {
              font-size: 1.25em;
              font-weight: 600;
            }

            .reading-mode-content h5 {
              font-size: 1em;
              font-weight: 600;
            }

            .reading-mode-content h6 {
              font-size: 1em;
              font-weight: 600;
              opacity: 0.8;
            }

            /* Paragraphs */
            .reading-mode-content > p {
              margin-top: 0;
              margin-bottom: 16px;
              word-wrap: break-word;
            }

            /* Emphasis */
            .reading-mode-content strong {
              font-weight: 600;
              color: var(--vscode-editor-foreground);
            }

            .reading-mode-content em {
              font-style: italic;
            }

            .reading-mode-content del {
              opacity: 0.7;
            }

            /* Links */
            .reading-mode-content a {
              color: var(--vscode-textLink-foreground, #0969da);
              text-decoration: none;
            }

            .reading-mode-content a:hover {
              color: var(--vscode-textLink-activeForeground, #0550ae);
              text-decoration: none;
            }

            /* Images */
            .reading-mode-content img {
              max-width: 100%;
              height: auto;
            }

            /* Lists */
            .reading-mode-content > ul,
            .reading-mode-content > ol {
              margin-bottom: 16px;
            }

            .reading-mode-content ul,
            .reading-mode-content ol {
              padding-left: 2em;
            }

            .reading-mode-content ul ul,
            .reading-mode-content ul ol,
            .reading-mode-content ol ol,
            .reading-mode-content ol ul {
              margin-top: 0;
              margin-bottom: 0;
            }

            .reading-mode-content li {
              margin-bottom: 0;
            }

            .reading-mode-content li > p {
              margin-top: 0;
              margin-bottom: 0;
            }

            /* Task list checkboxes */
            .reading-mode-content input[type="checkbox"] {
              cursor: pointer;
              margin: 0 0.2em 0.25em -1.8em;
              vertical-align: middle;
              width: 16px;
              height: 16px;
            }

            .reading-mode-content li:has(> input[type="checkbox"]) {
              list-style: none;
            }

            /* Blockquotes */
            .reading-mode-content blockquote {
              margin: 16px 0;
              font-size: inherit;
              padding: 0 15px;
              color: var(--vscode-descriptionForeground, var(--vscode-editor-foreground));
              background-color: var(--vscode-textBlockQuote-background, var(--vscode-editor-inactiveSelectionBackground, rgba(128, 128, 128, 0.15)));
              border-left: 4px solid var(--vscode-textBlockQuote-border, var(--vscode-editorWidget-border, rgba(128, 128, 128, 0.4)));
            }

            .reading-mode-content blockquote > :first-child {
              margin-top: 0;
            }

            .reading-mode-content blockquote > :last-child {
              margin-bottom: 0;
            }

            /* Horizontal Rule */
            .reading-mode-content hr {
              height: 4px;
              margin: 32px 0;
              background-color: var(--vscode-textSeparator-foreground, rgba(128, 128, 128, 0.3));
              border: 0 none;
            }

            /* Tables */
            .reading-mode-content table {
              margin: 10px 0 15px 0;
              border-collapse: collapse;
              border-spacing: 0;
              display: block;
              width: 100%;
              overflow: auto;
              word-break: normal;
              word-break: keep-all;
            }

            .reading-mode-content table th {
              font-weight: bold;
              color: var(--vscode-editor-foreground);
            }

            .reading-mode-content table td,
            .reading-mode-content table th {
              border: 1px solid var(--vscode-editorWidget-border, rgba(128, 128, 128, 0.3));
              padding: 6px 13px;
            }

            /* Definition Lists */
            .reading-mode-content dl {
              padding: 0;
            }

            .reading-mode-content dl dt {
              padding: 0;
              margin-top: 16px;
              font-size: 1em;
              font-style: italic;
              font-weight: bold;
            }

            .reading-mode-content dl dd {
              padding: 0 16px;
              margin-bottom: 16px;
            }

            /* Code */
            .reading-mode-content code {
              font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
              font-size: 0.85em;
              color: var(--vscode-textPreformat-foreground, var(--vscode-editor-foreground));
              background-color: var(--vscode-textCodeBlock-background, rgba(128, 128, 128, 0.15));
              border-radius: 3px;
              padding: 0.2em 0.4em;
            }

            .reading-mode-content pre {
              padding: 1em;
              overflow: auto;
              line-height: 1.45;
              background-color: var(--vscode-textCodeBlock-background, rgba(128, 128, 128, 0.1));
              border-radius: 3px;
              margin-top: 0;
              margin-bottom: 16px;
            }

            .reading-mode-content pre > code {
              padding: 0;
              margin: 0;
              word-break: normal;
              white-space: pre;
              background: transparent;
              border: 0;
            }

            .reading-mode-content pre code {
              display: inline;
              max-width: initial;
              padding: 0;
              margin: 0;
              overflow: initial;
              line-height: inherit;
              word-wrap: normal;
              background-color: transparent;
              border: 0;
            }

            .reading-mode-content p,
            .reading-mode-content blockquote,
            .reading-mode-content ul,
            .reading-mode-content ol,
            .reading-mode-content dl,
            .reading-mode-content pre {
              margin-top: 0;
              margin-bottom: 16px;
            }

            /* Keyboard */
            .reading-mode-content kbd {
              color: var(--vscode-editor-foreground);
              border: 1px solid var(--vscode-editorWidget-border, rgba(128, 128, 128, 0.3));
              border-bottom: 2px solid var(--vscode-editorWidget-border, rgba(128, 128, 128, 0.4));
              padding: 2px 4px;
              background-color: var(--vscode-textCodeBlock-background, rgba(128, 128, 128, 0.1));
              border-radius: 3px;
            }
          `;
          document.head.appendChild(style);

          // Hide CodeMirror content
          const cmContent = view.dom.querySelector('.cm-content');
          if (cmContent) {
            (cmContent as HTMLElement).style.display = 'none';
          }

          // Append HTML container
          view.dom.appendChild(this.htmlContainer);
        }

        // Update content
        this.htmlContainer.innerHTML = cleanHtml;

        // Make checkboxes interactive
        this.setupCheckboxHandlers(view);

        // Make links clickable with Cmd/Ctrl+Click
        this.setupLinkHandlers(view);
      } catch (error) {
        console.error('Failed to render markdown:', error);
        if (this.htmlContainer) {
          this.htmlContainer.innerHTML = `
            <div style="color: var(--vscode-errorForeground); padding: 20px;">
              <strong>Error rendering markdown:</strong> ${error}
            </div>
          `;
        }
      }
    }

    /**
     * Setup click handlers for checkboxes in reading mode
     * Allows toggling task list items by clicking checkboxes
     */
    setupCheckboxHandlers(view: EditorView) {
      if (!this.htmlContainer) return;

      const checkboxes = this.htmlContainer.querySelectorAll('input[type="checkbox"]');

      checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default to handle manually

          const isChecked = (checkbox as HTMLInputElement).checked;
          const newChecked = !isChecked;

          // Find the checkbox in the markdown source
          const doc = view.state.doc;
          let checkboxCount = 0;

          for (let lineNum = 1; lineNum <= doc.lines; lineNum++) {
            const line = doc.line(lineNum);
            const lineText = line.text;

            // Check if this line has a checkbox (with or without list marker)
            // Support [ ], [], and [x] patterns
            if (lineText.match(/^(\s*)(?:[-*+]\s)?\[(?:\s|x|X|)\]/)) {
              if (checkboxCount === index) {
                // This is the checkbox we clicked
                const newLine = newChecked
                  ? lineText.replace(/\[(?:\s|)\]/, '[x]')
                  : lineText.replace(/\[x\]/i, '[ ]');

                view.dispatch({
                  changes: {
                    from: line.from,
                    to: line.to,
                    insert: newLine
                  }
                });
                return;
              }
              checkboxCount++;
            }
          }
        });
      });
    }

    /**
     * Setup click handlers for links in reading mode
     * Allows opening markdown files with Cmd/Ctrl+Click
     */
    setupLinkHandlers(view: EditorView) {
      if (!this.htmlContainer) return;

      const links = this.htmlContainer.querySelectorAll('a[href]');

      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          const mouseEvent = e as MouseEvent;

          // Only handle Cmd/Ctrl+Click
          if (mouseEvent.metaKey || mouseEvent.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            const href = (link as HTMLAnchorElement).getAttribute('href');
            if (href) {
              // Send message to VS Code to open the file
              const vscode = (window as any).acquireVsCodeApi?.() || (window as any).vscode;
              if (vscode) {
                vscode.postMessage({
                  type: 'openLink',
                  url: href
                });
              }
            }
          }
        });
      });
    }
  }
);
