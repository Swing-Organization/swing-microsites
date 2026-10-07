# Sunday Set verification — 2026-10-07

- Complete campaign folder, native Google Doc brief (all content), product sheet, 21 still images and representative frames from all five films inspected.
- All 26 original Drive assets represented once; three equally sized two-view product stories; Clara name-only exception recorded from user confirmation.
- npm run check: **37 unit tests and 123 browser tests passed**, including Chromium, Firefox and WebKit across all four campaigns.
- node scripts/deployment/build.mjs: all four campaigns built, audited and packaged, including /campaign/sunday-set/. Other routes are unchanged.
- Sunday Set browser checks: 390/1440px rendered media and axe WCAG A/AA, 320px overflow, keyboard anchors, noninteractive shopping, reduced motion, offscreen pause, manual pause persistence, film request failure/poster fallback, playback of all five films, and no-JavaScript content.
- Desktop 1440px and mobile 390px cover/full-page screenshots inspected locally. Screenshots and logs remain ignored local artifacts.
- At 320/390/1440px with reduced motion, initial resource transfer measured about 745/777/1,035 kB; no initial MP4 requests and no external resource requests. Complete campaign media output: 25,901,992 bytes. MP4s retain their approved 720 × 1280 originals and preload none.
- Forced cover-image request failure preserved the image’s layout dimensions at all three measured widths.
- Sources and extracted posters reside in the existing **private** media repository, at immutable commit b842793b77f9ec9820f3815a90faa464762973ac. Upload was explicitly approved by the user. The media commit adds only the Sunday Set folder and preserves prior campaigns.
- Corrected two keyboard tests to use macOS WebKit’s native Option–Tab link navigation. Verified experimentally that plain Tab reaches video while Option–Tab reaches the skip link; Linux CI remains on Tab. No user system preferences changed.

## Launch checks

Shopping destinations are intentionally absent for the preview. Supply and verify product and collection URLs, then obtain explicit production approval for the updated preview SHA. This change neither merges nor deploys production.


## Headline update — 2026-10-07

User override: replace the original brief headline with “The same swing, a new Sunday set” exactly, without a final period. Updated the cover, matching metadata/content record and existing wording checks. Retained the editorial typography with line breaks that keep “Sunday set” together. Affected campaign build and four unit checks pass; exact wording and overflow checked in Chromium at 320, 390, 768 and 1440px, with desktop/mobile screenshots inspected. Required CI and the new current-head preview are verified separately before handoff.
