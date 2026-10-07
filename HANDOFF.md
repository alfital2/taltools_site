## Status

Padoo Mac 1.3.2 (27) versioned artifact is live at /padoo/PadooMac-1.3.2-27.dmg. Stable downloads and feed changes are prepared locally pending clean Mac launch verification (Padoo Actions run 37628685028). Public stable remains 1.3 (9) until those changes are pushed. User authorized publication and installation on their Mac. Other products, including FrameNook, remain unchanged.

## Recent changes

- Staged corrected notarized build 27, SHA256 bb02df23d106c766a4df37f333a123bc9740d10e619a0f6ddbceca62d65f3b48, in deployed commit 12e9dec; verified live digest.
- Withdrew staged build 26 after clean Mac runtime failure exposed a signing certificate/provisioning profile mismatch. It was never selected by stable downloads/feed.
- Prepared stable and legacy recovery aliases, signed Sparkle feed and update redirect for build 27. Preserved immutable PadooMac-1.3.dmg used by previous signed feed.

## Open questions / blockers

- Do not push prepared stable changes until clean Mac launch succeeds. No iPhone publication requested.

## Next steps

1. Check Padoo workflow 37628685028; on success build and push prepared stable changes.
2. Verify live stable/versioned/recovery downloads, signed feed and redirect after deployment.
3. Update this snapshot with final publication evidence. Preserve unrelated files in the original taltools_site checkout.

_Last updated: 2026-10-07 by Codex (GPT-6)_
