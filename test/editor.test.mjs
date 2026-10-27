import { describe, it, expect } from "vitest";
import { editorKeys, appendKey, visibleTail, EDIT_LINE_CHARS } from "../lib/editor.js";
import { MAX_STORED_LENGTH } from "../lib/config.js";
import { validSiteUrl } from "../lib/request-url.js";

describe("watch keyboard", () => {
  it("provides numeric race IDs, alphanumeric bibs and URL punctuation", () => {
    expect(editorKeys("competitionId").join("")).toBe("0123456789");
    expect(editorKeys("siteUrl")).toContain(":");
    expect(editorKeys("bib")).toContain("A");
    expect(appendKey("12", "a", "competitionId")).toBe("12");
    expect(appendKey("12", "3", "competitionId")).toBe("123");
    expect(appendKey("a".repeat(MAX_STORED_LENGTH), "b", "siteUrl")).toHaveLength(
      MAX_STORED_LENGTH
    );
  });
  it("keeps the end of a long value, where typing happens, on the edit line", () => {
    expect(visibleTail("259")).toBe("259");
    const url = "https://universalbicycle.team/results";
    expect(visibleTail(url)).toHaveLength(EDIT_LINE_CHARS);
    expect(visibleTail(url)).toBe("..." + url.slice(-(EDIT_LINE_CHARS - 3)));
  });
  it("offers only URL keys that can appear in a valid site URL", () => {
    for (const key of editorKeys("siteUrl"))
      expect(validSiteUrl("https://example.org/a" + key), key).toBe(true);
  });
});
