export const URL_KEYS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:/.-_?=&%#@~+".split("");
export const BIB_KEYS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.".split(
  ""
);
export const DIGIT_KEYS = "0123456789".split("");

export function editorKeys(field) {
  return field === "siteUrl" ? URL_KEYS : field === "competitionId" ? DIGIT_KEYS : BIB_KEYS;
}

export function appendKey(value, key, field) {
  const limit = field === "siteUrl" ? 240 : field === "competitionId" ? 10 : 32;
  if (editorKeys(field).indexOf(key) < 0 || value.length >= limit) return value;
  return value + key;
}
