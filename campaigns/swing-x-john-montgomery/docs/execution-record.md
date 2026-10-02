# SDD ledger — plan: campaigns/swing-x-john-montgomery/docs/superpowers/plans/2026-09-23-sunday-edit.md
Start: approved 2026-09-23; native execution on codex/sunday-edit; base 9b8b12b.
Pre-flight: Tasks 1→2→3 share Site/Asset/PreparedImage contracts; Tasks 4/6 consume renderer; Task 5 consumes reviewed Film; Tasks 7/8 consume final artifact. Consistent with incremental shell in Task 3.
Ruling: Keep system serif/script fallbacks for the review build pending supplied licensed fonts — approved plan allows structure work — final cross-platform type may change.
Ruling: Use temporary imageio-ffmpeg decoder outside runtime dependencies — AVFoundation failed to decode frames — encoding must be verified in browsers.
Tasks: 1 content in progress; 2 media pending; 3 static build pending; 4 editorial pending; 5 film pending; 6 products pending; 7 QA pending; 8 handoff pending.
Task 1: complete (commits 9b8b12b..7d90670, tests: npm test → ℹ duration_ms 40.553458)
Task 2: complete (commits 7d90670..807deb3, tests: npm test → ℹ duration_ms 60.825166)
Task 3: complete (commits 807deb3..c39e2f3, tests: npm test → ℹ duration_ms 7307.413333)
Task 4: complete (commits c39e2f3..ace84ab, tests: npx playwright test campaigns/swing-x-john-montgomery/tests/e2e/editorial.spec.mjs →   21 passed (3.3s))
Task 5: complete (commits ace84ab..bafa2d4, tests: npx playwright test campaigns/swing-x-john-montgomery/tests/e2e/film.spec.mjs →   12 passed (3.5s))
Task 6: complete (commits bafa2d4..5ca865a, tests: npx playwright test campaigns/swing-x-john-montgomery/tests/e2e/products.spec.mjs →   6 passed (2.0s))
Ruling: Add parse5 as a build-only dependency — HTML-aware auditing avoids false positives and escaped-attribute bypasses — adds two locked development packages, no browser bytes.
Task 7: complete (commits 5ca865a..c76768a, tests: npm run check →   54 passed (11.6s))
Ruling: Physical-device, licensed-type, and actual-host checks remain release gates — those external inputs are unavailable locally and deployment is out of scope — final platform appearance/integration may need adjustment.
Task 8: complete (commits c76768a..83b1cdf, tests: npm run check →   57 passed (11.6s))

Final: fixed film dimension injection — film dimensions must be positive safe integers RED→GREEN; suite 10 unit/63 browser passed.
Final: fixed narrow enlarged-text overflow — 200 percent text at 320/390 RED→GREEN; suite 10 unit/63 browser passed.
Final: Ruling: External creative, typography, device, accessibility and host certification remain release checks — local preview is reviewable but cannot certify unavailable environments — launch may need adjustments.
Final: Ruling: Author reran the full suite the reviewer set aside — all 73 tests pass on the fixed tree — automation cannot certify every real device.
Final: Ruling: Retain V01 based on the author's complete frame review and provenance — independent reviewer did not replay the whole source — Marketing must confirm the final creative treatment.
Final: no deferred minor findings.
