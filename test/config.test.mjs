import { describe, it, expect } from "vitest";
import {
  defaultConfig,
  parseConfig,
  configError,
  loadConfig,
  saveConfig,
  MAX_STORED_LENGTH,
} from "../lib/config.js";
import { appendKey } from "../lib/editor.js";
import { uiTexts } from "../lib/i18n/index.js";

// The documented Lite @system.storage limits: a key of at most 32 characters
// without \/"*+,:;<=>?[]| and a value under 128 bytes.
function liteStorage(failAt = -1) {
  const values = {};
  let writes = 0;
  return {
    values,
    get: (key, done) => done(Object.prototype.hasOwnProperty.call(values, key) ? values[key] : ""),
    set(key, value, done) {
      const validKey = key.length <= 32 && !/[\\/"*+,:;<=>?[\]|]/.test(key);
      if (writes++ === failAt || !validKey || Buffer.byteLength(value) >= 128) return done(false);
      values[key] = value;
      done(true);
    },
  };
}

describe("persisted watch settings", () => {
  it("supplies the demo and distinct field defaults", () => {
    expect(defaultConfig()).toMatchObject({
      competitionId: "259",
      bib: "1",
      rowMetric0: "0",
      rowMetric9: "9",
    });
  });
  it("recovers from missing and invalid stored settings", () => {
    for (const value of [null, "{", [], {}, { siteUrl: "file:///tmp/a" }])
      expect(parseConfig(value)).toEqual(defaultConfig());
    expect(parseConfig({ rowCount: "200", rowMetric0: "999", extra: "ignored" })).toMatchObject({
      rowCount: "10",
      rowMetric0: "0",
    });
    expect(parseConfig({ bib: "42", competitionId: "" })).toMatchObject({
      bib: "42",
      competitionId: "259",
    });
  });
  it("validates the user's site, race and bib before saving", () => {
    const config = defaultConfig();
    expect(configError(config)).toBe("");
    expect(configError({ ...config, siteUrl: "javascript:bad" })).not.toBe("");
    expect(configError({ ...config, siteUrl: "https://user:password@example.org" })).not.toBe("");
    expect(configError({ ...config, competitionId: "0" })).not.toBe("");
    expect(configError({ ...config, bib: " " })).not.toBe("");
    for (const bad of [{ siteUrl: "x" }, { competitionId: "x" }, { bib: "" }])
      expect(uiTexts("en")).toHaveProperty(configError({ ...config, ...bad }));
  });
});

describe("Lite storage round trip", () => {
  it("starts from the defaults on a fresh watch", () => {
    let loaded;
    loadConfig(liteStorage().get, (config) => (loaded = config));
    expect(loaded).toEqual(defaultConfig());
  });
  it("stores the longest settings the keyboard allows within the Lite limits", () => {
    let siteUrl = "https://example.org/";
    while (appendKey(siteUrl, "a", "siteUrl") !== siteUrl)
      siteUrl = appendKey(siteUrl, "a", "siteUrl");
    expect(siteUrl).toHaveLength(MAX_STORED_LENGTH);
    const config = {
      ...defaultConfig(),
      siteUrl,
      bib: "B".repeat(32),
      rowCount: "9",
      rowMetric8: "18",
    };
    const storage = liteStorage();
    let saved;
    let loaded;
    saveConfig(config, storage.set, (ok) => (saved = ok));
    loadConfig(storage.get, (value) => (loaded = value));
    expect(saved).toBe(true);
    expect(loaded).toEqual(config);
  });
  it("reports the first failed write and stops writing", () => {
    const storage = liteStorage(2);
    let saved;
    saveConfig({ ...defaultConfig(), bib: "77" }, storage.set, (ok) => (saved = ok));
    expect(saved).toBe(false);
    expect(Object.keys(storage.values)).toEqual(["siteUrl", "competitionId"]);
  });
});
