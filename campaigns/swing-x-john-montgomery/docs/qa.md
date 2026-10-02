# Sunday Edit verification

Verified 2026-09-23 in the isolated `codex/sunday-edit` worktree. These are local results, not a deployed-site or real-device certification.

## Automated evidence

`npm run check`: 10 unit tests and 75 browser tests passed in the latest full run. Chromium, Firefox, and WebKit each exercise the complete editorial journey, five widths (320, 390, 768, 1024, 1440), no-JavaScript content, all product views, native film, reduced motion, failed media, keyboard navigation, and doubled text sizing.

The release test scrolls to and decodes every campaign/product image, then plays the film and checks page errors and external requests. Axe WCAG 2.0/2.1/2.2 AA scans return no violations in all three engines. This is automated evidence, not a substitute for human accessibility review.

Policy tests reject changed source bytes, missing files, traversal, escaping source symlinks, unknown/omitted IDs, changed product descriptions, and unapproved destinations. Output auditing parses actual HTML, rejects active inline content/external resources, and verifies hashed output bytes. No signed Drive URLs are checked in or shipped.

Output audit: 30 distinct source photographs and six supplied films. Gzipped JS: 706 bytes. Gzipped CSS: 3,954 bytes. Alternative image files total 23,073,851 bytes in storage; a visitor fetches only selected responsive candidates. All three browsers pass the 1 MiB initial-media and 8 MiB complete-visit image-transfer budgets, with reduced motion enabled for image-only measurement. Normal playback requests films as they enter view.

## Performance sample (initial single-film build)

A fresh Chromium context, 390×844 CSS pixels, DPR 2, 4× CPU slowdown, 150ms added latency, 200,000 bytes/second download, and 93,750 bytes/second upload measured:

- LCP: 1,976ms.
- CLS: 0.
- Initial resource transfer: 382,412 bytes.

Measured locally with PerformanceObserver after network idle. The sample does not represent production hosting, CDN latency, field INP, or a population percentile. INP is unmeasured. Repeat measurement against the actual staging host.

## Visual inspection

Inspected desktop and mobile cover, full-page captures, collaboration-story section, and product views. Portraits retain natural proportions, C06 remains full-frame, and all six product views are visible without hover or scripts. The current machine renders the supplied system type stack as Snell Roundhand/Baskerville; exact cross-platform font appearance remains conditional on licensed local font files.

## Findings resolved during implementation

- Headline line break initially lost its inter-sentence space in textContent; a literal space now preserves the approved sentence for text readers.
- Firefox's no-script test cannot await the media play Promise reliably through the test harness. It now uses the real native play button; other engines verify playback directly.
- WebKit on macOS uses Option-Tab to include links by default. The keyboard test follows that native convention, with no product-code workaround. [Apple keyboard reference](https://support.apple.com/en-kg/guide/safari/cpsh003/mac).

## Outstanding release checks

- Marketing's final desktop/mobile review and licensed font files or explicit approval of the system fallback.
- Real iOS Safari/touch-device check and manual screen-reader assessment; WebKit automation is not a physical iPhone.
- Production route/header/media-range integration, parent cookie-scope review, and launch indexing decision.
- Product destinations remain intentionally absent in this scope.


## Final independent review

The fresh reviewer found two Important issues and no Critical or Minor issues. Both were accepted and fixed in one regression-driven pass: film dimensions now require positive safe integers and are escaped when rendered; the masthead wraps and film content can shrink/wrap at narrow widths. The new invalid-dimension test and 320/390px doubled-text cases failed before the fixes and passed afterward. The complete suite then passed (10 unit, 63 browser cases). No second reviewer pass was performed.

The reviewer did not certify final fonts, creative approval, physical devices, screen readers, or production hosting. Those remain explicit release checks. The author reran the full suite after review and previously inspected the complete source film frame sequence; independent review covered its provenance, not the whole clip.

## Motion update verification

All six clips automatically play muted and loop when visible in Chromium, Firefox and WebKit. Tests verify offscreen pause, reduced-motion changes, persistent manual pause, failed requests and no-script controls. Axe scans pass after fixing alternating-panel contrast. Desktop and mobile motion panels were visually inspected. All 30 photographs remain present.

## Revised editorial sequence

One Sunday Edit heading now separates two mixed-media collages, each containing three videos. A regression test verifies the exact six-part reading order and absence of repeated film-copy panels. All 10 unit and 72 browser checks pass; mobile and desktop collage compositions were inspected.

Caption and spacing refinement: zero figcaptions remain, while image alt text and product names stay intact. Desktop and mobile collages were inspected with varied column proportions, compact row spacing and uninterrupted white backgrounds. The full suite remains green (10 unit, 72 browser cases).

Scrapbook overlaps verified visually on desktop and mobile; all 10 unit and 72 browser tests pass. Overlaps are limited to selected photographs, with white borders and separate mobile offsets.

Latest row removal: second-collage rows 1 and 3 are absent; a regression checks the retained original spreads 5 and 7. Current artifact audit verifies 24 photographs and four videos. All 10 unit and 75 browser cases pass. Earlier media totals above document previous iterations.
