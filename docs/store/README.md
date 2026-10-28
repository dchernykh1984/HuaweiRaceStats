# AppGallery Connect submission kit

Everything the AppGallery Connect forms ask for, ready to paste. Texts per
language are in [i18n/en.md](i18n/en.md) (default) and [i18n/ru.md](i18n/ru.md).
Signing is described in [releasing](../releasing.md#signed-packages).

## App

| Field         | Value                                     |
| ------------- | ----------------------------------------- |
| Platform      | HarmonyOS, wearable (Lite Wearable watch) |
| Package name  | `io.github.dchernykh1984.huaweiracestats` |
| Default lang. | English                                   |
| Category      | Sports (Health & Fitness if not offered)  |
| Price         | Free; no in-app purchases; no ads         |
| Age rating    | Everyone / 3+: no objectionable content   |

## Links and contacts

| Field             | Value                                                                             |
| ----------------- | --------------------------------------------------------------------------------- |
| Privacy policy    | https://github.com/dchernykh1984/HuaweiRaceStats/blob/main/docs/privacy-policy.md |
| Developer website | https://github.com/dchernykh1984/HuaweiRaceStats                                  |
| Support           | https://github.com/dchernykh1984/HuaweiRaceStats/issues                           |

## Graphics

- Icon (216x216): [icon-216.png](icon-216.png)
- Screenshots (466x466), in this order:
  [results](screenshots/en-1-results.png),
  [9 fields](screenshots/en-2-results-9.png),
  [settings](screenshots/en-3-settings.png),
  [metric choice](screenshots/en-4-metrics.png),
  [URL editor](screenshots/en-5-editor.png). Russian: the same names with `ru-`.

The screenshots come from the DevEco Lite Wearable Simulator with a recorded
server reply for sample race 259, bib 1 (the simulator has no network).

## Data safety and permissions

- Data collected by the developer: none. No account, analytics, ads or tracking.
- Data sent: race ID and bib number to the timing site the user configures
  (default universalbicycle.team), to fetch the standing. Not linked to an
  identity by the app.
- Data stored: settings on the watch only.
- Permission `ohos.permission.INTERNET`: fetches the live race standing.

## Notes for the reviewer

```text
No account is needed. A fresh install shows the sample race 259, bib 1 from
universalbicycle.team, which returns demo standings (place 3/4, gaps, laps).
The watch reaches the internet through the paired phone; without a connection
the fields show "--" and keep the last standing once one has arrived.
Long-press the results screen to open the settings (race, bib, site, number of
fields and the metric of each field). Tap Save to keep changes, Cancel or a
right swipe to discard them. A right swipe on the results closes the app.
```

## Package

Upload `dist/huawei-race-stats-<version>-signed.app` built with
`HUAWEI_SIGNING_DIR=~/.huawei-signing/huaweiracestats npm run build`. Never
upload the unsigned package.
