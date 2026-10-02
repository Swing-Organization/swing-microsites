# Verification — 2026-10-03

- `npm run check`: 26 unit cases and 84 browser cases passed across Chromium, Firefox and WebKit, covering both campaigns. After review, added an output-ownership guard and regression test; the focused unit file passes.
- Deployment packaging builds and audits both registered campaign routes; no changes to the existing campaign's content or source.
- Desktop 1440px and mobile 390px screenshots visually inspected. Browser layout checked at 320, 390, 768 and 1440px. All visible images loaded after scrolling; all product back views open without JavaScript.
- Axe scan passes in all three browsers. Keyboard begins with the skip link. Native film playback, reduced motion and failed-film poster/status pass.
- Initial 390px mobile transfer: 383,086 bytes; no MP4 fetched under reduced motion; no overflow. Campaign output is approximately 6.2 MB including responsive variants and both films.
- Drive source IDs match the current campaign folders. Original SHA256 and film derivative SHA256 are verified. Local source originals were downloaded from authorized Drive. Exact existing derivatives were fetched from the live campaign and checked against the pinned hashes. CI must independently restore the pinned private source before preview is handed off.
- Two selected films have no audio track. Font stack uses disclosed system fallbacks. No generated imagery, external media, invented quotes, prices, or shopping URLs.
- Independent review found no important issues. Its output-ownership hardening suggestion was implemented with a regression test.

Launch decisions: shopping destinations intentionally unset. Production requires explicit approval of the reviewed PR SHA. CI and deployed preview status are recorded on the PR.

## Requested copy update — 2026-10-03

Callie requested changing the italic intro header from “Stay for the afternoon.” to “Stay for the aprés?” Exact requested spelling and punctuation retained; existing italic treatment preserved. No other page content changed.
