# TalTools

The umbrella site for a little lab of small tools: **Natcho**, **FlicKey**,
**Tally**, **Guitar Studio**, **Poof**, and **Padoo**.

Live at **[taltools.site](https://taltools.site)**.

## Stack

- Vite + React + Tailwind CSS v4
- framer-motion for animation
- Deployed to GitHub Pages via GitHub Actions (see `.github/workflows/deploy.yml`)

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Notes

- The homepage is the chosen design. The full design gallery (all explored
  directions) is browsable at `/#gallery`.
- `public/CNAME` pins the custom domain `taltools.site`.

## Per-app pages

Apps without their own domain get a hand-written static page under `public/`,
copied verbatim into `dist/` at build time — no React, no build step of their
own. Two live there today:

- `public/natcho/` → `taltools.site/natcho/`
- `public/padoo/` → `taltools.site/padoo/` (plus `privacy.html`, `support.html`)

An app is added to the homepage by appending it to `src/apps.js`; the live
design (`src/variants/Variant26.jsx`, "Daylight Glide") also wants a hero
silhouette in `AppTrio`, an eyebrow label in `AppScene`, and — optionally — a
demo component in `src/demos.jsx` registered in that file's `DEMO_BY_ID`.

### Padoo needs one file that is not in git yet

`public/padoo/index.html` and `support.html` link to `PadooMac.dmg` in the same
folder — the free notarized Mac companion, which the iPhone app is useless
without. **That file does not exist yet**, so the download button 404s until a
stapled `PadooMac.dmg` is dropped into `public/padoo/`. The Padoo App Store
listing points at these URLs, so it needs to resolve before submission:

- Marketing: `https://taltools.site/padoo/`
- Support: `https://taltools.site/padoo/support.html`
- Privacy: `https://taltools.site/padoo/privacy.html`
- Mac app: `https://taltools.site/padoo/PadooMac.dmg`
