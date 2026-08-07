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

### Padoo's URLs, and the DMG this repo hosts

The Padoo App Store listing points at all four of these, so they have to keep
resolving:

- Marketing: `https://taltools.site/padoo/`
- Support: `https://taltools.site/padoo/support.html`
- Privacy: `https://taltools.site/padoo/privacy.html`
- Mac app: `https://taltools.site/padoo/PadooMac.dmg`

`public/padoo/PadooMac.dmg` is the free Mac companion, checked in as a binary
because the iPhone app does nothing without it and App Review needs a download
link that works without a login. It is signed with Developer ID, notarized, and
stapled — both the DMG and the `Padoo.app` inside it, so a first launch works
with no network.

To replace it, build from the `padoo` repo:

```bash
xcodebuild -project Padoo.xcodeproj -scheme PadooMac -configuration Release \
  -archivePath build/PadooMac.xcarchive -destination 'generic/platform=macOS' archive
# then sign with Developer ID, notarize with notarytool, staple the app,
# rebuild the DMG around the stapled app, notarize and staple that too.
```

Xcode has no signed-in account on this Mac and the App Store Connect API key
lacks cloud-signing rights, so `xcodebuild -exportArchive` cannot produce the
Developer ID build. Sign the archived `.app` with `codesign` directly instead.
