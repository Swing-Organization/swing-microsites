# A Round with Sienna

Approved Swing × Sienna Hartley brief: https://docs.google.com/document/d/1MSRc1_Byf8JFkLq2-iBuiX48P2UL8PFRYaIq8kAcrTw/edit

Route: `/campaign/siennahartley/`. Follow the root README and deployment guide.
`content/site.json` owns product facts and verified media provenance.
`src/page.mjs` renders semantic static content; `src/style.css` owns the scrapbook.
Build and audit modules implement the shared campaign registry interface.

Media comes exclusively from the campaign's supplied Creative Content and Product Images folders. Selected files match IDs and SHA256s already in the pinned private store. Reusing those exact media bytes does not inherit another campaign's content, layout, or exclusions. The manifest includes original source hashes and film derivative hashes. Film V01 and V03 retain native controls and no audio; posters and the shared film module handle errors, reduced motion, offscreen playback, and manual pauses.

Fonts use Georgia/Times, Arial/Helvetica and optional installed Segoe Print/Bradley Hand with generic cursive fallback. No remote font or invented media is required.
Shopping destinations are intentionally null. The shopping heading is noninteractive. Native disclosure controls reveal each product's back view without JavaScript. Editorial models are not identified as Sienna and lifestyle garments are not labeled as the featured products.
