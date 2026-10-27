import {
  DEFAULT_SITE_URL,
  DEFAULT_COMPETITION_ID,
  DEFAULT_BIB,
  resolveRowMetrics,
} from "./settings.js";
import { MAX_ROWS, METRICS } from "./metrics.js";
import { buildRequestUrl, validSiteUrl } from "./request-url.js";

// Lite @system.storage keeps a value only when it is under 128 bytes, so every
// setting is stored under its own key and no value may reach this length.
export const MAX_STORED_LENGTH = 127;

export function defaultConfig() {
  const config = {
    siteUrl: DEFAULT_SITE_URL,
    competitionId: DEFAULT_COMPETITION_ID,
    bib: DEFAULT_BIB,
    rowCount: "4",
  };
  for (let i = 0; i < MAX_ROWS; i++) config["rowMetric" + i] = String(i);
  return config;
}

// Missing keys read back as "" and keep their defaults.
export function parseConfig(stored) {
  const defaults = defaultConfig();
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return defaults;
  const keys = Object.keys(defaults);
  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    if (typeof stored[key] === "string" && stored[key] !== "") defaults[key] = stored[key];
  }
  if (
    configError(defaults) ||
    !buildRequestUrl(defaults.siteUrl, defaults.competitionId, defaults.bib)
  ) {
    return defaultConfig();
  }
  defaults.rowCount = String(resolveRowMetrics(defaults).length);
  for (let i = 0; i < MAX_ROWS; i++) {
    const index = Number(defaults["rowMetric" + i]);
    if (!Number.isInteger(index) || index < 0 || index >= METRICS.length) {
      defaults["rowMetric" + i] = String(i);
    }
  }
  return defaults;
}

// Whether two settings poll the same rider; only then may standings carry over.
export function sameRider(a, b) {
  return a.siteUrl === b.siteUrl && a.competitionId === b.competitionId && a.bib === b.bib;
}

// The UI text key of the first invalid setting, or "" when the rider is valid.
export function configError(config) {
  if (!validSiteUrl(config.siteUrl)) return "badSite";
  if (
    !config.competitionId ||
    !Number.isSafeInteger(Number(config.competitionId)) ||
    Number(config.competitionId) < 1
  )
    return "badRace";
  for (let i = 0; i < config.competitionId.length; i++) {
    const code = config.competitionId.charCodeAt(i);
    if (code < 48 || code > 57) return "badRace";
  }
  if (!config.bib.trim()) return "badBib";
  return "";
}

// Read every setting through get(key, done(value)) one key at a time.
export function loadConfig(get, done) {
  const keys = Object.keys(defaultConfig());
  const stored = {};
  function next(i) {
    if (i === keys.length) {
      done(parseConfig(stored));
      return;
    }
    get(keys[i], (value) => {
      stored[keys[i]] = value;
      next(i + 1);
    });
  }
  next(0);
}

// Write every setting through set(key, value, done(ok)), stopping at the first
// failure. shortcut: writes are not atomic, so a failed Save can leave a mix of
// old and new values until the next successful Save; a Lite watch has no batch write.
export function saveConfig(config, set, done) {
  const keys = Object.keys(defaultConfig());
  function next(i) {
    if (i === keys.length) {
      done(true);
      return;
    }
    set(keys[i], String(config[keys[i]]), (ok) => (ok ? next(i + 1) : done(false)));
  }
  next(0);
}
