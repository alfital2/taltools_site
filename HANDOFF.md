## Status

The Padoo page at `public/padoo/index.html` is now the screenshot-led rewrite. The
old page, built around an interactive fake Mac driven by `engine.js`, is gone from
the markup; `engine.css` and `engine.js` are still in `public/padoo/` but nothing
references them any more. Every image on the new page is a capture of the shipping
Mac app or a native iPhone screenshot, served as WebP. The whole page is 0.76MB.

## Recent changes

- Replaced the Padoo page with the draft developed in `drafts/padoo-v2/`, which
  argues from screenshots instead of from a demo, and states the $9.99 one-time
  price in three places.
- Converted every screenshot to WebP at q=90. The PNG originals totalled 7.6MB,
  which is not a landing page; WebP brings that to 0.74MB with the text still
  crisp at 1:1, checked on the densest image rather than assumed.
- Sized every screenshot to source/2 in CSS. A macOS window is captured at exactly
  2x its point size, so anything wider than that upscales and looks soft on a
  retina screen. The inline `max-width` on each `.shot` is load-bearing: change a
  screenshot and its number has to change with it.
- Restored the sharing metadata (og:*, canonical, apple-touch-icon) that the draft
  did not carry, and gave the page a real title.

## Open questions / blockers

- The `#mac` section explaining that Padoo needs its free Mac app was removed
  during editing. Both "Get the Mac app" buttons now link straight to
  `PadooMac.dmg` so nothing is dead, but the page no longer says the Mac app is
  required, needs Accessibility permission, or is not on the Mac App Store. That
  is a real gap on a page selling the iPhone half.
- The h1 reads "best controlling device". "Controlling" carries a sense of
  domineering in English; "best control surface" or "best controller" is closer to
  the intent.
- `drafts/padoo-v2/` is untracked. It holds the PNG originals and the capture
  scripts (`cap.sh`, `probe.swift`, `edgecheck.swift`, `crop.swift`). Decide
  whether the 13MB belongs in git or should be gitignored.
- The unversioned `PadooMac.dmg` still must not be replaced until Padoo 1.1 is
  actually released on the App Store.

## Next steps

1. Decide on the Mac app section: restore it, or accept the download-only buttons.
2. Settle the h1 wording.
3. Delete `engine.css` and `engine.js` once the new page has been live a while.
4. Consider re-shooting the Connection pane with the phone attached; that row was
   cut, and with it the measured 0.8ms latency evidence.

_Last updated: 2026-09-05 by Claude Opus 5 (Claude Code)_
