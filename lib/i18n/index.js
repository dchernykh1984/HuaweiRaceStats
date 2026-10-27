// Localized metric labels: resolve the device language to a supported one and
// look up a label, falling back to English and then the raw metric key so a row
// always renders something. Pure and unit tested.
import { LABELS } from "./labels.js";
import { METRICS } from "../metrics.js";

export const DEFAULT_LANGUAGE = "en";

// Every language that has a label table.
export const LANGUAGES = Object.keys(LABELS);

// Map a device locale ("ru-RU", "en_US", "de") to a supported 2-letter language,
// or the default when it is unknown or empty.
export function resolveLanguage(locale) {
  if (!locale) {
    return DEFAULT_LANGUAGE;
  }
  const primary = String(locale).toLowerCase().replace("_", "-").split("-")[0];
  return Object.prototype.hasOwnProperty.call(LABELS, primary) ? primary : DEFAULT_LANGUAGE;
}

// One language's labels in METRICS order, split once per language change.
let splitLanguage = "";
let splitLabels = [];
function labelsOf(language) {
  if (language !== splitLanguage) {
    splitLanguage = language;
    splitLabels = LABELS[language].split("|");
  }
  return splitLabels;
}

// The localized label for a metric in the given language, falling back to English
// and then to the raw key.
export function labelFor(language, metric) {
  const lang = Object.prototype.hasOwnProperty.call(LABELS, language) ? language : DEFAULT_LANGUAGE;
  const index = METRICS.indexOf(metric);
  if (index < 0) {
    return metric;
  }
  return labelsOf(lang)[index] || LABELS[DEFAULT_LANGUAGE].split("|")[index] || metric;
}
