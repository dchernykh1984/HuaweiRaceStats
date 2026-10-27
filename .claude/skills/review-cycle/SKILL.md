---
name: review-cycle
description: Review a branch and fix valid findings.
---

# Review Cycle

Review the actual diff against origin/main. Check saved metric indices, all locales (metric captions and settings words), round and rectangular shapes, response status/type validation, native bundling, the 48 KB snapshot heap (npm run build fails when the page no longer fits), Lite storage limits (keys up to 32 characters, values under 128 bytes), Lite lifecycle hooks (no onBackPress), timeout and hide/resume behavior, late replies, settings persistence and rider changes, and that specs/app still describes the behaviour. Fix valid findings in separate Conventional Commits when authorized. Re-run affected checks. Do not invent findings or claim hardware proof from tests.
