# Yug Sharma — Portfolio

A single-page portfolio site. Plain HTML/CSS/JS, no build step, no framework —
so it deploys straight to GitHub Pages with zero configuration.

Theme: black background, white type, violet → cyan accent gradient, with
scroll-reveal animations, an animated typing headline, animated stat counters,
and a subtle cursor glow.

## Structure

```
yug-portfolio/
├── index.html          # all page content/sections
├── css/style.css        # theme, layout, animations
├── js/script.js         # typing effect, scroll reveal, nav behavior
└── assets/
    ├── profile.jpg               # your photo (optimized for web)
    └── Yug_Sharma_Resume.pdf     # downloadable resume
```

## Before you deploy — 2 things to update

1. **GitHub username** — open `js/script.js` and change this line near the top:
   ```js
   const GITHUB_USERNAME = 'yourusername';
   ```
   to your actual GitHub username. This fills in both "GitHub" links on the page.

2. **Content** — the resume text was used as a starting point and lightly
   reworded. Read through `index.html` (About, Experience, Work, Learning
   sections) and tweak anything that doesn't sound like you — especially the
   "Currently Learning" section (Generative AI + DSA), which is intentionally
   a bit open-ended since it reflects where you're headed, not a shipped resume line.

## Deploying to GitHub Pages (username.github.io)

This repo is meant to be named **exactly** `<your-github-username>.github.io` —
that naming convention is what makes GitHub serve it at the root domain
(e.g. `https://yugsharma.github.io`) instead of a sub-path.

From inside this folder:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git push -u origin main
```

Steps before that push works:

1. Create a new **empty** repository on GitHub named `<your-username>.github.io`
   (no README, no .gitignore — keep it empty so the push above doesn't conflict).
2. Replace `<your-username>` in the remote URL above with your actual GitHub username
   (both places).
3. Push. GitHub Pages is enabled automatically for a `username.github.io` repo —
   give it 1–2 minutes, then visit `https://<your-username>.github.io`.

If you'd rather use a project repo instead (site lives at
`username.github.io/repo-name`), name the repo anything you like, and after
pushing go to **Settings → Pages** in the repo and set the source to the
`main` branch, `/ (root)` folder.

## Local preview

No build step needed — just open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```
