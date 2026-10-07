# The Sunday Set Implementation Plan

> Execute in this session using the Swing create-microsite workflow. Build and staging are authorized; production requires explicit approval of the verified version.

**Goal:** Launch a reviewable, image-led Swing tennis editorial at /campaign/sunday-set/.
**Architecture:** Campaign-local static renderer, responsive CSS, content manifest, hashed media build and output audit. Reuse shared HTML escaping and native film enhancement. Register alongside all three existing campaigns.
**Tech stack:** Node 24, sharp, parse5, Playwright 1.63.0, axe; system Georgia/Arial fonts, with no external font requests.
**Spec:** Sunday Set Google Doc 13Q-3-O8M-DFk8HlW4C_vi8P-IpNA8oy9OKU3rD5PcXQ, revision read 2026-10-07; complete brief read and retained only in the ignored workspace record.

## Requirements and decisions
- Audience: existing Swing golf customers and a new tennis audience. Fashion magazine, friendly California club mood, minimal captions.
- Exact headline: “A new court, the same swing.”
- Warm ivory #f4f0e5, court green #153e32, sky blue #d5e2ea, tennis yellow #e3e877. Georgia editorial serif + Arial supporting sans are disclosed system fallbacks.
- Include every supplied original: 15 campaign JPEGs, five MP4s, six product WebPs. No stock/generated assets.
- Product order: Kin Polo, Clara Dress, Luisa Jacket. Equal-sized two-view stories and equal shopping placement.
- User confirmed the current green sleeveless Clara images with name only on 2026-10-07. Do not use conflicting patterned-polo description. Luisa spelling in sheet resolves to supplied Luisa filenames.
- All collection and product shopping placements are plain, non-focusable text. No fabricated links/prices. In-page editorial navigation can use real anchors.
- Source media lives only in private fernando-espinoza/swing-microsites-media; source metadata/checksums and code live here.
- No parent storefront/navigation, account/cart, external media requests, or indexing.
- Keep existing routes and hosting/CI configuration intact.

## Section and media map
1. Cover: C5; campaign masthead, exact headline, understated collection placement.
2. Love, all: C4, C8, V1. Portraits and a film, an invitation to doubles.
3. Kin Polo: P6 front, P5 back; C1 and C7 companion photos.
4. Better together: C9, C12, V3.
5. Clara Dress: P2 front, P1 back; C13 and C15 companion photos.
6. A little friendly competition: V2 and C3.
7. Club company: C10 and C11 still-photo spread.
8. Luisa Jacket: P4 front, P3 back; V5 shown in separate companion pane.
9. Courtside: C2 and C6 still-photo spread.
10. Stay a little longer: V4 and C14, then closing collection placement.
No adjacent film groups; still-photo/product spreads separate films.

## File contracts and tasks
### 1. Source manifest and reproducible build
- [x] Save complete brief/product provenance, original filenames, Drive IDs, modified times, visual alt descriptions and source SHA256 in content/site.json.
- [x] Store all originals and browser-extracted poster derivatives at private assets-source/sunday-set; record pinned media commit.
- [x] Test build rejects corrupt/missing source and unowned output before output mutations.
- [x] Implement scripts/build.mjs exporting build() and assertOwnedOutput(path); create responsive 360/720/1200px WebP variants without enlargement, hashed original MP4/posters, hashed styles/script.
- [x] Include registry route /campaign/sunday-set/ and exact private sourceDirectory/mediaDirectory. Confirm restoration from immutable source.

### 2. Editorial renderer and motion
- [x] Tests: all 26 original IDs represented; source strings escaped; all shopping prompts noninteractive; native film controls/posters/muted/inline and no autoplay attribute.
- [x] Implement src/page.mjs export renderPage(site, images, resources). No client-required content.
- [x] Implement src/style.css: spacious asymmetric desktop grid, consistent two-view products, 700px mobile reflow, 320px overflow protection, visible keyboard focus, reduced-motion support.
- [x] Product photos use contain; editorial photos preserve natural composition. Reserve aspect ratios for stable loading.
- [x] Reuse shared/client/film.mjs for offscreen/hidden-tab pause, manual pause, reduced motion and errors.
- [x] Implement scripts/audit-output.mjs export auditOutput(): verify local links/srcset/posters, full original coverage, fallback images, safe URLs, no inline code or source leaks.

### 3. Verification and staging
- [x] Browser tests at 390/1440px plus 320px overflow; loaded images, balanced product views, keyboard, reduced motion, manual pause, failed video, no-JS content and axe.
- [x] Run repository npm run check and packaging; verify all four routes. Inspect rendered desktop/mobile screenshots.
- [ ] Fresh independent review of entire change, resolve substantive findings.
- [ ] Commit and push codex/swing-x-sunday-set, create PR against main, wait for current-SHA Build and verify microsites and Vercel success.
- [ ] Verify actual returned preview path, headers, media and access; deliver link and PR, then request production decision.
- [ ] Shopping destinations must be supplied and verified before launch, invalidating this preview SHA and requiring renewed release approval.

## Acceptance / review focus
All original media visible in a coherent editorial sequence; products correctly named and equally emphasized; small viewport and no-JS content usable; video motion under visitor control; failures keep useful posters; source hashes enforced; no source/credentials leaked; prior routes preserved; current-head CI and preview verified separately.

