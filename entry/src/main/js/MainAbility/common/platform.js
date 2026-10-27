import fetch from "@system.fetch";
import storage from "@system.storage";
import { loadConfig as loadStored, saveConfig as saveStored } from "./lib/config.js";

export function loadConfig(done) {
  loadStored(
    (key, next) =>
      storage.get({
        key,
        default: "",
        success: next,
        fail: () => next(""),
      }),
    done
  );
}

export function saveConfig(value, done) {
  saveStored(
    value,
    (key, text, next) =>
      storage.set({
        key,
        value: text,
        success: () => next(true),
        fail: () => next(false),
      }),
    done
  );
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
