# TalTools

The umbrella site for a little lab of macOS menu-bar apps: **Natcho**, **FlicKey**, and **Tally**.

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
