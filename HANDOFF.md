## Status

Padoo's website now uses the owner's current Surfaces → Trackpad and Surfaces → App Deck screenshots instead of the outdated combined Deck & Library screenshot. The final Trackpad image shows focused-app controls enabled, as requested in the owner's correction. The update is published through GitHub Pages under continuing authorization. Paid-feature copy, the centered Windows tooltip, permanent Windows download URL, and Mac 1.3.2 (27) remain in place; other products are unchanged.

## Recent changes

- Replaced the hero screenshot with two current app-window captures, displayed side by side on desktop and stacked on mobile. Cropped transparent outer margins and encoded WebP assets for the site.
- Used the last supplied Trackpad capture (1.20.53), superseding the earlier capture with controls disabled; retained the supplied App Deck capture (1.20.16).
- Refreshed matching deck-layout, default key-gesture, and trackpad-dock detail crops from those captures so they no longer show the old combined interface.
- Updated captions and alt text to describe Surfaces, focused-app controls, and App Deck modes. Added intrinsic dimensions to hero images.
- Production build and diff checks passed. Chromium checks passed at 375, 768, and 1440 px for image loading, removal of old screenshot references, and no horizontal overflow. Visually inspected desktop/mobile hero layouts and detail crops.

## Open questions / blockers

- The new paid feature's name, price, and billing model remain unspecified; pricing copy refers to the app and App Store.
- Other screenshots (appearance, per-app overrides, action library, and phone views) were not replaced because new captures for them were not supplied.

## Next steps

1. Refresh remaining screenshots when new captures are supplied.
2. Add specific paid-feature information if the owner supplies it.
3. Preserve Mac release artifacts and unrelated untracked `.agents/` and `drafts/` files.

_Last updated: 2026-10-10 by Codex (GPT-6)_
