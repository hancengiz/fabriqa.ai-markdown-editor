# Implementation Tasks
## VS Code Markdown Documentation Extension

**Version**: 1.0
**Last Updated**: November 19, 2025
**Status**: Active

---

## Overview

This document breaks down the implementation of the VS Code Markdown Documentation Extension into actionable tasks across 5 phases (8 weeks total). Tasks are organized by phase and include dependencies, acceptance criteria, and references to design/requirements documents.

**Total Estimated Timeline**: 8 weeks
- Phase 1: Foundation (Weeks 1-2)
- Phase 2: Live Preview (Weeks 3-4)
- Phase 3: Configuration (Week 5)
- Phase 4: Reading Mode & Polish (Week 6)
- Phase 5: Enhanced Features (Weeks 7-8)

---

## Phase 1: Foundation (Weeks 1-2)

**Goal**: Basic extension scaffolding, TreeView, and CodeMirror 6 integration in Source mode

### 1.1 Project Setup

#### Task 1.1.1: Initialize Extension Project
- [ ] Create extension project using `yo code`
- [ ] Choose TypeScript extension template
- [ ] Configure project name: `markdown-docs-editor`
- [ ] Set up git repository (already done)
- [ ] Initialize npm/yarn dependencies

**Acceptance Criteria**:
- Extension can be loaded in VS Code Extension Development Host
- `Hello World` command works
- Basic file structure in place

**References**: Design §12 Implementation Phases

---

#### Task 1.1.2: Configure Build System
- [ ] Install esbuild as build tool
- [ ] Create `esbuild.js` configuration file
- [ ] Configure extension build (Node.js target)
- [ ] Configure webview build (browser target)
- [ ] Add build scripts to `package.json`
- [ ] Test production and development builds

**Files to Create**:
- `esbuild.js`
- Update `package.json` scripts

**Acceptance Criteria**:
- `npm run build` produces `out/extension.js`
- `npm run build:webview` produces `out/webview.js`
- Source maps generated in dev mode
- Minification works in production mode

**References**: Design Appendix B

---

#### Task 1.1.3: Setup TypeScript Configuration
- [ ] Configure root `tsconfig.json` for extension
- [ ] Create `webview/tsconfig.json` for webview code
- [ ] Configure path mappings
- [ ] Set up strict type checking
- [ ] Configure output directories

**Files to Create**:
- `tsconfig.json`
- `webview/tsconfig.json`

**Acceptance Criteria**:
- TypeScript compilation works without errors
- Proper type checking enabled
- Separate compilation for extension and webview

**References**: Design Appendix A

---

#### Task 1.1.4: Create Basic File Structure
- [ ] Create `src/` directory structure
- [ ] Create `webview/src/` directory structure
- [ ] Create placeholder files for main components
- [ ] Add `.gitignore` for `out/`, `node_modules/`
- [ ] Create `README.md` with project overview

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

**References**: Design §4.1 Extension Structure

---

### 1.2 Extension Host Components

#### Task 1.2.1: Implement Extension Entry Point
- [ ] Create `src/extension.ts`
- [ ] Implement `activate()` function
- [ ] Implement `deactivate()` function
- [ ] Register extension context subscriptions
- [ ] Add error handling for activation failures

**Files to Create**:
- `src/extension.ts`

**Acceptance Criteria**:
- Extension activates without errors
- Activation events configured in `package.json`
- Context properly disposed on deactivation
- Can set breakpoints and debug

**References**: Design §3.1.1

---

#### Task 1.2.2: Create Type Definitions
- [ ] Create `src/types/config.ts` for configuration types
- [ ] Create `src/types/messages.ts` for message protocol
- [ ] Create `src/types/index.ts` to export all types
- [ ] Document all interfaces with JSDoc comments

**Files to Create**:
- `src/types/config.ts`
- `src/types/messages.ts`
- `src/types/index.ts`

**Acceptance Criteria**:
- All interfaces properly typed
- JSDoc comments for intellisense
- No `any` types except where necessary

**References**: Design §4 Data Models

---

#### Task 1.2.3: Implement Config Manager
- [ ] Create `src/config/schema.ts` with interfaces
- [ ] Create `src/config/loader.ts` with ConfigManager class
- [ ] Implement `load()` method
- [ ] Implement `getDefaultConfig()` method
- [ ] Implement `validate()` method (basic validation)
- [ ] Add config file path constant

**Files to Create**:
- `src/config/schema.ts`
- `src/config/loader.ts`

**Acceptance Criteria**:
- Can load config from `.vscode/markdown-extension-config.json`
- Returns default config if file missing
- Basic validation (check required fields)
- No crashes on malformed JSON

**References**: Design §3.1.4, §8 Configuration Management

---

#### Task 1.2.4: Implement File Scanner
- [ ] Create `src/fileSystem/scanner.ts`
- [ ] Implement `FileScanner` class
- [ ] Implement `scanFolder()` method using VS Code API
- [ ] Implement file sorting (alphabetical)
- [ ] Add support for exclude patterns
- [ ] Add error handling for missing folders

**Files to Create**:
- `src/fileSystem/scanner.ts`

**Acceptance Criteria**:
- Can scan folder for `.md` files
- Respects exclude patterns
- Returns sorted file list
- Handles non-existent folders gracefully

**References**: Design §7.1 File Discovery Strategy

---

### 1.3 TreeView Implementation

#### Task 1.3.1: Create TreeView Provider
- [ ] Create `src/treeView/provider.ts`
- [ ] Implement `MarkdownTreeProvider` class
- [ ] Implement `getTreeItem()` method
- [ ] Implement `getChildren()` method
- [ ] Add `refresh()` method with event emitter
- [ ] Register provider in extension activation

**Files to Create**:
- `src/treeView/provider.ts`

**Acceptance Criteria**:
- TreeView appears in sidebar
- Shows hardcoded sections (SPECS, AGENTS, COMMANDS, BOLTS)
- Sections are collapsible
- Can expand/collapse sections

**References**: Design §3.1.2

---

#### Task 1.3.2: Create TreeItem Model
- [ ] Create `src/treeView/treeItem.ts`
- [ ] Implement `MarkdownTreeItem` class extending `vscode.TreeItem`
- [ ] Add support for 'section' and 'file' types
- [ ] Configure icons for sections and files
- [ ] Add context values for commands

**Files to Create**:
- `src/treeView/treeItem.ts`

**Acceptance Criteria**:
- Tree items display correctly
- Icons show for sections and files
- Context values set properly

**References**: Design §4.3 Tree Item Model

---

#### Task 1.3.3: Integrate File Discovery with TreeView
- [ ] Connect FileScanner to TreeProvider
- [ ] Load files for each section on expansion
- [ ] Cache file lists per section
- [ ] Show file count or empty state
- [ ] Handle errors in file discovery

**Files to Update**:
- `src/treeView/provider.ts`

**Acceptance Criteria**:
- Files appear under sections
- File discovery happens on section expand
- Error states handled gracefully
- Performance acceptable for 100+ files

**References**: Design §3.1.2 Data Flow

---

#### Task 1.3.4: Register TreeView in package.json
- [ ] Add view container in Activity Bar
- [ ] Register tree view with ID `markdownDocs`
- [ ] Configure view icon
- [ ] Set view title
- [ ] Add activation events

**Files to Update**:
- `package.json`

**Acceptance Criteria**:
- TreeView icon appears in Activity Bar
- Clicking icon shows sidebar
- View title displays correctly

**References**: Requirements §2.1 Sidebar View

---

### 1.4 Basic Custom Editor (Source Mode Only)

#### Task 1.4.1: Create Custom Editor Provider
- [ ] Create `src/editor/customEditor.ts`
- [ ] Implement `MarkdownEditorProvider` class
- [ ] Implement `resolveCustomTextEditor()` method
- [ ] Setup webview options (scripts, resources)
- [ ] Implement basic message handling
- [ ] Register custom editor in extension activation

**Files to Create**:
- `src/editor/customEditor.ts`

**Acceptance Criteria**:
- Custom editor registered for `.md` files
- Can open markdown files in custom editor
- Webview loads without errors
- Basic two-way communication works

**References**: Design §3.1.3

---

#### Task 1.4.2: Create Webview HTML Template
- [ ] Create `src/editor/webview.ts` with HTML generation
- [ ] Implement `getHtmlForWebview()` function
- [ ] Add Content Security Policy
- [ ] Include script and style URIs
- [ ] Add editor container div
- [ ] Add nonce for inline scripts

**Files to Create**:
- `src/editor/webview.ts`

**Acceptance Criteria**:
- HTML template renders in webview
- CSP configured correctly
- Resources load from extension URI
- No console errors

**References**: Design §9.1 Content Security Policy

---

#### Task 1.4.3: Implement Document Synchronization
- [ ] Create `src/editor/sync.ts`
- [ ] Implement webview → document sync
- [ ] Implement document → webview sync
- [ ] Add debouncing for changes
- [ ] Handle version conflicts
- [ ] Test with simultaneous edits

**Files to Create**:
- `src/editor/sync.ts`

**Acceptance Criteria**:
- Changes in webview save to document
- External document changes update webview
- Debouncing prevents excessive updates
- No infinite loops

**References**: Design §5.2 Document Synchronization

---

#### Task 1.4.4: Setup CodeMirror 6 in Webview
- [ ] Create `webview/src/index.ts`
- [ ] Install CodeMirror 6 dependencies
- [ ] Initialize basic CodeMirror editor
- [ ] Configure markdown language support
- [ ] Add basic extensions (history, keymap)
- [ ] Setup vscode API acquisition

**Files to Create**:
- `webview/src/index.ts`
- `webview/package.json`

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

**References**: Design §6.1 CodeMirror 6 Setup

---

#### Task 1.4.5: Implement Webview Message Handler
- [ ] Create `webview/src/messageHandler.ts`
- [ ] Handle `init` message
- [ ] Handle `updateContent` message
- [ ] Send `change` message on edit
- [ ] Send `ready` message on load
- [ ] Add error handling

**Files to Create**:
- `webview/src/messageHandler.ts`

**Acceptance Criteria**:
- All message types handled
- Error messages sent to extension
- No unhandled message types
- Logging for debugging

**References**: Design §4.2 Message Protocol

---

#### Task 1.4.6: Implement File Open Command
- [ ] Create `src/treeView/commands.ts`
- [ ] Implement `openFile` command
- [ ] Register command in extension activation
- [ ] Configure TreeItem click handler
- [ ] Test double-click to open

**Files to Create**:
- `src/treeView/commands.ts`

**Acceptance Criteria**:
- Double-clicking file opens in custom editor
- File content loads correctly
- Can edit and save
- Multiple files can be open

**References**: Requirements §2.1 Interaction Patterns

---

### 1.5 Basic Save Functionality

#### Task 1.5.1: Implement Save Logic
- [ ] Handle VS Code save commands (Cmd/Ctrl+S)
- [ ] Implement auto-save support
- [ ] Show dirty state indicator
- [ ] Handle save errors
- [ ] Test with multiple editors

**Files to Update**:
- `src/editor/customEditor.ts`

**Acceptance Criteria**:
- Cmd/Ctrl+S saves file
- Dirty indicator shows for unsaved changes
- Auto-save works (if enabled)
- Save errors displayed to user

**References**: Requirements §3.3 Save Behavior

---

### 1.6 Phase 1 Testing

#### Task 1.6.1: Manual Testing Checklist
- [ ] Extension activates without errors
- [ ] Sidebar shows tree view with sections
- [ ] Can expand/collapse sections
- [ ] Files appear under sections
- [ ] Double-click opens file in custom editor
- [ ] CodeMirror editor loads and is editable
- [ ] Can save changes (Cmd/Ctrl+S)
- [ ] Changes persist after reload

**References**: Design §11 Testing Strategy

---

#### Task 1.6.2: Create Test Files
- [ ] Create test markdown files in sample folders
- [ ] Create sample workspace configuration
- [ ] Test with 10-20 files per section
- [ ] Test with different markdown content

**Test Data**:
- Create `test-workspace/` with sample structure
- Minimum 4 sections with 5 files each

---

## Phase 2: Live Preview (Weeks 3-4)

**Goal**: Implement Live Preview mode with cursor-based syntax revealing

### 2.1 Live Preview Core Implementation

#### Task 2.1.1: Create Live Preview ViewPlugin
- [ ] Create `webview/src/livePreview.ts`
- [ ] Implement `livePreviewPlugin` ViewPlugin
- [ ] Implement `buildDecorations()` method
- [ ] Track cursor position
- [ ] Get cursor line number
- [ ] Iterate syntax tree

**Files to Create**:
- `webview/src/livePreview.ts`

**Acceptance Criteria**:
- ViewPlugin loads without errors
- Can access cursor position
- Syntax tree iteration works
- No performance issues

**References**: Design §3.2.3

---

#### Task 2.1.2: Implement Emphasis Hiding
- [ ] Hide `**` for bold (StrongEmphasis)
- [ ] Hide `*` for italic (Emphasis)
- [ ] Hide `__` for bold
- [ ] Hide `_` for italic
- [ ] Skip hiding if cursor on line
- [ ] Add decorations for hidden marks

**Files to Update**:
- `webview/src/livePreview.ts`

**Acceptance Criteria**:
- Bold/italic syntax hidden when cursor away
- Syntax shows when cursor on line
- Decorated text renders properly
- Cursor movement updates immediately

**References**: Design §3.2.3 Implementation

---

#### Task 2.1.3: Implement Heading Hiding
- [ ] Hide `#` markers for headings (ATXHeading)
- [ ] Support H1 through H6
- [ ] Preserve heading styling
- [ ] Show markers when cursor on heading
- [ ] Test with multiple heading levels

**Files to Update**:
- `webview/src/livePreview.ts`

**Acceptance Criteria**:
- Heading markers hidden
- Heading text styled correctly
- All heading levels work (H1-H6)
- Cursor reveals markers

---

#### Task 2.1.4: Implement Link Hiding
- [ ] Hide link syntax `[text](url)`
- [ ] Show only link text when cursor away
- [ ] Reveal full syntax when cursor on link
- [ ] Optionally show URL on hover
- [ ] Handle reference links

**Files to Update**:
- `webview/src/livePreview.ts`

**Acceptance Criteria**:
- Link text visible, URL hidden
- Clicking link opens URL (optional)
- Cursor reveals link syntax
- Hover shows URL (optional)

---

#### Task 2.1.5: Implement Code Block Handling
- [ ] Show code blocks with syntax highlighting
- [ ] Hide fences ` ``` ` when cursor away
- [ ] Reveal fences when cursor in block
- [ ] Preserve language specifier
- [ ] Test with various languages

**Files to Update**:
- `webview/src/livePreview.ts`

**Acceptance Criteria**:
- Code blocks render with highlighting
- Fences hidden when cursor outside
- Language syntax highlighting works
- Cursor reveals fences

---

#### Task 2.1.6: Create Decoration Theme
- [ ] Create CSS theme for hidden elements
- [ ] Use `font-size: 1px` technique
- [ ] Use `letter-spacing: -1ch` technique
- [ ] Set `color: transparent`
- [ ] Test across themes

**Files to Create**:
- `webview/src/decorations.ts` or inline in livePreview.ts

**Acceptance Criteria**:
- Hidden syntax is invisible but clickable
- No layout shift when hiding/showing
- Works in light and dark themes
- Cursor can click hidden areas

**References**: Design §3.2.3 CSS for hiding syntax

---

### 2.2 Mode Management

#### Task 2.2.1: Create Mode Manager
- [ ] Create `webview/src/modeSwitch.ts`
- [ ] Implement `ModeManager` class
- [ ] Setup Compartment for mode extensions
- [ ] Implement `switchTo(mode)` method
- [ ] Track current mode state
- [ ] Notify extension of mode changes

**Files to Create**:
- `webview/src/modeSwitch.ts`

**Acceptance Criteria**:
- Can switch between Live Preview and Source
- Mode state tracked correctly
- Extension notified of changes
- No errors during switch

**References**: Design §3.2.2

---

#### Task 2.2.2: Implement Source Mode
- [ ] Create source mode extensions
- [ ] Include markdown highlighting
- [ ] Include line numbers (optional)
- [ ] Remove Live Preview decorations
- [ ] Test switching to/from Source

**Files to Create/Update**:
- `webview/src/modeSwitch.ts`

**Acceptance Criteria**:
- Source mode shows all markdown syntax
- Syntax highlighting works
- Line numbers configurable
- Switching is smooth

**References**: Requirements §2.2 Source Mode

---

#### Task 2.2.3: Create Mode Switcher Toolbar
- [ ] Create `webview/styles/toolbar.css`
- [ ] Add toolbar HTML to webview template
- [ ] Add mode buttons (LP, SRC, RD)
- [ ] Style active/inactive states
- [ ] Add click handlers
- [ ] Position toolbar at top of editor

**Files to Create**:
- `webview/styles/toolbar.css`

**Files to Update**:
- `src/editor/webview.ts` (HTML template)
- `webview/src/index.ts` (toolbar handlers)

**Acceptance Criteria**:
- Toolbar visible at top
- Buttons styled correctly
- Active mode highlighted
- Clicking switches modes

**References**: Requirements §2.2 Mode Switching

---

#### Task 2.2.4: Register Mode Commands
- [ ] Create `src/commands/switchMode.ts`
- [ ] Implement `switchToLivePreview` command
- [ ] Implement `switchToSource` command
- [ ] Implement `toggleMode` command
- [ ] Register commands in extension
- [ ] Add to package.json

**Files to Create**:
- `src/commands/switchMode.ts`

**Files to Update**:
- `package.json` (contributes.commands)

**Acceptance Criteria**:
- Commands appear in Command Palette
- Commands work from keyboard
- Commands send message to webview
- Webview switches mode correctly

**References**: Requirements Appendix B

---

### 2.3 Phase 2 Testing

#### Task 2.3.1: Test Live Preview Functionality
- [ ] Test bold hiding/revealing
- [ ] Test italic hiding/revealing
- [ ] Test heading hiding/revealing
- [ ] Test link hiding/revealing
- [ ] Test code block handling
- [ ] Test cursor-based revealing
- [ ] Test with complex documents

---

#### Task 2.3.2: Test Mode Switching
- [ ] Test Live Preview → Source
- [ ] Test Source → Live Preview
- [ ] Test toolbar buttons
- [ ] Test keyboard commands
- [ ] Test mode persistence
- [ ] Verify no content loss

---

## Phase 3: Configuration (Week 5)

**Goal**: Config file support, dynamic sections, file watchers

### 3.1 Configuration System

#### Task 3.1.1: Implement Config Validation
- [ ] Create `src/config/validator.ts`
- [ ] Define JSON Schema for config
- [ ] Implement schema validation
- [ ] Check folder path existence
- [ ] Validate section IDs are unique
- [ ] Provide helpful error messages

**Files to Create**:
- `src/config/validator.ts`

**Acceptance Criteria**:
- Invalid config rejected with clear error
- Missing folders reported
- Duplicate section IDs caught
- Helpful error messages shown

**References**: Design §8.2 Configuration Validation

---

#### Task 3.1.2: Implement Config Watcher
- [ ] Watch config file for changes
- [ ] Reload config on change
- [ ] Refresh TreeView on config change
- [ ] Handle config file deletion
- [ ] Show notification on reload

**Files to Update**:
- `src/config/loader.ts`

**Acceptance Criteria**:
- Config changes detected automatically
- TreeView refreshes on config change
- No crashes on invalid config
- User notified of reload

**References**: Design §8.1 Configuration Loading

---

#### Task 3.1.3: Implement Dynamic Section Loading
- [ ] Remove hardcoded sections
- [ ] Load sections from config
- [ ] Support custom icons
- [ ] Support custom labels
- [ ] Support folder paths
- [ ] Test with 1-10 sections

**Files to Update**:
- `src/treeView/provider.ts`

**Acceptance Criteria**:
- Sections loaded from config
- Custom icons display
- Custom labels work
- Folder paths resolved correctly

**References**: Requirements §3.1 Configuration System

---

### 3.2 File Watching

#### Task 3.2.1: Implement File Watcher
- [ ] Create `src/fileSystem/watcher.ts`
- [ ] Implement `FileWatcher` class
- [ ] Watch for file create/delete/change
- [ ] Setup watchers for each section
- [ ] Dispose watchers properly
- [ ] Handle watch errors

**Files to Create**:
- `src/fileSystem/watcher.ts`

**Acceptance Criteria**:
- New files appear in TreeView immediately
- Deleted files removed from TreeView
- Changed files trigger refresh
- Watchers disposed on extension deactivate

**References**: Design §7.2 File Watching

---

#### Task 3.2.2: Integrate File Watcher with TreeView
- [ ] Setup watchers in extension activation
- [ ] Connect watcher events to TreeView refresh
- [ ] Debounce rapid changes
- [ ] Test with file create/delete/rename
- [ ] Handle multiple simultaneous changes

**Files to Update**:
- `src/extension.ts`
- `src/treeView/provider.ts`

**Acceptance Criteria**:
- TreeView updates automatically
- No excessive refreshes
- Smooth UI updates
- Performance good with many changes

---

### 3.3 Create File Functionality

#### Task 3.3.1: Implement Create File Command
- [ ] Create `src/commands/createFile.ts`
- [ ] Show input box for file name
- [ ] Validate file name
- [ ] Create file in section folder
- [ ] Add `.md` extension if missing
- [ ] Open new file in editor

**Files to Create**:
- `src/commands/createFile.ts`

**Acceptance Criteria**:
- [+] button shows input box
- File created in correct folder
- `.md` extension added automatically
- Invalid names rejected
- New file opens in editor

**References**: Requirements §2.1 Interaction Patterns

---

#### Task 3.3.2: Add Create Button to TreeView
- [ ] Add [+] button to section headers
- [ ] Register click handler
- [ ] Pass section info to command
- [ ] Test with all sections
- [ ] Handle errors gracefully

**Files to Update**:
- `src/treeView/provider.ts`
- `package.json` (view title commands)

**Acceptance Criteria**:
- [+] button visible on sections
- Clicking prompts for file name
- File created in correct section
- TreeView updates automatically

---

### 3.4 Phase 3 Testing

#### Task 3.4.1: Test Configuration
- [ ] Test valid config file
- [ ] Test invalid config file
- [ ] Test missing config (defaults)
- [ ] Test config file changes
- [ ] Test section add/remove
- [ ] Test custom icons and labels

---

#### Task 3.4.2: Test File Operations
- [ ] Test create file via [+] button
- [ ] Test file appears in TreeView
- [ ] Test file watcher detects new files
- [ ] Test file watcher detects deletions
- [ ] Test rapid file operations

---

## Phase 4: Reading Mode & Polish (Week 6)

**Goal**: Implement Reading mode, theme sync, error handling

### 4.1 Reading Mode Implementation

#### Task 4.1.1: Setup Markdown Renderer
- [ ] Install `marked` library
- [ ] Install `dompurify` library
- [ ] Create `webview/src/reading.ts`
- [ ] Configure marked options (GFM, breaks, etc.)
- [ ] Implement `renderReadingMode()` function
- [ ] Add HTML sanitization

**Files to Create**:
- `webview/src/reading.ts`

**Dependencies**:
```json
{
  "marked": "^11.1.0",
  "dompurify": "^3.0.6"
}
```

**Acceptance Criteria**:
- Markdown renders to HTML
- GFM features work (tables, task lists)
- HTML sanitized properly
- No XSS vulnerabilities

**References**: Design §3.2.4

---

#### Task 4.1.2: Create Reading Mode UI
- [ ] Add reading container to webview HTML
- [ ] Create `webview/styles/reading.css`
- [ ] Style rendered HTML elements
- [ ] Match VS Code theme colors
- [ ] Add padding and typography
- [ ] Test with various markdown

**Files to Create**:
- `webview/styles/reading.css`

**Files to Update**:
- `src/editor/webview.ts` (add reading div)

**Acceptance Criteria**:
- Reading mode looks clean
- Styles match VS Code theme
- Typography is readable
- All elements styled

---

#### Task 4.1.3: Implement Reading Mode Switch
- [ ] Add `switchToReading()` to ModeManager
- [ ] Hide CodeMirror editor
- [ ] Show reading container
- [ ] Render markdown to HTML
- [ ] Update toolbar state
- [ ] Test switching to/from Reading

**Files to Update**:
- `webview/src/modeSwitch.ts`

**Acceptance Criteria**:
- Can switch to Reading mode
- HTML renders correctly
- Can switch back to editing modes
- Content stays in sync

**References**: Requirements §2.2 Reading Mode

---

#### Task 4.1.4: Register Reading Mode Command
- [ ] Add `switchToReading` command
- [ ] Add keyboard shortcut (optional)
- [ ] Update toolbar to include RD button
- [ ] Test from Command Palette
- [ ] Test from keyboard

**Files to Update**:
- `src/commands/switchMode.ts`
- `package.json`

**Acceptance Criteria**:
- Command works from palette
- Toolbar button works
- Keyboard shortcut works (if added)

---

### 4.2 Theme Synchronization

#### Task 4.2.1: Detect VS Code Theme
- [ ] Get current theme type (light/dark)
- [ ] Send theme to webview on init
- [ ] Listen for theme change events
- [ ] Send theme change to webview
- [ ] Test with theme switches

**Files to Update**:
- `src/editor/customEditor.ts`

**Acceptance Criteria**:
- Webview knows current theme
- Theme changes detected
- Webview notified of changes

**References**: Design §6.2 Extension Compartments

---

#### Task 4.2.2: Implement Webview Theme Manager
- [ ] Create `webview/src/theme.ts`
- [ ] Apply theme to CodeMirror
- [ ] Apply theme to Reading mode
- [ ] Apply theme to toolbar
- [ ] Create light theme styles
- [ ] Create dark theme styles

**Files to Create**:
- `webview/src/theme.ts`

**Acceptance Criteria**:
- Light theme looks good
- Dark theme looks good
- Theme switches smoothly
- All UI elements themed

---

### 4.3 Error Handling & Polish

#### Task 4.3.1: Add Error Boundaries
- [ ] Add try/catch in critical paths
- [ ] Show error notifications to user
- [ ] Log errors to console
- [ ] Handle webview errors gracefully
- [ ] Prevent extension crashes

**Files to Update**:
- All source files with critical code

**Acceptance Criteria**:
- Errors don't crash extension
- User sees helpful error messages
- Errors logged for debugging

---

#### Task 4.3.2: Add Loading States
- [ ] Show loading indicator for editor
- [ ] Show loading for TreeView
- [ ] Show loading for file operations
- [ ] Add skeleton screens (optional)
- [ ] Test with slow operations

**Acceptance Criteria**:
- Loading states visible
- User knows something is happening
- Smooth transitions

---

#### Task 4.3.3: Improve UX Polish
- [ ] Add icons to TreeView items
- [ ] Add tooltips where helpful
- [ ] Improve error messages
- [ ] Add keyboard shortcuts
- [ ] Smooth animations
- [ ] Accessibility improvements

**Acceptance Criteria**:
- UI feels polished
- Keyboard navigation works
- Screen readers supported
- Animations smooth

---

### 4.4 Phase 4 Testing

#### Task 4.4.1: Test All Three Modes
- [ ] Test Live Preview mode thoroughly
- [ ] Test Source mode thoroughly
- [ ] Test Reading mode thoroughly
- [ ] Test switching between all modes
- [ ] Test mode persistence

---

#### Task 4.4.2: Test Theme Support
- [ ] Test light theme
- [ ] Test dark theme
- [ ] Test theme switching
- [ ] Test all modes with both themes
- [ ] Test custom themes (optional)

---

#### Task 4.4.3: Integration Testing
- [ ] Test complete workflow (create → edit → save)
- [ ] Test with multiple open editors
- [ ] Test with large files (1MB+)
- [ ] Test with complex markdown
- [ ] Performance testing

---

## Phase 5: Enhanced Features (Weeks 7-8)

**Goal**: Context menus, file operations, settings UI

### 5.1 Context Menus

#### Task 5.1.1: Implement File Context Menu
- [ ] Add right-click menu to files
- [ ] Add "Rename" option
- [ ] Add "Delete" option
- [ ] Add "Copy Path" option
- [ ] Add "Reveal in Explorer" option
- [ ] Register menu contributions

**Files to Update**:
- `package.json` (menus contribution)

**Acceptance Criteria**:
- Right-click shows context menu
- Menu items appropriate for files
- Commands work correctly

---

#### Task 5.1.2: Implement Section Context Menu
- [ ] Add right-click menu to sections
- [ ] Add "New File" option
- [ ] Add "Refresh" option
- [ ] Add "Collapse All" option
- [ ] Register menu contributions

**Files to Update**:
- `package.json` (menus contribution)

**Acceptance Criteria**:
- Right-click shows context menu
- Menu items appropriate for sections
- Commands work correctly

**References**: Requirements §2.1 Interaction Patterns

---

### 5.2 File Operations

#### Task 5.2.1: Implement Delete File
- [ ] Create `src/commands/deleteFile.ts`
- [ ] Show confirmation dialog
- [ ] Delete file from filesystem
- [ ] Refresh TreeView
- [ ] Close editor if open
- [ ] Handle errors

**Files to Create**:
- `src/commands/deleteFile.ts`

**Acceptance Criteria**:
- Confirmation required
- File deleted successfully
- TreeView updates
- Open editor closes
- Errors handled

---

#### Task 5.2.2: Implement Rename File
- [ ] Create `src/commands/renameFile.ts`
- [ ] Show input with current name
- [ ] Validate new name
- [ ] Rename file on filesystem
- [ ] Update open editors
- [ ] Refresh TreeView

**Files to Create**:
- `src/commands/renameFile.ts`

**Acceptance Criteria**:
- Shows current name in input
- Validates new name
- File renamed successfully
- Editor updates with new name
- TreeView shows new name

---

#### Task 5.2.3: Implement Copy Path
- [ ] Create `src/commands/copyPath.ts`
- [ ] Get file path
- [ ] Copy to clipboard
- [ ] Show confirmation
- [ ] Support relative and absolute paths

**Files to Create**:
- `src/commands/copyPath.ts`

**Acceptance Criteria**:
- Path copied to clipboard
- User notified of success
- Paste works in other apps

---

### 5.3 Search & Filter

#### Task 5.3.1: Add Search Box to TreeView
- [ ] Add search input to view
- [ ] Filter files by name
- [ ] Highlight matching text
- [ ] Clear search button
- [ ] Test with many files

**Files to Update**:
- `src/treeView/provider.ts`
- `package.json` (view welcome content)

**Acceptance Criteria**:
- Search box visible
- Typing filters results
- Clear button works
- Performance good with many files

---

### 5.4 Settings UI

#### Task 5.4.1: Add Extension Settings
- [ ] Add settings to `package.json`
- [ ] `defaultMode` setting
- [ ] `autoRefresh` setting
- [ ] `toolbar` visibility setting
- [ ] `theme` preference setting
- [ ] `lineNumbers` setting
- [ ] Document all settings

**Files to Update**:
- `package.json` (contributes.configuration)

**Acceptance Criteria**:
- Settings appear in VS Code settings UI
- Settings work as documented
- Defaults are reasonable

**References**: Requirements Appendix C

---

#### Task 5.4.2: Implement Settings Integration
- [ ] Read settings in extension
- [ ] Pass settings to webview
- [ ] Apply settings to editor
- [ ] Listen for setting changes
- [ ] Update UI when settings change

**Files to Update**:
- `src/extension.ts`
- `src/editor/customEditor.ts`
- `webview/src/index.ts`

**Acceptance Criteria**:
- Settings applied correctly
- Changes take effect immediately
- No restart required

---

### 5.5 Multi-Root Workspace Support

#### Task 5.5.1: Support Multiple Workspace Folders
- [ ] Detect multiple workspace folders
- [ ] Load config from each folder
- [ ] Prefix sections with folder name
- [ ] Merge sections in TreeView
- [ ] Test with 2-3 workspace folders

**Files to Update**:
- `src/extension.ts`
- `src/config/loader.ts`
- `src/treeView/provider.ts`

**Acceptance Criteria**:
- Works with multi-root workspaces
- Sections clearly labeled by folder
- Can distinguish files from different folders

**References**: Requirements §6.4 Compatibility

---

### 5.6 Documentation

#### Task 5.6.1: Create README
- [ ] Write extension overview
- [ ] Add features list
- [ ] Add screenshots/GIFs
- [ ] Document configuration
- [ ] Add usage examples
- [ ] Add troubleshooting section

**Files to Create/Update**:
- `README.md`

**Acceptance Criteria**:
- Clear, comprehensive README
- Screenshots show key features
- Installation instructions clear

---

#### Task 5.6.2: Create CHANGELOG
- [ ] Document initial release (v0.1.0)
- [ ] List all features
- [ ] Follow Keep a Changelog format
- [ ] Include version numbers

**Files to Create**:
- `CHANGELOG.md`

---

### 5.7 Marketplace Preparation

#### Task 5.7.1: Create Extension Icon
- [ ] Design extension icon (128x128)
- [ ] Export as PNG
- [ ] Add to extension package
- [ ] Test in marketplace

**Files to Create**:
- `resources/icons/extension-icon.png`

**Files to Update**:
- `package.json` (icon field)

---

#### Task 5.7.2: Update package.json Metadata
- [ ] Set display name
- [ ] Write description
- [ ] Add keywords
- [ ] Add categories
- [ ] Add repository URL
- [ ] Set license
- [ ] Add homepage URL

**Files to Update**:
- `package.json`

---

### 5.8 Phase 5 Testing

#### Task 5.8.1: End-to-End Testing
- [ ] Test complete user workflows
- [ ] Test all commands
- [ ] Test all context menus
- [ ] Test file operations
- [ ] Test settings
- [ ] Test multi-root workspaces

---

#### Task 5.8.2: Performance Testing
- [ ] Test with 100+ files
- [ ] Test with 5MB+ files
- [ ] Test rapid file operations
- [ ] Measure startup time
- [ ] Measure mode switch time
- [ ] Profile memory usage

---

#### Task 5.8.3: Cross-Platform Testing
- [ ] Test on Windows
- [ ] Test on macOS
- [ ] Test on Linux
- [ ] Test with Remote - SSH
- [ ] Test with Remote - Containers

---

## Testing & Quality Assurance

### Unit Tests

#### Task: Setup Testing Framework
- [ ] Install testing dependencies (mocha, chai, etc.)
- [ ] Configure test scripts in package.json
- [ ] Create test directory structure
- [ ] Write example test
- [ ] Run tests in CI (optional)

**Files to Create**:
- `tests/unit/` directory structure
- `.mocharc.json` or test config

---

#### Task: Write Unit Tests for Core Components
- [ ] ConfigManager tests (10+ tests)
- [ ] FileScanner tests (5+ tests)
- [ ] TreeProvider tests (5+ tests)
- [ ] Validation tests (10+ tests)
- [ ] Message protocol tests (5+ tests)

**Target**: 80%+ code coverage

**References**: Design §11.1 Unit Tests

---

### Integration Tests

#### Task: Setup Integration Testing
- [ ] Configure VS Code extension test runner
- [ ] Create test workspace
- [ ] Write integration test examples
- [ ] Add test script to package.json

**Files to Create**:
- `tests/integration/` directory

---

#### Task: Write Integration Tests
- [ ] Extension activation test
- [ ] TreeView rendering test
- [ ] File opening test
- [ ] Mode switching test
- [ ] File operations test

**References**: Design §11.2 Integration Tests

---

## Documentation Tasks

### Task: Create Developer Guide
- [ ] Document architecture
- [ ] Explain component interactions
- [ ] Add code examples
- [ ] Document message protocol
- [ ] Add debugging tips

**Files to Create**:
- `docs/DEVELOPMENT.md`

---

### Task: Create Contributing Guide
- [ ] Explain how to contribute
- [ ] Document coding standards
- [ ] Explain PR process
- [ ] Add issue templates

**Files to Create**:
- `CONTRIBUTING.md`
- `.github/ISSUE_TEMPLATE/` templates

---

## Deployment Tasks

### Task: Prepare for Initial Release
- [ ] Bump version to 0.1.0
- [ ] Update CHANGELOG
- [ ] Test VSIX package locally
- [ ] Create GitHub release
- [ ] Publish to VS Code Marketplace

---

### Task: Setup CI/CD (Optional)
- [ ] Configure GitHub Actions
- [ ] Add build workflow
- [ ] Add test workflow
- [ ] Add publish workflow
- [ ] Add automated versioning

**Files to Create**:
- `.github/workflows/build.yml`
- `.github/workflows/test.yml`
- `.github/workflows/publish.yml`

---

## Post-Launch Tasks (Phase 4+)

### Future Enhancements (Not in MVP)

#### Task: Implement Collaborative Commenting
- [ ] Choose commenting library (from research)
- [ ] Integrate with CodeMirror 6
- [ ] Add comment UI
- [ ] Implement comment storage
- [ ] Add comment threads
- [ ] Test with multiple users

**Timeline**: 2-3 weeks
**References**: Research §Collaborative Commenting

---

#### Task: Implement Math Equation Support
- [ ] Choose library (KaTeX or MathJax)
- [ ] Add to Reading mode
- [ ] Add to Live Preview mode
- [ ] Test with LaTeX syntax
- [ ] Document usage

**Timeline**: 1 week

---

#### Task: Implement Diagram Support
- [ ] Integrate Mermaid
- [ ] Add diagram rendering
- [ ] Support flow charts
- [ ] Support sequence diagrams
- [ ] Test in all modes

**Timeline**: 1 week

---

#### Task: Implement Split View
- [ ] Create split pane layout
- [ ] Show Live Preview + Source side-by-side
- [ ] Sync scrolling
- [ ] Sync cursor position
- [ ] Add toggle command

**Timeline**: 1-2 weeks

---

## Summary

**Total Tasks**: 130+ tasks across 5 phases
**Estimated Timeline**: 8 weeks
**MVP Deliverable**: Phase 1-3 (5 weeks)
**Production Ready**: Phase 1-5 (8 weeks)

### Phase Breakdown

| Phase | Duration | Tasks | Key Deliverables |
|-------|----------|-------|------------------|
| Phase 1 | 2 weeks | 25 tasks | Extension scaffold, TreeView, Basic editor (Source mode) |
| Phase 2 | 2 weeks | 15 tasks | Live Preview mode with cursor-based syntax revealing |
| Phase 3 | 1 week | 12 tasks | Config file support, File watchers, Create file |
| Phase 4 | 1 week | 15 tasks | Reading mode, Theme sync, Error handling |
| Phase 5 | 2 weeks | 20 tasks | Context menus, File operations, Settings, Multi-root |
| **Total** | **8 weeks** | **87 core tasks** | **Production-ready extension** |

### Next Steps

1. ✅ Review this task breakdown
2. ⏭️ Create GitHub project/issues from tasks
3. ⏭️ Begin Phase 1, Task 1.1.1 (Initialize Project)
4. ⏭️ Track progress using todo list or project board
5. ⏭️ Update this document as tasks completed

---

**Last Updated**: November 19, 2025
**Status**: Ready for Implementation
