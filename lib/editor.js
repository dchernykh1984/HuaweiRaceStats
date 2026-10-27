import { MAX_STORED_LENGTH } from "./config.js";

// No "?" or "#": a site URL with a query or fragment never passes validation.
export const URL_KEYS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:/.-_=&%@~+".split("");
export const BIB_KEYS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.".split(
  ""
);
export const DIGIT_KEYS = "0123456789".split("");

// The edit line fits about 27 characters at 24 px, so a longer value shows its
// end, where the next key lands.
export const EDIT_LINE_CHARS = 24;

export function visibleTail(value, limit = EDIT_LINE_CHARS) {
  if (value.length <= limit) return value;
  return "..." + value.slice(value.length - limit + 3);
}

// Lite wraps a text that does not fit, so a 360 px settings row at 24 px keeps
// "<name>: <value>" within this many characters (33 fit in the simulator).
export const ROW_CHARS = 28;

// One settings row, its value shortened from the left (a site without its
// scheme) so the row stays on one line.
export function settingLine(name, value) {
  const lower = value.toLowerCase();
  const start = lower.indexOf("https://") === 0 ? 8 : lower.indexOf("http://") === 0 ? 7 : 0;
  return name + ": " + visibleTail(value.slice(start), ROW_CHARS - name.length - 2);
}

export function editorKeys(field) {
  return field === "siteUrl" ? URL_KEYS : field === "competitionId" ? DIGIT_KEYS : BIB_KEYS;
}

export function appendKey(value, key, field) {
  const limit = field === "siteUrl" ? MAX_STORED_LENGTH : field === "competitionId" ? 10 : 32;
  if (editorKeys(field).indexOf(key) < 0 || value.length >= limit) return value;
  return value + key;
}
