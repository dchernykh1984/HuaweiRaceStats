import { describe, it, expect } from "vitest";
import { LABELS } from "../lib/i18n/labels.js";
import { UI, UI_KEYS } from "../lib/i18n/ui.js";
import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  labelFor,
  resolveLanguage,
  uiTexts,
} from "../lib/i18n/index.js";
import { METRICS } from "../lib/metrics.js";

// The on-watch label budget: a row header longer than this is truncated on the
// 466x466 screen. Kept in step with the labels the Garmin field ships.
const MAX_LABEL = 12;

describe("locale completeness", () => {
  it("includes the default language", () => {
    expect(LANGUAGES).toContain(DEFAULT_LANGUAGE);
  });

  it("defines exactly the metric catalogue in every language", () => {
    for (const lang of LANGUAGES) {
      expect(LABELS[lang].split("|"), lang).toHaveLength(METRICS.length);
    }
  });

  it("has a non-empty label within budget for every metric in every language", () => {
    for (const lang of LANGUAGES) {
      for (const metric of METRICS) {
        const label = labelFor(lang, metric);
        expect(typeof label, `${lang}/${metric}`).toBe("string");
        expect(label.length, `${lang}/${metric} '${label}'`).toBeGreaterThan(0);
        expect(label.length, `${lang}/${metric} '${label}'`).toBeLessThanOrEqual(MAX_LABEL);
      }
    }
  });
});

describe("resolveLanguage", () => {
  it("maps a device locale to a supported 2-letter language", () => {
    expect(resolveLanguage("ru-RU")).toBe("ru");
    expect(resolveLanguage("en_US")).toBe("en");
    expect(resolveLanguage("kk-KZ")).toBe("kk");
    expect(resolveLanguage("de")).toBe("de");
  });

  it("falls back to the default for unknown or empty locales", () => {
    expect(resolveLanguage("ja-JP")).toBe(DEFAULT_LANGUAGE);
    expect(resolveLanguage("")).toBe(DEFAULT_LANGUAGE);
    expect(resolveLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
  });
});

describe("labelFor", () => {
  it("returns the localized label for a supported language", () => {
    expect(labelFor("en", "place_abs")).toBe("Place abs");
    expect(labelFor("en", "qty_next_pack_abs")).toBe("Size bhd pk");
    expect(labelFor("ru", "place_abs")).toBe(LABELS.ru.split("|")[0]);
    expect(labelFor("kk", "laps")).toBe(LABELS.kk.split("|")[METRICS.indexOf("laps")]);
  });

  it("falls back to English, then to the raw key", () => {
    expect(labelFor("ja", "laps")).toBe("Laps");
    expect(labelFor("en", "not_a_metric")).toBe("not_a_metric");
  });
});

// Settings-screen words per key: buttons share a 180 px control, row prefixes sit
// before a value, titles and messages fill a 360 px row.
const UI_BUDGETS = {
  ...Object.fromEntries(["save", "cancel", "erase", "clear", "done", "back"].map((k) => [k, 12])),
  ...Object.fromEntries(["race", "bib", "site", "fields", "field"].map((k) => [k, 10])),
  ...Object.fromEntries(
    ["title", "metric", "siteUrl", "raceId", "bibNumber", "saving"].map((k) => [k, 22])
  ),
  ...Object.fromEntries(["badSite", "badRace", "badBib", "saveFailed"].map((k) => [k, 30])),
};

describe("settings screen words", () => {
  it("are translated for every metric language within their budgets", () => {
    expect(Object.keys(UI).sort()).toEqual([...LANGUAGES].sort());
    expect([...UI_KEYS].sort()).toEqual(Object.keys(UI_BUDGETS).sort());
    for (const lang of LANGUAGES) {
      expect(UI[lang].split("|"), lang).toHaveLength(UI_KEYS.length);
      const texts = uiTexts(lang);
      for (const [key, budget] of Object.entries(UI_BUDGETS)) {
        const text = texts[key];
        expect(text.length, `${lang}/${key}`).toBeGreaterThan(0);
        expect(text.length, `${lang}/${key} '${text}'`).toBeLessThanOrEqual(budget);
      }
    }
  });

  it("fall back to English for an unsupported language", () => {
    expect(uiTexts("ja")).toEqual(uiTexts("en"));
    expect(uiTexts("en").save).toBe("Save");
    expect(uiTexts("ru").save).not.toBe("Save");
  });
});
