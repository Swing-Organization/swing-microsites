# Shared staging control branch

This branch exists only so Vercel can attach staging.wearswing.com to a real,
inactive branch. Never merge, update, or deploy this branch. Git deployments are
disabled and builds are skipped. GitHub locks the branch; the staging workflow
pins its commit SHA. The workflow assigns staging directly to the newest open
PR's Ready preview deployment. Production continues to follow main.
