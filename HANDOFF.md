## Status

The taltools.site homepage lists four apps: FlicKey, Tally, Padoo and FrameNook. Tally and FrameNook have App Store buttons. Natcho, Guitar Studio and Poof are off the homepage, but `public/natcho/` stays deployed so Sparkle updates keep working. The homepage hero no longer has the "A lab of tiny tools" badge, and the Padoo scene has a richer interactive demo (see below). The owner's main checkout (`~/Documents/taltools_site`) is behind origin/main. It still holds an older, unpublished Multi-Mac draft of `public/padoo/index.html` plus `shots/multi-mac-control.webp`. Don't publish that without approval.

## Recent changes

- Removed the hero badge on the owner's request and set the wordmark's top margin to 0 so the hero stays centred.
- Rebuilt `PadooDemo` in `src/demos.jsx`, because the owner felt the old blue drag pad undersold the app. It now shows Padoo's three surfaces the way the app draws them (dark glass):
  - **Trackpad (landscape):** relative drag, tap to click, a focused-app chip and the five-app edge dock. An idle tour plays tap, two-finger right-click, scroll and three-finger desktop swipes; it pauses for 5 s whenever the visitor touches it.
  - **Air pointer (portrait):** the phone tilts toward the aim. Hovering the mock Mac aims it, and the phone's buttons click, right-click and switch desktops.
  - **App Deck:** 15 keys (apps, snap left/fill/right, media, mic mute, screen recording, Focus) plus brightness and volume sliders, each with a visible effect on the mock Mac.
  - Icons are generic glyphs, not real app logos, to stay clear of trademarks. The idle tour and air sweep are off under prefers-reduced-motion.
- Done in a clean worktree off origin/main so the owner's local draft stayed untouched.

## Open questions / blockers

- Should `/natcho/` be taken down entirely? (Removing it breaks Sparkle updates for existing installs.)
- Is the Multi-Mac draft in the main checkout still wanted, or has it been superseded on origin?
- tallyrate.site (separate `tally-app` repo) has no App Store link yet.
- The FrameNook page is 410px wide in a 390px viewport. The hero device likely spills over the edge.

## Next steps

1. Pull origin/main into the main checkout, keeping or discarding the Multi-Mac draft per the owner.
2. Optionally prune the unused Natcho/Guitar/Poof demos and icons once the old gallery variants are deleted.

_Last updated: 2026-11-08 by Claude Code (Opus 5.5)_
