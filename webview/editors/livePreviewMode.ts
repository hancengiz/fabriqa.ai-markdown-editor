import { ViewPlugin, DecorationSet, Decoration, EditorView, ViewUpdate } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { Range } from '@codemirror/state';

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

          // Hide markdown syntax based on node type
          const { from, to, type } = node;

          switch (type.name) {
            case 'HeaderMark':
              // Hide header marks (##)
              decorations.push(
                Decoration.replace({ inclusive: false }).range(from, to)
              );
              break;

            case 'EmphasisMark':
              // Hide emphasis marks (* or _)
              decorations.push(
                Decoration.replace({ inclusive: false }).range(from, to)
              );
              break;

            case 'StrongEmphasisMark':
              // Hide strong emphasis marks (** or __)
              decorations.push(
                Decoration.replace({ inclusive: false }).range(from, to)
              );
              break;

            case 'LinkMark':
            case 'URL':
              // Hide link syntax
              decorations.push(
                Decoration.replace({ inclusive: false }).range(from, to)
              );
              break;

            case 'CodeMark':
              // Hide inline code marks (`)
              decorations.push(
                Decoration.replace({ inclusive: false }).range(from, to)
              );
              break;

            case 'ListMark':
              // Style list marks but don't hide
              decorations.push(
                Decoration.mark({
                  class: 'cm-list-mark'
                }).range(from, to)
              );
              break;

            default:
              break;
          }
        }
      });

      return Decoration.set(decorations, true);
    }

    isOnCursorLine(node: any, cursorLine: any): boolean {
      return node.from >= cursorLine.from && node.to <= cursorLine.to;
    }
  },
  {
    decorations: (v) => v.decorations
  }
);
