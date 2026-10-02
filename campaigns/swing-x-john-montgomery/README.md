# Swing × John Montgomery — The Sunday Edit

Public route: `/campaign/johnmontgomery/` (unchanged).

- `content/`: approved campaign copy, products, layout, asset provenance, and review records.
- `src/`: campaign renderers and styling.
- `scripts/`: campaign build, content checks, media preparation, and output audit.
- `tests/`: campaign unit and browser tests.
- `docs/`: brief, source inventory, design, implementation records, QA, and handoff.
- `assets-source/`: ignored approved originals and film derivatives restored from the private media store.

Run commands from the **repository root**. `npm run build`, `npm run audit`, and `npm run check` cover all registered campaigns. `npm run media` prepares this campaign's images.

The private media store still uses `assets-source/sunday-edit`; the registry maps that remote directory to this campaign's local `assets-source/` directory. No media repository migration is required.

Shared dependencies are `shared/render/html.mjs` and `shared/client/film.mjs`. Campaign output is generated at `dist/campaign/johnmontgomery/` and copied into the same route under `publish/` for deployment.

See [handoff](docs/handoff.md), [QA records](docs/qa.md), and the repository's [deployment guide](../../docs/deployment.md). Historical QA records describe their original runs, not verification of this reorganization.
