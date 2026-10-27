# Development

## Platform

The app uses Huawei's official [Lite Empty Ability] JavaScript/FA project model.
The checked-in project compiles with DevEco 6.1.1 / SDK 24 and requires API 10+.
The native module declares only INTERNET; it does not access Huawei health data.
The server URL, race ID, bib and field choices are kept in local watch storage,
one key per setting: Lite `@system.storage` keeps a value only when it is under
128 bytes, so a single JSON object of all settings would not fit.

`@system.fetch` uses the network capability exposed by compatible watch firmware.
Huawei documents a [Bluetooth proxy fetch API](https://forums.developer.huawei.com/forumPortal/en/topic/0205201442076523096)
for sports watches, with a 6 KB request limit and SDK/access conditions. A compiled
package does not prove that a particular watch/phone combination exposes it.
Do not promise support for every GT/FIT or for iPhone before testing them.

The results page fetches immediately, then schedules the next request 60 seconds
after completion. A 20-second timeout unblocks a hung request. Opening settings,
hiding the app or destroying the page cancels timers and invalidates callbacks.
Failed requests retain results; changing the endpoint/rider clears them.

## Native compilation

```sh
npm run build
```

The script uses the installed vendor toolchain; it downloads no separate SDK and
copies no vendor binaries into Git. Hvigor may install its own pnpm/cache on the
first run. `entry/package.json` explicitly uses CommonJS: without it the SDK can
emit unresolved requires while still reporting a successful build. Portable
helpers in `lib/` remain ES modules for tests. Do not edit generated common/lib.

The app uses flex bands instead of unsupported Lite CSS absolute positioning.
Do not define a `render` method on the page: the compiler owns that name for HML.
Lite pages only receive onInit, onReady, onShow, onHide and onDestroy; there is
no onBackPress, so the page treats a right swipe as back and closes the app with
`app.terminate()` from the results. Settings open on a long press.

## Simulator

For a visual preview, open the project in DevEco Studio, select **Huawei Lite
Wearable Simulator**, click **Run**, and select the screen shape/resolution.
This is a manual user action; the agent does not automate the Mac interface.
Official reference:
https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/ide-run-simulator

The bundled Simulator backend is callable from the console, but full visual
preview also depends on IDE-provided fonts, persistent settings and IPC. A direct
backend launch reached app initialization during development but still reported
missing IDE resources; it is not counted as a successful visual preview.

Every npm run build instead performs a compiled-bundle smoke check and invokes
Huawei's JerryScript snapshot compiler. These catch unbundled imports, reserved
page-method names and unsupported ES5 syntax even when Hvigor reports success.
Lite Wearable does not accept RegExp literals in this SDK; use indexed loops and
ES5 string operations. The small runtime shim supplies shared numeric checks.
The snapshot compiler runs in a 48 KB JerryScript heap, so the whole page bundle
(bytecode and string literals) must fit there. Hvigor only warns when it does not
and then ships plain JavaScript; `npm run build` fails instead. Translations are
packed as one string per language because separate literals cost several KB.

A simulator does not prove Bluetooth proxy support or simultaneous operation
with the watch's workout recorder. Those need real hardware.

## Local hooks

```sh
pre-commit install
pre-commit run --all-files
python3 .codex/hooks/test_post_edit.py
```

Codex hooks also require project trust, review via /hooks and enabled local hook
settings. No user-level settings or MCP registration are changed automatically.
