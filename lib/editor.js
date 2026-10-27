import { MAX_STORED_LENGTH } from "./config.js";

export const URL_KEYS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:/.-_?=&%#@~+".split("");
export const BIB_KEYS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.".split(
  ""
);
export const DIGIT_KEYS = "0123456789".split("");

// The edit line fits about 27 characters at 24 px, so a longer value shows its
// end, where the next key lands.
export const EDIT_LINE_CHARS = 24;

export function visibleTail(value) {
  if (value.length <= EDIT_LINE_CHARS) return value;
  return "..." + value.slice(value.length - EDIT_LINE_CHARS + 3);
}

export function editorKeys(field) {
  return field === "siteUrl" ? URL_KEYS : field === "competitionId" ? DIGIT_KEYS : BIB_KEYS;
}

export function appendKey(value, key, field) {
  const limit = field === "siteUrl" ? MAX_STORED_LENGTH : field === "competitionId" ? 10 : 32;
  if (editorKeys(field).indexOf(key) < 0 || value.length >= limit) return value;
  return value + key;
}
