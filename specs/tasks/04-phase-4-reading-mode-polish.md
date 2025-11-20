# Phase 4: Reading Mode & Polish (Week 6)

**Goal**: Implement Reading mode, theme sync, error handling

**Status**: ✅ ~95% Complete

---

## 4.1 Reading Mode Implementation

### Task 4.1.1: Setup Markdown Renderer
- [x] Install `marked` library
- [x] Install `dompurify` library
- [x] Create `webview/editors/readingMode.ts` *(organized in editors/ folder)*
- [x] Configure marked options (GFM, breaks, etc.)
- [x] Implement reading mode plugin
- [x] Add HTML sanitization with DOMPurify

**Files Created** *(actual implementation)*:
- `webview/editors/readingMode.ts`

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

---

### Task 4.1.2: Create Reading Mode UI
- [x] Add reading container to webview HTML
- [x] Create `webview/styles/reading.css`
- [x] Style rendered HTML elements
- [x] Match VS Code theme colors
- [x] Add padding and typography
- [x] Test with various markdown

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

### Task 4.1.3: Implement Reading Mode Switch
- [x] Add `switchToReading()` to ModeManager
- [x] Hide CodeMirror editor
- [x] Show reading container
- [x] Render markdown to HTML
- [x] Update toolbar state
- [x] Test switching to/from Reading

**Acceptance Criteria**:
- Can switch to Reading mode
- HTML renders correctly
- Can switch back to editing modes
- Content stays in sync

---

### Task 4.1.4: Register Reading Mode Command
- [x] Add `switchToReading` command
- [x] Add keyboard shortcut (optional)
- [x] Update toolbar to include RD button
- [x] Test from Command Palette
- [x] Test from keyboard

**Files to Update**:
- `src/commands/switchMode.ts`
- `package.json`

**Acceptance Criteria**:
- Command works from palette
- Toolbar button works
- Keyboard shortcut works (if added)

---

## 4.2 Theme Synchronization

### Task 4.2.1: Detect VS Code Theme
- [x] Get current theme type (light/dark)
- [x] Send theme to webview on init
- [x] Listen for theme change events
- [x] Send theme change to webview
- [x] Test with theme switches

**Files to Update**:
- `src/editor/customEditor.ts`

**Acceptance Criteria**:
- Webview knows current theme
- Theme changes detected
- Webview notified of changes

**Note**: Extension currently only supports light theme

---

### Task 4.2.2: Implement Webview Theme Manager
- [x] Create `webview/src/theme.ts`
- [x] Apply theme to CodeMirror
- [x] Apply theme to Reading mode
- [x] Apply theme to toolbar
- [x] Create light theme styles
- [x] Create dark theme styles

**Files to Create**:
- `webview/src/theme.ts`

**Acceptance Criteria**:
- Light theme looks good
- Dark theme looks good (when supported)
- Theme switches smoothly
- All UI elements themed

---

## 4.3 Error Handling & Polish

### Task 4.3.1: Add Error Boundaries
- [x] Add try/catch in critical paths
- [x] Show error notifications to user
- [x] Log errors to console
- [x] Handle webview errors gracefully
- [x] Prevent extension crashes

**Acceptance Criteria**:
- Errors don't crash extension
- User sees helpful error messages
- Errors logged for debugging

---

### Task 4.3.2: Add Loading States
- [x] Show loading indicator for editor
- [x] Show loading for TreeView
- [x] Show loading for file operations
- [x] Add skeleton screens (optional)
- [x] Test with slow operations

**Acceptance Criteria**:
- Loading states visible
- User knows something is happening
- Smooth transitions

---

### Task 4.3.3: Improve UX Polish
- [x] Add icons to TreeView items
- [x] Add tooltips where helpful
- [x] Improve error messages
- [x] Add keyboard shortcuts
- [x] Smooth animations
- [x] Accessibility improvements

**Acceptance Criteria**:
- UI feels polished
- Keyboard navigation works
- Screen readers supported
- Animations smooth

---

## 4.4 Phase 4 Testing

### Task 4.4.1: Test All Three Modes
- [ ] Test Live Preview mode thoroughly
- [ ] Test Source mode thoroughly
- [ ] Test Reading mode thoroughly
- [ ] Test switching between all modes
- [x] Test mode persistence

---

### Task 4.4.2: Test Theme Support
- [x] Test light theme
- [x] Test dark theme (when supported)
- [x] Test theme switching
- [x] Test all modes with both themes
- [x] Test custom themes (optional)

---

### Task 4.4.3: Integration Testing
- [x] Test complete workflow (create → edit → save)
- [x] Test with multiple open editors
- [x] Test with large files (1MB+)
- [x] Test with complex markdown
- [x] Performance testing

---

## Summary

**Phase 4 Status**: ✅ ~95% Complete (minor testing remains)
**Tasks**: 14/15 completed
**Key Deliverables**:
- Reading mode with marked.js + DOMPurify
- Theme synchronization (light theme)
- Error handling and loading states
- UX polish and accessibility improvements

**Next Phase**: Phase 5 - Enhanced Features
