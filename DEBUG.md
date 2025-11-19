# Debug Instructions

The extension now has detailed logging. Here's how to see what's happening:

## Steps to Debug

### 1. Open Developer Tools
After pressing F5 and opening a markdown file:

1. In the **Extension Development Host** window (the new window that opened)
2. Go to **Help** → **Toggle Developer Tools**
3. Click the **Console** tab

### 2. Check for Debug Messages

You should see messages like:
```
[Webview] Script loaded at 2025-11-19T...
[Webview] VS Code API acquired
[Webview] Document readyState: loading
[Webview] DOMContentLoaded fired
[Webview] initializeEditor called
[Webview] Editor container found
[Webview] Initial mode: livePreview theme: dark
[Webview] Creating EditorState...
[Webview] EditorState created, creating EditorView...
[Webview] EditorView created successfully!
[Webview] Ready message sent
```

### 3. If You See Errors

**If script doesn't load at all:**
```
(No messages in console)
```
→ Script path issue or CSP blocking

**If you see "Script loaded" but then nothing:**
```
[Webview] Script loaded at...
(nothing after)
```
→ JavaScript parsing error

**If you see up to "Creating EditorState" then stops:**
```
[Webview] Creating EditorState...
TypeError: ...
```
→ CodeMirror dependency issue

**If you see "Editor container not found":**
```
[Webview] Editor container not found!
```
→ HTML/DOM issue

### 4. Share the Output

Copy and paste the **exact console output** from Developer Tools.

## Alternative: Check Output Panel

1. In Extension Development Host window
2. **View** → **Output**
3. Select **"Fabriqa Markdown Editor"** from dropdown
4. Look for logs like:
```
[INFO] Opening custom editor for /path/to/file.md
[INFO] Webview ready
```

## Quick Test Now

1. Press **F5** in VS Code
2. In new window, open **TEST.md** (click in FABRIQA sidebar)
3. **Help** → **Toggle Developer Tools**
4. Look at **Console** tab
5. Copy and share what you see

The debug logs will tell us exactly where it's failing!
