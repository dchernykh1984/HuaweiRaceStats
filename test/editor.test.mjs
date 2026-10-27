import { describe, it, expect } from "vitest";
import { editorKeys, appendKey } from "../lib/editor.js";

describe("watch keyboard", () => {
  it("provides numeric race IDs, alphanumeric bibs and URL punctuation", () => {
    expect(editorKeys("competitionId").join("")).toBe("0123456789");
    expect(editorKeys("siteUrl")).toContain(":");
    expect(editorKeys("bib")).toContain("A");
    expect(appendKey("12", "a", "competitionId")).toBe("12");
    expect(appendKey("12", "3", "competitionId")).toBe("123");
    expect(appendKey("a".repeat(240), "b", "siteUrl")).toHaveLength(240);
  });
});
