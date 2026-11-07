// Shared app data used by every design variant.
import flickeyIcon from './assets/icons/flickey.png'
import tallyIcon from './assets/icons/tally.png'
import padooIcon from './assets/icons/padoo.png'
import frameNookIcon from './assets/icons/framenook.png'

export const APPS = [
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
    appStore: 'https://apps.apple.com/app/id6780034410',
    appStoreLabel: 'Get Tally for Mac & iPhone',
    bullets: ['Claude, Codex, or both', 'Session + weekly limits', 'Live models + token totals', 'Private local authentication'],
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
  {
    id: 'framenook',
    name: 'FrameNook',
    tagline: 'Your photos, at home on every screen.',
    blurb:
      'Runs on your iPhone and gives an old iPad a new purpose as a private photo and video display. TVs, other tablets, and computers can join through their browser too.',
    accent: '#ee6c4d',
    emoji: '🖼️',
    icon: frameNookIcon,
    site: '/framenook/',
    external: false,
    appStore: 'https://apps.apple.com/app/id6814156822',
    appStoreLabel: 'Get FrameNook on the App Store',
    bullets: ['Give an old iPad a new purpose', 'Works with TVs, tablets and computers', 'Private local-network sharing', 'No account or analytics'],
  },
]
