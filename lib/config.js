import {
  DEFAULT_SITE_URL,
  DEFAULT_COMPETITION_ID,
  DEFAULT_BIB,
  resolveRowMetrics,
} from "./settings.js";
import { MAX_ROWS, METRICS } from "./metrics.js";
import { buildRequestUrl, validSiteUrl } from "./request-url.js";

export const CONFIG_KEY = "raceStatsConfig";

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

export function parseConfig(value) {
  const defaults = defaultConfig();
  try {
    const stored = typeof value === "string" ? JSON.parse(value) : value;
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return defaults;
    const keys = Object.keys(defaults);
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      if (typeof stored[key] === "string") defaults[key] = stored[key];
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
  } catch {
    return defaults;
  }
}

export function configError(config) {
  if (!validSiteUrl(config.siteUrl)) return "Enter an http:// or https:// site URL";
  if (
    !config.competitionId ||
    !Number.isSafeInteger(Number(config.competitionId)) ||
    Number(config.competitionId) < 1
  )
    return "Race ID must be a positive number";
  for (let i = 0; i < config.competitionId.length; i++) {
    const code = config.competitionId.charCodeAt(i);
    if (code < 48 || code > 57) return "Race ID must be a positive number";
  }
  if (!config.bib.trim()) return "Enter a bib number";
  return "";
}
