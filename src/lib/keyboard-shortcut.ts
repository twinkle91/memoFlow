/**
 * Pure factory that creates the Cmd+K / Ctrl+K keyboard handler for the
 * MemoFlow search shortcut. Keeping the logic in a separate module makes it
 * straightforward to test without a browser or jsdom environment.
 */

export type SearchShortcutDeps = {
  /** Returns the search <input> element (or null before mount). */
  getSearchElement: () => { focus(): void } | null;
  /** Returns the currently focused element (e.g. document.activeElement). */
  getActiveElement: () => {
    tagName?: string;
    isContentEditable?: boolean;
  } | null;
};

/**
 * Returns a `keydown` handler that focuses the search input on Cmd+K /
 * Ctrl+K, unless the key is pressed while a different editable element
 * (textarea, input, contenteditable) has focus.
 */
export function makeSearchShortcutHandler(deps: SearchShortcutDeps) {
  return function handleKeyDown(e: {
    metaKey: boolean;
    ctrlKey: boolean;
    key: string;
    preventDefault(): void;
  }): void {
    if (!((e.metaKey || e.ctrlKey) && e.key === "k")) return;

    const searchEl = deps.getSearchElement();
    const active = deps.getActiveElement();

    // Skip if another editable element currently has focus.
    if (active && active !== (searchEl as unknown)) {
      const tag = (active.tagName ?? "").toLowerCase();
      if (tag === "textarea") return;
      if (tag === "input") return;
      if (active.isContentEditable) return;
    }

    e.preventDefault();
    searchEl?.focus();
  };
}
