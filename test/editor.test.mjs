import { describe, it, expect } from "vitest";
import {
  editorKeys,
  appendKey,
  visibleTail,
  settingLine,
  EDIT_LINE_CHARS,
  ROW_CHARS,
} from "../lib/editor.js";
import { LANGUAGES, uiTexts } from "../lib/i18n/index.js";
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
  it("keeps every settings row on one line in every language", () => {
    expect(settingLine("Site", "https://universalbicycle.team")).toBe(
      "Site: universalbicycle.team"
    );
    const longest = {
      race: "9".repeat(10),
      bib: "B".repeat(32),
      site: "https://" + "a".repeat(119),
    };
    for (const language of LANGUAGES) {
      const ui = uiTexts(language);
      for (const [name, value] of Object.entries(longest)) {
        const line = settingLine(ui[name], value);
        expect(line.length, `${language} ${line}`).toBeLessThanOrEqual(ROW_CHARS);
        expect(line.startsWith(ui[name] + ": "), line).toBe(true);
      }
    }
  });
});
