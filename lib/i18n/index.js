// Localized metric labels and settings words: resolve the device language to a
// supported one and look up a text, falling back to English (and a label to the
// raw metric key) so the watch always renders something. Pure and unit tested.
import { LABELS } from "./labels.js";
import { UI, UI_KEYS } from "./ui.js";
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
  // split, not replace: Lite JerryScript has no RegExp, so replace does not exist.
  const primary = String(locale).toLowerCase().split("_")[0].split("-")[0];
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

// Every settings-screen word in the given language, English where one is missing.
export function uiTexts(language) {
  const lang = Object.prototype.hasOwnProperty.call(UI, language) ? language : DEFAULT_LANGUAGE;
  const words = UI[lang].split("|");
  const english = UI[DEFAULT_LANGUAGE].split("|");
  const texts = {};
  for (let i = 0; i < UI_KEYS.length; i++) texts[UI_KEYS[i]] = words[i] || english[i];
  return texts;
}
