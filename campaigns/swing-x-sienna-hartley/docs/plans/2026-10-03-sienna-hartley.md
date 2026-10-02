# A Round with Sienna — Implementation Plan

**Goal:** Build the approved photography-led scrapbook, introducing Swing to Sienna's followers before equal product discovery.
**Architecture:** One static campaign module registered at /campaign/siennahartley/, independent of the existing campaign. Reuse only shared escaping and film behavior. Node 24 and Sharp produce responsive local imagery; no external runtime dependencies.
**Spec:** [Approved creative brief](https://docs.google.com/document/d/1MSRc1_Byf8JFkLq2-iBuiX48P2UL8PFRYaIq8kAcrTw/edit).

## Requirements and provenance
Campaign folder: 1LyvCkf80LKjPLMYlDVsJfEjd_q0z4ru2. Creative folder: 1ARxie1nNx2p4cJp_BmUay5cavDdpZJye. Product folder: 1DfT2CBq7qS6nm3dGIZrO7nh2Qmxe6fyI. Product sheet: 1bOMzB8URYtRuABHIPvXqbs_t00Pvztu9wtshIGtBWDY.
Dusty pink #ead5d0, warm brown #503b30, cream #faf6ee. Serif display, readable system body font, selective system cursive accents; disclosed fallback, no downloaded fonts. Swing narrates, no attributed quotes. No invented pricing, claims or destinations. All three products get equal cards, front/back images and factual descriptions. Shopping URLs remain null.

## Design and media sequence
1. Pink masthead and oversized serif “A Round with Sienna”; overlapping C19 and C02 paper photographs, C01 detail.
2. Intro on cream, then C14 + V01 + C21: first tee, moving moments, afternoon light.
3. Equal three-product detail strip: P04 Kin, P02 Clara, P06 Luisa.
4. Brown editorial spread: C20 + V03 + C09, relaxed afternoon story.
5. Cream collection section with three equal product cards, native front/back details and factual copy. Noninteractive shopping label while destinations are unset.
6. Pink closing with C03 and a small collaboration credit.
Video moments are separated by stills and product imagery. No requirement to use every file. Images reviewed in a contact sheet and films inspected at representative frames; avoid prominent third-party text in selected stills. Do not identify models as Sienna or claim editorial garments are the listed products.

## Files and tasks
- [x] content/site.json: campaign content, products, selected media manifest, film derivative checksums; private originals stay ignored. Current Drive IDs and SHA256s match existing pinned assets-source/sunday-edit; restore that verified store into this campaign's own assets-source. No media-lock change needed.
- [x] tests/unit/site.test.mjs: verify equal product records, null destinations, pinned source hashes, and safe output ownership. Browser and output checks verify the actual selected media and local URLs.
- [x] scripts/build.mjs: export build() producing isolated dist/campaign/siennahartley, hash-verify sources and film derivatives, emit responsive WebP and local CSS/JS.
- [x] src/page.mjs and src/style.css: semantic static HTML, restrained overlapping paper photos, responsive typography, native video controls and error posters, keyboard focus and no-JS product access.
- [x] scripts/audit-output.mjs: export auditOutput(), validate local references and reject source originals/leaks or external URLs.
- [x] tests/e2e/site.spec.mjs: mobile/desktop overflow, accessible navigation, no-JS content, image health, playback/reduced motion/fallback; Axe scan.
- [x] deployment/campaigns.json and README.md: add campaign, preserve existing entry, document shared exact media reuse.
- [x] npm run check and deployment packaging; inspect screenshots.
- [ ] Push branch, open PR and verify current-head CI and actual preview URL.

## Review focus
Missing media fails build. Reduced-motion visitors receive paused native controls. Broken video displays poster/status. Narrow screens stack paper layouts without overflow. Empty shopping destinations never render fake links. Preserve existing campaign artifact. Deployment and exact-head preview must pass before handoff; production requires separate explicit approval.
