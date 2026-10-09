## Status

Padoo's website now acknowledges paid features and directs users to the app and App Store for current pricing. Conflicting promises about no paid tiers, a single $9.99 purchase covering everything, and no purchases in the Mac app have been removed from marketing, support, privacy, and metadata. This update is published through GitHub Pages under the user's continuing publication authorization. The centered Windows installation tooltip and permanent latest-installer URL remain in place. Mac 1.3.2 (27) remains current; other products are unchanged.

## Recent changes

- Removed fixed-price and no-subscription claims from the hero, search/social descriptions, and pricing panel because the owner added a paid feature.
- Replaced the pricing panel with a compact Try Padoo section that acknowledges paid features, retaining the existing trial CTA and non-pricing benefits.
- Updated the support pricing FAQ and requirements chip to avoid promises of one payment unlocking everything or permanent free access.
- Generalized the privacy purchase paragraph to StoreKit purchase verification, removing assumptions about a single unlock and no Mac purchases.
- Production build and diff checks passed. Chromium checks passed at 375 and 1440 px on landing, support, and privacy pages for removal of stale claims, new wording, and no horizontal overflow. Inspected the mobile pricing panel.

## Open questions / blockers

- The new paid feature's name, price, and billing model have not been supplied. The site deliberately refers readers to the app and App Store instead of guessing these details.
- The Windows publisher must retain the asset name `PadooWin-Setup.exe` in each latest release for the permanent download URL to work.

## Next steps

1. Add specific paid-feature information if the owner supplies it.
2. Keep pricing and installation guidance aligned with product releases.
3. Preserve Mac release artifacts and unrelated untracked `.agents/` and `drafts/` files.

_Last updated: 2026-10-10 by Codex (GPT-6)_
