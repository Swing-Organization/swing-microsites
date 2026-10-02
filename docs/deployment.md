# Swing microsite delivery

## Environments and triggers

- Code: `Swing-Organization/swing-microsites` (public GitHub repository; transferred from `fernando-espinoza/swing-microsites`).
- Hosting: [ownward / swing-microsites](https://vercel.com/ownward/swing-microsites).
- Vercel project ID: `prj_OFCPCvkEYuzaTx6euiLg6iReNAHk`; team ID: `team_HDbZ1HzOVHGr2pPOMd9mNWc8`.
- Production branch: `main`. Vercel Domains was verified on 2026-10-02: `www.wearswing.com` and `swing-microsites.vercel.app` point to Production; `wearswing.com` redirects to `www.wearswing.com` (308).
- Shared review domain: `staging.wearswing.com`. At that inspection it tracked `codex/sunday-edit`; the automation below replaces that fixed-branch behavior after activation.
- GitHub integration is connected. PR comments, commit statuses and deployment-status events are enabled.

The project Git connection was reconnected to `Swing-Organization/swing-microsites` on 2026-10-02 after the repository transfer. A manually created Ready deployment is not proof that GitHub received the required `Vercel` commit status; verify that status on the current PR head after a fresh Git push.

Vercel's native Git integration is the deployment trigger. Feature-branch pushes generate Preview deployments and attach them to the PR; opening a PR gives Marketing its review link. Further pushes refresh that PR's preview. Merging the approved PR into main triggers Production automatically. Do not configure a duplicate Actions deploy or run `vercel --prod` for previews.

The `.github/workflows/verify.yml` workflow runs the full verification suite for same-repository PRs. It has read-only GitHub permissions, restores only pinned approved media, and runs Chromium, Firefox, WebKit and source/output audits. Fork PRs do not receive the private media key and require an internal reviewed branch before the campaign can be previewed.

## Build contract

`vercel.json` uses `npm ci`, `npm run build:deployment`, and the generated `publish/` directory. `media:restore` obtains the immutable media commit declared in `deployment/media-lock.json`; build-time hashes validate each original and derivative. `scripts/deployment/build.mjs` builds and audits every entry in `deployment/campaigns.json`, then packages only those routes without local ownership markers. `publish/` is generated, ignored, and never a source directory.

New campaigns must keep campaign-specific content, source code, tests, and documents under `campaigns/<campaign-name>/` and have a registry entry with unique `/campaign/<slug>/` route, source directory and build/audit modules. Those modules must export the same build/audit interfaces, produce their campaign in `dist`, and audit that campaign. Do not simply change Sunday's hardcoded route or overwrite its content when adding another campaign. Verify all registered campaigns before publishing: each Vercel deployment replaces the entire project output.

The output contains campaign routes only. It does not implement a parent storefront. The custom domains above serve this campaign-only project; any future parent storefront/path integration requires a separate routing decision. Headers apply to `/campaign/*`; no catch-all rewrite to the campaign is used. Search indexing stays disabled until Marketing explicitly changes that requirement.

## Private media bootstrap

The source store must be private because originals and licensing-sensitive source material do not belong in this public repository. The approved source store is `fernando-espinoza/swing-microsites-media` (private). It is pinned in `deployment/media-lock.json`. To maintain it:

1. Store approved originals and derivatives under `assets-source/<campaign>/` in the private media repository, excluding prepared caches and unrelated files. Set the registry’s `mediaDirectory` to that remote path and `sourceDirectory` to `campaigns/<campaign-name>/assets-source`; restoration copies between these locations.
2. Commit and push the media, and record the full immutable commit SHA in `deployment/media-lock.json` with the repository owner/name.
3. Create a repository-scoped **read-only** SSH deploy key. Store the private half as `SOURCE_MEDIA_SSH_KEY` in GitHub Actions and as `SOURCE_MEDIA_SSH_KEY_BASE64` (base64-encoded key) in the Vercel project for Preview and Production only; do not put it in Git, logs, PR text, or this document.
4. `deployment/github-known-hosts` pins GitHub's public SSH host keys. Review official GitHub key changes rather than disabling host checking.
5. Restore in a clean checkout, run all checks, then verify the Vercel preview for the exact PR head. A missing key/lock or a changed asset hash fails the build.

Do not use a personal GitHub token with broad repository write access as the build credential. Keep Vercel fork protection enabled. Only trusted internal branches should have access to private build-time media. Any collaborator who can modify a secret-bearing build must be treated as trusted with its source material.

## Review and production approval

Use `$create-microsite` for requirements → plan → implementation → PR → preview → feedback → approved release. A copy of the skill is versioned in `skills/create-microsite`; the discoverable personal installation lives under the user's Codex skills directory.

Before returning a preview, inspect Vercel/GitHub for a successful deployment at the current PR head SHA. Use the actual returned deployment URL plus the campaign path. Confirm Marketing can access it without changing protection silently. Never return localhost or a guessed/stale URL as staging.

Do not merge, enable auto-merge or promote a deployment until the user explicitly approves production for the verified head. Any subsequent change requires a new preview and approval. Merge with `gh pr merge --squash --match-head-commit <approved-sha>` after required checks succeed. Verify the resulting Vercel Production deployment and campaign URL; a successful merge is not proof of a successful release.

Main should require the `Build and verify microsites` check and the Vercel check, with up-to-date PR branches and no force pushes. Direct pushes to main also trigger Vercel production, so use branch protection and do not push main during setup. Do not impose an impossible second-person review requirement on a sole repository owner; the skill records the explicit release decision while GitHub enforces checks/PR merging.

## Rollback

Retain the previous successful production deployment and commit. If a release fails, use Vercel's verified previous project deployment only after checking that it preserves all currently required campaign routes; reverting a whole project can otherwise remove a newer unrelated campaign. Prefer a reviewed revert PR for a persistent source correction. Never roll back the parent website.

## Setup verification

The skill is installed and validated. The private media repository and read-only deploy key exist. GitHub Actions has the raw key secret; Vercel has the base64 Secret for both Preview and Production. Media restoration and static packaging pass locally. PR #1 exercises the complete workflow. Require successful checks at the latest PR head before release; branch protection is configured in GitHub, independently of this document. Marketing requested previews accessible to anyone with the link; Vercel Authentication is disabled for this project. Preview pages retain noindex headers. Production deployment is deliberately not part of bootstrap.


## Shared staging automation

Implementation: `.github/workflows/staging.yml` and `scripts/deployment/staging.mjs`.
The implementation is prepared for activation; it is not active merely because its PR exists.

- Select the newest **created**, still-open PR targeting `main`, including drafts, whose head belongs to this repository. Fork previews remain outside the private-media workflow.
- Keep the current staging deployment until that PR's exact current head has a Ready Vercel Preview in this project. A failed or pending head never promotes an older commit or another PR.
- Point `staging.wearswing.com` at that exact deployment. Future successful head deployments of the selected PR update it. Other PR events only trigger reconciliation; they do not select the event's PR.
- After a close/merge, select the next-newest open PR. With no eligible open PR, retain the last assigned deployment. Production releases still require explicit approval.
- The Sunday campaign URL is `https://staging.wearswing.com/campaign/johnmontgomery/`. Per-PR Vercel URLs remain available for reviewing older PRs.

The shared domain is assigned directly to a deployment. Its Vercel branch setting points to the real, locked **control branch** `codex/staging-managed` at commit `8e44e8896dd31e9985a0c20a6bf557e9e7dfc981`. Vercel rejects nonexistent branches, so this branch must exist. Its branch-specific `vercel.json` disables Git deployments, skips builds, and fails any attempted build. GitHub branch protection locks updates, prevents deletion/force-pushes and applies to administrators. **Never merge, update, or deploy this branch.** The workflow verifies its existence, protected status and exact SHA before accessing Vercel; changing or deleting it fails closed. This leaves alias assignment to the workflow, including after the final PR closes, without changing production domains, DNS or deployment protection.

The control branch and its Vercel domain assignment were created and verified on 2026-10-02. They are infrastructure, not a campaign PR. To recreate them, restore that exact pinned commit as the control branch, disable its deployments as above, and lock the branch before running reconciliation. Do not bypass a failed control-branch check by pointing staging at `main`.

### Connect and activate

1. In `Swing-Organization/swing-microsites`, create the GitHub Actions environment **staging-automation**. Under deployment branches and tags, select **Selected branches and tags**, add a **branch** rule for `main`, and allow no tags or other branches. Create a Vercel access token scoped to **Ownward → swing-microsites** (not the separate `ownward` project) with the access needed to read deployments and manage the staging project domain/alias. Save it as the **environment secret** `VERCEL_STAGING_TOKEN`, not a repository secret. Never put the token in Git, PR text or chat. Leave the repository variable `STAGING_AUTOMATION_ENABLED` unset until step 5.
2. Review and merge the workflow PR only with explicit production approval: this repository's `main` pushes also trigger the existing Vercel production build. The privileged workflow always checks out `main`, never code from a PR head.
3. In GitHub Actions, run **Update shared staging** on **main** with **dry_run** enabled. Verify the reported PR, SHA and deployment ID. If no PR is open, `retained` confirms access only; it does not test deployment selection or alias writes. This checks provider access without changing the domain.
4. Run it again with **dry_run** disabled. With an eligible Ready PR, confirm the run says `assigned`, then verify the campaign page through the shared staging URL. With no eligible PR, `retained` is expected. Before declaring setup complete, open a PR and verify `planned` in a dry run, `assigned` in a live run, the shared URL, a subsequent PR update, and a production deployment after an explicitly approved merge.
5. Set the GitHub Actions repository variable `STAGING_AUTOMATION_ENABLED` to `true`. Automatic events are disabled until this explicit activation; manual runs remain available.

Subsequent PR open/reopen/update/close events and successful Vercel commit statuses trigger reconciliation automatically. One concurrency group serializes writes, and each run re-reads PR ownership before and after alias assignment. Provider changes cannot be atomic across GitHub and Vercel: a PR changing during a request can briefly show the previous selection; the runner reconciles again before returning, with later queued events covering subsequent changes. There is no periodic polling job.

The workflow has read-only GitHub permissions, installs no PR dependencies, and uses the trusted main-branch script with the Vercel credential. The `status` event loads the workflow from the default branch, `pull_request_target` uses the main base, and manual dispatch is restricted to main. The main-only environment restriction is the independent credential boundary; keep it configured even if workflow code changes. It verifies project, repository ID, branch, SHA, preview target and Ready state before assignment, and checks the resulting alias. No token is available to PR tests. Missing/expired credentials and provider errors fail the run with a bounded diagnostic; rerun **Update shared staging** after correcting access. If a Ready event arrives before the deployment is visible in the API, a manual rerun reconciles it.

To pause automatic updates, set `STAGING_AUTOMATION_ENABLED` to `false` or disable **Update shared staging** in GitHub Actions; the last alias stays assigned. To return to fixed-branch staging, disable the workflow first, then explicitly assign the desired preview branch in Vercel Domains. Do not assign staging to the Production environment.
