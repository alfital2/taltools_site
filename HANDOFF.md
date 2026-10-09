## Status

Padoo's landing, support, and Windows download pages have a compact English installation tooltip on their Windows download links. Hovering or focusing the download link displays the instructions without a separate info icon. The tooltip is now centered on the button, with a small pointer, compact steps, and a softer shadow. The update is published through GitHub Pages under the user's continuing publication authorization. All three links still use the permanent latest-installer URL. Padoo Mac 1.3.2 (27) remains current; other products are unchanged.

## Recent changes

- Corrected the tooltip's right-edge alignment to center it on the download link, clamping it within narrow viewports and positioning its pointer toward the button.
- Replaced the dense paragraph with a small title, unsigned-installer explanation, and separate Browser and Windows steps. Reduced typography, padding, and shadow weight for a lighter appearance.
- Preserved hover, keyboard focus, Escape, and pointer dismissal, with no separate icon.
- Production build, JavaScript syntax, and diff checks passed. Chromium interaction and viewport checks passed on all three pages at 375 and 1440 px. Verified desktop centering within 1 px and visually inspected the screenshot.
- Published under the user's continuing authorization to update the live tooltip.

## Open questions / blockers

- None.
- The Windows publisher must retain the asset name `PadooWin-Setup.exe` in each latest release for the permanent link to work.

## Next steps

1. Keep installation guidance aligned with the Windows publisher's instructions.
2. Preserve Mac release artifacts and unrelated untracked `.agents/` and `drafts/` files.

_Last updated: 2026-10-10 by Codex (GPT-6)_
