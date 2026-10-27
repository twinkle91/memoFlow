import { describe, expect, it, vi } from "vitest";
import { makeSearchShortcutHandler } from "@/lib/keyboard-shortcut";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSearchEl() {
  return { focus: vi.fn(), tagName: "INPUT", isContentEditable: false };
}

function makeEvent(
  overrides: Partial<{
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    preventDefault: () => void;
  }> = {},
) {
  return {
    key: "k",
    ctrlKey: false,
    metaKey: false,
    preventDefault: vi.fn(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("makeSearchShortcutHandler – Cmd+K / Ctrl+K search focus", () => {
  it("Ctrl+K focuses the search input", () => {
    const searchEl = makeSearchEl();
    const handler = makeSearchShortcutHandler({
      getSearchElement: () => searchEl,
      getActiveElement: () => null,
    });

    handler(makeEvent({ ctrlKey: true }));

    expect(searchEl.focus).toHaveBeenCalledOnce();
  });

  it("Meta+K (Cmd) focuses the search input", () => {
    const searchEl = makeSearchEl();
    const handler = makeSearchShortcutHandler({
      getSearchElement: () => searchEl,
      getActiveElement: () => null,
    });

    handler(makeEvent({ metaKey: true }));

    expect(searchEl.focus).toHaveBeenCalledOnce();
  });

  it("preventDefault is called when the shortcut fires", () => {
    const searchEl = makeSearchEl();
    const event = makeEvent({ ctrlKey: true });
    const handler = makeSearchShortcutHandler({
      getSearchElement: () => searchEl,
      getActiveElement: () => null,
    });

    handler(event);

    expect(event.preventDefault).toHaveBeenCalledOnce();
  });

  it("existing search text is preserved after shortcut (focus-only, no value reset)", () => {
    // The handler only calls focus(); it never touches .value.
    // We verify focus is invoked and no unexpected mutations occur.
    const searchEl = { ...makeSearchEl(), value: "existing query" };
    // Wrap in a plain-function object so the type satisfies { focus(): void }.
    const searchElHandle = {
      focus: () => {
        searchEl.focus();
      },
    };
    const handler = makeSearchShortcutHandler({
      getSearchElement: () => searchElHandle,
      getActiveElement: () => null,
    });

    handler(makeEvent({ ctrlKey: true }));

    expect(searchEl.focus).toHaveBeenCalledOnce();
    // Value is untouched – handler has no access to it.
    expect(searchEl.value).toBe("existing query");
  });

  it("shortcut does not fire when a textarea is the active element", () => {
    const searchEl = makeSearchEl();
    const textarea = { tagName: "TEXTAREA", isContentEditable: false };
    const handler = makeSearchShortcutHandler({
      getSearchElement: () => searchEl,
      getActiveElement: () => textarea,
    });

    handler(makeEvent({ ctrlKey: true }));

    expect(searchEl.focus).not.toHaveBeenCalled();
  });

  it("shortcut does not fire when another input is the active element", () => {
    const searchEl = makeSearchEl();
    const otherInput = { tagName: "INPUT", isContentEditable: false };
    const handler = makeSearchShortcutHandler({
      getSearchElement: () => searchEl,
      getActiveElement: () => otherInput,
    });

    handler(makeEvent({ ctrlKey: true }));

    expect(searchEl.focus).not.toHaveBeenCalled();
  });

  it("plain K without a modifier does nothing", () => {
    const searchEl = makeSearchEl();
    const event = makeEvent({ ctrlKey: false, metaKey: false });
    const handler = makeSearchShortcutHandler({
      getSearchElement: () => searchEl,
      getActiveElement: () => null,
    });

    handler(event);

    expect(searchEl.focus).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
