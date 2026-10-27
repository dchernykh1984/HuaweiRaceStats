# Layout and languages

## User stories

### The fields fit the watch

1. **Given** a round watch, **then** the fields form a diamond (narrow rows at the
   top and bottom, wide in the middle) whose rows stay inside the circle; at
   most 9 fields are drawn.
2. **Given** a rectangular watch, **then** the fields form a two-column grid with
   a lone last field centred; at most 10 fields are drawn.
3. **Given** a long caption or value in a narrow cell, **then** its font shrinks
   to fit the cell, down to a readable minimum.

### The captions speak the watch's language

1. **Given** the watch language is one of en, ru, de, fr, it, es, pt, nl, pl, cs
   or kk (with or without a region), **then** metric captions use it.
2. **Given** any other language, **then** captions are English.

## Functional requirements

- **FR-201** The layout is computed for a 466 px design width; the height follows
  the watch's aspect ratio and `screenShape` (`rect` or `circle`).
- **FR-202** A round row's width is the circle's chord at the row's outer edge,
  minus 6 px of padding on each side.
- **FR-203** Every metric has a caption of at most 12 characters in every
  language.
- **FR-204** Metric captions on the settings screens use the same translations.

## Tests

- `test/layout.test.mjs`, `test/round-geometry.test.mjs`: row patterns and chord
  widths.
- `test/dashboard.test.mjs`: every cell stays inside both shapes for 1 to 10
  fields.
- `test/i18n.test.mjs`: every language has every metric within the budget.

## Needs real hardware

Font rendering and clipping on each target watch and resolution.
