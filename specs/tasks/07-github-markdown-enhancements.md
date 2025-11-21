# Task 07: GitHub Markdown Enhancements

## Overview
Add support for GitHub-Flavored Markdown (GFM) features to make the editor fully compatible with GitHub's markdown syntax and rendering.

## Priority
High - GitHub markdown is the most widely used markdown flavor

## Current Status
- Basic markdown features supported (headings, bold, italic, code blocks, lists, task lists)
- Missing several key GitHub-specific features

## GitHub Features to Implement

### Priority 1: Tables ⏳
**Status:** Not Started
**Complexity:** Medium-High

Add support for GitHub-style tables:
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
```

**Features:**
- Table parsing and rendering
- Column alignment support (`:---`, `:---:`, `---:`)
- Live preview table rendering
- Interactive table editing (cursor in cell shows raw markdown)

**Implementation:**
1. Add table detection in syntax tree
2. Create TableWidget for rendering
3. Parse table structure (headers, separators, rows, cells)
4. Apply styling (borders, padding, alignment)
5. Handle cursor-in-table behavior (show raw when editing)

---

### Priority 2: GitHub Alerts/Admonitions ⏳
**Status:** Not Started
**Complexity:** Medium

Add support for GitHub alert blocks:
```markdown
> [!NOTE]
> Useful information that users should know

> [!TIP]
> Helpful advice for doing things better

> [!IMPORTANT]
> Key information users need to know

> [!WARNING]
> Urgent info that needs immediate attention

> [!CAUTION]
> Advises about risks or negative outcomes
```

**Features:**
- Parse blockquote with `[!TYPE]` syntax
- Render with appropriate colors/icons
- 5 alert types: NOTE, TIP, IMPORTANT, WARNING, CAUTION

**Implementation:**
1. Extend blockquote handler to detect `[!TYPE]` pattern
2. Create AlertWidget or enhanced blockquote decoration
3. Add theme colors for each alert type
4. Add icons (optional) for visual distinction
5. Style title and content differently

**Theme Colors (GitHub style):**
- NOTE: Blue (#0969da)
- TIP: Green (#1a7f37)
- IMPORTANT: Purple (#8250df)
- WARNING: Orange (#9a6700)
- CAUTION: Red (#d1242f)

---

### Priority 3: Images ⏳
**Status:** Not Started
**Complexity:** Medium

Add support for image rendering:
```markdown
![alt text](image-url)
![alt text](./relative/path.png)
```

**Features:**
- Parse image syntax
- Render images inline
- Show alt text when image fails to load
- Support relative and absolute paths
- Support http/https URLs

**Implementation:**
1. Detect Image node in syntax tree
2. Create ImageWidget for rendering
3. Handle image loading and errors
4. Scale images appropriately
5. Show raw syntax when cursor is on image

---

### Priority 4: Horizontal Rules ⏳
**Status:** Not Started
**Complexity:** Low

Add support for horizontal rules:
```markdown
---
***
___
```

**Implementation:**
1. Detect HorizontalRule node
2. Apply styling (border, spacing)
3. Use theme colors for line

---

### Priority 5: HTML Tag Support ⏳
**Status:** Not Started
**Complexity:** Medium

Add support for common HTML tags:
- `<sub>subscript</sub>`
- `<sup>superscript</sup>`
- `<ins>underline</ins>`
- `<kbd>keyboard</kbd>`
- `<details><summary>...</summary>...</details>`

**Implementation:**
1. Extend markdown parser to recognize HTML tags
2. Create widgets or decorations for each tag type
3. Handle nested content
4. Apply appropriate styling

---

### Priority 6: Footnotes ⏳
**Status:** Not Started
**Complexity:** Medium

Add support for footnotes:
```markdown
Here's a sentence with a footnote[^1].

[^1]: This is the footnote.
```

**Implementation:**
1. Parse footnote references `[^1]`
2. Parse footnote definitions `[^1]: text`
3. Link references to definitions
4. Render footnotes at bottom or inline
5. Make footnote numbers clickable

---

### Priority 7: Emoji Support ⏳
**Status:** Not Started
**Complexity:** Low-Medium

Add support for emoji shortcodes:
```markdown
:smile: :heart: :rocket:
```

**Implementation:**
1. Parse `:emoji-name:` syntax
2. Replace with Unicode emoji characters
3. Add emoji autocomplete (optional)
4. Use GitHub emoji list

---

## Implementation Order

**Phase 1 (Immediate):**
1. Tables - Most requested feature
2. GitHub Alerts - High visual impact

**Phase 2 (Near-term):**
3. Images - Common in documentation
4. Horizontal Rules - Easy quick win

**Phase 3 (Future):**
5. HTML Tags - Power user feature
6. Footnotes - Advanced feature
7. Emoji - Nice to have

## Testing Requirements

For each feature:
1. Create test markdown files in `specs/`
2. Test in all three modes (Live Preview, Source, Reading)
3. Test cursor behavior (show raw syntax when editing)
4. Test with nested structures
5. Verify theme compatibility (light/dark modes)

## Success Criteria

- ✅ All GitHub markdown features render correctly
- ✅ Editing experience matches Obsidian/GitHub expectations
- ✅ No performance degradation
- ✅ Works in all editor modes
- ✅ Theme colors match GitHub's style

## Related Files

- `webview/editors/livePreviewMode.ts` - Main decoration logic
- `webview/themes/vscode-light.ts` - Theme colors
- `webview/themes/vscode-dark.ts` - Dark theme colors
- `webview/themes/index.ts` - Theme interface

## Notes

- Prioritize features based on user demand
- GitHub markdown is the de-facto standard
- These features will significantly improve documentation editing
- Consider performance impact of complex widgets
