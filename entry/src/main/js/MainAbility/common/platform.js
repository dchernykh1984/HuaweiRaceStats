import fetch from "@system.fetch";
import storage from "@system.storage";
import { CONFIG_KEY, parseConfig } from "./lib/config.js";

export function loadConfig(done) {
  storage.get({
    key: CONFIG_KEY,
    default: "",
    success: (value) => done(parseConfig(value)),
    fail: () => done(parseConfig(null)),
  });
}

export function saveConfig(config, done) {
  storage.set({
    key: CONFIG_KEY,
    value: JSON.stringify(config),
    success: () => done(true),
    fail: () => done(false),
  });
}

export function requestStats(url, done) {
  fetch.fetch({
    url,
    method: "GET",
    responseType: "json",
    success: done,
    fail: () => done(null),
  });
}
