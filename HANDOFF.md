## Status

Padoo Mac 1.3.2 (27) is published on taltools.site and GitHub. Stable download, legacy recovery aliases, signed Sparkle feed and /padoo/update redirect select build 27. Website deployment 37628778221 succeeded and all live hashes were verified. The exact public app is installed and running on the user’s Mac. Other products, including FrameNook, remain unchanged.

## Recent changes

- Published immutable /padoo/PadooMac-1.3.2-27.dmg and switched stable PadooMac.dmg, recovery 1.1/1.2 aliases, signed appcast and update redirect after clean Mac launch check passed (Padoo workflow 37628685028).
- Release DMG SHA256 is bb02df23d106c766a4df37f333a123bc9740d10e619a0f6ddbceca62d65f3b48; appcast SHA256 is 866fe2ad273fa8ea19590a1ef7c3beef5a0d09cf4bbf330f190fe046dba9fbc8. Verified both against live responses.
- Preserved immutable PadooMac-1.3.dmg (previous signed feed artifact). Withdrawn staged build 26 failed clean launch due to a signing certificate/profile mismatch and was never selected by stable URLs.
- Website build passed using npm --script-shell=/bin/sh run build. Release assets switched in f174003; source release tag mac-v1.3.2-build27 is in alfital2/padoo.

## Open questions / blockers

- No website publication blockers. No iPhone release was performed; native Bluetooth experiments remain excluded.

## Next steps

1. Keep versioned artifacts immutable; publish future versions under fresh filenames before changing stable aliases/feed.
2. Preserve unrelated files in the original /Users/tal/Documents/taltools_site checkout; publication used this isolated worktree.

_Last updated: 2026-10-07 by Codex (GPT-6)_
