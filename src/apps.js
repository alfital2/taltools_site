// Shared app data used by every design variant.
import natchoIcon from './assets/icons/natcho.png'
import flickeyIcon from './assets/icons/flickey.png'
import tallyIcon from './assets/icons/tally.png'

export const APPS = [
  {
    id: 'natcho',
    name: 'Natcho',
    tagline: 'Notch? Nacho problem.',
    blurb:
      'Hides your MacBook camera notch behind a perfectly black bar. Crispy rounded corners optional. Asks for barely any permissions.',
    accent: '#ffb703',
    emoji: '🌮',
    icon: natchoIcon,
    site: '/natcho',
    external: false,
    bullets: ['Minimal permissions', 'Optional rounded corners', 'Multi-display aware', '0.6 MB, notarized'],
  },
  {
    id: 'flickey',
    name: 'FlicKey',
    tagline: 'Always typing in the right language.',
    blurb:
      'Auto-switches your keyboard language per app, per site, even per browser tab, and fixes wrong-layout gibberish with a double-tap.',
    accent: '#7c5cff',
    emoji: '⌨️',
    icon: flickeyIcon,
    site: 'https://flickey.site',
    external: true,
    bullets: ['Per-app / per-site memory', 'Double-tap ⇧ fixes gibberish', 'No account, fully local', 'Live language badge'],
  },
  {
    id: 'tally',
    name: 'Tally',
    tagline: 'Your Claude usage, at a glance.',
    blurb:
      'Watches your Claude.ai session and weekly limits from the menu bar, with reset countdowns and gentle heads-up nudges.',
    accent: '#2ec4b6',
    emoji: '📊',
    icon: tallyIcon,
    site: 'https://tallyrate.site',
    external: true,
    bullets: ['Session + weekly windows', 'Reset countdowns', 'Threshold notifications', 'Secure Keychain login'],
  },
]
