# Swing Microsites

Campaign microsites share one repository and deployment. Each campaign owns its content, design, implementation, tests, and working documents in `campaigns/<campaign-name>/`.

## Repository layout

| Location | Responsibility |
| --- | --- |
| `campaigns/swing-x-john-montgomery/` | Swing × John Montgomery — The Sunday Edit |
| `shared/` | Reusable HTML escaping and native-film enhancement |
| `scripts/` | Build/audit dispatch, local preview, and deployment tooling |
| `deployment/` | Campaign registry, shared pinned private-media source, and SSH host keys |
| `docs/deployment.md` | Repository-wide hosting and release instructions |
| `tests/unit/` | Shared deployment tests |

Package dependencies, Playwright configuration, GitHub workflows, and Vercel configuration live at the repository root. Generated `dist/` and `publish/` directories contain separate campaign routes and remain ignored.

## Agent workflows

The installed **Swing Microsites** plugin is the source of truth for reusable skills and brand guidance. Use its `create-microsite` skill when creating a campaign. Skill definitions and their supporting brand files are maintained in the plugin, not duplicated in this repository. If the plugin is unavailable in the current environment, enable it before using that workflow.

This repository remains the source of truth for build, test, and deployment instructions. Before making changes, read this README, any applicable `AGENTS.md`, and `docs/deployment.md`, and inspect the current scripts and configuration.

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
2. Reuse `shared/` utilities and the Swing brand guidance bundled in the installed **Swing Microsites** plugin.
3. Add a unique route and campaign-local build/audit modules to `deployment/campaigns.json`. Set `sourceDirectory` to `campaigns/<campaign-name>/assets-source` and `mediaDirectory` to its directory in the pinned private-media repository.
4. Run the full checks, then follow [deployment and release instructions](docs/deployment.md).

Campaign-specific code stays with its campaign. Promote code into `shared/` when it is reusable without importing a particular campaign's content or rules.

## Swing × Sienna Hartley

`campaigns/swing-x-sienna-hartley/` builds **A Round with Sienna** at
`/campaign/siennahartley/`. Its source manifest was matched by Drive file ID and
SHA256 to approved media already in the pinned `assets-source/sunday-edit`
store. The registry restores those exact files into Sienna's own ignored
`assets-source/`; each campaign has independent content, style and output.
Shopping destinations are intentionally unset for this review version.
