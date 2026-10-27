import { afterEach, describe, expect, it, vi } from "vitest";
import seed from "../../data/seed.json";
import type { ActionItem } from "../lib/types";
import { CSV_HEADER, formatActionItemsCsv } from "./exportCsv";

afterEach(() => vi.unstubAllEnvs());

describe("selected workspace CSV", () => {
  it("escapes commas, quotes and embedded newlines with CRLF record boundaries", () => {
    expect(
      formatActionItemsCsv(
        seed.actionItems as ActionItem[],
        ["item-1", "item-2"],
        "team-alpha",
      ),
    ).toBe(
      `${CSV_HEADER}\r\nitem-1,"Fix login, session, and ""auth"" timeout",Alex Morgan,In progress,team-alpha\r\nitem-2,"Update Q4 roadmap,\nmetrics, and goals",Sam Rivera,To do,team-alpha\r\n`,
    );
  });
  it("exports only selected rows in the authorized workspace, without duplicating IDs", () => {
    const csv = formatActionItemsCsv(
      seed.actionItems as ActionItem[],
      ["item-1", "item-1", "item-3"],
      "team-alpha",
    );
    expect(csv).toContain("item-1,");
    expect(csv).not.toContain("item-2,");
    expect(csv).not.toContain("restricted-org");
    expect(csv.match(/item-1,/g)).toHaveLength(1);
  });
  it("exposes the deliberate empty-export fault only when explicitly enabled", () => {
    vi.stubEnv("SIMULATE_EMPTY_CSV_FAULT", "true");
    expect(
      formatActionItemsCsv(
        seed.actionItems as ActionItem[],
        ["item-1"],
        "team-alpha",
      ),
    ).toBe(`${CSV_HEADER}\r\n`);
  });
  it("exports a title with embedded newlines correctly quoted", () => {
    const items: ActionItem[] = [
      {
        id: "item-ml",
        workspace_id: "team-alpha",
        title: "Line1\nLine2",
        owner: "Alice",
        status: "To do",
      },
    ];
    const csv = formatActionItemsCsv(items, ["item-ml"], "team-alpha");
    expect(csv).toContain('"Line1\nLine2"');
    expect(csv).toMatch(/^id,title,owner,status,workspace_id\r\n/);
  });
  it("exports a title with CRLF embedded newlines correctly quoted", () => {
    const items: ActionItem[] = [
      {
        id: "item-crlf",
        workspace_id: "team-alpha",
        title: "First\r\nSecond",
        owner: "Bob",
        status: "To do",
      },
    ];
    const csv = formatActionItemsCsv(items, ["item-crlf"], "team-alpha");
    expect(csv).toContain('"First\r\nSecond"');
  });
  it("long single-line title is exported without truncation", () => {
    const longTitle = "A".repeat(180);
    const items: ActionItem[] = [
      {
        id: "item-long",
        workspace_id: "team-alpha",
        title: longTitle,
        owner: "Carol",
        status: "Done",
      },
    ];
    const csv = formatActionItemsCsv(items, ["item-long"], "team-alpha");
    expect(csv).toContain(longTitle);
  });
  it("single-line titles remain unquoted when no special chars", () => {
    const items: ActionItem[] = [
      {
        id: "item-plain",
        workspace_id: "team-alpha",
        title: "Simple title",
        owner: "Dave",
        status: "Done",
      },
    ];
    const csv = formatActionItemsCsv(items, ["item-plain"], "team-alpha");
    expect(csv).toContain("item-plain,Simple title,Dave,Done,team-alpha");
  });
});
