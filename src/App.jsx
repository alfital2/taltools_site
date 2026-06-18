import { useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll } from 'framer-motion'
import natchoIcon from './assets/icons/natcho.png'
import flickeyIcon from './assets/icons/flickey.png'
import tallyIcon from './assets/icons/tally.png'

const ICONS = { natcho: natchoIcon, flickey: flickeyIcon, tally: tallyIcon }

/* ============================================================= *
 *  TalTools — a playful lab of tiny Mac menu-bar apps.
 *  Hand-built: confetti, blob background, custom SVG art, and
 *  three live mini-demos of the apps.
 * ============================================================= */

const ACCENT = { natcho: '#ffb703', flickey: '#7c5cff', tally: '#2ec4b6' }
const INK = '#1b1233'

const APPS = [
  {
    id: 'natcho',
    name: 'Natcho',
    tagline: 'Notch? Nacho problem.',
    blurb:
      'Hides your MacBook camera notch behind a perfectly black bar. Crispy rounded corners optional. Asks for barely any permissions.',
    accent: ACCENT.natcho,
    site: '/natcho',
    external: false,
  },
  {
    id: 'flickey',
    name: 'FlicKey',
    tagline: 'Always typing in the right language.',
    blurb:
      'Auto-switches your keyboard language per app, per site, even per browser tab, and fixes wrong-layout gibberish with a double-tap.',
    accent: ACCENT.flickey,
    site: 'https://flickey.site',
    external: true,
  },
  {
    id: 'tally',
    name: 'Tally',
    tagline: 'Your Claude usage, at a glance.',
    blurb:
      'Watches your Claude.ai session and weekly limits from the menu bar, with reset countdowns and gentle heads-up nudges.',
    accent: ACCENT.tally,
    site: 'https://tallyrate.site',
    external: true,
  },
]

/* ====================  APP ICONS  ==================== */
/* The real macOS app icons, lifted from each app's .icns / asset catalog. */
function AppImage({ id, size = 24, className = '' }) {
  return <img src={ICONS[id]} alt={`${id} app icon`} width={size} height={size} className={className} style={{ display: 'block' }} />
}

function Sparkle({ color = '#ff5d5d', size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 1.5 L14 9.5 L22 12 L14 14.5 L12 22.5 L10 14.5 L2 12 L10 9.5 Z"
        fill={color}
        stroke={INK}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---------- Floating background blobs ---------- */
function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-blob absolute -left-24 top-10 h-80 w-80 rounded-full bg-cheese/40 blur-3xl" />
      <div className="animate-blob absolute right-0 top-40 h-96 w-96 rounded-full bg-grape/30 blur-3xl" style={{ animationDelay: '-4s' }} />
      <div className="animate-blob absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-guac/30 blur-3xl" style={{ animationDelay: '-8s' }} />
      <div className="animate-blob absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-bubble/30 blur-3xl" style={{ animationDelay: '-2s' }} />
    </div>
  )
}

/* ---------- Confetti burst ---------- */
function useConfetti() {
  const [bursts, setBursts] = useState([])
  const fire = (x, y) => {
    const id = `${x}-${y}-${bursts.length}-${performance.now()}`
    const pieces = Array.from({ length: 26 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 26 + (i % 3) * 0.3
      const dist = 90 + (i % 7) * 26
      const colors = ['#ff5d5d', '#ffb703', '#2ec4b6', '#7c5cff', '#4cc9f0', '#ff7ad9']
      return {
        i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 60,
        rot: (i % 2 ? 1 : -1) * (180 + i * 20),
        color: colors[i % colors.length],
        sq: i % 2 === 0,
      }
    })
    setBursts((b) => [...b, { id, x, y, pieces }])
    setTimeout(() => setBursts((b) => b.filter((it) => it.id !== id)), 1100)
  }

  const Layer = () => (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <AnimatePresence>
        {bursts.map((b) => (
          <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
            {b.pieces.map((p) => (
              <motion.div
                key={p.i}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{ x: p.dx, y: p.dy + 240, opacity: 0, rotate: p.rot }}
                transition={{ duration: 1, ease: [0.2, 0.6, 0.3, 1] }}
                className="absolute h-3 w-3"
                style={{ background: p.color, borderRadius: p.sq ? 2 : 99 }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )

  return { fire, Layer }
}

/* ---------- Magnetic button ---------- */
function MagneticButton({ children, className = '', style, onClick, ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 15 })
  const sy = useSpring(y, { stiffness: 300, damping: 15 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: sx, y: sy, ...style }}
      whileTap={{ scale: 0.94 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/* ---------- Reveal on scroll ---------- */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* =====================  NAVBAR  ===================== */
function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-2xl border-2 border-ink bg-cream/85 px-5 py-3 shadow-pop-sm backdrop-blur"
    >
      <a href="#top" className="flex items-center gap-2 font-display text-xl font-700">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-cream">T</span>
        TalTools
      </a>
      <nav className="hidden items-center gap-6 font-600 sm:flex">
        {APPS.map((a) => (
          <a key={a.id} href={`#${a.id}`} className="transition-colors hover:text-salsa">
            {a.name}
          </a>
        ))}
      </nav>
      <a
        href="#apps"
        className="rounded-xl border-2 border-ink bg-cheese px-4 py-2 font-700 shadow-pop-sm transition-transform hover:-translate-y-0.5"
      >
        Get the apps
      </a>
    </motion.header>
  )
}

/* =====================  HERO  ===================== */
function Hero({ fire }) {
  return (
    <section id="top" className="dot-grid relative px-4 pb-10 pt-36 sm:pt-44">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="animate-bob inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 font-700 shadow-pop-sm">
            <Sparkle color="#ffb703" size={18} />
            a tiny lab of Mac menu-bar apps
          </span>
        </Reveal>

        <h1 className="mt-6 font-display text-5xl font-700 leading-[1.05] sm:text-7xl md:text-8xl">
          Little apps that <br className="hidden sm:block" />
          <span className="text-rainbow">just fix the annoying stuff.</span>
        </h1>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl text-lg font-500 text-ink/70 sm:text-xl">
            They live in your menu bar, ask for almost nothing, and quietly make your Mac a nicer
            place to be. Three of them so far. Go on, poke around.
          </p>
        </Reveal>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            onClick={(e) => fire(e.clientX, e.clientY)}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-salsa px-7 py-3.5 font-display text-lg font-700 text-cream shadow-pop transition-shadow"
          >
            <Sparkle color="#fff7ec" size={20} />
            Tap for confetti
          </MagneticButton>
          <a
            href="#apps"
            className="rounded-2xl border-2 border-ink bg-white px-7 py-3.5 font-display text-lg font-700 shadow-pop-sm transition-transform hover:-translate-y-0.5"
          >
            Meet the apps →
          </a>
        </div>
      </div>

      <FloatingArt />
    </section>
  )
}

function FloatingArt() {
  const tiles = [
    { id: 'natcho', cls: 'left-[7%] top-[30%]', d: 0 },
    { id: 'flickey', cls: 'right-[8%] top-[22%]', d: 0.5 },
    { id: 'tally', cls: 'left-[12%] bottom-[6%]', d: 1 },
  ]
  const sparks = [
    { color: '#ff5d5d', size: 40, cls: 'right-[14%] bottom-[14%]', d: 0.3 },
    { color: '#4cc9f0', size: 26, cls: 'right-[27%] top-[58%]', d: 0.8 },
    { color: '#ff7ad9', size: 22, cls: 'left-[26%] top-[20%]', d: 1.3 },
  ]
  return (
    <>
      {tiles.map((t, i) => (
        <motion.div
          key={t.id}
          className={`pointer-events-none absolute hidden drop-shadow-[4px_4px_0_rgba(27,18,51,0.5)] md:block ${t.cls}`}
          animate={{ y: [0, -16, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: t.d }}
        >
          <AppImage id={t.id} size={62} className="rounded-[14px]" />
        </motion.div>
      ))}
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute hidden md:block ${s.cls}`}
          animate={{ y: [0, -14, 0], rotate: [0, 25, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: s.d }}
        >
          <Sparkle color={s.color} size={s.size} />
        </motion.div>
      ))}
    </>
  )
}

/* =====================  MARQUEE  ===================== */
function Marquee() {
  const words = ['minimal permissions', 'no accounts', 'no tracking', 'tiny downloads', 'made on a Mac', 'open a menu, not a tab', 'notarized']
  const row = [...words, ...words]
  return (
    <div className="my-4 -rotate-1 border-y-2 border-ink bg-ink py-3 text-cream">
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap font-display text-lg font-600"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            {w} <span className="text-cheese">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* =====================  APP SECTION  ===================== */
function AppShowcase({ fire }) {
  return (
    <section id="apps" className="mx-auto max-w-6xl px-4 py-20">
      <Reveal className="text-center">
        <h2 className="font-display text-4xl font-700 sm:text-5xl">Three apps. Try them right here.</h2>
        <p className="mx-auto mt-3 max-w-lg text-lg text-ink/65">
          These aren&rsquo;t screenshots. Each demo below actually works, so click around.
        </p>
      </Reveal>

      <div className="mt-14 space-y-10">
        {APPS.map((app, i) => (
          <Reveal key={app.id} delay={i * 0.05}>
            <AppCard app={app} flip={i % 2 === 1} fire={fire} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function AppCard({ app, flip, fire }) {
  return (
    <div
      id={app.id}
      className="grid items-center gap-8 rounded-3xl border-2 border-ink bg-white p-6 shadow-pop sm:p-9 md:grid-cols-2"
      style={{ scrollMarginTop: 90 }}
    >
      <div className={flip ? 'md:order-2' : ''}>
        <div
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink py-1 pl-1 pr-3.5 font-700"
          style={{ background: app.accent }}
        >
          <AppImage id={app.id} size={26} className="rounded-[7px] ring-1 ring-ink/20" />
          {app.name}
        </div>
        <h3 className="mt-4 font-display text-3xl font-700 sm:text-4xl">{app.tagline}</h3>
        <p className="mt-3 text-lg text-ink/70">{app.blurb}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <MagneticButton
            onClick={(e) => fire(e.clientX, e.clientY)}
            className="rounded-xl border-2 border-ink px-5 py-2.5 font-700 shadow-pop-sm transition-transform hover:-translate-y-0.5"
            style={{ background: app.accent }}
          >
            Download {app.name}
          </MagneticButton>
          <a
            href={app.site}
            {...(app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group inline-flex items-center gap-1.5 font-700 text-ink/70 underline decoration-2 underline-offset-4 transition-colors hover:text-salsa"
          >
            See the full demo
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
      <div className={flip ? 'md:order-1' : ''}>
        {app.id === 'natcho' && <NatchoDemo />}
        {app.id === 'flickey' && <FlicKeyDemo />}
        {app.id === 'tally' && <TallyDemo />}
      </div>
    </div>
  )
}

/* ----- Natcho: toggle the notch away (menu-bar text stays readable) ----- */
const MAC_WALLPAPER = {
  backgroundColor: '#6d6af0',
  backgroundImage: [
    'radial-gradient(at 18% 18%, #ff8fab 0px, transparent 45%)',
    'radial-gradient(at 82% 12%, #b388ff 0px, transparent 45%)',
    'radial-gradient(at 12% 86%, #ffd6a5 0px, transparent 45%)',
    'radial-gradient(at 88% 82%, #7ad7f0 0px, transparent 45%)',
    'linear-gradient(135deg, #6d6af0, #a06bd0)',
  ].join(','),
}

function NatchoDemo() {
  const [hidden, setHidden] = useState(false)
  const [round, setRound] = useState(true)
  return (
    <div className="rounded-2xl border-2 border-ink bg-gradient-to-br from-sky/40 to-grape/30 p-5">
      <div
        className={`relative mx-auto aspect-[16/10] w-full max-w-sm overflow-hidden ring-2 ring-ink transition-all duration-300 ${round ? 'rounded-2xl' : 'rounded-none'}`}
        style={MAC_WALLPAPER}
      >
        {/* layer 1: menu-bar background strip. Goes solid black when "hidden" so the
            notch blends into it. No blur here, so nothing smears the notch. */}
        <motion.div
          className="absolute inset-x-0 top-0 z-10 h-6"
          animate={{ backgroundColor: hidden ? '#000000' : 'rgba(8,6,20,0.34)' }}
          transition={{ duration: 0.35 }}
        />

        {/* layer 2: the notch (a crisp solid-black pill at top-center) */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-[10px] bg-black" />

        {/* layer 3: menu-bar text/icons, always on top and readable */}
        <div className="absolute inset-x-0 top-0 z-30 flex h-6 items-center justify-between px-2 text-[9px] font-600 text-white">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white" />
            Finder
            <span className="opacity-70">File</span>
            <span className="opacity-70">Edit</span>
          </span>
          <span className="flex items-center gap-1.5">
            <WifiGlyph />
            <BatteryGlyph />
            <span>9:41</span>
          </span>
        </div>

        {/* the screen's corners themselves round/unround via the container's
            border-radius above, exactly like Natcho's "rounded corners" toggle */}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button onClick={() => setHidden((v) => !v)} className="rounded-lg border-2 border-ink bg-cheese px-4 py-2 font-700 shadow-pop-sm transition-transform hover:-translate-y-0.5">
          {hidden ? 'Show the notch' : 'Hide the notch'}
        </button>
        <button onClick={() => setRound((v) => !v)} className="rounded-lg border-2 border-ink bg-white px-4 py-2 font-700 shadow-pop-sm transition-transform hover:-translate-y-0.5">
          Corners: {round ? 'on' : 'off'}
        </button>
      </div>
    </div>
  )
}

function WifiGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      <path d="M2 8.5a15 15 0 0 1 20 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M5.5 12.5a10 10 0 0 1 13 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 16.5a5 5 0 0 1 6 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.3" fill="white" />
    </svg>
  )
}

function BatteryGlyph() {
  return (
    <svg width="18" height="12" viewBox="0 0 26 14" aria-hidden>
      <rect x="1" y="2" width="21" height="10" rx="3" fill="none" stroke="white" strokeWidth="1.4" />
      <rect x="3" y="4" width="15" height="6" rx="1.5" fill="white" />
      <rect x="23" y="5" width="2" height="4" rx="1" fill="white" />
    </svg>
  )
}

/* ----- FlicKey: fix gibberish (each example targets a DIFFERENT language) ----- */
function FlicKeyDemo() {
  // wrong = what shows when you type the word in the wrong layout;
  // right = what you actually meant. Only the first one is Hebrew.
  const pairs = [
    { wrong: 'akuo', right: 'שלום', lang: 'Hebrew' },
    { wrong: 'ghbdtn', right: 'привет', lang: 'Russian' },
    { wrong: 'יקךךם', right: 'hello', lang: 'English' },
  ]
  const [idx, setIdx] = useState(0)
  const [fixed, setFixed] = useState(false)
  const cur = pairs[idx]
  const fix = () => {
    setFixed(true)
    setTimeout(() => {
      setFixed(false)
      setIdx((i) => (i + 1) % pairs.length)
    }, 1700)
  }
  return (
    <div className="rounded-2xl border-2 border-ink bg-gradient-to-br from-grape/25 to-bubble/30 p-5">
      <div className="rounded-xl border-2 border-ink bg-white p-4 shadow-pop-sm">
        <div className="mb-2 flex items-center justify-between text-xs font-700 text-ink/50">
          <span>Messages</span>
          <span className="rounded bg-grape/20 px-2 py-0.5">layout: {fixed ? cur.lang : '???'}</span>
        </div>
        <div className="flex min-h-12 items-center rounded-lg bg-cream px-3 py-2 font-mono text-2xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${idx}-${fixed ? 'r' : 'w'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              dir="auto"
            >
              {fixed ? cur.right : cur.wrong}
            </motion.span>
          </AnimatePresence>
          <motion.span
            className="ml-1 inline-block h-6 w-0.5 bg-ink"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={fix}
          className="flex items-center gap-2 rounded-lg border-2 border-ink bg-grape px-4 py-2 font-700 text-cream shadow-pop-sm transition-transform hover:-translate-y-0.5"
        >
          Double-tap
          <kbd className="rounded bg-cream px-2 py-0.5 font-mono text-ink">⇧ Shift</kbd>
        </button>
      </div>
      <p className="mt-3 text-center text-sm font-600 text-ink/55">
        Typed in the wrong layout? One shortcut un-scrambles it into the language you meant.
      </p>
    </div>
  )
}

/* ----- Tally: the real menu-bar popover, with session + weekly rings ----- */
const TALLY_GREEN = '#46e08f'
const TALLY_CYAN = '#4cc9f0'

// One gauge = two concentric rings. Each ring is split into a cyan "used" arc
// and a green "remaining" arc, separated by small gaps, so it's NOT a closed
// circle — the cyan segment grows (and the gaps shift) as usage climbs.
function GaugeRing({ r, pct }) {
  const c = 2 * Math.PI * r
  const GAP = 8 // gap (in path units) at each of the two seams
  const used = (c * pct) / 100
  const rem = c - used
  return (
    <>
      {/* cyan = used */}
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={TALLY_CYAN}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${Math.max(used - GAP, 0.001)} ${c}`}
        strokeDashoffset={-GAP / 2}
      />
      {/* green = remaining */}
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={TALLY_GREEN}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${Math.max(rem - GAP, 0.001)} ${c}`}
        strokeDashoffset={-(used + GAP / 2)}
      />
    </>
  )
}

function TallyGauge({ pct, innerPct, label, reset, dot }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <GaugeRing r={46} pct={pct} />
          <GaugeRing r={31} pct={innerPct} />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center leading-none">
          <span className="font-display text-xl font-700" style={{ color: TALLY_GREEN }}>
            {pct}%
          </span>
          <span className="mt-1 text-[10px] font-600 text-white/55">{label}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-600 text-white/60">
        <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
        Resets in {reset}
      </div>
    </div>
  )
}

function TallyDemo() {
  const [session, setSession] = useState(28)
  const weekly = 33
  return (
    <div className="rounded-2xl border-2 border-ink p-5" style={{ background: 'linear-gradient(135deg,#2a2350,#352a63 45%,#214a82)' }}>
      {/* faux menu bar */}
      <div className="mb-2 flex items-center justify-end gap-3 rounded-lg bg-black/30 px-3 py-1.5 text-[11px] font-700 text-white/85 backdrop-blur">
        <span className="rounded bg-grape/80 px-1.5 py-0.5 text-white">EN</span>
        <span className="flex items-center gap-1">
          <AppImage id="tally" size={15} className="rounded-[3px]" />
          {session}%
        </span>
        <WifiGlyph />
        <BatteryGlyph />
        <span>9:41</span>
      </div>

      {/* popover with a pointer that originates from the rings panel */}
      <div className="relative">
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-l border-t border-white/10" style={{ background: 'rgba(22,24,44,0.96)' }} />
        <div className="rounded-2xl border border-white/10 p-5 shadow-lg" style={{ background: 'rgba(22,24,44,0.96)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-start justify-around gap-4">
            <TallyGauge pct={session} innerPct={64} label="session" reset="1h 55m" dot="#f0a500" />
            <TallyGauge pct={weekly} innerPct={47} label="weekly" reset="12h 25m" dot={TALLY_CYAN} />
          </div>
          <div className="mt-4 border-t border-white/10 pt-2 text-center text-[11px] font-600 text-white/45">
            Plan: Max (5x) · Updated just now
          </div>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={session}
        onChange={(e) => setSession(+e.target.value)}
        aria-label="Simulated session usage percentage"
        className="mt-4 w-full accent-guac"
      />
      <p className="text-center text-sm font-600 text-white/55">Drag to simulate a busy day.</p>
    </div>
  )
}

/* =====================  CTA + FOOTER  ===================== */
function CTA({ fire }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <Reveal>
        <div className="dot-grid relative overflow-hidden rounded-3xl border-2 border-ink bg-cheese p-10 text-center shadow-pop sm:p-16">
          <h2 className="font-display text-4xl font-700 sm:text-6xl">Free. Tiny. Yours.</h2>
          <p className="mx-auto mt-4 max-w-md text-lg font-600 text-ink/75">
            No sign-ups, no subscriptions, no nonsense. Just download and enjoy a calmer Mac.
          </p>
          <MagneticButton
            onClick={(e) => fire(e.clientX, e.clientY)}
            className="mt-8 rounded-2xl border-2 border-ink bg-ink px-8 py-4 font-display text-xl font-700 text-cream shadow-pop"
          >
            Grab them all →
          </MagneticButton>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink px-4 py-10 text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="font-display text-xl font-700">TalTools</div>
        <div className="flex gap-6 font-600">
          {APPS.map((a) => (
            <a key={a.id} href={`#${a.id}`} className="text-cream/70 transition-colors hover:text-cheese">
              {a.name}
            </a>
          ))}
        </div>
        <div className="text-sm text-cream/50">Made with care for your menu bar.</div>
      </div>
    </footer>
  )
}

/* =====================  APP  ===================== */
export default function App() {
  const { fire, Layer } = useConfetti()
  const { scrollYProgress } = useScroll()

  return (
    <div className="relative min-h-screen">
      <Blobs />
      <Layer />

      {/* scroll progress bar */}
      <motion.div className="fixed inset-x-0 top-0 z-[110] h-1.5 origin-left bg-salsa" style={{ scaleX: scrollYProgress }} />

      <Navbar />
      <main>
        <Hero fire={fire} />
        <Marquee />
        <AppShowcase fire={fire} />
        <CTA fire={fire} />
      </main>
      <Footer />
    </div>
  )
}
