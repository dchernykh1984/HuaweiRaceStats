---
name: shipping-a-change
description: Ship a branch and PR with passing checks.
---

# Shipping A Change

Fetch origin and branch from origin/main. Stage explicit paths. Use one-line Conventional Commits without attribution. Run all AGENTS.md gates and an SDK build. Update specs/app when behaviour changes. Honor existing task authorization for pushing and PR creation; never merge without it. Query headRefOid and statusCheckRollup and require completed successful checks at that exact head. PR descriptions contain real newlines and describe native-signing and hardware limits.
