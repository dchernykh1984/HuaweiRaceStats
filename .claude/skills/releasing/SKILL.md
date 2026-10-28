---
name: releasing
description: Release-please, Huawei versions and native packages.
---

# Releasing

release-please owns package.json and CHANGELOG. It writes the manifest version name; version:sync computes code = major*10000 + minor*100 + patch for the package; the build restores the tracked manifest. The first release was 1.0.0 (tags huawei-race-stats-vX.Y.Z); release-please bumps from its manifest. Build and Distribute needs a trusted self-hosted macOS runner labeled huawei-sdk with DevEco 6.1.1. Unsigned HAP/APP packages are not store-ready uploads. Never release, tag or merge without authorization. Merge the release PR by rebase too; squash merges are rejected. Read docs/releasing.md.
