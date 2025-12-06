// Canvas context for measuring text width - created lazily
let measureContext: CanvasRenderingContext2D | null = null;
let currentFont: string = '';

/**
 * Get or create the measurement canvas context
 */
function getMeasureContext(font: string): CanvasRenderingContext2D {
    if (!measureContext) {
        const canvas = document.createElement('canvas');
        measureContext = canvas.getContext('2d')!;
    }

    // Update font if changed
    if (currentFont !== font) {
        currentFont = font;
        measureContext.font = font;
    }

    return measureContext;
}

/**
 * Get the computed font from the editor
 */
export function getEditorFont(): string {
    // Try to get font from CodeMirror editor
    const cmContent = document.querySelector('.cm-content');
    if (cmContent) {
        const style = window.getComputedStyle(cmContent);
        return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    }

    // Fallback to a reasonable monospace default
    return '14px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
}

/**
 * Measure the actual pixel width of a string using the editor's font
 */
export function measureTextWidth(str: string, font?: string): number {
    const useFont = font || getEditorFont();
    const ctx = getMeasureContext(useFont);
    return ctx.measureText(str).width;
}

/**
 * Calculate the visual width of a string in character units
 * Uses actual font metrics to account for proportional fonts
 * Returns width normalized to space character width
 */
export function getVisualWidth(str: string, font?: string): number {
    if (!str) return 0;

    const useFont = font || getEditorFont();
    const ctx = getMeasureContext(useFont);

    // Measure the string width
    const textWidth = ctx.measureText(str).width;

    // Measure a space character for normalization
    const spaceWidth = ctx.measureText(' ').width;

    // Return width in "space units" (rounded up to ensure enough padding)
    return Math.ceil(textWidth / spaceWidth);
}

/**
 * Pad a string to a target visual width with spaces
 * Uses actual font metrics for accurate padding
 */
export function padString(str: string, targetWidth: number, font?: string): string {
    const currentWidth = getVisualWidth(str, font);
    if (currentWidth >= targetWidth) {
        return str;
    }
    return str + ' '.repeat(targetWidth - currentWidth);
}

/**
 * Alternative: Pad string to match a target pixel width
 * More accurate for proportional fonts
 * Uses iterative approach to find the exact number of spaces needed
 */
export function padStringToPixelWidth(str: string, targetPixelWidth: number, font?: string): string {
    const useFont = font || getEditorFont();
    const ctx = getMeasureContext(useFont);

    const currentWidth = ctx.measureText(str).width;
    if (currentWidth >= targetPixelWidth) {
        return str;
    }

    const spaceWidth = ctx.measureText(' ').width;

    // Start with an estimate
    let spacesNeeded = Math.floor((targetPixelWidth - currentWidth) / spaceWidth);

    // Iteratively add spaces until we reach or exceed target width
    let result = str + ' '.repeat(spacesNeeded);
    let resultWidth = ctx.measureText(result).width;

    // Add more spaces if needed (should usually only add 0-1 more)
    while (resultWidth < targetPixelWidth) {
        spacesNeeded++;
        result = str + ' '.repeat(spacesNeeded);
        resultWidth = ctx.measureText(result).width;
    }

    return result;
}

/**
 * Get the pixel width of a string with current font
 */
export function getPixelWidth(str: string, font?: string): number {
    if (!str) return 0;
    const useFont = font || getEditorFont();
    const ctx = getMeasureContext(useFont);
    return ctx.measureText(str).width;
}

/**
 * Strip markdown syntax from a string to get "rendered" text
 * Used for calculating visual width in Live Preview mode
 */
export function stripMarkdownSyntax(str: string): string {
    if (!str) return '';

    let result = str;

    // Bold: **text** or __text__
    result = result.replace(/\*\*(.+?)\*\*/g, '$1');
    result = result.replace(/__(.+?)__/g, '$1');

    // Italic: *text* or _text_ (but not inside words)
    result = result.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '$1');
    result = result.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '$1');

    // Strikethrough: ~~text~~
    result = result.replace(/~~(.+?)~~/g, '$1');

    // Inline code: `text`
    result = result.replace(/`([^`]+)`/g, '$1');

    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Images: ![alt](url)
    result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

    return result;
}

/**
 * Get the pixel width of rendered text (stripping markdown syntax)
 */
export function getRenderedPixelWidth(str: string, font?: string): number {
    const renderedStr = stripMarkdownSyntax(str);
    return getPixelWidth(renderedStr, font);
}

/**
 * Get the pixel width of a space character in current font
 */
export function getSpacePixelWidth(font?: string): number {
    const useFont = font || getEditorFont();
    const ctx = getMeasureContext(useFont);
    return ctx.measureText(' ').width;
}
