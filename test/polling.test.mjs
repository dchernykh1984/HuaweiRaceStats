import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPoller, statsFromResponse, REFRESH_MS, REQUEST_TIMEOUT_MS } from "../lib/polling.js";
import { defaultConfig } from "../lib/config.js";

const reply = (place) => ({ code: 200, data: { stats: { place_abs: place } } });
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("Huawei response parsing", () => {
  it("accepts JSON text and objects, ignores new keys and rejects malformed responses", () => {
    expect(
      statsFromResponse({
        code: 200,
        data: JSON.stringify({
          stats: { place_abs: "2", future: "new", laps: 4 },
        }),
      })
    ).toEqual({ place_abs: "2" });
    for (const response of [
      null,
      { data: reply("2").data },
      { code: 404, data: reply("2").data },
      { code: 200, data: "{" },
      { code: 200, data: { stats: [] } },
      { code: 200, data: { stats: { future: "new" } } },
    ])
      expect(statsFromResponse(response)).toBeNull();
  });
});

describe("watch polling lifecycle", () => {
  it("polls immediately and every minute, retaining standings through offline responses", () => {
    const request = vi.fn();
    const changed = vi.fn();
    const poller = createPoller(defaultConfig(), request, changed);
    poller.start();
    poller.start();
    poller.refresh();
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toContain("/live-stats/259/1");
    request.mock.calls[0][1](reply("2"));
    vi.advanceTimersByTime(REFRESH_MS);
    request.mock.calls[1][1](null);
    expect(changed).toHaveBeenLastCalledWith({ place_abs: "2" });
    poller.stop();
    vi.advanceTimersByTime(REFRESH_MS * 2);
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("times out hung requests and rejects old callbacks after timeout or page hide", () => {
    const request = vi.fn();
    const changed = vi.fn();
    const poller = createPoller(defaultConfig(), request, changed);
    poller.start();
    const late = request.mock.calls[0][1];
    vi.advanceTimersByTime(REQUEST_TIMEOUT_MS);
    expect(changed).toHaveBeenLastCalledWith(null);
    vi.advanceTimersByTime(REFRESH_MS);
    late(reply("99"));
    expect(changed).toHaveBeenCalledTimes(1);
    poller.stop();
    request.mock.calls[1][1](reply("98"));
    expect(changed).toHaveBeenCalledTimes(1);
    poller.start();
    request.mock.calls[2][1](reply("1"));
    expect(changed).toHaveBeenLastCalledWith({ place_abs: "1" });
    poller.stop();
  });
  it("survives a synchronous native network error and retries", () => {
    const changed = vi.fn();
    const request = vi.fn(() => {
      throw new Error("Bluetooth unavailable");
    });
    const poller = createPoller(defaultConfig(), request, changed);
    poller.start();
    expect(changed).toHaveBeenLastCalledWith(null);
    vi.advanceTimersByTime(REFRESH_MS);
    expect(request).toHaveBeenCalledTimes(2);
    poller.stop();
  });
});
