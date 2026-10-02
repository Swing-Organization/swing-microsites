# The Sunday Edit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. No execution method has been selected; do not dispatch agents or start implementation from this document alone.

**Goal:** Build a reliable, premium static editorial page for Swing × John Montgomery that uses all supplied photographs and introduces the three approved products.

**Architecture:** Generate complete HTML from reviewed local JSON using small Node.js rendering modules, with scoped CSS and optional vanilla JavaScript for film behavior. Validate content, source checksums, asset completeness, and URLs before writing a route-contained static artifact. No browser framework, backend, CMS, or runtime third-party service is required.

**Tech Stack:** Node.js 24 LTS, ES modules, semantic HTML, CSS Grid/Flexbox, native video, Node’s built-in test runner; build/test-only Sharp, Playwright, and axe-core integration. Pin exact dependency versions and the tested Node 24 patch during implementation; commit the lockfile. No production runtime packages.

**Spec:** [Proposed design](../specs/2026-09-23-sunday-edit-design.md). Read it and the [source inventory](../reference/2026-09-23-asset-inventory.json) before any task.

**Status:** Approved for native execution on 2026-09-23. Implementation and automated QA are complete subject to final branch review; see ../../sunday-edit/qa.md. Licensed typography, final creative approval, and real-device checks remain release gates. No deployment or parent-site changes are included.

## Global Constraints

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


## Review Focus

1. Nested campaign URLs and slashless entry must load assets without changing parent routes — Tasks 3 and 8 test document/asset paths and host mapping.
2. Missing, substituted, or incomplete source files must stop the build, including the Luisa filename alias and all 30 photographs — Tasks 1 and 2 test hashes, coverage, and mapping.
3. No JavaScript, blocked video, or reduced motion must preserve the complete readable page — Tasks 5 and 7 test those visitor conditions.
4. A future malicious/mistyped product URL or HTML-like content must not create script execution or an unapproved destination — Tasks 1, 3, and 6 test escaping and URL allowlisting.
5. Narrow screens, large text, or slow-loading fonts must not hide copy, crop garments, or cause sideways scrolling — Tasks 4, 6, and 7 test mobile layout and zoom; final human review verifies type and crops.

---

## Starting state and delivery boundaries

Repository inspection found only `README.md` and one initial commit (`9afbb43`), with no application framework, build system, tests, or applicable AGENTS.md. Recheck before execution because the repository may change. Preserve unrelated changes.

This plan creates one campaign, not a reusable microsite platform. Do not add commerce, sign-up forms, analytics, search, navigation, a CMS, consent UI, or deployment automation. The review documents are intentionally separate from publishable files.

Recommended execution: native sequential implementation, because the eight tasks share a small content/asset contract. Use independent final review if available and authorized by the selected workflow.

## File structure and ownership

```text
package.json                         Commands and exact build/test dependencies
package-lock.json                    Reproducible dependency resolution
.nvmrc                               Tested Node 24 patch
.gitignore                           Excludes sources/downloads, dist, QA output, secrets
content/sunday-edit/campaign.json     Identity, exact/proposed copy, section order
content/sunday-edit/products.json     Three exact records and nullable approved URLs
content/sunday-edit/assets.json       Provenance, hashes, dimensions, alt, review state
content/sunday-edit/layout.json       All image IDs assigned to editorial roles
content/sunday-edit/review.json       Recorded font/copy/media decisions
assets-source/sunday-edit/            Local originals; ignored, never published
scripts/content-policy.mjs           Pure copy/URL/manifest validation
scripts/prepare-media.mjs            Validated local originals to image derivatives
scripts/build.mjs                    Validation → render → write route-contained output
scripts/serve.mjs                    Local artifact server, MIME, path safety, byte ranges
scripts/audit-output.mjs             Coverage, paths, runtime resource and size audit
src/render/html.mjs                  Plain-text/attribute escaping
src/render/image.mjs                 Responsive image markup and intrinsic dimensions
src/render/editorial.mjs             Cover, seven spreads, collaboration story
src/render/products.mjs              Front/back product cards and nullable link wrapping
src/render/page.mjs                  Document metadata and three-section composition
src/styles/campaign.css              Scoped editorial visual design and responsive rules
src/client/film.mjs                  Small media enhancement; no network API calls
tests/unit/content-policy.test.mjs   Source identity, coverage, URL cases
tests/unit/media.test.mjs            Derivatives, dimensions, paths, hashes
tests/unit/render.test.mjs           Static structure, escaping, links, source coverage
tests/e2e/editorial.spec.mjs          Layout and no-JavaScript visitor journey
tests/e2e/film.spec.mjs               Playback failure and reduced-motion behavior
tests/e2e/products.spec.mjs           Product facts, front/back visibility, future links
tests/e2e/release.spec.mjs            Accessibility, requests, route and budget checks
playwright.config.mjs                Chromium, Firefox, WebKit and local test server
docs/sunday-edit/asset-review.md      Source/derivative review and media decisions
docs/sunday-edit/handoff.md          Commands, safe edits, host contract, rollback
docs/sunday-edit/qa.md               Real test results and human review evidence
dist/campaign/johnmontgomery/        Sole public artifact; index.html and assets/
```

Do not create empty modules solely to match the tree. Each task creates the files needed for its deliverable; keep the render modules small.

## Shared interfaces

Use JSON, not executable content. Runtime records have these shapes (JSDoc typedefs in `content-policy.mjs`; this notation documents fields, not a required TypeScript dependency):

```ts
type Product = {
  id: 'kin-polo' | 'clara-dress' | 'luisa-jacket';
  name: string;
  description: string;
  front: string; // P04, P02, P06 respectively
  back: string;  // P03, P01, P05 respectively
  href: string | null;
};
type Asset = {
  id: string; driveId: string; sourceFilename: string; sourceSha256: string;
  kind: 'image' | 'video'; sourcePath: string;
  width: number; height: number; alt: string;
  approved: boolean; // recorded review, not inferred by the build
};
type ImageVariant = {
  src: string; width: number; height: number;
  format: 'webp' | 'jpeg'; bytes: number;
};
type PreparedImage = {
  id: string; alt: string; width: number; height: number;
  variants: ImageVariant[];
};
type Layout = {
  hero: ['C02', 'C19'];
  spreads: string[][];
  story: 'C03';
};
type Campaign = {
  title: string; collaboration: string; headline: string;
  intro: string; storyHeading: string; story: string;
  basePath: '/campaign/johnmontgomery/';
  indexing: 'noindex,nofollow' | 'index,follow';
};
type Film = {
  sourceAssetId: string; // V01–V06; only a reviewed selected clip
  src: string; posterSrc: string; // hashed campaign-relative output paths
  width: number; height: number; posterAlt: string;
  sourceStartSeconds: number; sourceEndSeconds: number;
  captionSrc: string | null; // reviewed local VTT if meaningful audio is retained
};
type Site = {
  campaign: Campaign; products: Product[]; assets: Asset[]; layout: Layout;
  approvedProductUrls: string[]; films: Film[];
};
```

Public function contracts:

- `validateSite(site: Site): void` throws an actionable error for invalid data.
- `validateProductUrl(value: string | null, approved: string[]): string | null`.
- `verifySources(assets: Asset[], sourceRoot: string): Promise<void>` verifies identity, path containment and bytes.
- `prepareImages(assets: Asset[], sourceRoot: string, outputRoot: string): Promise<Record<string, PreparedImage>>`.
- `escapeHtml(value: string): string` escapes text and quoted attribute values.
- `renderImage(image: PreparedImage, options: {priority?: boolean, className?: string}): string`.
- `renderEditorial(site: Site, images: Record<string, PreparedImage>): {opening: string, story: string}`.
- `renderProducts(products: Product[], images: Record<string, PreparedImage>, approvedUrls: string[]): string`.
- `renderPage(site: Site, images: Record<string, PreparedImage>): string`.
- `build({outDir: string, site: Site, sourceRoot: string}): Promise<void>`.
- `initFilms(root: ParentNode = document): void` enhances native videos only.
- `auditOutput(outDir: string): Promise<void>` rejects missing assets, omitted images, external resources, unsafe markup, or exceeded agreed budgets.

The renderer takes validated data, escapes text, and never interpolates an unvalidated path or class name. Asset variants use normalized output-relative paths; URL creation prepends the campaign basePath. Avoid arbitrary HTML/config extensibility.

Keep films empty during the image-only structure work. Add a Film record to campaign.json only after Task 2 produces and reviews its derivative/poster; the loader separates it into site.films. Only active selected videos enter site.assets; the complete six-video source inventory remains in the reference record. validateSite requires approval for every active asset. Final release acceptance requires at least one usable supplied film or an explicit Marketing-approved photo-only scope change; an empty array must never silently waive the brief.

## Task 1: Establish the approved content and provenance contract

**Files:** Create package files, ignore rules, `content/sunday-edit/*.json`, `scripts/content-policy.mjs`, `tests/unit/content-policy.test.mjs`, and `docs/sunday-edit/asset-review.md`.

**Consumes:** Source snapshots and the reviewKey/Drive-ID/checksum inventory.  
**Produces:** `Site`, `validateSite`, `validateProductUrl`, `verifySources`; reviewed content contract used by all later tasks.

- [x] **1.1 Recheck the workspace.** Run `git status --short`, `git branch --show-current`, and inspect any new AGENTS.md. Use the worktree skill at execution time if isolation is needed. Do not discard work.
- [ ] **1.2 Resolve typography ownership.** Record the user’s answer about fonts/text lockup in `review.json`. Obtain licensed local WOFF2 files before final styling approval, or record an explicitly approved substitute. No guessed font downloads.
- [x] **1.3 Create the minimum package and scripts.** Use Node 24; add exact build/test dependencies with the lockfile. Package scripts are:
  ```json
  {
    "type": "module",
    "scripts": {
      "test:unit": "node --test tests/unit/*.test.mjs",
      "media": "node scripts/prepare-media.mjs",
      "build": "node scripts/build.mjs",
      "preview": "node scripts/serve.mjs",
      "test:e2e": "playwright test",
      "audit": "node scripts/audit-output.mjs",
      "check": "npm run test:unit && npm run build && npm run audit && npm run test:e2e"
    }
  }
  ```
  Keep runtime `dependencies` empty; use `npm install --save-dev --save-exact sharp @playwright/test @axe-core/playwright` and verify the resolved packages support the chosen Node version. Ignore `node_modules/`, `dist/`, `assets-source/`, `test-results/`, `playwright-report/`, and secret environment files.
- [x] **1.4 Write policy tests before the validator.**
  ```js
  import test from 'node:test';
  import assert from 'node:assert/strict';
  import { validateProductUrl } from '../../scripts/content-policy.mjs';
  test('absent product destinations remain absent', () => {
    assert.equal(validateProductUrl(null, []), null);
  });
  for (const value of [
    'javascript:alert(1)', '//evil.example/p',
    'https://wearswing.com.evil.example/p',
    'https://wearswing.com@evil.example/p',
    'https://wearswing.com/p?redirect=https://evil.example'
  ]) {
    test('rejects unapproved destination ' + value, () => {
      assert.throws(() => validateProductUrl(value, []));
    });
  }
  test('accepts only explicitly approved exact product URLs', () => {
    const url = 'https://wearswing.com/products/test-approved-piece';
    assert.equal(validateProductUrl(url, [url]), url);
    assert.throws(() => validateProductUrl(url, []));
  });
  ```
  That product URL is a test fixture only; never put it in campaign data.
- [x] **1.5 Run the test and observe the missing-module/function failure.** Command: `node --test tests/unit/content-policy.test.mjs`.
- [x] **1.6 Implement strict URL validation.**
  ```js
  export function validateProductUrl(value, approved) {
    if (value === null) return null;
    if (typeof value !== 'string' || value.trim() !== value) {
      throw new Error('Product destination must be null or an approved HTTPS URL');
    }
    const url = new URL(value);
    if (url.origin !== 'https://wearswing.com' ||
        url.username || url.password || url.search || url.hash ||
        !approved.includes(value)) {
      throw new Error('Unapproved product destination: ' + value);
    }
    return value;
  }
  ```
  Add tests rejecting bare relative paths and credentials on the allowed host. Future query parameters require an explicit policy revision and tests.
- [x] **1.7 Populate exact content.** Copy all three descriptions from the CSV snapshot without paraphrase. Set all three href values to null. Use the brief’s exact supporting sentence until proposed story copy is approved. Record C06 retention approval. Map “Lusia back.webp” to P05’s actual “Luisa back.webp”.
- [x] **1.8 Validate completeness.** Derive used image IDs from `layout.hero`, every spread, `layout.story`, and every product’s front/back fields. Require exact set equality with the 30 image IDs; reject duplicate/unknown asset IDs, empty alt text, invalid dimensions, and missing approval records. Lock the three product IDs/names and source descriptions to the snapshot. Test removing C06, omitting P05, and substituting an unknown Drive ID; each must fail with the specific ID in the error.
- [x] **1.9 Verify source bytes.** Load only paths contained within `assets-source/sunday-edit/`; reject traversal, symlinks escaping the directory, and files with a changed SHA-256. Test a temporary file with changed bytes and a path `../outside.jpg`; both must fail. Use Node `crypto.createHash('sha256')` on actual file bytes.
- [x] **1.10 Run policy tests and commit the deliverable.** `npm run test:unit` must pass. Review the diff for credentials/temporary signed URLs. Commit message: `feat: define approved Sunday Edit content and asset policy`.

## Task 2: Prepare traceable, responsive media

**Files:** Create `scripts/prepare-media.mjs`, `tests/unit/media.test.mjs`; update `assets.json`, `review.json`, and `asset-review.md`.

**Consumes:** `Asset[]`, `verifySources`, inventory; local originals obtained through authenticated Drive downloads.  
**Produces:** `PreparedImage` map and a local generated media manifest consumed by the renderer.

- [x] **2.1 Fetch only inventory assets to ignored source storage.** Verify every source hash before processing. Reuse verified local originals if available; do not rely on this planning session’s temporary directory. Record newly changed source revisions for review rather than automatically updating hashes.
- [x] **2.2 Write a derivative test with a small temporary fixture.**
  ```js
  import test from 'node:test';
  import assert from 'node:assert/strict';
  import sharp from 'sharp';
  import { mkdtemp, readFile, rm } from 'node:fs/promises';
  import { tmpdir } from 'node:os';
  import { join } from 'node:path';
  import { createHash } from 'node:crypto';
  import { prepareImages } from '../../scripts/prepare-media.mjs';
  test('keeps source proportions and never enlarges a small image', async () => {
    const root = await mkdtemp(join(tmpdir(), 'swing-media-'));
    try {
      const file = join(root, 'sample.jpg');
      await sharp({create:{width:100,height:150,channels:3,background:'#24533E'}})
        .jpeg().toFile(file);
      const sourceSha256 = createHash('sha256').update(await readFile(file)).digest('hex');
      const result = await prepareImages([{
        id:'fixture',driveId:'test-only',sourceFilename:'sample.jpg',
        sourcePath:'sample.jpg',sourceSha256,kind:'image',
        width:100,height:150,alt:'Test fixture',approved:true
      }], root, join(root,'output'));
      assert.ok(result.fixture.variants.length > 0);
      for (const variant of result.fixture.variants) {
        assert.ok(variant.width <= 100);
        assert.equal(variant.height / variant.width, 1.5);
      }
    } finally { await rm(root, {recursive:true, force:true}); }
  });
  ```
  Synthetic fixtures are test-only bytes; they never enter campaign media.
- [x] **2.3 Observe the failing test**, then implement image processing. Use `sharp(input).rotate().resize({width, withoutEnlargement:true})` and preserve color correctly. Width candidates: 320, 480, 640, 960, 1280, 1600, filtered to the original width plus a native-width candidate where needed; deduplicate widths. Use WebP quality 82 and JPEG quality 85 as starting points, then inspect actual results. Derivative names include source ID, width, format, and a hash of output bytes.
- [x] **2.4 Record metadata from generated bytes.** Each variant gets its real width, height, byte length, and normalized local path. Copy originals nowhere into dist. Fail on corrupt sources, unknown output extensions, or any path escape. Add a test that corrupt JPEG bytes produce a named failure instead of a blank image.
- [x] **2.5 Review all six clips.** Read the [planning asset review](../reference/2026-09-23-asset-review.md). Planning metadata can be read but local frame decoding failed; do not assume damage or successful playback. Test each source in a browser/media decoder, watch the full candidates, and record duration, orientation, UI overlays, sound, and caption needs. Prefer one clean vertical film between spreads 3 and 4. Other usable clips may appear after spreads 1 and 6, but all six videos are not mandatory. If none is usable, keep the photographic design and request a clean supplied replacement before claiming the film requirement complete.
- [x] **2.6 Make web derivatives only from an approved clip.** Use a documented local encoder to create H.264 MP4, yuv420p, fast-start metadata, and at most 720px width without enlargement. Strip audio for the proposed atmospheric treatment; preserve the original. Record exact source/time range and a source-derived poster. Do not add music, new frames, retouching, or substitute imagery. A typical command, once the reviewed source path is entered:
  ```sh
  ffmpeg -i assets-source/sunday-edit/approved-film.mp4 -an \
    -vf "scale='min(720,iw)':-2" -c:v libx264 -crf 23 \
    -pix_fmt yuv420p -movflags +faststart generated-film.mp4
  ```
  `approved-film.mp4` is a local alias to a recorded inventory ID, not a new asset source. Rename/hash the final derivative through the same output policy. Do not install an encoder or select a film implicitly during plan review.
- [x] **2.7 Run media tests and inspect contact sheets.** Check all 30 image derivatives against originals, particularly C06’s unchanged wordmark and complete product silhouettes. Target under 8 MiB of selected image sources transferred during a full-page visit at one viewport; do not sum every alternative encoding in storage against that transfer budget. Commit code/manifests and review records, not temporary authenticated URLs. Commit message: `feat: prepare verified responsive campaign media`.

## Task 3: Generate a complete static page at the campaign path

**Files:** Create `src/render/html.mjs`, `image.mjs`, `page.mjs`, `scripts/build.mjs`, `scripts/serve.mjs`, `tests/unit/render.test.mjs`. Tasks 4 and 6 provide the editorial/product modules called by the final page.

**Consumes:** Validated `Site` and `PreparedImage` map.  
**Produces:** `escapeHtml`, `renderImage`, `renderPage`, `build`; usable static preview at the required path.

- [x] **3.1 Test escaping before implementation.**
  ```js
  import test from 'node:test';
  import assert from 'node:assert/strict';
  import { escapeHtml } from '../../src/render/html.mjs';
  test('treats HTML-like copy as text', () => {
    assert.equal(escapeHtml('<script>"x"&</script>'),
      '&lt;script&gt;&quot;x&quot;&amp;&lt;/script&gt;');
  });
  ```
  Run `node --test tests/unit/render.test.mjs` and confirm failure before adding the function.
- [x] **3.2 Implement one shared escaping function.**
  ```js
  export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[character]);
  }
  ```
  Validate names/paths separately; escaping does not make a URL trustworthy.
- [x] **3.3 Render images with stable geometry.** `renderImage` emits `picture`, format-appropriate srcsets and sizes, one `img[data-asset-id]`, exact alt text, width/height, and lazy/async settings. Only C02 receives `loading="eager" fetchpriority="high"`. Read variants exclusively from the prepared map.
- [x] **3.4 Render the document shell.** Include lang=en, viewport, title “The Sunday Edit | Swing × John Montgomery”, description from approved intro, preview robots policy, one h1, and one main with three labelled sections. For this task, render the escaped headline/intro in campaign, the approved supporting sentence in story, and the three product names/descriptions in products directly in page.mjs. Tasks 4 and 6 replace those simple bodies with their render modules. Link stylesheet/module files only after they exist; use external JS/CSS, never inline handlers. Task 3 acceptance covers valid standalone HTML and the route, not the final creative treatment.
- [x] **3.5 Generate only the campaign directory.** Validate first, then write to a fresh temporary build directory and move it into the chosen outDir only after success. Never clean arbitrary directories or the parent site. Prevent output-root traversal; build does not access the network. Copy only referenced derivatives and approved font files.
- [x] **3.6 Implement a local artifact server.** Bind to 127.0.0.1:4173; serve dist with correct MIME types, 404 missing files, prevent traversal, support HEAD and Range requests for MP4, and redirect only `/campaign/johnmontgomery` to the slash form. This server is for QA, not the production deployment architecture.
- [x] **3.7 Add static artifact tests.** Build into a temp directory. Assert the nested index exists, no root index is emitted, no Drive/external resource URL appears in HTML, all referenced paths exist, unknown asset IDs fail, and injected copy is escaped. Later integration must count exactly 30 unique image IDs.
- [x] **3.8 Run tests/build, then commit.** `npm run test:unit`; `npm run build`; load the exact nested URL. Commit message: `feat: generate route-contained static campaign page`.

## Task 4: Build the editorial opening and collaboration story

**Files:** Create `src/render/editorial.mjs`, `src/styles/campaign.css`, `tests/e2e/editorial.spec.mjs`, `playwright.config.mjs`; integrate into `page.mjs`.

**Consumes:** Campaign strings, layout map, prepared image map.  
**Produces:** Complete campaign opening with seven spreads, and collaboration story in the correct source order.

- [x] **4.1 Create the browser test configuration.**
  ```js
  import { defineConfig } from '@playwright/test';
  export default defineConfig({
    testDir: './tests/e2e',
    use: { baseURL: 'http://127.0.0.1:4173' },
    webServer: {
      command: 'npm run preview', port: 4173, reuseExistingServer: false
    },
    projects: [
      { name: 'chromium', use: {browserName:'chromium'} },
      { name: 'firefox', use: {browserName:'firefox'} },
      { name: 'webkit', use: {browserName:'webkit'} }
    ]
  });
  ```
- [x] **4.2 Write the editorial acceptance test.**
  ```js
  import { test, expect } from '@playwright/test';
  test('introduces the collaboration and keeps the editorial order', async ({page}) => {
    await page.goto('/campaign/johnmontgomery/');
    await expect(page.getByRole('heading', {level:1}))
      .toHaveText('Forget the flowers. Book the tee time.');
    expect(await page.locator('main > section').evaluateAll(
      nodes => nodes.map(node => node.id)
    )).toEqual(['campaign', 'story', 'products']);
    await expect(page.getByRole('link', {name:'Explore the collection'}))
      .toHaveAttribute('href', '#products');
  });
  ```
- [x] **4.3 Run the test against the pre-editorial build** and observe missing content/order failure. Then implement opening and story markup from the specification.
- [x] **4.4 Apply the visual system.**
  ```css
  .swing-campaign {
    --navy:#14263D; --green:#24533E; --white:#FFFFFF; --brown:#76543C;
    color:var(--navy); background:var(--white);
    font-family:Baskerville, "Times New Roman", serif;
  }
  .swing-campaign * { box-sizing:border-box; }
  .swing-campaign img { display:block; width:100%; height:auto; }
  .swing-campaign .spread {
    display:grid; grid-template-columns:repeat(12,minmax(0,1fr));
    gap:clamp(1rem,3vw,3rem);
  }
  .swing-campaign .copy { max-width:52ch; line-height:1.5; }
  .swing-campaign :focus-visible { outline:3px solid var(--green); outline-offset:5px; }
  @media (max-width:47.99rem) {
    .swing-campaign .spread { grid-template-columns:minmax(0,1fr); }
    .swing-campaign .spread > * { grid-column:1; }
  }
  @media (prefers-reduced-motion:reduce) {
    .swing-campaign { scroll-behavior:auto; }
    .swing-campaign * { animation:none !important; transition:none !important; }
  }
  ```
  Add deliberate span/offset classes for the seven specified spreads, with natural image proportions. Do not hide content for reveal animations. Final `@font-face` rules reference approved local WOFF2 with font-display:swap.
- [x] **4.5 Check low-resolution and embedded-mark handling.** C04/C22 stay small detail inserts. C06 remains full-frame. Wide bands use arranged portraits/white space; never force every image into a landscape crop.
- [x] **4.6 Add narrow viewport assertions.**
  ```js
  for (const width of [320,390,768,1024,1440]) {
    test('no horizontal overflow at '+width, async ({page}) => {
      await page.setViewportSize({width,height:900});
      await page.goto('/campaign/johnmontgomery/');
      expect(await page.evaluate(() =>
        document.documentElement.scrollWidth <= window.innerWidth
      )).toBe(true);
    });
  }
  ```
  Add a no-JavaScript context test that reads the headline/story and follows the product anchor. Inspect screenshots at 390 and 1440px before establishing baselines.
- [x] **4.7 Run browser tests and review type/crops.** Commit only after the planned compositions, every editorial photograph, and story pairing are present. Commit message: `feat: compose Sunday Edit editorial campaign`.

## Task 5: Add resilient, quiet campaign film

**Files:** Create `src/client/film.mjs`, `tests/e2e/film.spec.mjs`; update editorial markup, media review, and CSS.

**Consumes:** Approved usable video derivative and source-derived poster from Task 2.  
**Produces:** Native accessible click-to-play film, optional enhancement, persistent fallback.

- [x] **5.1 Gate this task on a reviewed playable clip.** The page’s photographs can progress without it. Do not use an unreviewed clip merely to pass a test, and do not report the campaign film complete while this dependency is unmet.
- [x] **5.2 Write failure/reduced-motion tests.**
  ```js
  import { test, expect } from '@playwright/test';
  test('reduced motion starts with a still film', async ({page}) => {
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/campaign/johnmontgomery/');
    const video = page.locator('video').first();
    await expect(video).toHaveAttribute('preload','none');
    expect(await video.evaluate(v => v.paused && !v.autoplay)).toBe(true);
  });
  test('film failure leaves its still and page content available', async ({page}) => {
    await page.goto('/campaign/johnmontgomery/');
    const film = page.locator('[data-film]').first();
    await film.locator('video').dispatchEvent('error');
    await expect(film.locator('[data-film-fallback]')).toBeVisible();
    await expect(film.locator('[role="status"]')).toHaveText('Film unavailable');
    await expect(page.locator('#products')).toBeAttached();
  });
  ```
  Also intercept the actual MP4 request and abort it after initiating playback; verify the same fallback. The synthetic error test alone is insufficient evidence for browser playback failures.
- [x] **5.3 Observe failures**, then render a native video with controls, playsinline, preload=none, muted, width/height, and a verified local poster. No autoplay attribute. Supply a persistent image fallback beneath/next to the video and an initially empty polite status region.
- [x] **5.4 Implement minimal behavior.**
  ```js
  export function initFilms(root = document) {
    for (const wrapper of root.querySelectorAll('[data-film]')) {
      const video = wrapper.querySelector('video');
      const fallback = wrapper.querySelector('[data-film-fallback]');
      const status = wrapper.querySelector('[role="status"]');
      if (!video || !fallback || !status) continue;
      video.addEventListener('error', () => {
        video.hidden = true;
        fallback.hidden = false;
        status.textContent = 'Film unavailable';
      });
      video.addEventListener('play', () => {
        for (const other of root.querySelectorAll('video')) {
          if (other !== video) other.pause();
        }
      });
    }
  }
  initFilms();
  ```
  Native controls remain available without JS. Add visibility/pagehide handling to pause active films; do not restart them automatically when the tab returns.
- [ ] **5.5 Verify no automatic movie downloads.** In a fresh context, record requests before interaction and assert no `.mp4` request occurs. Check fallback, keyboard-native controls, no-JS playback, and a real touch device. If meaningful audio is retained by an approved direction change, add reviewed captions before acceptance.
- [x] **5.6 Run film tests and commit.** Commit message: `feat: add accessible campaign film with still fallback`.

## Task 6: Render the three product stories without premature commerce

**Files:** Create `src/render/products.mjs`, `tests/e2e/products.spec.mjs`; update `page.mjs`, CSS, and render unit tests.

**Consumes:** Three `Product` records, six prepared product images, `validateProductUrl`.  
**Produces:** `renderProducts`, visible front/back product views, future safe-link branch.

- [x] **6.1 Write a browser test for the current contract.**
  ```js
  import { test, expect } from '@playwright/test';
  test('shows exactly the approved pieces without fictional links', async ({page}) => {
    await page.goto('/campaign/johnmontgomery/');
    const cards = page.locator('#products [data-product-id]');
    await expect(cards).toHaveCount(3);
    expect(await cards.locator('h3').allTextContents())
      .toEqual(['Kin Polo','Clara Dress','Luisa Jacket']);
    await expect(page.locator('#products img[data-asset-id]')).toHaveCount(6);
    await expect(page.locator('#products a')).toHaveCount(0);
  });
  ```
  Add unit assertions for exact descriptions and P06/P05 on Luisa; test an explicitly allowlisted URL wraps the correct product image/title, while null emits no anchor.
- [x] **6.2 Run and observe the missing-product failure.** Implement cards using escaped source text and `renderImage`; call `validateProductUrl` again before emitting any link. No runtime URL parameter can override the manifest.
- [x] **6.3 Apply product layouts.**
  ```css
  .swing-campaign .products-grid {
    display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:2rem;
  }
  .swing-campaign .product-views {
    display:grid; grid-template-columns:minmax(0,3fr) minmax(0,2fr);
    align-items:end; gap:.75rem;
  }
  .swing-campaign .product-views img { object-fit:contain; }
  @media (max-width:47.99rem) {
    .swing-campaign .products-grid { grid-template-columns:minmax(0,1fr); }
  }
  ```
  Product h3 and copy follow the images in DOM order. If the back view becomes too small at 320px, stack both images; do not hide it.
- [x] **6.4 Verify all six photographs with JavaScript disabled**, keyboard navigation, 200% zoom, and at 320px. Inspect that full garments are visible and no hover is required.
- [x] **6.5 Run product tests and commit.** Commit message: `feat: present approved products with deferred destinations`.

## Task 7: Enforce the release contract and examine real failure modes

**Files:** Create `scripts/audit-output.mjs`, `tests/e2e/release.spec.mjs`, `docs/sunday-edit/qa.md`; extend existing tests only where required.

**Consumes:** Built static artifact, source manifest, exact section/copy contract.  
**Produces:** `auditOutput`, reproducible QA evidence, a visually reviewed artifact.

- [x] **7.1 Add output coverage checks.** Count image IDs in built HTML and require equality with the 30 source image IDs, with every ID rendered. Inspect every referenced asset path exists beneath the campaign output; reject inline scripts, event attributes, source maps/secrets, external resource URLs, root-relative URLs outside the campaign asset path, and unapproved link destinations. Record compressed CSS/JS and image byte totals.
- [x] **7.2 Test the network and accessibility contract.**
  ```js
  import { test, expect } from '@playwright/test';
  import AxeBuilder from '@axe-core/playwright';
  test('has no external requests and no automated AA violations', async ({page}) => {
    const foreign = [];
    page.on('request', request => {
      const url = new URL(request.url());
      if (url.origin !== 'http://127.0.0.1:4173') foreign.push(url.href);
    });
    await page.goto('/campaign/johnmontgomery/');
    await page.locator('#products').scrollIntoViewIfNeeded();
    const results = await new AxeBuilder({page})
      .withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
    expect(foreign).toEqual([]);
  });
  ```
  Scroll through every spread and initiate film playback in an additional request-audit test so below-fold and interactive resources are covered.
- [x] **7.3 Check security behavior as rendered.** Build a temporary malicious text fixture and verify it appears as text and no script executes. Attempt a changed hash and missing original; both must stop the build. Attempt a crafted product URL; it must not produce output. These are build fixtures, never shipped content.
- [x] **7.4 Exercise degraded conditions.** Disable JS; block fonts; abort one below-fold image and the MP4; emulate reduced motion; inspect on slow mobile network. Verify headings, source descriptions, image dimensions/alt fallback, and anchor access survive. Record console errors separately from deliberately aborted network requests.
- [ ] **7.5 Human visual review.** Capture full page screenshots at 390 and 1440px plus key sections at 320 and 768px. Check image ordering/coverage, full-frame C06, no clipped script, editorial rhythm, product silhouettes, focus indicators, and 200% zoom. Compare with actual source photographs; do not approve empty screenshots or snapshots automatically.
- [x] **7.6 Measure budgets and performance.** Run `npm run audit`. Measure mobile first-viewport bytes, verify zero automatic MP4 bytes, and record lab LCP/CLS with device/network settings on the preview. Report INP as unmeasured until field or appropriate interaction evidence exists. If the 1 MiB opening target is exceeded, reduce image delivery widths/quality with visual review, not by removing required photographs.
- [x] **7.7 Run the complete check once the integrated page is ready.** `npm run check` must pass. Document actual tool versions, test counts, browser engines, failed/retested issues, and unperformed real-device checks in qa.md. No fabricated pass claims.
- [x] **7.8 Commit the verified artifact sources and QA.** Commit message: `test: verify campaign accessibility provenance and resilience`. Do not commit dist unless repository conventions explicitly require built artifacts.

## Task 8: Package a safe handoff for the parent-domain route

**Files:** Update `README.md`; create `docs/sunday-edit/handoff.md`; extend release tests; update qa.md with handoff review.

**Consumes:** Verified static output and review decisions.  
**Produces:** Buildable source, static campaign artifact, exact route/headers/rollback instructions. No live deployment.

- [x] **8.1 Write the maintenance commands.** Document `npm ci`, approved asset retrieval/hash verification, `npm run build`, `npm run preview`, and `npm run check`. Explain where Marketing changes copy, where image replacements are reviewed, and how future product URLs are added to both records and the explicit allowlist.
- [x] **8.2 State the mount contract.** Serve `dist/campaign/johnmontgomery/index.html` at the slash route; redirect the slashless route; preserve all other parent routes. Serve assets beneath the same campaign prefix with correct content types and MP4 Range support. Do not deploy a root catch-all rewrite, robots file, or service worker.
- [x] **8.3 Provide route-scoped header recommendations.**
  ```text
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; media-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  ```
  Apply these as response headers only to this route and its assets; verify compatibility with the host. Explain explicitly that a path under wearswing.com does not isolate origin privileges or prevent browser cookie transmission.
- [x] **8.4 Define caching and preview policy.** HTML must revalidate; hashed assets may use long immutable caching. Keep preview noindex,nofollow. Obtain a launch indexing decision before changing it. Do not claim that lack of inbound links hides the page.
- [x] **8.5 Add route smoke tests.**
  ```js
  test('nested entry redirects correctly and parent routes stay absent', async ({request}) => {
    const redirect = await request.get('/campaign/johnmontgomery', {maxRedirects:0});
    expect(redirect.status()).toBe(308);
    expect(redirect.headers().location).toBe('/campaign/johnmontgomery/');
    expect((await request.get('/campaign/johnmontgomery/')).status()).toBe(200);
    expect((await request.get('/products/not-built')).status()).toBe(404);
  });
  ```
  The parent-route 404 applies to the standalone QA server only, not to replacing real parent behavior. Repeat on a staging host when that integration exists, checking its real parent pages remain unchanged.
- [x] **8.6 Define release and rollback.** Marketing reviews final desktop/mobile appearance and copy; technical owner reviews QA/headers/media. The deployment operator mounts a versioned artifact only after separate release authorization and can restore the prior artifact atomically. Record the release identifier, checksums, and URL in the handoff when deployment actually happens.
- [x] **8.7 Final verification and delivery.** Run `npm run check`, `git diff --check`, and inspect the final diff. Report remaining font/film/real-device/host decisions accurately. Commit message: `docs: hand off standalone Sunday Edit campaign`.

## Requirements-to-task coverage

| Requirement | Tasks |
| --- | --- |
| Required three-part editorial journey and exact campaign identity | 1, 3, 4 |
| Every supplied photograph, including all six product views | 1, 2, 4, 6, 7 |
| Source-only media and traceable revisions | 1, 2, 7 |
| Premium palette, script/serif typography, responsive layouts | 2, 4, 6, 7 |
| Concise brand-aligned copy and precise product details | 1, 4, 6, 7 |
| Approved C06 wordmark retained unchanged | 1, 2, 4, 7 |
| Luisa filename mismatch corrected explicitly | 1, 6, 7 |
| Supplied film, native controls, failure/reduced-motion behavior | 2, 5, 7 |
| Deferred product links without dead interactions | 1, 6 |
| No-JS content, accessibility, responsive media, budgets | 3–7 |
| No runtime external dependencies and safe parent route handoff | 1, 3, 7, 8 |
| Parent site, product pages, deployment excluded | All tasks |

## Plan review and execution handoff

Review the proposed design and this plan before implementation. Confirm the typography direction/files and any creative changes. The image with embedded “Fair Club” branding is already approved unchanged; do not ask again.

Choose native execution or subagent-driven execution when ready to build. Native is recommended for this tightly coupled single-page scope; subagent-driven execution adds per-task independent reviews at higher context cost. This plan does not start either approach.

## Technical references consulted

- [Node test runner](https://nodejs.org/api/test.html) — built-in unit-test harness.
- [Playwright assertions](https://playwright.dev/docs/test-assertions) — browser assertions and observable behavior.
- [MDN video reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video) — native playback, poster, controls, and preload behavior.
- [MDN Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy) — response-header policy and deployment enforcement.

Execution note: unchecked items retain the external licensed-font, physical-device, and final Marketing review portions; implementation and automated verification portions are complete. See the QA record rather than inferring release approval from this checklist.
