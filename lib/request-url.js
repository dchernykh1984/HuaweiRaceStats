// URL helpers use ES5 string operations: Lite Wearable has no RegExp support.
export function validSiteUrl(value) {
  if (typeof value !== "string") return false;
  const base = value.trim();
  const lower = base.toLowerCase();
  const start = lower.indexOf("https://") === 0 ? 8 : lower.indexOf("http://") === 0 ? 7 : 0;
  if (!start) return false;
  const authority = base.slice(start).split("/")[0];
  if (!authority || authority.indexOf("@") >= 0 || base.indexOf("?") >= 0 || base.indexOf("#") >= 0)
    return false;
  for (let i = 0; i < base.length; i++) {
    if (base.charCodeAt(i) <= 32 || base.charCodeAt(i) === 127) return false;
  }
  return true;
}

export function buildRequestUrl(siteUrl, competitionId, bib) {
  let base = String(siteUrl == null ? "" : siteUrl).trim();
  while (base.charAt(base.length - 1) === "/") base = base.slice(0, -1);
  const competition = Number(competitionId);
  const bibValue = String(bib == null ? "" : bib).trim();
  if (
    !validSiteUrl(base) ||
    !Number.isSafeInteger(competition) ||
    competition <= 0 ||
    bibValue === ""
  )
    return null;
  return base + "/api/v1/live-stats/" + competition + "/" + encodeURIComponent(bibValue);
}
