# Phase 1: Foundation (Weeks 1-2)

**Goal**: Basic extension scaffolding, TreeView, and CodeMirror 6 integration in Source mode

**Status**: ✅ Complete

---

## 1.1 Project Setup

### Task 1.1.1: Initialize Extension Project
- [x] Create extension project using `yo code`
- [x] Choose TypeScript extension template
- [x] Configure project name: `markdown-docs-editor`
- [x] Set up git repository (already done)
- [x] Initialize npm/yarn dependencies

**Acceptance Criteria**:
- Extension can be loaded in VS Code Extension Development Host
- `Hello World` command works
- Basic file structure in place

---

### Task 1.1.2: Configure Build System
- [x] Install esbuild as build tool
- [x] Create `esbuild.js` configuration file
- [x] Configure extension build (Node.js target)
- [x] Configure webview build (browser target)
- [x] Add build scripts to `package.json`
- [x] Test production and development builds

**Files to Create**:
- `esbuild.js`
- Update `package.json` scripts

**Acceptance Criteria**:
- `npm run build` produces `out/extension.js`
- `npm run build:webview` produces `out/webview.js`
- Source maps generated in dev mode
- Minification works in production mode

---

### Task 1.1.3: Setup TypeScript Configuration
- [x] Configure root `tsconfig.json` for extension
- [x] Create `webview/tsconfig.json` for webview code
- [x] Configure path mappings
- [x] Set up strict type checking
- [x] Configure output directories

**Files to Create**:
- `tsconfig.json`
- `webview/tsconfig.json`

**Acceptance Criteria**:
- TypeScript compilation works without errors
- Proper type checking enabled
- Separate compilation for extension and webview

---

### Task 1.1.4: Create Basic File Structure
- [x] Create `src/` directory structure
- [x] Create `webview/src/` directory structure
- [x] Create placeholder files for main components
- [x] Add `.gitignore` for `out/`, `node_modules/`
- [x] Create `README.md` with project overview

**Directories to Create**:
```
src/
  extension.ts
  types/
  treeView/
  editor/
  config/
  fileSystem/
webview/
  src/
    index.ts
  styles/
```

**Acceptance Criteria**:
- All directories created
- Placeholder files compile without errors
- Git ignores generated files

---

## 1.2 Extension Host Components

### Task 1.2.1: Implement Extension Entry Point
- [x] Create `src/extension.ts`
- [x] Implement `activate()` function
- [x] Implement `deactivate()` function
- [x] Register extension context subscriptions
- [x] Add error handling for activation failures

**Files to Create**:
- `src/extension.ts`

**Acceptance Criteria**:
- Extension activates without errors
- Activation events configured in `package.json`
- Context properly disposed on deactivation
- Can set breakpoints and debug

---

### Task 1.2.2: Create Type Definitions
- [x] Create `src/config/types.ts` for configuration types *(simplified: all types in one file)*
- [x] Document all interfaces with JSDoc comments

**Files Created** *(actual implementation)*:
- `src/config/types.ts` - All type definitions

**Acceptance Criteria**:
- All interfaces properly typed
- JSDoc comments for intellisense
- No `any` types except where necessary

---

### Task 1.2.3: Implement Config Manager
- [x] Create `src/config/types.ts` with interfaces *(combined schema and types)*
- [x] Create `src/config/ConfigManager.ts` with ConfigManager class
- [x] Implement `load()` method
- [x] Implement `getDefaultConfig()` method
- [x] Implement YAML and JSON config support
- [x] Add glob pattern support for dynamic file discovery

**Files Created** *(actual implementation)*:
- `src/config/types.ts`
- `src/config/ConfigManager.ts`

**Acceptance Criteria**:
- Can load config from `.vscode/markdown-extension-config.json`
- Returns default config if file missing
- Basic validation (check required fields)
- No crashes on malformed JSON

---

### Task 1.2.4: Implement File Scanner
- [x] Integrated into `src/providers/MarkdownTreeProvider.ts` *(simplified architecture)*
- [x] Use VS Code glob API with patterns from config
- [x] Implement file sorting (alphabetical)
- [x] Support glob patterns for flexible file matching
- [x] Add error handling for missing folders

**Files Created** *(actual implementation)*:
- File scanning integrated into `src/providers/MarkdownTreeProvider.ts`

**Acceptance Criteria**:
- Can scan folder for `.md` files
- Respects exclude patterns
- Returns sorted file list
- Handles non-existent folders gracefully

---

## 1.3 TreeView Implementation

### Task 1.3.1: Create TreeView Provider
- [x] Create `src/providers/MarkdownTreeProvider.ts` *(simplified path)*
- [x] Implement `MarkdownTreeProvider` class
- [x] Implement `getTreeItem()` method
- [x] Implement `getChildren()` method
- [x] Add `refresh()` method with event emitter
- [x] Register provider in extension activation

**Files Created** *(actual implementation)*:
- `src/providers/MarkdownTreeProvider.ts`

**Acceptance Criteria**:
- TreeView appears in sidebar
- Shows hardcoded sections (SPECS, AGENTS, COMMANDS, BOLTS)
- Sections are collapsible
- Can expand/collapse sections

---

### Task 1.3.2: Create TreeItem Model
- [x] Integrated into `src/providers/MarkdownTreeProvider.ts` *(simplified: inline tree items)*
- [x] Use `vscode.TreeItem` directly with dynamic properties
- [x] Add support for 'section' and 'file' types
- [x] Configure icons for sections and files
- [x] Add context values for commands

**Files Created** *(actual implementation)*:
- Tree items created inline in `src/providers/MarkdownTreeProvider.ts`

**Acceptance Criteria**:
- Tree items display correctly
- Icons show for sections and files
- Context values set properly

---

### Task 1.3.3: Integrate File Discovery with TreeView
- [x] Connect FileScanner to TreeProvider
- [x] Load files for each section on expansion
- [x] Cache file lists per section
- [x] Show file count or empty state
- [x] Handle errors in file discovery

**Acceptance Criteria**:
- Files appear under sections
- File discovery happens on section expand
- Error states handled gracefully
- Performance acceptable for 100+ files

---

### Task 1.3.4: Register TreeView in package.json
- [x] Add view container in Activity Bar
- [x] Register tree view with ID `markdownDocs`
- [x] Configure view icon
- [x] Set view title
- [x] Add activation events

**Files to Update**:
- `package.json`

**Acceptance Criteria**:
- TreeView icon appears in Activity Bar
- Clicking icon shows sidebar
- View title displays correctly

---

## 1.4 Basic Custom Editor (Source Mode Only)

### Task 1.4.1: Create Custom Editor Provider
- [x] Create `src/providers/MarkdownEditorProvider.ts` *(simplified path)*
- [x] Implement `MarkdownEditorProvider` class
- [x] Implement `resolveCustomTextEditor()` method
- [x] Setup webview options (scripts, resources)
- [x] Implement message handling (integrated)
- [x] Register custom editor in extension activation

**Files Created** *(actual implementation)*:
- `src/providers/MarkdownEditorProvider.ts`

**Acceptance Criteria**:
- Custom editor registered for `.md` files
- Can open markdown files in custom editor
- Webview loads without errors
- Basic two-way communication works

---

### Task 1.4.2: Create Webview HTML Template
- [x] Integrated into `src/providers/MarkdownEditorProvider.ts` *(simplified: HTML generation in provider)*
- [x] Implement `getHtmlForWebview()` method
- [x] Add Content Security Policy
- [x] Include script and style URIs
- [x] Add editor container div
- [x] Add nonce for inline scripts

**Files Created** *(actual implementation)*:
- HTML generation in `src/providers/MarkdownEditorProvider.ts`

**Acceptance Criteria**:
- HTML template renders in webview
- CSP configured correctly
- Resources load from extension URI
- No console errors

---

### Task 1.4.3: Implement Document Synchronization
- [x] Integrated into `src/providers/MarkdownEditorProvider.ts` *(simplified: sync logic in provider)*
- [x] Implement webview → document sync
- [x] Implement document → webview sync
- [x] Handle edit messages from webview
- [x] Handle document change events

**Files Created** *(actual implementation)*:
- Sync logic in `src/providers/MarkdownEditorProvider.ts`

**Acceptance Criteria**:
- Changes in webview save to document
- External document changes update webview
- Debouncing prevents excessive updates
- No infinite loops

---

### Task 1.4.4: Setup CodeMirror 6 in Webview
- [x] Create `webview/main.ts` *(simplified path)*
- [x] Install CodeMirror 6 dependencies
- [x] Initialize basic CodeMirror editor
- [x] Configure markdown language support
- [x] Add basic extensions (history, keymap, autocomplete, search)
- [x] Setup vscode API acquisition

**Files Created** *(actual implementation)*:
- `webview/main.ts`

**Dependencies**:
```json
{
  "@codemirror/state": "^6.4.0",
  "@codemirror/view": "^6.23.0",
  "@codemirror/lang-markdown": "^6.2.4",
  "@codemirror/commands": "^6.3.3"
}
```

**Acceptance Criteria**:
- CodeMirror 6 editor renders
- Can type and edit markdown
- Syntax highlighting works
- Undo/redo functional

---

### Task 1.4.5: Implement Webview Message Handler
- [x] Integrated into `webview/main.ts` *(simplified: message handling in main file)*
- [x] Handle `update` message
- [x] Handle `switchMode` message
- [x] Send `edit` message on document change
- [x] Send `ready` message on load
- [x] Send `console` logs to extension
- [x] Add error handling

**Files Created** *(actual implementation)*:
- Message handling in `webview/main.ts`

**Acceptance Criteria**:
- All message types handled
- Error messages sent to extension
- No unhandled message types
- Logging for debugging

---

### Task 1.4.6: Implement File Open Command
- [x] Integrated into `src/commands/index.ts` *(simplified: all commands in one file)*
- [x] Implement `fabriqa.openMarkdownEditor` command
- [x] Register command in extension activation
- [x] Configure TreeItem click handler
- [x] Support opening from sidebar and command palette

**Files Created** *(actual implementation)*:
- Commands in `src/commands/index.ts`

**Acceptance Criteria**:
- Double-clicking file opens in custom editor
- File content loads correctly
- Can edit and save
- Multiple files can be open

---

## 1.5 Basic Save Functionality

### Task 1.5.1: Implement Save Logic
- [x] Handle VS Code save commands (Cmd/Ctrl+S)
- [x] Implement auto-save support
- [x] Show dirty state indicator
- [x] Handle save errors
- [x] Test with multiple editors

**Acceptance Criteria**:
- Cmd/Ctrl+S saves file
- Dirty indicator shows for unsaved changes
- Auto-save works (if enabled)
- Save errors displayed to user

---

## 1.6 Phase 1 Testing

### Task 1.6.1: Manual Testing Checklist
- [x] Extension activates without errors
- [x] Sidebar shows tree view with sections
- [x] Can expand/collapse sections
- [x] Files appear under sections
- [x] Double-click opens file in custom editor
- [x] CodeMirror editor loads and is editable
- [x] Can save changes (Cmd/Ctrl+S)
- [x] Changes persist after reload

---

### Task 1.6.2: Create Test Files
- [x] Create test markdown files in sample folders
- [x] Create sample workspace configuration
- [x] Test with 10-20 files per section
- [x] Test with different markdown content

**Test Data**:
- Create `test-workspace/` with sample structure
- Minimum 4 sections with 5 files each

---

## Summary

**Phase 1 Status**: ✅ Complete
**Tasks**: 25/25 completed
**Key Deliverables**:
- Extension scaffold with TypeScript
- TreeView with config-based sections
- Source mode editor with CodeMirror 6
- Basic file operations (open, edit, save)

**Next Phase**: Phase 2 - Live Preview Mode
