# HuaweiRaceStats Constitution

HuaweiRaceStats shows a rider's live race standing on a Huawei Lite Wearable
watch. It is the Huawei companion of AmazfitRaceStats and GarminRaceStats: all
three poll the same UniversalBicycleTeam endpoint by race ID and bib and render
the strings the server sends.

## Core Principles

### I. One server contract for every watch

The watch asks `GET <site>/api/v1/live-stats/<race-id>/<encoded-bib>` and reads
`{stats: {...}}`. Values are opaque strings drawn as sent; a numeric place is
shown as place/quantity. Unknown keys and non-string values are ignored, so an
old install keeps working when the server grows. A change to the contract is
made in all three apps, not in one.

### II. Standings survive the woods

A failed, slow or empty reply keeps the last standings on screen; only a change
of site, race or bib clears them. A request is never left hanging (timeout), a
late or stale reply never overwrites newer state, and polling stops while the
results are not visible.

### III. The Lite Wearable runtime is the platform

The app is a JavaScript FA Lite Wearable app (API 10+), not ArkTS. Code runs on
an ES5 JerryScript runtime without RegExp literals. Only documented Lite APIs
and lifecycle hooks are used, within their documented limits (for example a
storage value under 128 bytes). Round screens draw at most 9 fields and
rectangular screens at most 10; every change is checked on both shapes.

### IV. Logic lives in lib and carries tests (NON-NEGOTIABLE)

Testable logic lives in `lib/` with Vitest tests; the page in `entry/` stays a
thin binding. A bug fix comes with a test that fails without it. Behaviour that
only exists in the compiled page is pinned by the compiled-bundle check run by
`npm run build`.

### V. Every language the watch offers

Everything the rider reads on the watch exists in every supported language
(en, ru, de, fr, it, es, pt, nl, pl, cs, kk) and fits the screen at every field
count. Source files stay ASCII; translations live in `lib/i18n/`. Metric
indices are appended, never reordered, so saved choices keep their meaning.

### VI. Small, complete, reviewable changes

One logical change per one-line Conventional Commit, without attribution
trailers. Work is reviewed in cycles and each valid finding is fixed in its own
commit. Pull requests are merged by rebase, never squashed, so every commit
survives on a linear history. A change finishes everything it touches: callers,
tests, translations, documentation, specifications and the matching Claude and
Codex guidance.

### VII. Claims match evidence

Tests, packaging and the simulator do not prove Bluetooth networking, iPhone
behaviour, workout coexistence, battery life or store acceptance. Those are
claimed only after a check on real hardware or in AppGallery.

## Constraints

- Builds use DevEco Studio's bundled SDK through `npm run build`; generated
  `entry/src/main/js/MainAbility/common/lib/` is never edited by hand.
- Credentials, signing material and personal paths are never tracked.
- release-please owns versions and the changelog.

## Development Workflow

Specifications live in `specs/`: `specs/app/` describes the app as it works
today, and a feature with its own issue gets `specs/<issue>-<short-name>/`. A
change that alters behaviour updates the matching specification in the same
pull request. Gates before a change is reported done: `npm test`, `npm run
lint`, `npm run format:check`, `npm run version:check`, `pre-commit run
--all-files`, `python3 .codex/hooks/test_post_edit.py`, and `npm run build`
when the SDK is available.

## Governance

This constitution supersedes conflicting guidance; AGENTS.md and CLAUDE.md hold
the day-to-day rules. Pushing, merging, tagging and releasing need the
maintainer's authorization. Amendments are made in a pull request that states
the reason and bumps the version below (major: a principle removed or redefined;
minor: a principle added; patch: wording).

**Version**: 1.1.0 | **Ratified**: 2026-10-27 | **Last Amended**: 2026-10-28
