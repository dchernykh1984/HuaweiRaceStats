# Watch settings

Huawei Lite Wearable apps have no phone settings page, so the rider configures
the app on the watch itself.

## User stories

### A rider sets up the race before the start

1. **Given** a fresh install, **then** the app shows sample race 259, bib 1 on
   `https://universalbicycle.team` with four fields.
2. **Given** the results screen, **when** the rider long-presses it, **then** the
   settings list opens and polling stops. A single tap does nothing, so a stray
   touch during a race keeps the standings updating.
3. **Given** the settings list, **when** the rider taps Race, Bib or Site, **then**
   an on-screen keyboard opens: digits for the race ID, letters, digits and
   `-_.` for the bib, and URL characters for the site.
4. **Given** the settings list, **when** the rider changes the number of fields
   or taps a field, **then** they can choose any of the 19 metrics for it. The
   count goes up to what the watch draws: 9 on a round screen, 10 on a
   rectangular one.
5. **Given** valid values, **when** the rider taps Save, **then** the settings are
   stored and the results screen returns; a different site, race or bib clears
   the old standings.

### A rider backs out

1. **Given** the keyboard or the metric list, **when** the rider swipes right or
   taps Cancel/Back, **then** the settings list returns without the change.
2. **Given** the settings list, **when** the rider swipes right or taps Cancel,
   **then** the stored settings are restored and polling resumes.
3. **Given** the results screen, **when** the rider swipes right, **then** the
   app closes.

### A rider gets clear feedback

1. **Given** an invalid site, race ID or bib, **when** the rider taps Save, **then**
   an error is shown and nothing is stored.
2. **Given** storage fails, **then** "Could not save. Please retry." is shown and
   the settings list stays open.

## Functional requirements

- **FR-101** Each setting is stored under its own `@system.storage` key
  (`siteUrl`, `competitionId`, `bib`, `rowCount`, `rowMetric0`..`rowMetric9`).
  Lite storage keeps a value only when it is under 128 bytes, so the site URL is
  limited to 127 characters, the race ID to 10 digits and the bib to 32.
- **FR-102** A missing, corrupt or invalid stored rider (site, race, bib) falls
  back to the defaults; an out-of-range metric index falls back to the field's
  own index.
- **FR-103** The site URL must be `http://` or `https://`, without credentials,
  query or fragment. The race ID is a positive integer. The bib is not blank.
- **FR-104** Metric indices are appended to `METRICS`, never reordered.
- **FR-105** Lite pages receive no back event; a right swipe is the back gesture.
- **FR-106** While a save is in progress, edits, Cancel and swipes are ignored.

## Tests

- `test/config.test.mjs`: defaults, recovery, validation and a storage round
  trip that enforces the Lite key and value limits.
- `test/editor.test.mjs`: keyboard keys and length limits.
- `scripts/check-native-bundle.mjs`: long press and swipe bindings, keyboard,
  metric choice, failed save and retry, swipe back and app exit.

## Needs real hardware

Persistence across a watch restart and the feel of the keyboard and gestures
on the target watches.
