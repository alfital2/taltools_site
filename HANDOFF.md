## Status

The taltools.site homepage now lists four apps: FlicKey, Tally, Padoo and FrameNook. Tally (id6780034410, one listing for Mac and iPhone) and FrameNook (id6814156822, iPhone) are live on the App Store at $9.99. Their homepage cards now use an App Store button as the main call to action, and the FrameNook page links to the App Store instead of saying "coming soon". Natcho, Guitar Studio and Poof were removed from it on the owner's request. `public/natcho/` (page, terms, Sparkle appcast) is still deployed but no longer linked from the homepage. The Padoo page itself is unchanged by this session. The owner's main checkout (`~/Documents/taltools_site`) was behind origin/main and still holds an older, unpublished Multi-Mac draft of `public/padoo/index.html` plus `shots/multi-mac-control.webp`. Check whether origin's Padoo page already covers it before re-applying anything, and don't publish it without approval.

## Recent changes

- Removed Natcho, Guitar Studio and Poof from `src/apps.js` and from the live design (`Variant26.jsx`): hero app glyphs, demo map, scene eyebrows and the guitar/poof special-cased CTAs. The headline and bio now say "Four tools" and "Four so far". The meta description now names the remaining four apps.
- Kept `public/natcho/` so installed Natcho copies can still reach the appcast and old links don't 404. Kept the demo components in `demos.jsx` and the old gallery variants (not wired into the build) to avoid churn.
- Added App Store links: optional `appStore`/`appStoreLabel` fields in `src/apps.js` swap the card's primary button for an Apple-logo App Store button. "See the full demo" still opens the app's own site. On the FrameNook page the button appears in the hero and the closing section, plus a desktop-only nav link (it wrapped on phones). Verified with Playwright at 1280px and 390px.
- Done in a clean worktree off origin/main so the owner's uncommitted local draft stayed untouched.

## Open questions / blockers

- Should `/natcho/` be taken down entirely? (Removing it breaks Sparkle updates for existing installs.)
- Is the Multi-Mac draft in the main checkout still wanted, or has it been superseded on origin?

- tallyrate.site (separate `tally-app` repo) has no App Store link yet. It still only offers the GitHub DMG (1.5.2), while the App Store edition is 1.0.
- The FrameNook page is 410px wide in a 390px viewport (it was before this session too). The hero device and its floating note likely spill over the edge.

## Next steps

1. Pull origin/main into the main checkout, keeping or discarding the Multi-Mac draft per the owner.
2. Optionally prune the unused Natcho/Guitar/Poof demos and icons once the old gallery variants are deleted.

_Last updated: 2026-11-08 by Claude Code (Opus 5.5)_
