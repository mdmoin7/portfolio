# Mohammad Moin — Portfolio

Personal portfolio site, auto-deployed to GitHub Pages via GitHub Actions on every push to `main`.

## One-time setup (do this once per repo)

1. Push this repo's contents to GitHub (root must contain `index.html` and `.github/workflows/deploy.yml`, exactly as in this folder).
2. In your repo: **Settings → Pages → Build and deployment → Source** → select **"GitHub Actions"** (not "Deploy from a branch").
3. Push to `main`. The workflow runs automatically and deploys.
4. Your site goes live at: `https://<your-username>.github.io/<repo-name>/`
   - If the repo is named `<your-username>.github.io`, it's served at `https://<your-username>.github.io/` instead.

## After setup

Every push to `main` automatically rebuilds and redeploys the site — no manual steps needed.

## Local preview

Just open `index.html` directly in a browser, or run a quick local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
