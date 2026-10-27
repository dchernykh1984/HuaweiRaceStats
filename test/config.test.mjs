import { describe, it, expect } from "vitest";
import { defaultConfig, parseConfig, configError } from "../lib/config.js";

describe("persisted watch settings", () => {
  it("supplies the demo and distinct field defaults", () => {
    expect(defaultConfig()).toMatchObject({
      competitionId: "259",
      bib: "1",
      rowMetric0: "0",
      rowMetric9: "9",
    });
  });
  it("recovers from corrupt, missing and invalid stored settings", () => {
    for (const value of [null, "{", "[]", '{"siteUrl":"file:///tmp/a"}'])
      expect(parseConfig(value)).toEqual(defaultConfig());
    expect(parseConfig('{"rowCount":"200","rowMetric0":"999","extra":"ignored"}')).toMatchObject({
      rowCount: "10",
      rowMetric0: "0",
    });
    expect(parseConfig('{"bib":"42"}').bib).toBe("42");
  });
  it("validates the user's site, race and bib before saving", () => {
    const config = defaultConfig();
    expect(configError(config)).toBe("");
    expect(configError({ ...config, siteUrl: "javascript:bad" })).not.toBe("");
    expect(configError({ ...config, siteUrl: "https://user:password@example.org" })).not.toBe("");
    expect(configError({ ...config, competitionId: "0" })).not.toBe("");
    expect(configError({ ...config, bib: " " })).not.toBe("");
  });
});
