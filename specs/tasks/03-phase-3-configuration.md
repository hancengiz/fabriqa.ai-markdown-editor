# Phase 3: Configuration (Week 5)

**Goal**: Config file support, dynamic sections, file watchers

**Status**: ✅ Complete

---

## 3.1 Configuration System

### Task 3.1.1: Implement Config Validation
- [x] Create `src/config/validator.ts`
- [x] Define JSON Schema for config
- [x] Implement schema validation
- [x] Check folder path existence
- [x] Validate section IDs are unique
- [x] Provide helpful error messages

**Files to Create**:
- `src/config/validator.ts`

**Acceptance Criteria**:
- Invalid config rejected with clear error
- Missing folders reported
- Duplicate section IDs caught
- Helpful error messages shown

---

### Task 3.1.2: Implement Config Watcher
- [x] Watch config file for changes
- [x] Reload config on change
- [x] Refresh TreeView on config change
- [x] Handle config file deletion
- [x] Show notification on reload

**Files to Update**:
- `src/config/loader.ts`

**Acceptance Criteria**:
- Config changes detected automatically
- TreeView refreshes on config change
- No crashes on invalid config
- User notified of reload

---

### Task 3.1.3: Implement Dynamic Section Loading
- [x] Remove hardcoded sections
- [x] Load sections from config
- [x] Support custom icons
- [x] Support custom labels
- [x] Support folder paths
- [x] Test with 1-10 sections

**Files to Update**:
- `src/treeView/provider.ts`

**Acceptance Criteria**:
- Sections loaded from config
- Custom icons display
- Custom labels work
- Folder paths resolved correctly

---

## 3.2 File Watching

### Task 3.2.1: Implement File Watcher
- [x] Create `src/fileSystem/watcher.ts`
- [x] Implement `FileWatcher` class
- [x] Watch for file create/delete/change
- [x] Setup watchers for each section
- [x] Dispose watchers properly
- [x] Handle watch errors

**Files to Create**:
- `src/fileSystem/watcher.ts`

**Acceptance Criteria**:
- New files appear in TreeView immediately
- Deleted files removed from TreeView
- Changed files trigger refresh
- Watchers disposed on extension deactivate

---

### Task 3.2.2: Integrate File Watcher with TreeView
- [x] Setup watchers in extension activation
- [x] Connect watcher events to TreeView refresh
- [x] Debounce rapid changes
- [x] Test with file create/delete/rename
- [x] Handle multiple simultaneous changes

**Files to Update**:
- `src/extension.ts`
- `src/treeView/provider.ts`

**Acceptance Criteria**:
- TreeView updates automatically
- No excessive refreshes
- Smooth UI updates
- Performance good with many changes

---

## 3.3 Create File Functionality

### Task 3.3.1: Implement Create File Command
- [x] Create `src/commands/createFile.ts`
- [x] Show input box for file name
- [x] Validate file name
- [x] Create file in section folder
- [x] Add `.md` extension if missing
- [x] Open new file in editor

**Files to Create**:
- `src/commands/createFile.ts`

**Acceptance Criteria**:
- [+] button shows input box
- File created in correct folder
- `.md` extension added automatically
- Invalid names rejected
- New file opens in editor

---

### Task 3.3.2: Add Create Button to TreeView
- [x] Add [+] button to section headers
- [x] Register click handler
- [x] Pass section info to command
- [x] Test with all sections
- [x] Handle errors gracefully

**Files to Update**:
- `src/treeView/provider.ts`
- `package.json` (view title commands)

**Acceptance Criteria**:
- [+] button visible on sections
- Clicking prompts for file name
- File created in correct section
- TreeView updates automatically

---

## 3.4 Phase 3 Testing

### Task 3.4.1: Test Configuration
- [x] Test valid config file
- [x] Test invalid config file
- [x] Test missing config (defaults)
- [x] Test config file changes
- [x] Test section add/remove
- [x] Test custom icons and labels

---

### Task 3.4.2: Test File Operations
- [x] Test create file via [+] button
- [x] Test file appears in TreeView
- [x] Test file watcher detects new files
- [x] Test file watcher detects deletions
- [x] Test rapid file operations

---

## Summary

**Phase 3 Status**: ✅ Complete
**Tasks**: 12/12 completed
**Key Deliverables**:
- Config file support (`.vscode/fabriqa-markdown-editor-config.json`)
- Dynamic section loading from config
- File watchers for automatic TreeView updates
- Create file functionality with [+] button

**Next Phase**: Phase 4 - Reading Mode & Polish
