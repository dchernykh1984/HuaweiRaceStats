# Live Race Stats privacy policy

Effective date: 2026-10-28

Live Race Stats ("the app") is an open-source watch app published by
dchernykh1984. It shows a rider's live race standing on a Huawei watch. This
policy explains what the app handles and why.

## What the app stores

The app keeps its settings on the watch only: the timing site address, the race
ID, the bib number, the number of fields and the metric shown in each field.
They stay on the watch until you change them or remove the app.

## What the app sends

To show your standing, the watch requests
`<site>/api/v1/live-stats/<race ID>/<bib>` from the timing site you configure
(by default `https://universalbicycle.team`) about once a minute while the
results screen is visible. The request contains the race ID and bib number.
It reaches the internet through the phone the watch is paired with. The timing
site receives it like any web request, including your IP address, and handles
it under its own privacy policy.

## What the app does not do

The app has no account and no sign-in. It does not read health, location,
contacts or other personal data from the watch or phone. It contains no
advertising, analytics or tracking, and the developer receives no data from it.

## Permissions

The app uses only the internet permission, to fetch the race standing.

## Children

The app is not directed at children and collects no personal data from anyone.

## Changes and contact

Changes to this policy are published at this address together with the app's
source code. Questions:
https://github.com/dchernykh1984/HuaweiRaceStats/issues
