import { describe, it, expect } from "vitest";
import { dashboardCells, dashboardBands, screenFor } from "../lib/dashboard.js";
import { METRICS } from "../lib/metrics.js";
import { maxFields } from "../lib/layout.js";
import { LANGUAGES } from "../lib/i18n/index.js";

describe("watch dashboard", () => {
  it("normalizes actual round and rectangular device dimensions", () => {
    expect(screenFor(null)).toEqual({ width: 466, height: 466, round: true });
    expect(screenFor({ windowWidth: 390, windowHeight: 450, screenShape: "rect" })).toEqual({
      width: 466,
      height: 538,
      round: false,
    });
  });
  it("keeps every cell inside round and rectangular displays for every field count", () => {
    for (const info of [{}, { windowWidth: 390, windowHeight: 450, screenShape: "rect" }]) {
      const screen = screenFor(info);
      for (let count = 1; count <= 10; count++) {
        const cells = dashboardCells(METRICS.slice(0, count), null, "ru", screen);
        expect(
          dashboardBands(METRICS.slice(0, count), null, "ru", screen).flatMap((band) => band.cells)
        ).toEqual(cells);
        expect(cells.length).toBe(Math.min(count, screen.round ? 9 : 10));
        for (const cell of cells) {
          expect(cell.value).toBe("--");
          expect(cell.x).toBeGreaterThanOrEqual(0);
          expect(cell.x + cell.width).toBeLessThanOrEqual(screen.width);
          expect(cell.y + cell.height).toBeLessThanOrEqual(screen.height);
          expect(cell.labelSize).toBeGreaterThan(0);
        }
      }
    }
  });
  it("renders the server's place and pack values with localized captions", () => {
    const cells = dashboardCells(
      ["place_abs", "gap_prev_pack_abs"],
      { place_abs: "17", qty_abs: "84", gap_prev_pack_abs: "+0:12" },
      "en",
      screenFor(null)
    );
    expect(cells.map((cell) => cell.value)).toEqual(["17/84", "+0:12"]);
  });
  it("fits every language's captions and long values in both shapes at every field count", () => {
    // The widest values the server sends: a long gap, a three-digit place and a pack size.
    const stats = { place_abs: "123", qty_abs: "456", gap_prev_abs: "+1:23:45", laps: "12" };
    for (const info of [{}, { windowWidth: 390, windowHeight: 450, screenShape: "rect" }]) {
      const screen = screenFor(info);
      for (const language of LANGUAGES) {
        for (let count = 1; count <= maxFields(screen.round); count++) {
          for (let start = 0; start < METRICS.length; start += count) {
            const metrics = Array.from({ length: count }, (_, i) => {
              return METRICS[(start + i) % METRICS.length];
            });
            for (const cell of dashboardCells(metrics, stats, language, screen)) {
              const where = `${language} ${count} ${screen.round ? "round" : "rect"} '${cell.label}'`;
              expect(cell.labelSize * 0.55 * cell.label.length, where).toBeLessThanOrEqual(
                cell.width
              );
              expect(cell.valueSize * 0.6 * cell.value.length, where).toBeLessThanOrEqual(
                cell.width
              );
              expect(cell.labelSize + cell.valueSize, where).toBeLessThanOrEqual(cell.height);
            }
          }
        }
      }
    }
  });
});
