# Footwear Launch Implementation Plan

**Goal:** Build Swing Tennis as a five-part editorial campaign with display-only products.
**Architecture:** Campaign-local static renderer, CSS, content manifest, hash-verified build and output audit. Reuse shared film behavior and the existing immutable private media store; preserve both existing routes.
**Tech stack:** Node 24, Sharp, HTML/CSS, Playwright, axe.
**Spec:** Drive creative brief 1VvH76mLi6SGu1Ow9sM8De6Gql1vt2zS789N_-5IVe1k, revision 2026-10-06T10:24:07.513Z; marketer override 2026-10-06 explicitly approves existing golf media as test stand-ins.

## Requirements and design
- Route /campaign/footwear-launch/; campaign-local source, tests and documentation.
- Exact hero: A New Court. The Same Swing. Supporting line: Meet Swing Tennis. Your afternoon starts here.
- Five sections: entrance, next chapter, doubles partners, après, closing invitation.
- Ivory #f6f3e9, green #234c39, blue #d7e5ed, yellow #e5eb80. System Georgia editorial type and sans-serif supporting text; no external fonts.
- Hero: oversized type left, C02 friendship image right, fine court-line geometry. Next chapter: C03 plus V01 with concise story. Collection: equal-width Kin Polo P04, Clara Dress P02, Luisa Jacket P06 and source-grounded descriptions. Après: V03 and C20. Closing: green field and Explore Swing Tennis anchor.
- Two videos separated by collection; controls, posters, manual pause, offscreen pause, reduced motion and failure fallback.
- Product cards have no links/prices. Both primary CTAs target #collection. No inferred tennis performance or footwear products.
- Keep truthful alt text for actual stand-in images. Only front product photos; no need to resolve unused back filename.
- Mobile: single-column hero and editorial groups; product cards stack; no sticky obstruction or horizontal overflow.
- Source file IDs, hashes and original names in content/site.json. Source images are ignored, never committed. Remote CI restores exact assets from existing pinned store.

## Tasks
1. Write contract tests for section order, exact copy, display-only products, safe media and escaping; observe failure. Implement src/page.mjs and src/style.css. Use build()/auditOutput() interfaces in campaign-local scripts.
2. Register campaign in deployment/campaigns.json. Build and audit new route; verify unchanged existing registry entries. Tests exercise wrong checksum and refusal to overwrite unowned output.
3. Browser tests at desktop/mobile: links scroll, no overflow, images resolve, no JS, keyboard, axe, reduced motion and video error/manual pause. Review screenshots and representative video frames.
4. Run unit suite and new-campaign browser coverage locally. Required CI executes complete multi-route build/audit and three-browser suite. Open PR, verify exact-head checks and staging headers/media before handoff. No merge without explicit release approval.

## Review focus
No-JS rendering; reduced-motion playback; failed media; noninteractive product semantics; fresh-checkout private media restoration. All must be checked before verified handoff.
