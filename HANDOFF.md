## Status

The site now publishes the notarized Padoo 1.1 Mac companion at `public/padoo/PadooMac-1.1.dmg` for App Review. The unversioned `PadooMac.dmg` remains the byte-identical Padoo 1.0/wire-v2 download for current users.

## Recent changes

- Added only the versioned Padoo 1.1 DMG so reviewers can install the wire-v8 Mac companion without breaking the public download used by the live iOS 1.0 app.
- Preserved the live unversioned DMG at 2,762,135 bytes with MD5 `0d2c26ea91239fe2bc8c84fe1f92c7d4`.
- Verified the new 4,332,064-byte artifact has SHA-256 `5bddafa7827eaf160ca09668f4b5521cd87236310e213e97610611430d115da8` before deployment.

## Open questions / blockers

- The unversioned `PadooMac.dmg` must not be replaced until Padoo 1.1 is actually released on the App Store.

## Next steps

1. Keep `PadooMac-1.1.dmg` available throughout App Review.
2. On release day, replace the unversioned DMG with the matching wire-v8 build in the same sitting as the manual App Store release.

_Last updated: 2026-09-01 by Codex_
