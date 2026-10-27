# Live stats

The results screen shows a rider's live standing, fetched from the timing site
by race ID and bib, as the same strings AmazfitRaceStats and GarminRaceStats show.

## User stories

### A rider sees their standing during a race

1. **Given** a configured site, race and bib, **when** the app opens, **then** it
   requests the stats at once and draws each chosen field as a caption above
   its value.
2. **Given** the server returns `place_abs: "17"` and `qty_abs: "84"`, **then** the
   overall place field reads `17/84`; a non-numeric place such as `DSQ` stands
   alone, and a missing value reads `--`.
3. **Given** the results stay open, **then** the next request starts 60 seconds
   after the previous one finished.

### The standings survive a lost connection

1. **Given** standings are on screen, **when** a request fails, times out after
   20 seconds, returns a non-2xx status, malformed JSON or no known string values,
   **then** the previous standings stay on screen.
2. **Given** a reply arrives after its request timed out, after the page was
   hidden, or after the rider changed, **then** it is ignored.

### Polling follows what the rider sees

1. **Given** the app is hidden or settings are open, **then** no request runs and
   no timer is pending; showing the results again requests at once.
2. **Given** the rider saves a different site, race or bib, **then** the old
   standings are cleared before the new rider's first reply; saving only field
   changes keeps them.

## Functional requirements

- **FR-001** The request is `GET <site>/api/v1/live-stats/<race-id>/<bib>` with
  the bib percent-encoded as one path segment and trailing slashes trimmed from
  the site.
- **FR-002** Only the known keys in `lib/metrics.js` are read; unknown keys and
  non-string values are dropped.
- **FR-003** Place metrics show `place/qty`; other metrics show the raw string;
  anything missing shows `--`.
- **FR-004** At most one request is in flight; a 20 s timeout releases it.
- **FR-005** A failed or empty reply keeps the last standings (`keepLatestStats`).
- **FR-006** Polling stops on hide, on opening settings and on destroy, and every
  pending callback is invalidated.

## Tests

- `test/polling.test.mjs`: response validation, cadence, timeout, late replies,
  hide/resume and synchronous native errors.
- `test/request-url.test.mjs`, `test/stats-formatter.test.mjs`,
  `test/metrics.test.mjs`: URL building, value formatting, known keys.
- `scripts/check-native-bundle.mjs` (part of `npm run build`): the compiled page
  fetches on start, renders `17/84`, stops while hidden and resumes on show.

## Needs real hardware

Bluetooth proxy networking through the phone, iPhone pairing, behaviour while a
workout is recorded, and battery use.
