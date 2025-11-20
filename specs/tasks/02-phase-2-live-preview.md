# Phase 2: Live Preview (Weeks 3-4)

**Goal**: Implement Live Preview mode with cursor-based syntax revealing

**Status**: ✅ Complete

---

## 2.1 Live Preview Core Implementation

### Task 2.1.1: Create Live Preview ViewPlugin
- [x] Create `webview/editors/livePreviewMode.ts` *(organized in editors/ folder)*
- [x] Implement `livePreviewPlugin` ViewPlugin
- [x] Implement decoration building
- [x] Track cursor position
- [x] Get cursor line number
- [x] Iterate syntax tree

**Files Created** *(actual implementation)*:
- `webview/editors/livePreviewMode.ts`

**Acceptance Criteria**:
- ViewPlugin loads without errors
- Can access cursor position
- Syntax tree iteration works
- No performance issues

---

### Task 2.1.2: Implement Emphasis Hiding
- [x] Hide `**` for bold (StrongEmphasis)
- [x] Hide `*` for italic (Emphasis)
- [x] Hide `__` for bold
- [x] Hide `_` for italic
- [x] Skip hiding if cursor on line
- [x] Add decorations for hidden marks

**Acceptance Criteria**:
- Bold/italic syntax hidden when cursor away
- Syntax shows when cursor on line
- Decorated text renders properly
- Cursor movement updates immediately

---

### Task 2.1.3: Implement Heading Hiding
- [x] Hide `#` markers for headings (ATXHeading)
- [x] Support H1 through H6
- [x] Preserve heading styling
- [x] Show markers when cursor on heading
- [x] Test with multiple heading levels

**Acceptance Criteria**:
- Heading markers hidden
- Heading text styled correctly
- All heading levels work (H1-H6)
- Cursor reveals markers

---

### Task 2.1.4: Implement Link Hiding
- [x] Hide link syntax `[text](url)`
- [x] Show only link text when cursor away
- [x] Reveal full syntax when cursor on link
- [x] Optionally show URL on hover
- [x] Handle reference links

**Acceptance Criteria**:
- Link text visible, URL hidden
- Clicking link opens URL (optional)
- Cursor reveals link syntax
- Hover shows URL (optional)

---

### Task 2.1.5: Implement Code Block Handling
- [x] Show code blocks with syntax highlighting
- [x] Hide fences ` ``` ` when cursor away
- [x] Reveal fences when cursor in block
- [x] Preserve language specifier
- [x] Test with various languages

**Acceptance Criteria**:
- Code blocks render with highlighting
- Fences hidden when cursor outside
- Language syntax highlighting works
- Cursor reveals fences

---

### Task 2.1.6: Create Decoration Theme
- [x] Create CSS theme for hidden elements
- [x] Use `font-size: 1px` technique
- [x] Use `letter-spacing: -1ch` technique
- [x] Set `color: transparent`
- [x] Test across themes

**Files to Create**:
- `webview/src/decorations.ts` or inline in livePreview.ts

**Acceptance Criteria**:
- Hidden syntax is invisible but clickable
- No layout shift when hiding/showing
- Works in light and dark themes
- Cursor can click hidden areas

---

## 2.2 Mode Management

### Task 2.2.1: Create Mode Manager
- [x] Integrated into `webview/main.ts` *(simplified: mode management in main file)*
- [x] Setup Compartment for mode extensions
- [x] Implement `switchMode()` function
- [x] Track current mode state
- [x] Notify extension of mode changes

**Files Created** *(actual implementation)*:
- Mode management in `webview/main.ts`

**Acceptance Criteria**:
- Can switch between Live Preview and Source
- Mode state tracked correctly
- Extension notified of changes
- No errors during switch

---

### Task 2.2.2: Implement Source Mode
- [x] Create source mode extensions
- [x] Include markdown highlighting
- [x] Include line numbers (optional)
- [x] Remove Live Preview decorations
- [x] Test switching to/from Source

**Acceptance Criteria**:
- Source mode shows all markdown syntax
- Syntax highlighting works
- Line numbers configurable
- Switching is smooth

---

### Task 2.2.3: Create Mode Switcher Toolbar
- [x] Create `webview/styles/toolbar.css`
- [x] Add toolbar HTML to webview template
- [x] Add mode buttons (LP, SRC, RD)
- [x] Style active/inactive states
- [x] Add click handlers
- [x] Position toolbar at top of editor

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

---

### Task 2.2.4: Register Mode Commands
- [x] Integrated into `src/commands/index.ts` *(simplified: all commands in one file)*
- [x] Implement `fabriqa.switchToLivePreview` command
- [x] Implement `fabriqa.switchToSource` command
- [x] Implement `fabriqa.switchToReading` command
- [x] Register commands in extension
- [x] Add to package.json with keyboard shortcuts

**Files Created** *(actual implementation)*:
- Mode commands in `src/commands/index.ts`

**Files to Update**:
- `package.json` (contributes.commands)

**Acceptance Criteria**:
- Commands appear in Command Palette
- Commands work from keyboard
- Commands send message to webview
- Webview switches mode correctly

---

## 2.3 Phase 2 Testing

### Task 2.3.1: Test Live Preview Functionality
- [x] Test bold hiding/revealing
- [x] Test italic hiding/revealing
- [x] Test heading hiding/revealing
- [x] Test link hiding/revealing
- [x] Test code block handling
- [x] Test cursor-based revealing
- [x] Test with complex documents

---

### Task 2.3.2: Test Mode Switching
- [x] Test Live Preview → Source
- [x] Test Source → Live Preview
- [x] Test toolbar buttons
- [x] Test keyboard commands
- [x] Test mode persistence
- [x] Verify no content loss

---

## Summary

**Phase 2 Status**: ✅ Complete
**Tasks**: 15/15 completed
**Key Deliverables**:
- Live Preview mode with cursor-based syntax hiding
- Mode switcher (Live Preview ↔ Source)
- Decorations for hidden markdown syntax
- Smooth mode transitions

**Next Phase**: Phase 3 - Configuration
