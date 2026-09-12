## Status

Padoo Mac 1.2 (5) is deployed through a signed Sparkle feed. The versioned and stable downloads use the same notarized, stapled universal DMG, and a real 1.2 (4) installation successfully updated to 1.2 (5), relaunched, and retained its pairing.

## Recent changes

- Published the versioned 1.2 DMG before exposing it in the feed so clients could never see a dangling update URL.
- Published the generated EdDSA-signed Sparkle appcast only after the archive was live and its SHA-256 matched the release artifact.
- Exercised the full updater path from build 4 to build 5, including download, signature verification, installation, and relaunch.
- Promoted the exact tested artifact to the stable `PadooMac.dmg` download after the updater test passed.

## Open questions / blockers

- The matching iPhone companion from Padoo `dev` still needs installation and on-device validation of cable → Wi-Fi Direct → Wi-Fi; CoreDevice previously could not establish a tunnel while the phone was unavailable.
- The unrelated landing-page wording and cleanup questions from the prior handoff remain open. The existing dirty site checkout was deliberately left untouched; this release used a clean temporary clone.

## Next steps

1. Verify the final public stable and versioned DMG hashes and the signed appcast after Pages deploys.
2. Install and test the matching iPhone companion when the phone is unlocked and available.
3. Monitor the first public updater checks for any delivery errors.

_Last updated: 2026-09-13 by Codex_
