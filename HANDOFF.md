## Status

Padoo's landing, support, and Windows download pages have a compact English installation tooltip on their Windows download links. The separate info icon has been removed at the user's request; hovering or focusing the download link displays the instructions. The update is published through GitHub Pages under the user's continuing publication authorization. All three links still use the permanent latest-installer URL. Padoo Mac 1.3.2 (27) remains current; other products are unchanged.

## Recent changes

- Removed the info button and its styles, anchoring the existing tooltip directly to the Windows download link for a cleaner download row.
- Kept keyboard focus, Escape dismissal, pointer dismissal, and the ability to hover over the tooltip itself. Clicking the link still downloads the installer normally.
- Kept the developer's condensed instructions: unsigned installer; Keep for browser warnings; More info → Run anyway, then Yes for installation and firewall access.
- Production build, JavaScript syntax, and diff checks passed. Chromium checks passed on all three pages at 375 and 1440 px for absence of the icon, hover, focus, dismissal, and viewport bounds.

## Open questions / blockers

- None.
- The Windows publisher must retain the asset name `PadooWin-Setup.exe` in each latest release for the permanent link to work.

## Next steps

1. Keep installation guidance aligned with the Windows publisher's instructions.
2. Preserve Mac release artifacts and unrelated untracked `.agents/` and `drafts/` files.

_Last updated: 2026-10-10 by Codex (GPT-6)_
