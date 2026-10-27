---
name: harmonyos-app
description: Huawei app architecture, settings, layout and networking.
---

# Harmonyos App

Use JavaScript FA/Lite Wearable for GT/FIT: minimum API 10, compile SDK 24. Keep runtime thin and logic in lib; prepare:app copies helpers into ignored common/lib. Keep entry/package.json type commonjs so the Huawei compiler bundles imports. Do not name page methods render: Huawei uses it for generated HML. Settings use @system.storage; labels follow device language. Network uses @system.fetch on firmware with Bluetooth proxy support, requiring hardware verification. Round layout caps at 9 fields, rectangular at 10.
