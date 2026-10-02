# Swing Microsites

Campaign microsites share one repository and deployment. Each campaign owns its content, design, implementation, tests, and working documents in `campaigns/<campaign-name>/`.

## Repository layout

| Location | Responsibility |
| --- | --- |
| `campaigns/swing-x-john-montgomery/` | Swing × John Montgomery — The Sunday Edit |
| `shared/` | Reusable HTML escaping and native-film enhancement |
| `skills/` | Shared microsite workflows and Swing brand reference |
| `scripts/` | Build/audit dispatch, local preview, and deployment tooling |
| `deployment/` | Campaign registry, shared pinned private-media source, and SSH host keys |
| `docs/deployment.md` | Repository-wide hosting and release instructions |
| `tests/unit/` | Shared deployment tests |

Package dependencies, Playwright configuration, GitHub workflows, and Vercel configuration live at the repository root. Generated `dist/` and `publish/` directories contain separate campaign routes and remain ignored.

## Develop and verify

Use the Node 24 version in `.nvmrc`, then run:

```sh
npm ci
npm run media:restore
npm run build
npm run preview
```

Media restoration requires the existing private-media credential described in [deployment instructions](docs/deployment.md). Source media remains private and ignored; it is restored into each campaign's `assets-source/` directory.

The existing site remains at **http://127.0.0.1:4173/campaign/johnmontgomery/**. Moving source folders does not change public URLs.

```sh
npx playwright install chromium firefox webkit
npm run check
```

The check command runs shared and campaign unit tests, builds and audits all registered campaigns, and runs campaign browser tests. See the [John Montgomery campaign guide](campaigns/swing-x-john-montgomery/README.md) for campaign-specific details.

## Add a campaign

1. Create `campaigns/<campaign-name>/` with its own `content/`, `src/`, `scripts/`, `tests/`, and `docs/` as needed.
2. Reuse `shared/` utilities and the Swing brand guidance in `skills/create-microsite/references/brand-context.md`.
3. Add a unique route and campaign-local build/audit modules to `deployment/campaigns.json`. Set `sourceDirectory` to `campaigns/<campaign-name>/assets-source` and `mediaDirectory` to its directory in the pinned private-media repository.
4. Run the full checks, then follow [deployment and release instructions](docs/deployment.md).

Campaign-specific code stays with its campaign. Promote code into `shared/` when it is reusable without importing a particular campaign's content or rules.
