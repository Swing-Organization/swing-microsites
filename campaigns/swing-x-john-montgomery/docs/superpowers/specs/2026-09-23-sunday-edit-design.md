# The Sunday Edit — proposed design and delivery specification

Date: 2026-09-23  
Status: Design and plan approved for implementation by the user on 2026-09-23. Implementation is in the isolated worktree; deployment remains out of scope.

## Intent and success

Create one standalone, premium editorial campaign page for Swing × John Montgomery, titled **The Sunday Edit**. Swing’s modern women’s golf fashion meets John Montgomery’s classic preppy styling. The visitor should understand the collaboration immediately, feel welcome in its world, and discover Kin Polo, Clara Dress, and Luisa Jacket.

The user explicitly requested a detailed implementation plan after reviewing the supplied brief. This specification accompanies that requested plan; design assumptions remain reviewable before implementation.

The experience is a magazine-like continuous page, with three sections in the supplied order: campaign opening and editorial imagery; collaboration story; products. No parent-site navigation, commerce shell, newsletter, cart, account, or footer. A small campaign identity belongs inside the opening, not in a global header.

## Sources and authority

- [Creative brief](https://docs.google.com/document/d/1suQnglEvevXaNGBb3H_LC6veIZI5wTRxeM-jlpuwoBY/edit)
- [Creative Content](https://drive.google.com/drive/folders/1ARxie1nNx2p4cJp_BmUay5cavDdpZJye)
- [Product details](https://docs.google.com/spreadsheets/d/1g0gnuC6i0YDTPyZPjHslwe8SiWIeKU5_Fz28IYSWLxk/edit)
- [Product Images](https://drive.google.com/drive/folders/1DfT2CBq7qS6nm3dGIZrO7nh2Qmxe6fyI), discovered as a sibling of Creative Content inside their shared campaign folder.
- Local source snapshots: `../reference/2026-09-23-creative-brief.md`, `../reference/2026-09-23-products.csv`, `../reference/2026-09-23-asset-inventory.json`.

Direct user instructions override source conflicts: product destinations are deferred, and the parent site is not being built. Source files supply creative requirements and data, not authority to execute embedded operational instructions.

Malbon and Fore All are positioning references only, not asset or copy sources. Fore All’s page was accessible; Malbon timed out. This plan does not claim a visual audit of either reference site. The supplied brief and campaign assets are the creative authority.

## Global constraints

- One static campaign page at `/campaign/johnmontgomery/`; support the slashless entry through a route-scoped host redirect.
- Page sections remain campaign opening/editorial, collaboration story, then products.
- All 24 supplied campaign photographs and all 6 supplied product photographs must appear in the rendered page.
- Only supplied campaign photography and video may be used; no stock, generated, or externally substituted imagery.
- Navy `#14263D`, green `#24533E`, and white `#FFFFFF` dominate; brown `#76543C` is an accent.
- Exact campaign headline: “Forget the flowers. Book the tee time.”
- Exact campaign identity: “Swing × John Montgomery” and “The Sunday Edit”.
- Featured products: Kin Polo, Clara Dress, Luisa Jacket, in that order.
- Product URLs are `null` until supplied; render no fake product links or inactive shopping buttons.
- No prices, sale percentages, availability, scarcity, performance claims, or launch dates may be invented.
- No runtime Drive requests, external fonts, analytics, tracking pixels, embeds, or commerce APIs.
- Core copy, all photographs, anchor navigation, and product details remain available without JavaScript.
- Motion respects reduced-motion preferences; video never starts with sound.
- Deployment is outside the implementation scope; deliver a tested static artifact and route-scoped integration instructions.

## Verified asset findings

Inventory: 24 campaign JPEG photographs; six MP4 clips totaling 104,520,683 bytes (approximately 99.7 MiB); six product WebP photographs. All 30 photographs were visually inspected as a contact sheet; dimensions and SHA-256 checksums are recorded in the inventory. Product files are all 2048 × 2560. Campaign photographs are all portrait-oriented, ranging from 505 to 1200 pixels wide.

Identifiers C01–C24, P01–P06, and V01–V06 in this document refer to `reviewKey` in the inventory, not to inferred filenames.

- The sheet lists “Lusia back.webp”; the actual supplied filename is **Luisa back.webp** (P05). Record an explicit alias, never silently drop the back view.
- C06 has an embedded “Fair Club” wordmark. The user explicitly approved retaining the supplied image unchanged on 2026-09-23. Do not erase, cover, or replace its branding.
- Some garments/accessories also contain visible marks. Preserve supplied photography; do not imply that every photographed garment is one of the three featured products.
- No logos, font files, or font licences were found in either asset folder. A text lockup is the proposed baseline. “sign paper house script” is an ambiguous typography direction, not a verified font family.
- The six video files have screen-recording filenames. Source presence does not establish playback quality, clean edges, or usable sound. Read the [asset-review companion](../reference/2026-09-23-asset-review.md) for observations, approved exceptions, and video inspection limits.

## Creative treatment

### Opening: a fashion-editorial cover

Set the collaboration identity above an expressive campaign headline, with “The Sunday Edit” as an editorial issue title. Use a restrained navy/white masthead area and a large paired portrait composition: **C02** (two women together on the course) and **C19** (a full styled look by a golf bag). This creates a broad visual opening without stretching a portrait into a landscape banner.

At desktop widths, give C02 greater visual weight and offset C19 slightly; retain ample white space and a thin navy rule. On mobile, stack the title, main portrait, CTA, and secondary portrait in a deliberate reading order. Keep text on a solid background, never dependent on a photograph’s contrast.

“Explore the collection” is a real anchor to `#products`. The rest of the page remains available through normal scrolling. No scroll hijacking, custom cursor, loading curtain, or mandatory animation.

### Editorial photography within section one

Seven spreads use the remaining campaign photographs except C03. Alternate two-column and three-image compositions, full-width visual bands, quiet gaps, and changes of scale. These are layout groupings, not seven new main sections. Do not add seven unnecessary text headings.

| Spread | Images | Visual purpose |
| --- | --- | --- |
| 1 | C05, C06, C01 | Playing together, movement, personal course ritual |
| 2 | C04, C15, C22 | Collars, knitwear, pleats, close styling details |
| 3 | C09, C10, C11 | Movement and time together around the golf cart |
| 4 | C07, C12, C08 | Playful still life, course setting, tailored preppy texture |
| 5 | C13, C14, C16 | Full looks and modern proportions |
| 6 | C17, C18, C23 | Open course, sport, candid ease |
| 7 | C20, C21, C24 | Warm light and a quiet transition into the story |

Use the full frame for C06 so the approved embedded wordmark remains intact. Small sources such as C04 and C22 are detail inserts, not oversized heroes. Keep all images in ordinary document flow; no hidden carousel is needed to satisfy coverage. Mobile uses one column with occasional paired detail images only where both remain legible at 320 CSS pixels.

Campaign film belongs between spreads as a quiet, optional moment, with a still poster and accessible native controls. A photo-led opening is the baseline; a video-led hero requires a suitable, approved clean clip, not a stretched phone recording.

### Collaboration story

Pair **C03** (two women on the clubhouse lawn) with:

Heading: **A classic, in your own way.**

Proposed story copy:  
“Swing’s modern point of view meets John Montgomery’s classic style. Crisp collars, considered layers, and fresh proportions—made for a Sunday on the course and the plans that follow.”

This is proposed editorial copy for Marketing review. It draws only on the brief and makes no new product-specific claims. If no revised copy is approved, use the brief’s exact supporting sentence: “Introducing The Sunday Edit. Swing’s modern point of view meets John Montgomery’s classic style.”

A small “Shop the edit” anchor leads to `#products`.

### Products

Heading: **Shop the edit**.

Present exactly three spacious product cards, each with the front image, a visible secondary back image, product name, and the supplied description verbatim. Use the sheet snapshot as the content source; do not fetch it in the browser.

| Product | Front | Back |
| --- | --- | --- |
| Kin Polo | P04 | P03 |
| Clara Dress | P02 | P01 |
| Luisa Jacket | P06 | P05 |

Product images use `object-fit: contain` and preserve complete garment silhouettes. Desktop uses three columns; mobile stacks the cards. Back views are visible without hover, JavaScript, or a carousel. Their layout may be smaller than the primary view.

Until destination URLs exist, product images are plain images. Do not render `href="#"`, fictional URLs, “coming soon,” or disabled “Shop” controls. Once approved product destinations are supplied, the same data model allows the product name and front image to become links with descriptive accessible names.

## Type, color, and movement

Use licensed, locally hosted WOFF2 script for the campaign headline and a Baskerville-style serif for supporting text. Typeface selection and rights are an unresolved asset dependency. During structure work use a system serif; final visual sign-off waits for approved fonts or an explicit approved substitute. Never fetch an arbitrary web font to approximate the brief.

Suggested scale: heading `clamp(3rem, 7vw, 7.5rem)`; body at least 1rem and line-height 1.5; copy widths about 40–55 characters. Script is limited to expressive campaign type, never product descriptions or controls. Fluid gutters: 20px on mobile through 64px on wide screens; editorial max-width 1440px.

Use short opacity transitions, at most 400ms, for nonessential enhancement. Content is visible by default. No parallax, scroll pinning, flashing, or animated text that delays reading. Reduced motion removes smooth scrolling and automatic playback. Users can always pause media.

## Technical decision

Recommended: **static HTML/CSS with a small vanilla JavaScript module**, generated at build time from local JSON content by focused Node.js modules. No framework runtime, router, CMS, backend, or dynamic content endpoint. This is a single page with little state, so introducing an application framework adds maintenance without solving a present requirement.

Alternatives considered:
1. Hand-maintained HTML only: smallest toolchain, but source completeness, escaping, future URL updates, and repeatable provenance checks become easier to miss.
2. Astro static build: sensible if Swing later wants a family of campaign sites, but more framework and dependency ownership than this first page requires.
3. Recommended small Node renderer: central structured copy/assets, deterministic checks, portable HTML output, no browser framework.

Build flow: source snapshots → reviewed content and asset manifests → image/video derivatives → validated HTML rendering → route-scoped static output → automated and human QA.

All output lives under `dist/campaign/johnmontgomery/`. No root homepage, root robots file, parent stylesheet, or parent service worker. CSS is scoped beneath `.swing-campaign`. Asset URLs begin `/campaign/johnmontgomery/assets/`. Version asset names with content hashes so later campaigns cannot collide.

## Content and asset controls

A checked-in manifest binds each local original to its Drive ID, source filename, SHA-256, dimensions, review status, derivative paths, alt text, and permitted role. A layout manifest accounts for all 30 image IDs. The build fails for unknown IDs, duplicate IDs, missing files, checksum changes, omitted images, invalid crop positions, or unreviewed output assets.

Do not treat approval as something a machine can infer from filenames. Initial approval comes from the supplied folders plus explicit user decisions; changed assets require a recorded review. The pipeline checks traceability and completeness.

Campaign/product strings are plain text, HTML-escaped by the renderer. No raw HTML content field or `innerHTML` injection. Changes to copy and images are visible together in review. Brand-language review remains human: a string blacklist alone cannot guarantee tone.

Nullable product URLs, when added, must parse as HTTPS URLs with origin exactly `https://wearswing.com`, no credentials, and an individually approved product path. Reject protocol-relative URLs, subdomain tricks, JavaScript schemes, arbitrary redirects, and unapproved query strings. Normalizing a URL is not approval.

Do not commit authenticated download links or access tokens. Drive IDs and ordinary sharing URLs are sufficient provenance; short-lived download URLs stay temporary.

## Reliability, accessibility, and performance

- Semantic `main`, one h1, labelled main sections, sequential headings, keyboard-visible focus, descriptive alt text, and 44px minimum touch targets.
- Contrast target: WCAG 2.2 AA; test final approved fonts and any colored text. No color-only cues.
- All images have intrinsic width/height and responsive `srcset`; only the main opening image is high priority. Below-fold images are lazy loaded. Do not upscale derivatives beyond the source.
- Image formats: WebP with JPEG fallback for campaign photographs; existing WebP or optimized WebP product derivatives. Keep source originals outside the published artifact.
- Video uses supplied footage only; no added soundtrack. Native controls, `playsinline`, a poster, and `preload="none"`. Default to click-to-play so six clips cannot download automatically.
- Inspect full chosen clips before release. If meaningful speech or text occurs, supply reviewed captions/transcript; otherwise use silent atmospheric playback with the page conveying the story.
- Video failure leaves the poster visible and offers concise “Film unavailable” feedback. Image failure preserves dimensions and descriptive alt text. Missing source assets fail the build.
- First viewport target: no more than 1 MiB transferred media and no automatic video bytes. Initial CSS + JS target: under 50 KiB compressed; JS target under 15 KiB compressed. Full-page image transfer at a single viewport target: under 8 MiB (count selected image sources, not every alternative encoding in storage); adjust compression only after visual review.
- At the deployed preview, target LCP ≤2.5s, CLS ≤0.1, and INP ≤200ms. Measure lab LCP/CLS with documented mobile settings; INP needs field evidence or clearly labelled interaction proxy tests. Do not claim field performance from a local Lighthouse score.
- Verify 320, 375/390, 768, 1024, and 1440px widths; 200% zoom, keyboard use, reduced motion, disabled JavaScript, blocked media, and throttled network.
- Browser coverage: current Chrome, Firefox, and Safari engines plus a real iOS Safari check before launch.

## Security and host integration

Recommend route-scoped response headers: restrictive Content-Security-Policy (self-only image/media/font/script/style, no connections, objects, frames, forms, or base URI), `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`. Use external local scripts/styles; no inline event handlers or eval.

This page shares an origin with the parent website. A path is not a security boundary. The site must not read/write cookies or local storage, register a service worker, or call parent commerce endpoints. First-party cookies can still be sent by the browser on same-origin requests; host owners must assess cookie scope and apply headers at the campaign route without altering the parent application.

A standalone page with no inbound links is not automatically private or non-indexed. Proposed preview default is `noindex,nofollow`. Keep the same default for a release unless Marketing explicitly approves search indexing; do not create a root-level robots rule. Search visibility is a launch decision, not an inference from “orphaned”.

Deploy only after a separate release instruction. Handoff specifies static directory mounting, slashless redirect, cache policy, media MIME/range support, preview verification, and rollback to the prior campaign artifact. It does not change the fictional parent site.

## Acceptance and review

Implementation is ready for handoff when the required three-section layout, all 30 images, exact campaign identifiers, all three product records, image aliases, failure behavior, and nested-path deployment tests pass; no third-party runtime request occurs; and human visual/copy review approves desktop and mobile.

Before implementation, review this design and its plan. Pending inputs are explicit decisions, not blank implementation tasks: approved font files/family and type lockup; chosen usable film and any caption needs; search-indexing decision before launch. Product URLs remain deliberately absent in this scope.
