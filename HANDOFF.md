## Status

Padoo's landing, support, and Windows download pages now have a compact English installation tooltip beside their Windows download links. The user authorized publication, and the tooltip changes are published through GitHub Pages. All three links still use the permanent latest-installer URL. Padoo Mac 1.3.2 (27) remains current; other products are unchanged.

## Recent changes

- Added shared Windows download tooltip assets and included them on all three pages so the instructions stay consistent.
- Condensed the developer's supplied instructions: the installer isn't digitally signed; choose Keep for a browser warning, then More info → Run anyway and Yes for installation and firewall access.
- Added an info button with mouse hover, keyboard focus, touch/click, Escape, and outside-click dismissal. Tooltips remain within the viewport.
- Published the tooltip update after the user explicitly authorized publication.
- Production build, JavaScript syntax, and diff checks passed. Local Chromium checks passed on all three pages at 375 and 1440 px; inspected the mobile screenshot.

## Open questions / blockers

- No implementation or publication blockers.
- The Windows publisher must retain the asset name `PadooWin-Setup.exe` in each latest release for the permanent link to work.

## Next steps

1. Keep installation guidance aligned with the Windows publisher's instructions.
2. Preserve Mac release artifacts and unrelated untracked `.agents/` and `drafts/` files.

_Last updated: 2026-10-10 by Codex (GPT-6)_
