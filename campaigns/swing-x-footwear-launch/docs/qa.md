# Verification record

- Source inspection: six images and representative frames from both videos reviewed; eight original files and four derivatives matched pinned SHA256 hashes.
- New campaign: renderer contract, escaping, checksum refusal, unowned-output refusal pass; build and output audit pass (8 image elements including two video fallbacks, 2 films).
- Full local unit suite initially 31/32: existing John Montgomery static build test could not run because its private source media is absent locally. CI has the configured restore credential and must pass the full suite.
- Local browser installation: repository Playwright download and runtime alternate download returned truncated/non-ZIP archives. No local browser success claimed. CI supplies preinstalled Chromium, Firefox and WebKit.
- Independent review: corrected mobile editorial grids to single column; added build safety tests; use video src directly so native network errors trigger the shared error fallback. Browser test requests a real 404 for the film rather than synthesizing an error.
- Production remains unapproved. This is an intentional test using existing golf imagery.

## Follow-up verification
- Recovered local Chromium through a separate scratch-only browser package; desktop (1440px) and mobile (390px) screenshots reviewed against the exact deployed HTML artifact.
- All six new campaign browser tests pass locally, including axe WCAG checks, no-JS anchors, keyboard focus, reduced motion, manual pause, actual network-error fallback, and mobile stacking.
- Initial CI: 33/33 unit tests; all three campaign builds/audits passed; 99/102 browser tests passed. The three failures were the same test fixture: the MP4 interception glob did not match its query string and preload=none did not trigger a request. Corrected fixture to match query parameters and explicitly request playback; no production-code change needed.
- Preview returned HTTP 200 without authentication, HTML identical to local output, expected CSP/noindex/nosniff headers. Final head CI and preview checks recorded in PR handoff.

## 2026-10-07 headline update
Marketer requested “Your Sunday Starts Here.” Replaced hero headline and matching browser title; preserved all CSS, media, layout, supporting copy and interactions. Updated existing headline assertions. This explicit copy override supersedes the brief headline; Drive brief unchanged.
