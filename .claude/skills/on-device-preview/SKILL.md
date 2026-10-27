---
name: on-device-preview
description: Build Huawei and understand preview verification limits.
---

# Huawei preview

Use npm run build to invoke the SDK, execute the actual compiled bundle against
native API stubs, and generate a JerryScript snapshot. Do not automate the Mac
UI. A full visual preview uses Huawei Lite Wearable Simulator in DevEco Studio,
with IDE-provided font/configuration/IPC. The console backend renders JPEG frames
over its -lws WebSocket and takes mouse commands on /tmp/<name>_commandPipe, but
has no system.fetch, cannot write storage and always reports rect/zh; a preview
there needs a patched copy of the bundle. See docs/development.md and docs/validation.md. Native
Bluetooth networking, workout coexistence and battery life require real hardware.
Follow installation authorization already given; do not change user-level MCP
settings without authorization.
