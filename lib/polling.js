import { pickKnownStats } from "./metrics.js";
import { keepLatestStats } from "./stats-formatter.js";
import { buildRequestUrl } from "./request-url.js";

export const REFRESH_MS = 60000;
export const REQUEST_TIMEOUT_MS = 20000;

export function statsFromResponse(response) {
  try {
    if (
      !response ||
      !Number.isInteger(response.code) ||
      response.code < 200 ||
      response.code >= 300
    )
      return null;
    const body = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    if (!body || !body.stats || typeof body.stats !== "object" || Array.isArray(body.stats))
      return null;
    const stats = pickKnownStats(body.stats);
    const keys = Object.keys(stats);
    for (let i = 0; i < keys.length; i++)
      if (typeof stats[keys[i]] !== "string") delete stats[keys[i]];
    return Object.keys(stats).length ? stats : null;
  } catch {
    return null;
  }
}

// Each instance belongs to one rider. A timed-out or hidden page cannot accept late replies.
export function createPoller(config, request, onData, initialStats = null) {
  const url = buildRequestUrl(config.siteUrl, config.competitionId, config.bib);
  let active = false;
  let pending = false;
  let generation = 0;
  let timer = null;
  let deadline = null;
  let stats = initialStats;

  function refresh() {
    if (!active || pending) return;
    clearTimeout(timer);
    pending = true;
    const token = ++generation;
    function finish(response) {
      if (!active || !pending || token !== generation) return;
      clearTimeout(deadline);
      pending = false;
      stats = keepLatestStats(stats, statsFromResponse(response));
      onData(stats);
      if (active && token === generation) timer = setTimeout(refresh, REFRESH_MS);
    }
    deadline = setTimeout(() => finish(null), REQUEST_TIMEOUT_MS);
    try {
      if (url) request(url, finish);
      else finish(null);
    } catch {
      finish(null);
    }
  }

  return {
    start() {
      if (active) return;
      active = true;
      refresh();
    },
    refresh,
    stop() {
      active = false;
      pending = false;
      generation++;
      clearTimeout(timer);
      clearTimeout(deadline);
    },
  };
}
