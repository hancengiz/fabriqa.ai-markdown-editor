import { ViewPlugin, DecorationSet, Decoration, EditorView, ViewUpdate, WidgetType } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { Range } from '@codemirror/state';
import { SyntaxNode } from '@lezer/common';

/**
 * Widget for clickable links in Live Preview
 */
class LinkWidget extends WidgetType {
  constructor(readonly url: string, readonly text: string) {
    super();
  }

  toDOM() {
    const link = document.createElement('a');
    link.textContent = this.text;
    link.href = this.url;
    link.className = 'cm-link-preview';
    link.title = this.url;
    link.style.cssText = `
      color: var(--vscode-textLink-foreground);
      text-decoration: none;
      cursor: pointer;
    `;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // You could send a message to VS Code to open the link
      console.log('Link clicked:', this.url);
    });
    return link;
  }

  ignoreEvent() {
    return false;
  }
}

/**
 * Live Preview Mode Plugin
 * Hides markdown syntax except on the line where the cursor is positioned
 */
export const livePreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view: EditorView): DecorationSet {
      const decorations: Range<Decoration>[] = [];
      const cursorPos = view.state.selection.main.head;
      const cursorLine = view.state.doc.lineAt(cursorPos);

      // Iterate through syntax tree
      syntaxTree(view.state).iterate({
        enter: (node) => {
          // Skip if node is on cursor line
          if (this.isOnCursorLine(node, cursorLine)) {
            return;
          }

          this.processNode(node, view, decorations);
        }
      });

      return Decoration.set(decorations, true);
    }

    processNode(node: SyntaxNode, view: EditorView, decorations: Range<Decoration>[]): void {
      const { from, to, type } = node;
      const nodeText = view.state.doc.sliceString(from, to);

      switch (type.name) {
        case 'HeaderMark':
          // Hide header marks (# ## ### etc.)
          decorations.push(
            Decoration.replace({
              inclusive: false,
              widget: new (class extends WidgetType {
                toDOM() {
                  const span = document.createElement('span');
                  span.style.letterSpacing = '-1ch';
                  span.style.opacity = '0';
                  span.textContent = nodeText;
                  return span;
                }
              })()
            }).range(from, to)
          );
          break;

        case 'EmphasisMark':
          // Hide emphasis marks (* or _) for italic
          if (nodeText === '*' || nodeText === '_') {
            decorations.push(
              Decoration.replace({ inclusive: false }).range(from, to)
            );
          }
          break;

        case 'StrongEmphasisMark':
          // Hide strong emphasis marks (** or __)
          if (nodeText === '**' || nodeText === '__') {
            decorations.push(
              Decoration.replace({ inclusive: false }).range(from, to)
            );
          }
          break;

        case 'Link':
          // Handle link syntax [text](url)
          this.handleLink(node, view, decorations);
          break;

        case 'CodeMark':
          // Hide inline code marks (`)
          decorations.push(
            Decoration.replace({ inclusive: false }).range(from, to)
          );
          break;

        case 'InlineCode':
          // Style inline code
          decorations.push(
            Decoration.mark({
              class: 'cm-inline-code-preview',
              attributes: {
                style: `
                  background-color: var(--vscode-textCodeBlock-background);
                  padding: 2px 4px;
                  border-radius: 3px;
                  font-family: var(--vscode-editor-font-family);
                `
              }
            }).range(from, to)
          );
          break;

        case 'CodeInfo':
          // Hide code block language info when cursor away
          decorations.push(
            Decoration.mark({
              class: 'cm-code-info',
              attributes: {
                style: 'opacity: 0.5; font-size: 0.9em;'
              }
            }).range(from, to)
          );
          break;

        case 'QuoteMark':
          // Style blockquote marks
          decorations.push(
            Decoration.mark({
              class: 'cm-quote-mark',
              attributes: {
                style: `
                  color: var(--vscode-descriptionForeground);
                  opacity: 0.6;
                `
              }
            }).range(from, to)
          );
          break;

        case 'ListMark':
          // Style list marks
          decorations.push(
            Decoration.mark({
              class: 'cm-list-mark',
              attributes: {
                style: `
                  color: var(--vscode-symbolIcon-arrayForeground);
                  font-weight: bold;
                `
              }
            }).range(from, to)
          );
          break;

        case 'Strikethrough':
          // Handle strikethrough
          decorations.push(
            Decoration.mark({
              class: 'cm-strikethrough',
              attributes: {
                style: 'text-decoration: line-through;'
              }
            }).range(from, to)
          );
          break;

        case 'TaskMarker':
          // Style task list checkboxes
          decorations.push(
            Decoration.mark({
              class: 'cm-task-marker'
            }).range(from, to)
          );
          break;

        default:
          break;
      }
    }

    handleLink(linkNode: SyntaxNode, view: EditorView, decorations: Range<Decoration>[]): void {
      let linkText = '';
      let linkUrl = '';
      let markStart = -1;
      let markEnd = -1;
      let urlStart = -1;
      let urlEnd = -1;

      // Parse link structure [text](url)
      linkNode.node.cursor().iterate((node) => {
        const nodeText = view.state.doc.sliceString(node.from, node.to);

        switch (node.type.name) {
          case 'LinkMark':
            if (nodeText === '[') {
              markStart = node.from;
            } else if (nodeText === ']') {
              markEnd = node.to;
            } else if (nodeText === '(') {
              urlStart = node.from;
            } else if (nodeText === ')') {
              urlEnd = node.to;
            }
            // Hide link marks
            decorations.push(
              Decoration.replace({ inclusive: false }).range(node.from, node.to)
            );
            break;

          case 'LinkLabel':
            linkText = nodeText;
            break;

          case 'URL':
            linkUrl = nodeText;
            // Hide URL
            decorations.push(
              Decoration.replace({ inclusive: false }).range(node.from, node.to)
            );
            break;
        }
      });

      // Apply link styling to the text
      if (linkText && linkUrl && markStart !== -1 && markEnd !== -1) {
        decorations.push(
          Decoration.mark({
            class: 'cm-link-text',
            attributes: {
              style: `
                color: var(--vscode-textLink-foreground);
                text-decoration: underline;
                cursor: pointer;
              `,
              title: linkUrl
            }
          }).range(markStart + 1, markEnd - 1)
        );
      }
    }

    isOnCursorLine(node: SyntaxNode, cursorLine: any): boolean {
      return node.from >= cursorLine.from && node.to <= cursorLine.to;
    }
  },
  {
    decorations: (v) => v.decorations
  }
);
