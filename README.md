# Huawei Race Stats

Live race standings for Huawei Lite Wearable watches, using the same timing API
as [AmazfitRaceStats](https://github.com/dchernykh1984/AmazfitRaceStats) and
[GarminRaceStats](https://github.com/dchernykh1984/GarminRaceStats).

Displays overall and classification-group place/quantity, gaps ahead/behind and
to the leader, per-lap gap changes, laps, and the gap/size of neighbouring rider
packs. All 19 selectable metrics and all 11 metric-label languages from Amazfit
are preserved. Unknown server keys are ignored; offline periods retain the last
standings. A different rider starts with empty values rather than stale results.

## Requirements

- DevEco Studio 6.1.1 with its bundled HarmonyOS SDK 24, Node and Java.
- A Lite Wearable watch supporting API 10+ and the btproxy network capability.
  GT/FIT device compatibility must be checked by model and firmware. This is not
  an ArkTS application for the full WATCH runtime and does not target GT 3/API 6.
- A connected phone with working internet for live data on supported firmware.
- Node 22.13+ for repository tools (the native SDK uses its own bundled Node).

## Develop

```sh
npm ci
npm test
npm run lint
npm run format:check
npm run version:check
npm run build
```

Open this directory in DevEco Studio to inspect the project. All builds can also
run through the console. Set `DEVECO_STUDIO_HOME` if the Contents directory is not
`/Applications/DevEco-Studio.app/Contents`; set `DEVECO_SDK_HOME` for another SDK.
No additional MCP is required for compilation.

The initial settings use sample race 259 / bib 1. Long-press the results screen
to edit the site URL, race ID, bib, number of fields, and each field's metric; a
single tap does nothing, so a stray touch never stops live updates. The watch
keyboard supports numeric race IDs, alphanumeric bibs and site URLs (up to 127
characters, the Lite storage limit). Tap Save to persist, or Cancel to discard.
Swipe right to go back, or to close the app from the results. Scroll the
settings and keyboard lists. Metric
captions and the settings screens follow the watch language (English otherwise).
Round screens display at most 9 fields; rectangular screens display up to 10.

`lib/` contains the tested logic. `entry/` is the thin Huawei runtime.
`prepare:app` copies helpers into ignored native sources before building.
`npm run build` produces unsigned `.hap` and `.app` packages in `dist/`.
**Unsigned packages are development artifacts and cannot be advertised as
approved AppGallery uploads.** See [releasing](docs/releasing.md).

## Automation

GitHub Actions runs Vitest, version checks, pre-commit, commit-message validation,
actionlint, npm audit, and OSV scans. Dependabot updates npm and Actions monthly.
CODEOWNERS assigns the repository owner. Claude and Codex contexts, matching
skills and ASCII edit guards are included; hook regression tests run in CI.

release-please creates version/changelog PRs and GitHub Releases. Native release
builds use a trusted macOS runner with DevEco installed and label `huawei-sdk`;
configure this runner before merging a release PR. No runner is installed by this
repository. Store submission and signing remain separate explicit actions.

See [development](docs/development.md) for SDK and preview details,
[validation](docs/validation.md) for the checks and limits of this first version,
and [the AppGallery kit](docs/store/README.md) for store listing texts, graphics
and the [privacy policy](docs/privacy-policy.md).

## License

MIT. Shared metric logic and labels originate from AmazfitRaceStats.
