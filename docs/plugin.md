# Swing Microsites plugin

The repository root is a skills-only plugin named `swing-microsites`, version 0.1.0. It uses the existing `skills/create-microsite/` directory directly, including its brand reference and display metadata. There is no second copy of the skill to keep synchronized.

## What it does

Takes a creative brief and approved assets through requirements, implementation, verification, a pull request, staging preview, feedback, and an explicitly approved production release. Packaging does not change the workflow or authorize a release.

## Requirements

- An authorized working checkout of Swing-Organization/swing-microsites, with Git, the repository's Node version, its build dependencies, and browser verification tools.
- GitHub access to push a feature branch and open a pull request.
- Access to the supplied brief and assets; connect Google Drive when those inputs are in Drive.
- The media restoration and Vercel configuration documented in `docs/deployment.md`.

The plugin supplies instructions, not credentials, a GitHub connection, a Google Drive connection, a Vercel server, or a compute environment. Install and authorize the required services separately. The current repository deployment documentation takes precedence over historical hosting/repository references in the brand context.

## Install in desktop Codex / Work

1. Check out the branch containing this plugin, or pull main after its PR has been reviewed and merged.
2. Open this repository as the current project in the desktop app.
3. Open the Plugins Directory and select the **Swing Plugins** repository source.
4. Install **Swing Microsites**, then open a new conversation in this project and select its **Create Microsite** skill.
5. Provide the campaign brief and approved asset folder.

The repository catalog is `.agents/plugins/marketplace.json`. Its `./` source path resolves to the repository root, where `plugin.json` lives. The catalog makes the plugin discoverable; it does not silently enable or install it. If the source does not appear, refresh or reopen the app and confirm this repository and branch are selected.

A previous standalone create-microsite installation may also appear. Select the plugin-provided skill to test this package. Do not delete an existing installation until you have confirmed the plugin works.

## ChatGPT web and workspace distribution

A local repository catalog does not automatically install the plugin in ChatGPT web or sync it to every device. Where workspace publishing is enabled, a workspace admin can publish an installed local plugin from **Plugins > Personal > plugin menu > Publish**, selecting the intended roles. This is workspace distribution, not public directory publication.

If that option is unavailable for your account, this package remains usable through supported local/repository plugin sources. Do not assume a web install has occurred. Public directory submission is a separate reviewed process and is not part of this change.

For distribution, the package contents are `plugin.json` and the complete `skills/create-microsite/` directory. Do not bundle the website checkout, source media, credentials, or generated campaign output.

## Verify after installation

In a new conversation, select the plugin's Create Microsite skill and ask to create a campaign without providing a brief or assets. It should request the missing inputs before building. With supplied inputs, verify the workflow uses the intended repository, returns a staging preview for the exact PR head, and waits for explicit approval before production.

Package structure and JSON are checked during packaging. Host installation and a full campaign run must be verified in the target app; packaging alone is not evidence of either.

## Updates

Edit the canonical skill under `skills/create-microsite/`, increment the plugin version, and submit a PR. Refresh the installed plugin or publish an updated workspace version as appropriate; a GitHub edit alone does not prove that an installed version refreshed.

Official packaging and distribution reference:
https://developers.openai.com/plugins/build/plugins
