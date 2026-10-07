## Status

Padoo has a Windows download entry on its landing and support pages, pointing to `/padoo/windows/` with a clear “Download link coming soon” placeholder. The user authorized publishing this placeholder while waiting for the public Windows repository URL. Padoo Mac 1.3.2 (27) remains the current release: stable download, recovery aliases, signed Sparkle feed, and update redirect select build 27. Other products, including FrameNook, are unchanged.

## Recent changes

- Finished the existing Windows placeholder and linked it from the landing and support pages so Windows users have a destination now.
- Removed the unfinished scheduled installer-sync workflow, which referenced a missing script and would break deployment. A public GitHub latest-release link will not require this job or a token.
- Deferred Windows system requirements and feature claims until the release repository can verify them.
- Documented how to activate the latest-release link in README; retained `windows-release` markers and `data-windows-label` hooks for the small follow-up edit.
- Fast-forwarded this checkout to the newer published Mac release before deployment. Stable DMG SHA256 remains `bb02df23d106c766a4df37f333a123bc9740d10e619a0f6ddbceca62d65f3b48`; appcast SHA256 remains `866fe2ad273fa8ea19590a1ef7c3beef5a0d09cf4bbf330f190fe046dba9fbc8`.
- Production build and diff checks passed. Browser checks verified landing/support links, download navigation, and layouts at 375, 768, 1024, and 1440 px; desktop and mobile screenshots were inspected.

## Open questions / blockers

- The public Windows repository URL was missing from the user's message. No Windows installer link can be verified until they supply it.

## Next steps

1. When the URL arrives, verify the repo's release assets and Windows requirements. Replace the placeholder with `/releases/latest`, or use `/releases/latest/download/<filename>` if the installer name is stable across releases; update button labels.
2. Publish and verify the activated Windows download link.
3. Keep Mac versioned artifacts immutable; preserve unrelated untracked `.agents/` and `drafts/` files.

_Last updated: 2026-10-08 by Codex (GPT-6)_
