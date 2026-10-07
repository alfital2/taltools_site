## Status

Padoo's Windows download buttons on the landing, support, and Windows pages now use RonYehuda's public latest-installer URL: `https://github.com/RonYehuda/padoo-win-releases/releases/latest/download/PadooWin-Setup.exe`. The Windows page includes release notes, installation requirements, and the unsigned-installer notice. The user authorized publication. Padoo Mac 1.3.2 (27) remains current; other products, including FrameNook, are unchanged.

## Recent changes

- Published the Windows placeholder first, then replaced it after the user supplied the repository and direct latest-download URL.
- Verified GitHub's latest endpoint selects `v1.0.0` and the download redirects to its `PadooWin-Setup.exe` asset. Downloaded without executing; size, Windows executable header, and GitHub SHA256 all match: `0d6c44c2bd7e1e8ce1e8419c10efa791146e2c51ebef0fbcf8814fc4a66ba4af`.
- Used GitHub's latest redirect instead of pinning a release version, requiring no website redeploy, scheduled sync, or repository token for future releases. Removed the earlier unfinished workflow referencing a missing sync script.
- Added a latest-release page fallback, Windows 10/11 64-bit requirements, and a note that the current unsigned installer may trigger SmartScreen, based on the owner's release notes.
- Production build and diff checks passed. Browser checks verified all three pages at 375, 768, 1024, and 1440 px, latest download links, removal of placeholders, and the release fallback; screenshots were inspected.
- Preserved the newer published Mac release before deployment. Stable DMG SHA256 remains `bb02df23d106c766a4df37f333a123bc9740d10e619a0f6ddbceca62d65f3b48`; appcast remains `866fe2ad273fa8ea19590a1ef7c3beef5a0d09cf4bbf330f190fe046dba9fbc8`.

## Open questions / blockers

- No publication blocker. The publisher must retain the asset name `PadooWin-Setup.exe` in each latest release for the direct installer URL to work; the release-page fallback remains useful if it changes.

## Next steps

1. Keep Windows requirements and installation guidance aligned with the publisher's release notes. If they rename the installer, update the three direct-download links or use the latest-release page.
2. Keep Mac versioned artifacts immutable and preserve unrelated untracked `.agents/` and `drafts/` files.

_Last updated: 2026-10-08 by Codex (GPT-6)_
