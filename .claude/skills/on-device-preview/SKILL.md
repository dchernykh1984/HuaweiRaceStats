---
name: on-device-preview
description: Build Huawei and understand preview verification limits.
---

# Huawei preview

Use npm run build to invoke the SDK, execute the actual compiled bundle against
native API stubs, and generate a JerryScript snapshot. Do not automate the Mac
UI. A full visual preview uses Huawei Lite Wearable Simulator in DevEco Studio,
with IDE-provided font/configuration/IPC. Standalone backend startup alone is not
proof of rendered output. See docs/development.md and docs/validation.md. Native
Bluetooth networking, workout coexistence and battery life require real hardware.
Follow installation authorization already given; do not change user-level MCP
settings without authorization.
