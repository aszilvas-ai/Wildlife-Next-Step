---
name: Patch hunk anchors
description: Prevent repeated apply-patch failures when editing top-level declarations.
---

Use an exact `@@` anchor for each top-level declaration being changed, and keep separate hunks in source order. Unanchored multi-hunk edits can fail to match or report misleading context locations.

**Why:** Several patch attempts failed on module-level changes; anchoring each declaration separately succeeded.

**How to apply:** Prefer a single anchored hunk per top-level constant or import group. Group edits only when the target lines are adjacent.
