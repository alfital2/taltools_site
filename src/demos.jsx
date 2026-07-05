import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* =========================================================================
 *  Shared, self-contained interactive demos for the three apps.
 *  Drop <NatchoDemo/>, <FlicKeyDemo/>, <TallyDemo/> into any design.
 *  Each accepts an optional `tone` ('light' | 'dark') to blend with the page
 *  and a `className` for outer sizing/spacing. They carry their own surfaces,
 *  so they look right on any background.
 *
 *  These encode every correctness fix we agreed on:
 *   - Natcho: menu-bar text stays readable when the notch is hidden; only the
 *     bottom corners round; crisp (non-blurred) notch.
 *   - FlicKey: three examples, each a real wrong-layout mapping to a DIFFERENT
 *     language (only one Hebrew).
 *   - Tally: real menu-bar popover, two concentric rings each drawn as a faint
 *     full-circle track + a colored progress arc proportional to usage (green
 *     outer / cyan inner), cyan reset dots, and the session ring + number +
 *     menu-bar mini-ring escalate green -> orange (>=60%) -> red (>=90%).
 * ========================================================================= */

/* ---------- shared glyphs ---------- */
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

/* ====================  NATCHO  ==================== */
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

export function NatchoDemo({ tone = 'light', className = '' }) {
  const [hidden, setHidden] = useState(false)
  const [round, setRound] = useState(true)
  const dark = tone === 'dark'
  const secondary = dark ? 'border-white/25 bg-white/10 text-white' : 'border-black/15 bg-white text-slate-900'
  return (
    <div className={className}>
      <div
        className={`relative mx-auto aspect-[16/10] w-full max-w-sm overflow-hidden ring-1 ring-black/25 transition-all duration-300 ${round ? 'rounded-b-2xl rounded-t-none' : 'rounded-none'}`}
        style={MAC_WALLPAPER}
      >
        {/* menu-bar background goes solid black when hidden so the notch blends */}
        <motion.div
          className="absolute inset-x-0 top-0 z-10 h-6"
          animate={{ backgroundColor: hidden ? '#000000' : 'rgba(8,6,20,0.34)' }}
          transition={{ duration: 0.35 }}
        />
        {/* crisp notch pill */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-[10px] bg-black" />
        {/* readable menu-bar content on top */}
        <div className="absolute inset-x-0 top-0 z-30 flex h-6 items-center justify-between px-2 text-[9px] font-semibold text-white">
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
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setHidden((v) => !v)}
          className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-black shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ background: '#ffb703' }}
        >
          {hidden ? 'Show the notch' : 'Hide the notch'}
        </button>
        <button
          onClick={() => setRound((v) => !v)}
          className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 ${secondary}`}
        >
          {round ? 'Show corners' : 'Hide corners'}
        </button>
      </div>
    </div>
  )
}

/* ====================  FLICKEY  ==================== */
export function FlicKeyDemo({ tone = 'light', className = '' }) {
  // wrong = what shows when you type the word in the wrong layout; right = intended.
  // Each targets a different language; only the first is Hebrew.
  const pairs = [
    { wrong: 'akuo', right: 'שלום', lang: 'Hebrew' },
    { wrong: 'ghbdtn', right: 'привет', lang: 'Russian' },
    { wrong: 'יקךךם', right: 'hello', lang: 'English' },
  ]
  const [idx, setIdx] = useState(0)
  const [fixed, setFixed] = useState(false)
  const cur = pairs[idx]
  const dark = tone === 'dark'
  const fix = () => {
    setFixed(true)
    setTimeout(() => {
      setFixed(false)
      setIdx((i) => (i + 1) % pairs.length)
    }, 1700)
  }
  return (
    <div className={className}>
      <div
        className="rounded-xl border p-4 shadow-sm"
        style={dark ? { background: '#15151f', borderColor: 'rgba(255,255,255,0.12)' } : { background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}
      >
        <div className="mb-2 flex items-center justify-between text-xs font-bold" style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
          <span>Messages</span>
          <span className="rounded px-2 py-0.5" style={{ background: 'rgba(124,92,255,0.18)', color: dark ? '#cbbcff' : '#5b3fd6' }}>
            layout: {fixed ? cur.lang : '???'}
          </span>
        </div>
        <div className="flex min-h-12 items-center rounded-lg px-3 py-2 font-mono text-2xl" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#f6f3ec', color: dark ? '#fff' : '#1b1233' }}>
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
          <motion.span className="ml-1 inline-block h-6 w-0.5" style={{ background: dark ? '#fff' : '#1b1233' }} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={fix}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ background: '#7c5cff' }}
        >
          Double-tap <kbd className="rounded bg-white/90 px-2 py-0.5 font-mono text-[#1b1233]">⇧ Shift</kbd>
        </button>
      </div>
      <p className="mt-3 text-center text-sm font-semibold" style={{ color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)' }}>
        Typed in the wrong layout? One shortcut un-scrambles it into the language you meant.
      </p>
    </div>
  )
}

/* ====================  TALLY  ==================== */
const T_GREEN = '#46e08f'
const T_CYAN = '#4cc9f0'
const T_ORANGE = '#ff9f0a'
const T_RED = '#ff453a'
function severity(pct, base) {
  if (pct >= 90) return T_RED
  if (pct >= 60) return T_ORANGE
  return base
}

function GaugeRing({ r, pct, color = T_GREEN }) {
  const c = 2 * Math.PI * r
  const prog = Math.min(Math.max(pct, 0), 100)
  return (
    <>
      {/* faint full-circle track */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="6" />
      {/* colored progress arc, proportional to the percentage */}
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${Math.max((c * prog) / 100, 0.001)} ${c}`} />
    </>
  )
}

function TallyGauge({ pct, innerPct, label, reset, dot = T_CYAN, outerColor = T_GREEN, numberColor = T_GREEN }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <GaugeRing r={46} pct={pct} color={outerColor} />
          <GaugeRing r={31} pct={innerPct} color={T_CYAN} />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center leading-none">
          <span className="text-xl font-bold" style={{ color: numberColor }}>{Math.round(pct)}%</span>
          <span className="mt-1 text-[10px] font-semibold text-white/55">{label}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-white/60">
        <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
        Resets in {reset}
      </div>
    </div>
  )
}

function MiniRing({ pct }) {
  const r = 6.5
  const c = 2 * Math.PI * r
  const col = severity(pct, T_GREEN)
  return (
    <span className="relative inline-grid place-items-center" style={{ width: 17, height: 17 }}>
      <span className="absolute inset-0 rounded-full" style={{ background: '#0e1430' }} />
      <svg width="17" height="17" viewBox="0 0 17 17" className="relative -rotate-90">
        <circle cx="8.5" cy="8.5" r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.4" />
        <circle cx="8.5" cy="8.5" r={r} fill="none" stroke={col} strokeWidth="2.4" strokeLinecap="round" strokeDasharray={`${Math.max((c * pct) / 100, 0.001)} ${c}`} />
      </svg>
    </span>
  )
}

export function TallyDemo({ className = '' }) {
  // Usage fills on its own to demonstrate consumption over a working day. Each
  // ring climbs at its own pace (the inner rings are NOT tied to the outer ones)
  // and gently resets when it tops out, mirroring the real reset windows.
  const [session, setSession] = useState(12)
  const [sessionInner, setSessionInner] = useState(5)
  const [weekly, setWeekly] = useState(8)
  // Weekly inner ring is intentionally static - it does not climb.
  const weeklyInner = 21

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    // Independent step sizes -> the climbing rings drift out of sync over time.
    const climb = (set, step, floor) =>
      set((v) => (v >= 100 ? floor : v + step))
    const id = setInterval(() => {
      climb(setSession, 0.8, 6)
      climb(setSessionInner, 0.3, 2)
      climb(setWeekly, 0.22, 4)
    }, 500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: 'linear-gradient(135deg,#2a2350,#352a63 45%,#214a82)' }}>
      <div className="mb-2 flex items-center justify-end gap-3 rounded-lg bg-black/30 px-3 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur">
        <span className="rounded px-1.5 py-0.5 text-white" style={{ background: 'rgba(124,92,255,0.8)' }}>EN</span>
        <span className="flex items-center gap-1" style={{ color: severity(session, '#ffffff') }}>
          <MiniRing pct={session} />
          {Math.round(session)}%
        </span>
        <WifiGlyph />
        <BatteryGlyph />
        <span>9:41</span>
      </div>
      <div className="relative">
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-l border-t border-white/10" style={{ background: 'rgba(22,24,44,0.96)' }} />
        <div className="rounded-2xl border border-white/10 p-5 shadow-lg" style={{ background: 'rgba(22,24,44,0.96)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-start justify-around gap-4">
            <TallyGauge pct={session} innerPct={sessionInner} label="session" reset="1h 55m" dot={T_CYAN} outerColor={severity(session, T_GREEN)} numberColor={severity(session, T_GREEN)} />
            <TallyGauge pct={weekly} innerPct={weeklyInner} label="weekly" reset="12h 25m" dot={T_CYAN} />
          </div>
          <div className="mt-4 border-t border-white/10 pt-2 text-center text-[11px] font-semibold text-white/45">Plan: Max (5x) · Updated just now</div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-white/55">Live - your usage fills as you work.</p>
    </div>
  )
}

/* ====================  GUITAR STUDIO  ==================== */
// A live amp head: a brushed-dark control panel of amber rotary knobs (the amp
// EQ), a swinging VU needle, and a cabinet with a live signal waveform + power
// LED - Guitar Studio's own dark, amber-accented rig. Self-contained; the motion
// loop is deterministic (sine-driven, no randomness) and halts under
// prefers-reduced-motion, settling on a clean static rig.
const GS_AMBER = '#f0b429'
const GS_AMBER_HI = '#ff9f0a'
const GS_GREEN = '#32d74b'

// The amp's controls. `base` is the resting value (0..1); `wob` is how much it
// gently drifts so the rig reads as live rather than frozen.
const GS_KNOBS = [
  { label: 'Gain', base: 0.68, wob: 0.05 },
  { label: 'Bass', base: 0.55, wob: 0.02 },
  { label: 'Mid', base: 0.48, wob: 0.02 },
  { label: 'Treble', base: 0.62, wob: 0.03 },
  { label: 'Reverb', base: 0.34, wob: 0.04 },
]

// polar point with 0deg = 12 o'clock, increasing clockwise
function gsPolar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}
function gsArc(cx, cy, r, a0, a1) {
  const [x0, y0] = gsPolar(cx, cy, r, a0)
  const [x1, y1] = gsPolar(cx, cy, r, a1)
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  return `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`
}

// A single skeuomorphic amp knob with an amber value arc + pointer.
function GsKnob({ value, label }) {
  const va = -135 + value * 270 // -135 (min) .. +135 (max)
  const [px, py] = gsPolar(28, 28, 15, va)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="52" height="52" viewBox="0 0 56 56" aria-hidden>
        {/* metal knob body */}
        <circle cx="28" cy="28" r="16" fill="#0f0f11" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <circle cx="28" cy="24.5" r="13" fill="rgba(255,255,255,0.05)" />
        {/* faint full track */}
        <path d={gsArc(28, 28, 20, -135, 135)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" />
        {/* amber value arc */}
        <path d={gsArc(28, 28, 20, -135, va)} fill="none" stroke={GS_AMBER} strokeWidth="3" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${GS_AMBER})` }} />
        {/* pointer */}
        <line x1="28" y1="28" x2={px} y2={py} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="28" r="2.2" fill="rgba(255,255,255,0.5)" />
      </svg>
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </span>
    </div>
  )
}

export function GuitarStudioDemo({ className = '' }) {
  const [knobs, setKnobs] = useState(() => GS_KNOBS.map((k) => k.base))
  const [vu, setVu] = useState(0.4) // 0..1 needle position
  const [ms, setMs] = useState(6.8)
  const [wave, setWave] = useState('')

  useEffect(() => {
    const W = 300
    const H = 44
    const buildWave = (t, amp) => {
      const pts = []
      for (let x = 0; x <= W; x += 6) {
        const y =
          H / 2 +
          amp *
            (Math.sin(x / 13 + t / 3) * 10 +
              Math.sin(x / 5 - t / 2) * 5 +
              Math.sin(x / 27 + t) * 6)
        pts.push(`${x},${y.toFixed(1)}`)
      }
      return pts.join(' ')
    }
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setWave(buildWave(0, 0.5))
      setVu(0.5)
      return
    }
    let t = 0
    const id = setInterval(() => {
      t += 1
      // knobs breathe subtly around their resting value
      setKnobs(GS_KNOBS.map((k, i) => Math.max(0, Math.min(1, k.base + Math.sin(t / 22 + i * 1.3) * k.wob))))
      // VU needle swings with the signal envelope
      const env = 0.45 + 0.4 * Math.abs(Math.sin(t / 5)) + 0.1 * Math.sin(t / 2)
      setVu(Math.max(0, Math.min(1, env)))
      // round-trip latency wobbles in a plausible low range
      setMs(6.6 + Math.sin(t / 13) * 1.5 + Math.sin(t / 4) * 0.3)
      // live signal waveform, amplitude tracking the envelope
      setWave(buildWave(t, 0.6 + env * 0.7))
    }, 60)
    return () => clearInterval(id)
  }, [])

  // VU needle angle: -42deg (low) .. +42deg (hot)
  const vuAngle = -42 + vu * 84
  const [nx, ny] = gsPolar(50, 46, 34, vuAngle)
  const vuHot = vu > 0.82

  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: 'linear-gradient(180deg,#26262b 0%,#1a1a1e 58%,#151517 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* window chrome */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.42)' }}>
          Guitar Studio
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ background: GS_GREEN, boxShadow: `0 0 8px ${GS_GREEN}` }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          LIVE
          <span style={{ color: GS_AMBER }}>{ms.toFixed(1)} ms</span>
        </span>
      </div>

      {/* amp control panel: knobs + VU meter */}
      <div
        className="flex items-center justify-between gap-3 rounded-xl px-3 py-4"
        style={{
          background: 'linear-gradient(180deg,#232327,#171719)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex flex-1 items-start justify-between">
          {knobs.map((v, i) => (
            <GsKnob key={GS_KNOBS[i].label} value={v} label={GS_KNOBS[i].label} />
          ))}
        </div>
        {/* VU meter */}
        <div
          className="rounded-md px-2 pt-2 pb-1"
          style={{ background: 'linear-gradient(180deg,#f3ead0,#d8caa4)', border: '1px solid rgba(0,0,0,0.35)' }}
        >
          <svg width="88" height="50" viewBox="0 0 100 52" aria-hidden>
            <path d={gsArc(50, 46, 34, -42, 42)} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
            <path d={gsArc(50, 46, 34, 20, 42)} fill="none" stroke={GS_AMBER_HI} strokeWidth="2.4" />
            <line x1="50" y1="46" x2={nx} y2={ny} stroke={vuHot ? '#c02618' : '#1c1c1c'} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="50" cy="46" r="2.4" fill="#1c1c1c" />
          </svg>
          <div className="text-center font-mono text-[7px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(0,0,0,0.5)' }}>
            VU
          </div>
        </div>
      </div>

      {/* cabinet: live waveform + power LED */}
      <div
        className="mt-3 flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: 'linear-gradient(180deg,#141416,#0c0c0d)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span
          className="font-semibold italic"
          style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: 'rgba(255,255,255,0.72)' }}
        >
          Studio
        </span>
        <svg viewBox="0 0 300 44" preserveAspectRatio="none" width="100%" height="34" style={{ flex: 1, overflow: 'visible' }} aria-hidden>
          <polyline points={wave} fill="none" stroke={GS_AMBER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${GS_AMBER})` }} />
        </svg>
        <div className="flex flex-col items-center gap-1">
          <motion.span
            className="h-3 w-3 rounded-full"
            style={{ background: GS_GREEN, boxShadow: `0 0 10px ${GS_GREEN}` }}
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Power
          </span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Live - dial in the amp, stack your pedals, and play.
      </p>
    </div>
  )
}

/* Convenience: map app id -> its demo component. */
/* ---------- Poof: draw a region, it poofs to the clipboard as a GIF ----------
 * Interactive, mirrors the real app: press Select, the preview dims with a
 * crosshair, you DRAG your own region (clear inside, dim outside), release to
 * record (coral frame with a breathing glow), then it lands on the clipboard. */
export function PoofDemo({ tone = 'light', className = '' }) {
  const [phase, setPhase] = useState('idle') // idle | selecting | recording | done
  const [rect, setRect] = useState(null) // {x,y,w,h} in preview px
  const screenRef = useRef(null)
  const startRef = useRef(null)
  const dark = tone === 'dark'
  const accent = '#ff4436'
  const screen = dark ? '#181c2b' : '#eef1f7'

  const rel = (e) => {
    const r = screenRef.current.getBoundingClientRect()
    return {
      x: Math.min(Math.max(e.clientX - r.left, 0), r.width),
      y: Math.min(Math.max(e.clientY - r.top, 0), r.height),
    }
  }
  const onDown = (e) => {
    if (phase !== 'selecting') return
    e.preventDefault()
    const p = rel(e)
    startRef.current = p
    setRect({ x: p.x, y: p.y, w: 0, h: 0 })
    screenRef.current.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    if (phase !== 'selecting' || !startRef.current) return
    const p = rel(e)
    const s = startRef.current
    setRect({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) })
  }
  const onUp = (e) => {
    if (phase !== 'selecting' || !startRef.current) return
    const p = rel(e)
    const s = startRef.current
    startRef.current = null
    const fr = { x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) }
    if (fr.w < 26 || fr.h < 22) { setRect(null); return } // too small - keep selecting
    setRect(fr)
    setPhase('recording')
    // Stay recording until the user presses Stop (Esc) - no auto-stop.
  }

  const reset = () => { setRect(null); startRef.current = null }
  const button =
    phase === 'idle'
      ? { label: 'Select a region', onClick: () => { reset(); setPhase('selecting') } }
      : phase === 'selecting'
      ? { label: 'Cancel', onClick: () => { reset(); setPhase('idle') } }
      : phase === 'recording'
      ? { label: 'Stop (Esc)', onClick: () => setPhase('done') }
      : { label: 'Again', onClick: () => { reset(); setPhase('idle') } }
  const caption =
    phase === 'selecting' ? 'Drag on the preview to draw a region.'
    : phase === 'recording' ? 'Recording. Press Esc to stop.'
    : phase === 'done' ? 'Dropped into your agent - it reads every frame.'
    : 'Grab a region, press Esc, then drag it into your agent.'

  return (
    <div className={className}>
      <div
        ref={screenRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        className={`relative mx-auto aspect-[16/10] w-full max-w-sm select-none overflow-hidden rounded-xl ring-1 ring-black/15 ${
          phase === 'selecting' ? 'cursor-crosshair' : ''
        }`}
        style={{ background: screen, touchAction: 'none' }}
      >
        {/* motion worth capturing (shows through the clear region) */}
        <motion.div
          className="pointer-events-none absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-full"
          style={{ background: 'linear-gradient(135deg,#7fb1ff,#9b7bff)' }}
          animate={{ x: [36, 210, 36] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* full dim while selecting before the drag starts */}
        {phase === 'selecting' && !rect && (
          <div className="pointer-events-none absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />
        )}

        {/* the region: dim-outside while selecting, breathing coral glow while recording */}
        {rect && (phase === 'selecting' || phase === 'recording' || phase === 'done') && (
          <motion.div
            className="pointer-events-none absolute"
            style={{
              left: rect.x, top: rect.y, width: rect.w, height: rect.h,
              border: `2px solid ${accent}`,
              boxShadow: phase === 'selecting' ? '0 0 0 9999px rgba(0,0,0,0.38)' : undefined,
            }}
            animate={
              phase === 'recording'
                ? { boxShadow: [`0 0 0px ${accent}`, `0 0 16px ${accent}`, `0 0 0px ${accent}`] }
                : {}
            }
            transition={phase === 'recording' ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
          />
        )}

        {/* handoff: the clip dropped into an AI chat (Claude) */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 px-4"
              style={{ background: 'rgba(12,14,22,0.93)' }}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
                <span
                  className="grid h-4 w-4 place-items-center rounded-full text-[10px] leading-none text-white"
                  style={{ background: accent }}
                >
                  ✳
                </span>
                Claude
              </div>
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
                className="flex items-center gap-2 self-end rounded-xl bg-white/12 px-2.5 py-2"
                style={{ maxWidth: '88%' }}
              >
                <div
                  className="h-8 w-11 shrink-0 rounded"
                  style={{ background: 'linear-gradient(135deg,#7fb1ff,#9b7bff)' }}
                />
                <div className="font-mono text-[10px] leading-tight text-white/85">
                  for context, view this gif file at{' '}
                  <span className="text-white/45">~/…/poof.gif</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-[10px] text-white/55"
              >
                Claude opens the file and reads every frame.
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={button.onClick}
          className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ background: accent }}
        >
          {button.label}
        </button>
      </div>
      <p className={`mt-3 text-center text-xs ${dark ? 'text-white/60' : 'text-slate-500'}`}>{caption}</p>
    </div>
  )
}

export const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo, guitar: GuitarStudioDemo, poof: PoofDemo }
