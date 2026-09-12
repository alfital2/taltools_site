## Status

The notarized Padoo Mac 1.3 (9) reviewer DMG is published at the versioned URL while the stable download and signed Sparkle appcast intentionally remain on 1.2 (5). This lets App Review use the matching companion without offering 1.3 to existing Mac users before iOS 1.3 is live.

## Recent changes

- Published `PadooMac-1.3.dmg` from tagged source `v1.3-build9` after Developer ID signing, two-stage notarization/stapling, Gatekeeper validation, universal-architecture verification, and the all-Macs provisioning-profile check.
- Kept `PadooMac.dmg`, `PadooMac-1.2.dmg`, and `appcast.xml` byte-for-byte unchanged to preserve the release-day ordering.
- Used a clean temporary checkout so the separate dirty `taltools_site` working copy and its unrelated draft work were not touched.

## Open questions / blockers

- Do not publish the generated 1.3 appcast or replace the stable recovery download until iOS 1.3 is live on the App Store.
- The unrelated landing-page wording and cleanup questions remain open in the primary site checkout.

## Next steps

1. Update the 1.3 App Review notes to use `https://taltools.site/padoo/PadooMac-1.3.dmg`.
2. After iOS 1.3 goes live, publish the generated signed 1.3 appcast and point the stable recovery URL/download at the 1.3 DMG.
3. Verify the final live hashes after each release-day deployment.

_Last updated: 2026-09-13 by Codex_
