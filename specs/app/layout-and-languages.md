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

### The watch speaks the rider's language

1. **Given** the watch language is one of en, ru, de, fr, it, es, pt, nl, pl, cs
   or kk (with or without a region), **then** metric captions and every word of
   the settings screens (titles, row names, buttons and errors) use it.
2. **Given** any other language, **then** they are English.

## Functional requirements

- **FR-201** The layout is computed for a 466 px design width; the height follows
  the watch's aspect ratio and `screenShape` (`rect` or `circle`).
- **FR-202** A round row's width is the circle's chord at the row's outer edge,
  minus 6 px of padding on each side.
- **FR-203** Every metric has a caption of at most 12 characters in every
  language.
- **FR-204** Metric captions on the settings screens use the same translations.
- **FR-205** Settings words fit their controls in every language: buttons up to
  12 characters, row names up to 10, titles up to 22, messages up to 30.
- **FR-206** The page bundle, translations included, compiles into a JerryScript
  snapshot within the 48 KB heap, so each language's texts are packed into one
  string.

## Tests

- `test/layout.test.mjs`, `test/round-geometry.test.mjs`: row patterns and chord
  widths.
- `test/dashboard.test.mjs`: every cell stays inside both shapes for 1 to 10
  fields.
- `test/i18n.test.mjs`: every language has every metric and every settings word
  within its budget.
- `npm run build`: the snapshot compiles; the compiled page shows Russian
  settings words on a Russian watch.

## Needs real hardware

Font rendering and clipping on each target watch and resolution.
