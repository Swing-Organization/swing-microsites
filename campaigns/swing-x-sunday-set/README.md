# The Sunday Set

Standalone Swing tennis editorial at **/campaign/sunday-set/**.

## Sources and creative decisions
The campaign folder, complete brief and product sheet were read on 2026-10-07. IDs, URLs, current modified times, original filenames, visual descriptions and SHA256 checksums are recorded in content/site.json. All 15 campaign photos, five films and six product views are included. Video posters were extracted from the supplied films using the installed browser; no generated or external media is used.

The brief’s warm ivory / court green / faded blue direction is preserved. Georgia and Arial are disclosed system-font fallbacks; the page requests no external fonts. Editorial captions are original campaign copy within the brief’s open supporting-copy direction.

The current Clara front/back images supersede the stale file discrepancy in the brief. The user explicitly approved the green sleeveless images with the name “Clara Dress” only, omitting the conflicting patterned-polo description. Luisa’s back image is matched to the actual file despite the product sheet’s “Lusia” typo.

All shopping prompts are plain text, as approved for preview. Product/collection destinations must be supplied, connected and verified before production, followed by approval of the updated preview version.

## Implementation
- src/page.mjs: complete semantic static HTML and all original media coverage.
- src/style.css: responsive editorial spreads and consistent front/back product stories.
- scripts/build.mjs: validates every original/poster SHA256 before writing owned output; creates responsive WebP derivatives and hashed assets.
- scripts/audit-output.mjs: validates source coverage, local URLs/srcsets/posters, inactive shopping, native films, no source leaks and a 40 MiB complete-media cap.
- shared/client/film.mjs: native controls, muted inline playback, reduced motion, offscreen/hidden-page pause, manual pause persistence and poster fallback.
- Source media is private and ignored; deployment restores assets-source/sunday-set at the repository’s immutable media lock.

Run repository npm run check and node scripts/deployment/build.mjs. See ../../docs/deployment.md for CI and staging. The output contains all four registered campaign routes.

