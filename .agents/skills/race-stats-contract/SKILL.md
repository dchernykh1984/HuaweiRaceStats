---
name: race-stats-contract
description: The live-race server contract shared with Amazfit and Garmin.
---

# Race Stats Contract

GET <site>/api/v1/live-stats/<race-id>/<encoded-bib> returns {stats:{...}}. All known values are opaque strings: place, quantity, group/absolute gaps, leader gaps, per-lap deltas, laps and neighbouring participant-pack gaps/sizes. Positive gaps mean ahead, negative behind. Ignore unknown keys and nonstrings. Numeric place becomes place/quantity, DSQ stands alone, missing values become --. Failures retain results; URL/race/bib changes clear them. Poll only while results are visible and reject stale callbacks.
