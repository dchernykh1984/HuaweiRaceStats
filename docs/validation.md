# Validation and remaining hardware checks

## Source parity

Ported from AmazfitRaceStats main 700a005, including the ESLint 10 configuration
update proposed in its open dependency PR. The catalogue preserves all 19 metrics
and 11 metric-label languages, place/quantity formatting, leader and per-lap gaps,
laps and neighbouring participant-pack gaps/sizes. Both round and rectangular
layouts, configurable fields and the same server endpoint are present.

## Automated checks

- Vitest tests for metric/locale contracts, settings, URL validation, geometry,
  value formatting, timeout/offline recovery and poller lifecycle.
- ESLint, Prettier, version check, complete pre-commit gate, actionlint, and 14
  Codex hook regression tests including HML, TypeScript and JSON5 policy coverage.
- npm audit reports zero vulnerabilities after compatible dependency updates.
- DevEco Studio 6.1.1 / bundled SDK 24 builds actual unsigned HAP and APP packages.
- The compiled SDK bundle is executed with native API stubs to exercise dashboard
  rendering, keyboard, metric choices, Lite storage key/value limits, save
  failures/retry, long-press and swipe bindings, swipe back, app exit and page
  hide/resume.
  Huawei's JerryScript compiler also generates a real native snapshot. These
  checks are part of npm run build and fail on invalid generated code.

## Not yet verified

Full visual rendering in the IDE Simulator has not been verified. A console-only
backend probe reached app initialization but reported missing IDE font/IPC
resources, so it is not claimed as a passing visual test.

No physical Huawei watch or paired phone was tested. Verify supported firmware's
Bluetooth network proxy, real server responses, screen fonts and clipping,
settings persistence across restarts, connection recovery, battery behavior and
coexistence with recorded workouts. iPhone compatibility is not claimed.

AppGallery account verification, release signing and store review have not been
performed. Release automation requires the separately configured huawei-sdk
runner; default artifacts are explicitly unsigned. See docs/releasing.md.
