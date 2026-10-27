import { fieldRows } from "./layout.js";
import { lineWidth } from "./round-geometry.js";
import { labelFor } from "./i18n/index.js";
import { displayOr } from "./stats-formatter.js";

export function screenFor(info) {
  const source = info || {};
  const width = Number(source.windowWidth || source.screenWidth || source.width) || 466;
  const height = Number(source.windowHeight || source.screenHeight || source.height) || width;
  return {
    width: 466,
    height: Math.round((466 * height) / width),
    round: source.screenShape !== "rect",
  };
}

export function dashboardCells(metrics, stats, language, screen) {
  const pattern = fieldRows(metrics.length, screen.round);
  const margin = Math.round(screen.height * 0.1);
  const band = Math.floor((screen.height - 2 * margin) / pattern.length);
  const cells = [];
  let index = 0;
  for (let row = 0; row < pattern.length; row++) {
    const columns = pattern[row];
    const y = margin + row * band;
    const width = lineWidth(screen.round, screen.width, y + band / 2, band, 6);
    const cellWidth = Math.floor(width / columns);
    const left = Math.round((screen.width - width) / 2);
    for (let column = 0; column < columns; column++) {
      const metric = metrics[index++];
      const label = labelFor(language, metric);
      const labelSize = Math.max(
        10,
        Math.min(
          28,
          Math.floor(band * 0.3),
          Math.floor(cellWidth / (Math.max(label.length, 1) * 0.55))
        )
      );
      const value = displayOr(stats, metric);
      const valueSize = Math.max(
        12,
        Math.min(
          52,
          Math.floor(band * 0.46),
          Math.floor(cellWidth / (Math.max(value.length, 1) * 0.6))
        )
      );
      cells.push({
        x: left + column * cellWidth,
        y,
        width: cellWidth,
        height: band,
        label,
        value,
        labelSize,
        valueSize,
      });
    }
  }
  return cells;
}

export function dashboardBands(metrics, stats, language, screen) {
  const bands = [];
  const cells = dashboardCells(metrics, stats, language, screen);
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (!bands.length || bands[bands.length - 1].y !== cell.y) {
      bands.push({ y: cell.y, width: 0, height: cell.height, cells: [] });
    }
    const band = bands[bands.length - 1];
    band.width += cell.width;
    band.cells.push(cell);
  }
  return bands;
}
