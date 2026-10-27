# Working in HuaweiRaceStats

Huawei Lite Wearable companion to AmazfitRaceStats and GarminRaceStats. Poll the
same UniversalBicycleTeam endpoint by race ID and bib; render server strings.

## Architecture

- `entry/src/main/js/MainAbility/`: thin JavaScript/HML/CSS app and watch settings.
- `lib/`: portable metrics, translations, layout, configuration and polling.
- `scripts/prepare-app.mjs`: copies tested helpers into ignored native common/lib.
- `scripts/build.mjs`: invokes DevEco Studio 6.1.1's SDK through Hvigor.
- `entry/src/main/config.json`: FA/Lite Wearable manifest, minimum API 10.
- `test/`: Vitest contract, lifecycle, layout and settings tests.

Use console commands and documented APIs. Do not automate the Mac interface.
No extra MCP is required for builds. GT/FIT use JavaScript Lite Wearable, not
ArkTS Wearable. Network proxy support needs real-watch verification.

## Conventions

- Fetch origin and branch from origin/main; never commit on main.
- One logical change per one-line Conventional Commit. No body, attribution,
  Co-Authored-By trailer or generated-by footer.
- Pushing, PR creation, merging, tagging and releases require authorization.
  Honor authorization already given for the task; never merge without it.
- Gates: npm test, npm run lint, npm run format:check, npm run version:check,
  pre-commit run --all-files, and python3 .codex/hooks/test_post_edit.py.
- Put testable logic in lib. Ignore unknown/nonstring stats. Failures retain
  standings; changing the rider clears them. Stop polling on hidden pages.
- Append metric indices, never reorder. Round screens cap at 9 fields and
  rectangular screens at 10. Check every locale and both shapes.
- UTF-8 and ASCII in source/docs, except lib/i18n, CHANGELOG and package-lock.
  Keep .claude/.codex policies and both skill sets consistent.
- release-please owns version bumps and CHANGELOG. version:sync derives the
  Huawei name/code from package.json. Do not bump versions manually.
- Never track credentials, signing profiles, certificates or personal paths.

## Build and preview

The default SDK is in /Applications/DevEco-Studio.app/Contents. Set
DEVECO_STUDIO_HOME for another installation. Build uses bundled Node/Java.
`npm run build` creates unsigned .hap/.app packages in dist and validates the
compiled bundle and JerryScript snapshot. Visual preview uses the IDE Simulator.

Signing, btproxy on hardware, iPhone behavior, coexistence with workouts, and
store acceptance require separate checks. Do not infer these from packaging.
Read docs/development.md and docs/releasing.md.

## Skills and hooks

Read the relevant .agents/skills workflow first. Claude has matching skills
under .claude/skills. Maintain both when a shared convention changes.

.codex/hooks.json checks edited files for ASCII after apply_patch. Test with
`python3 .codex/hooks/test_post_edit.py`. Automatic hooks require a trusted
project, review of the current definition through /hooks, and enabled local
hooks. Tracked files grant no trust and change no user-level configuration.
Claude permission prompts are not Codex approvals.
