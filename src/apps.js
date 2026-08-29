// Shared app data used by every design variant.
import natchoIcon from './assets/icons/natcho.png'
import flickeyIcon from './assets/icons/flickey.png'
import tallyIcon from './assets/icons/tally.png'
import guitarIcon from './assets/icons/guitar.svg'
import poofIcon from './assets/icons/poof.png'
import padooIcon from './assets/icons/padoo.png'

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
    site: '/natcho/',
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
    tagline: 'Claude + Codex usage, at a glance.',
    blurb:
      'Tracks Claude and Codex limits, reset windows, and live coding sessions from the menu bar — with model switching and one-click terminal jumps.',
    accent: '#2ec4b6',
    emoji: '📊',
    icon: tallyIcon,
    site: 'https://tallyrate.site',
    external: true,
    bullets: ['Claude, Codex, or both', 'Session + weekly limits', 'Live models + token totals', 'Private local authentication'],
  },
  {
    id: 'guitar',
    name: 'Guitar Studio',
    tagline: 'Plug in. Your browser is the amp.',
    blurb:
      'A whole guitar rig in a browser tab: amp sim, a pedal chain, a built-in tuner and low-latency monitoring. Plug into your interface, press start, and play. Nothing to install, no account.',
    accent: '#f0b429',
    emoji: '🎸',
    icon: guitarIcon,
    site: 'https://alfital2.github.io/guitar-web/',
    external: true,
    bullets: ['Amp sim + pedal chain', 'Built-in chromatic tuner', 'Low-latency monitoring', 'Runs in the browser - nothing to install'],
  },
  {
    id: 'poof',
    name: 'Poof',
    tagline: 'Show your coding agent what moved.',
    blurb:
      'Press Cmd+Shift+2, drag a region, press Esc. Then drag the clip into Claude Code, Cursor, or any file-reading agent - it drops a note pointing at the recording, and your agent reads every frame instead of one flat screenshot.',
    accent: '#ff4436',
    emoji: '💨',
    icon: poofIcon,
    site: 'https://github.com/alfital2/poof/releases/latest/download/Poof.app.zip',
    external: true,
    bullets: ['Your agent reads every frame', 'Perfect for showing UI and interactions', 'One hotkey, no window', 'Keeps a GIF for humans too'],
  },
  {
    id: 'padoo',
    name: 'Padoo',
    tagline: 'Your iPhone is the trackpad your Mac was missing.',
    blurb:
      'Turns an iPhone into a real pointing device for a Mac: a trackpad you can also aim like a remote, plus a grid of glass keys for your Dock apps. About two milliseconds from finger to cursor. Pair once, then the two just find each other.',
    accent: '#3d6bff',
    emoji: '📱',
    icon: padooIcon,
    site: '/padoo/',
    external: false,
    bullets: ['Trackpad, air pointer and key deck', '~2 ms finger to cursor', 'Cable, Wi-Fi Direct or your network', 'No account, no servers'],
  },
]
