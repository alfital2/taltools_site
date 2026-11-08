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
        <span className="flex items-center gap-1" style={{ color: severity(weekly, '#ffffff') }}>
          <MiniRing pct={weekly} />
          {Math.round(weekly)}%
        </span>
        <WifiGlyph />
        <BatteryGlyph />
        <span>9:41</span>
      </div>
      <div className="relative">
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-l border-t border-white/10" style={{ background: 'rgba(22,24,44,0.96)' }} />
        <div className="rounded-2xl border border-white/10 p-5 shadow-lg" style={{ background: 'rgba(22,24,44,0.96)', backdropFilter: 'blur(10px)' }}>
          <div className="mb-3 text-[11px] font-bold tracking-wide text-white/55">CLAUDE + CODEX</div>
          <div className="flex items-start justify-around gap-4">
            <TallyGauge pct={session} innerPct={sessionInner} label="session" reset="1h 55m" dot={T_CYAN} outerColor={severity(session, T_GREEN)} numberColor={severity(session, T_GREEN)} />
            <TallyGauge pct={weekly} innerPct={weeklyInner} label="weekly" reset="12h 25m" dot={T_CYAN} />
          </div>
          <div className="mt-4 border-t border-white/10 pt-2 text-center text-[11px] font-semibold text-white/45">Two providers · live limits · updated just now</div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-white/55">Claude and Codex, together in your menu bar.</p>
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

/* ====================  PADOO  ====================
 * Padoo has three surfaces, and the demo shows all three as the app draws
 * them (dark glass, landscape trackpad and deck, portrait air pointer):
 *  - Trackpad: relative drag moves the cursor, a tap clicks, and an idle tour
 *    plays the real multi-finger gestures (right-click, scroll, swipe between
 *    desktops). The focused app sits in a chip on top, a five-app dock on the
 *    bottom edge.
 *  - Air pointer: the phone tilts toward wherever the cursor is aimed.
 *  - App Deck: fifteen glass keys (apps, window snapping, media, mic mute,
 *    screen recording, Focus) plus brightness and volume sliders, and every
 *    key visibly does its thing on the Mac.
 */
const PADOO_BLUE = '#3d6bff'
const PADOO_APPS = {
  mail: { name: 'Mail', bg: 'linear-gradient(160deg,#6cbcff,#1f6fe5)', tint: '#1f6fe5' },
  messages: { name: 'Messages', bg: 'linear-gradient(160deg,#74e382,#21b13a)', tint: '#21b13a' },
  music: { name: 'Music', bg: 'linear-gradient(160deg,#ff8299,#ee2a4a)', tint: '#ee2a4a' },
  notes: { name: 'Notes', bg: 'linear-gradient(160deg,#fff5bf,#ffd23f)', tint: '#e0a800', ink: '#8a6a00' },
  terminal: { name: 'Terminal', bg: 'linear-gradient(160deg,#41444e,#15161a)', tint: '#2a2c33' },
  photos: { name: 'Photos', bg: '#ffffff', tint: '#f08a24' },
}
const PADOO_DOCK = ['mail', 'messages', 'music', 'notes', 'terminal']
const PADOO_DECK = [
  'mail', 'messages', 'music', 'notes', 'terminal',
  'photos', 'snapL', 'fill', 'snapR', 'record',
  'prev', 'play', 'next', 'mic', 'focus',
]
const PADOO_LAYOUTS = {
  float: { left: '13%', top: '17%', width: '56%', height: '58%' },
  snapL: { left: '1%', top: '10.5%', width: '48.5%', height: '74%' },
  snapR: { left: '50.5%', top: '10.5%', width: '48.5%', height: '74%' },
  fill: { left: '1%', top: '10.5%', width: '98%', height: '74%' },
}
const PADOO_TOUR = [
  { kind: 'move', to: { x: 30, y: 40 } },
  { kind: 'move', to: { x: 62, y: 52 } },
  { kind: 'tap' },
  { kind: 'right' },
  { kind: 'scroll' },
  { kind: 'swipe', dir: 1 },
  { kind: 'swipe', dir: -1 },
]
const PADOO_AIR = [
  { x: 24, y: 34 },
  { x: 70, y: 28 },
  { x: 80, y: 62 },
  { x: 46, y: 70 },
  { x: 34, y: 52 },
]
const GESTURE_LABEL = {
  move: 'Drag to move',
  tap: 'Tap to click',
  right: 'Two-finger tap: right-click',
  scroll: 'Two fingers to scroll',
  swipe: 'Three fingers: next desktop',
}

const clampPct = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function PGlyph({ name, color = '#fff', size = 14, muted = false }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const f = { fill: color }
  let body = null
  switch (name) {
    case 'mail':
      body = (<><rect x="3" y="6" width="18" height="12" rx="2" {...s} /><path d="M4 7.5l8 5.5 8-5.5" {...s} /></>)
      break
    case 'messages':
      body = <path d="M12 5c-4.7 0-8 2.8-8 6.3 0 2 1.1 3.7 2.9 4.8L6 19.5l3.5-1.8c.8.2 1.6.3 2.5.3 4.7 0 8-2.8 8-6.3S16.7 5 12 5z" {...f} />
      break
    case 'music':
      body = (<><path d="M9 17V7.2l9-2.2v10" {...s} /><circle cx="7" cy="17" r="2.2" {...f} /><circle cx="16" cy="15" r="2.2" {...f} /></>)
      break
    case 'notes':
      body = <path d="M6 9h12M6 13h12M6 17h7" {...s} />
      break
    case 'terminal':
      body = <path d="M6 8l4 4-4 4M12.5 16.5H18" {...s} />
      break
    case 'photos':
      body = (
        <>
          {['#ff9f0a', '#ffd60a', '#32d74b', '#64d2ff', '#5e5ce6', '#ff375f'].map((c, i) => {
            const a = (i / 6) * Math.PI * 2
            return <circle key={c} cx={12 + Math.cos(a) * 4.4} cy={12 + Math.sin(a) * 4.4} r="3.4" fill={c} opacity=".85" />
          })}
        </>
      )
      break
    case 'snapL':
    case 'snapR':
    case 'fill':
      body = (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2.2" {...s} />
          <rect
            x={name === 'snapR' ? 12.5 : 5.5}
            y="7.5"
            width={name === 'fill' ? 13 : 6}
            height="9"
            rx="1"
            {...f}
          />
        </>
      )
      break
    case 'record':
      body = (<><circle cx="12" cy="12" r="7.5" {...s} /><circle cx="12" cy="12" r="3.6" {...f} /></>)
      break
    case 'prev':
      body = <path d="M11.5 7l-6 5 6 5zM19 7l-6 5 6 5z" {...f} />
      break
    case 'next':
      body = <path d="M12.5 7l6 5-6 5zM5 7l6 5-6 5z" {...f} />
      break
    case 'play':
      body = (<><path d="M4.5 7l7 5-7 5z" {...f} /><path d="M15 7.5v9M19 7.5v9" {...s} /></>)
      break
    case 'mic':
      body = (
        <>
          <rect x="9" y="3.5" width="6" height="10.5" rx="3" {...s} />
          <path d="M6 11a6 6 0 0 0 12 0M12 17v3.5" {...s} />
          {muted && <path d="M4.5 4.5l15 15" {...s} />}
        </>
      )
      break
    case 'focus':
      body = <path d="M19 14.6A7.2 7.2 0 0 1 9.4 5a7.4 7.4 0 1 0 9.6 9.6z" {...f} />
      break
    case 'sun':
      body = (
        <>
          <circle cx="12" cy="12" r="4" {...f} />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" {...s} />
        </>
      )
      break
    case 'speaker':
      body = (<><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" {...f} /><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" {...s} /></>)
      break
    case 'back':
      body = <path d="M14.5 6l-6 6 6 6" {...s} />
      break
    case 'forward':
      body = <path d="M9.5 6l6 6-6 6" {...s} />
      break
    case 'grid':
      body = (<><rect x="5" y="5" width="6" height="6" rx="1.5" {...f} /><rect x="13" y="5" width="6" height="6" rx="1.5" {...f} /><rect x="5" y="13" width="6" height="6" rx="1.5" {...f} /><rect x="13" y="13" width="6" height="6" rx="1.5" {...f} /></>)
      break
    default:
      body = null
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ display: 'block' }}>
      {body}
    </svg>
  )
}

function PAppIcon({ id, size = 16, radius = 4 }) {
  const app = PADOO_APPS[id]
  return (
    <span
      className="grid place-items-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: app.bg,
        boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,.35)',
        flex: 'none',
      }}
    >
      <PGlyph name={id} size={size * 0.68} color={app.ink || '#fff'} />
    </span>
  )
}

/* the contents of the frontmost window, by app */
function PadooWindowBody({ id, playing, track }) {
  if (id === 'terminal') {
    return (
      <div className="space-y-1 font-mono text-[6.5px] leading-tight text-[#9ef0a5]">
        <div><span className="text-white/60">~ %</span> npm run build</div>
        <div className="text-white/70">vite v5 building for production…</div>
        <div>✓ 214 modules transformed</div>
        <div>✓ built in 706ms</div>
        <div><span className="text-white/60">~ %</span> git push</div>
        <div className="text-white/70">main → main</div>
        <div><span className="text-white/60">~ %</span> ▍</div>
      </div>
    )
  }
  if (id === 'photos') {
    const tiles = ['#ffb4a2', '#a0c4ff', '#caffbf', '#ffd6a5', '#bdb2ff', '#9bf6ff', '#ffc6ff', '#fdffb6', '#b9fbc0', '#f1c0e8', '#90dbf4', '#ffcfd2']
    return (
      <div className="grid grid-cols-4 gap-1">
        {tiles.map((c) => (
          <span key={c} className="block aspect-square rounded-[2px]" style={{ background: c }} />
        ))}
      </div>
    )
  }
  if (id === 'music') {
    const tracks = ['Glass Keys', 'Two Milliseconds', 'Air Pointer']
    return (
      <div className="flex items-center gap-2">
        <span
          className="block h-9 w-9 shrink-0 rounded-[3px]"
          style={{ background: 'linear-gradient(135deg,#ff8299,#7c5cff)' }}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="truncate text-[7px] font-bold text-slate-800">{tracks[track % tracks.length]}</div>
          <div className="text-[6px] text-slate-500">{playing ? 'Playing' : 'Paused'}</div>
          <div className="h-[3px] overflow-hidden rounded bg-slate-900/10">
            <motion.span
              className="block h-full rounded"
              style={{ background: PADOO_APPS.music.tint }}
              animate={{ width: playing ? ['20%', '90%'] : '20%' }}
              transition={playing ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
            />
          </div>
        </div>
      </div>
    )
  }
  const widths = ['100%', '82%', '64%', '92%', '48%', '76%', '88%', '58%', '70%', '96%', '52%']
  return (
    <div className="space-y-1.5">
      {widths.map((w, i) => (
        <span
          key={i}
          className="block h-1.5 rounded"
          style={{ width: w, background: id === 'notes' ? 'rgba(138,106,0,.18)' : 'rgba(15,23,42,.1)' }}
        />
      ))}
    </div>
  )
}

function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    setReduced(mq.matches)
    const on = (e) => setReduced(e.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduced
}

export function PadooDemo({ tone = 'light', className = '' }) {
  const dark = tone === 'dark'
  const reduced = useReducedMotionPref()

  const [mode, setMode] = useState('pad') // 'pad' | 'air' | 'deck'
  const [pos, setPos] = useState({ x: 62, y: 52 })
  const [front, setFront] = useState('mail')
  const [layout, setLayout] = useState('float')
  const [space, setSpace] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [brightness, setBrightness] = useState(1)
  const [volume, setVolume] = useState(0.55)
  const [micMuted, setMicMuted] = useState(false)
  const [recording, setRecording] = useState(false)
  const [focusOn, setFocusOn] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState(0)
  const [ripple, setRipple] = useState(null)
  const [menu, setMenu] = useState(null)
  const [hud, setHud] = useState(null)
  const [fingers, setFingers] = useState(null)
  const [touch, setTouch] = useState(null)
  const [gesture, setGesture] = useState('move')

  const posRef = useRef(pos)
  posRef.current = pos
  const scrolledRef = useRef(false)
  const spaceRef = useRef(0)
  spaceRef.current = space
  const lastTouch = useRef(0)
  const padRef = useRef(null)
  const macRef = useRef(null)
  const drag = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const showHud = (icon, label, level) => {
    const id = Math.random()
    setHud({ icon, label, level, id })
    later(() => setHud((h) => (h && h.id === id ? null : h)), 1400)
  }
  const click = (p = posRef.current) => {
    const id = Math.random()
    setRipple({ ...p, id })
    later(() => setRipple((r) => (r && r.id === id ? null : r)), 520)
  }
  const rightClick = () => {
    const id = Math.random()
    setMenu({ ...posRef.current, id })
    later(() => setMenu((m) => (m && m.id === id ? null : m)), 1500)
  }
  const goSpace = (s) => {
    setSpace(s)
    setMenu(null)
  }

  // play one trackpad gesture: the fingers on the glass and its effect on the Mac
  const play = (step) => {
    const id = Math.random()
    setGesture(step.kind)
    if (step.kind === 'move') {
      const from = posRef.current
      const dx = (step.to.x - from.x) * 0.45
      const dy = (step.to.y - from.y) * 0.45
      setFingers({ n: 1, from: { x: 50 - dx / 2, y: 52 - dy / 2 }, to: { x: 50 + dx / 2, y: 52 + dy / 2 }, id })
      setPos(step.to)
    } else if (step.kind === 'tap') {
      setFingers({ n: 1, tap: true, from: { x: 50, y: 52 }, to: { x: 50, y: 52 }, id })
      later(() => click(), 160)
    } else if (step.kind === 'right') {
      setFingers({ n: 2, tap: true, from: { x: 50, y: 52 }, to: { x: 50, y: 52 }, id })
      later(rightClick, 160)
    } else if (step.kind === 'scroll') {
      const next = !scrolledRef.current
      scrolledRef.current = next
      setScrolled(next)
      setFingers({ n: 2, from: { x: 50, y: next ? 74 : 30 }, to: { x: 50, y: next ? 30 : 74 }, id })
    } else if (step.kind === 'swipe') {
      const dir = step.dir ?? (spaceRef.current === 0 ? 1 : -1)
      setFingers({ n: 3, from: { x: dir > 0 ? 72 : 28, y: 50 }, to: { x: dir > 0 ? 28 : 72, y: 50 }, id })
      goSpace(dir > 0 ? 1 : 0)
    }
    later(() => setFingers((f) => (f && f.id === id ? null : f)), 900)
  }

  // idle tour of the trackpad gestures; pauses while the visitor is driving
  useEffect(() => {
    if (reduced || mode !== 'pad') return
    let i = 0
    const t = setInterval(() => {
      if (Date.now() - lastTouch.current < 5000) return
      play(PADOO_TOUR[i % PADOO_TOUR.length])
      i += 1
    }, 1700)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reduced])

  // air pointer: the phone sweeps the room until the visitor aims it
  useEffect(() => {
    if (reduced || mode !== 'air') return
    let i = 0
    const t = setInterval(() => {
      if (Date.now() - lastTouch.current < 4000) return
      i = (i + 1) % PADOO_AIR.length
      setPos(PADOO_AIR[i])
    }, 1300)
    return () => clearInterval(t)
  }, [mode, reduced])

  /* ---- trackpad: relative motion, like the real glass ---- */
  const padPoint = (e) => {
    const r = padRef.current?.getBoundingClientRect()
    if (!r) return null
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, r }
  }
  const onPadDown = (e) => {
    const p = padPoint(e)
    if (!p) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    lastTouch.current = Date.now()
    drag.current = { x: e.clientX, y: e.clientY, travel: 0 }
    setFingers(null)
    setGesture('move')
    setTouch({ x: p.x, y: p.y })
  }
  const onPadMove = (e) => {
    if (!drag.current) return
    const p = padPoint(e)
    if (!p) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    drag.current = { x: e.clientX, y: e.clientY, travel: drag.current.travel + Math.abs(dx) + Math.abs(dy) }
    lastTouch.current = Date.now()
    setTouch({ x: p.x, y: p.y })
    setPos((c) => ({
      x: clampPct(c.x + (dx / p.r.width) * 150, 2, 96),
      y: clampPct(c.y + (dy / p.r.height) * 110, 9, 92),
    }))
  }
  const onPadUp = () => {
    if (!drag.current) return
    const tapped = drag.current.travel < 6
    drag.current = null
    setTouch(null)
    lastTouch.current = Date.now()
    if (tapped) {
      setGesture('tap')
      click()
    }
  }

  /* ---- air pointer: aim at the Mac ---- */
  const onMacMove = (e) => {
    if (mode !== 'air') return
    const r = macRef.current?.getBoundingClientRect()
    if (!r) return
    lastTouch.current = Date.now()
    setPos({
      x: clampPct(((e.clientX - r.left) / r.width) * 100, 2, 96),
      y: clampPct(((e.clientY - r.top) / r.height) * 100, 9, 92),
    })
  }
  const airButton = (fn) => () => {
    lastTouch.current = Date.now()
    fn()
  }

  /* ---- deck ---- */
  const press = (key) => {
    if (PADOO_APPS[key]) {
      setFront(key)
      goSpace(0)
      return
    }
    if (key === 'snapL' || key === 'snapR' || key === 'fill') {
      setLayout((l) => (l === key ? 'float' : key))
      goSpace(0)
      return
    }
    if (key === 'record') {
      setRecording(!recording)
      showHud('record', recording ? 'Recording saved' : 'Recording screen')
    } else if (key === 'mic') {
      setMicMuted(!micMuted)
      showHud('mic', micMuted ? 'Microphone on' : 'Mic muted in every app')
    } else if (key === 'focus') {
      setFocusOn(!focusOn)
      showHud('focus', focusOn ? 'Focus off' : 'Do Not Disturb')
    } else if (key === 'play') {
      setPlaying(!playing)
      showHud(playing ? 'play' : 'music', playing ? 'Paused' : 'Playing')
    } else if (key === 'prev' || key === 'next') {
      setTrack((t) => t + (key === 'next' ? 1 : 2))
      setPlaying(true)
      showHud(key, key === 'next' ? 'Next track' : 'Previous track')
    }
  }
  const slider = (setter, icon, label) => {
    const set = (e) => {
      const r = e.currentTarget.getBoundingClientRect()
      const v = clampPct(1 - (e.clientY - r.top) / r.height, 0.05, 1)
      setter(v)
      showHud(icon, label, v)
    }
    return {
      onPointerDown: (e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId)
        set(e)
      },
      onPointerMove: (e) => {
        if (e.buttons) set(e)
      },
    }
  }

  const btn = (active) =>
    `cursor-pointer rounded-lg px-3.5 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 ${
      active
        ? 'text-white shadow-sm'
        : dark
        ? 'border border-white/25 bg-white/10 text-white'
        : 'border border-black/15 bg-white text-slate-900'
    }`
  const chip = (active) =>
    `cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
      active
        ? 'text-white'
        : dark
        ? 'bg-white/10 text-white/75 hover:bg-white/20'
        : 'bg-slate-900/[.06] text-slate-600 hover:bg-slate-900/10'
    }`

  const app = PADOO_APPS[front]
  const win = PADOO_LAYOUTS[layout]
  const glassKey = {
    background: 'linear-gradient(170deg,#2a2c34,#121318)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18), inset 0 0 0 1px rgba(255,255,255,.07), 0 3px 6px rgba(0,0,0,.5)',
  }

  return (
    <div className={className}>
      {/* ===================== the Mac ===================== */}
      <div
        ref={macRef}
        onPointerMove={onMacMove}
        onClick={mode === 'air' ? () => click() : undefined}
        className={`relative mx-auto aspect-[16/10] w-full max-w-sm select-none overflow-hidden rounded-lg ring-1 ring-black/25 ${
          mode === 'air' ? 'cursor-crosshair' : ''
        }`}
        style={MAC_WALLPAPER}
      >
        {/* menu bar */}
        <div className="absolute inset-x-0 top-0 z-30 flex h-5 items-center justify-between bg-black/25 px-2 text-[8px] font-semibold text-white backdrop-blur-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {space === 0 ? app.name : 'Terminal'}
            <span className="opacity-70">File</span>
            <span className="opacity-70">Edit</span>
            <span className="opacity-70">View</span>
          </span>
          <span className="flex items-center gap-1.5">
            {recording && (
              <motion.span
                className="block h-1.5 w-1.5 rounded-full bg-[#ff453a]"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            {micMuted && <PGlyph name="mic" muted size={10} color="#ff8a80" />}
            {focusOn && <PGlyph name="focus" size={9} color="#c4b5fd" />}
            {playing && <PGlyph name="music" size={9} />}
            <WifiGlyph />
            <span>9:41</span>
          </span>
        </div>

        {/* desktops: three-finger swipes slide between them */}
        <motion.div
          className="absolute inset-0"
          animate={{ x: `${-space * 100}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 30 }}
        >
          {/* desktop 1: the frontmost app */}
          <motion.div
            className="absolute z-10 flex flex-col overflow-hidden rounded-md shadow-lg"
            animate={win}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            style={{ background: front === 'terminal' ? '#17181d' : 'rgba(255,255,255,.94)' }}
          >
            <div
              className="flex h-4 shrink-0 items-center gap-1 px-2"
              style={{ background: front === 'terminal' ? '#2a2c33' : `${app.tint}26` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
              <span className={`ml-1 text-[7px] font-bold ${front === 'terminal' ? 'text-white/70' : 'text-slate-600'}`}>
                {app.name}
              </span>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={front}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: scrolled ? -28 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="p-2"
                >
                  <PadooWindowBody id={front} playing={playing} track={track} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* desktop 2 */}
          <div
            className="absolute z-10 overflow-hidden rounded-md shadow-lg"
            style={{ left: '118%', top: '20%', width: '64%', height: '54%', background: '#17181d' }}
          >
            <div className="flex h-4 items-center gap-1 bg-[#2a2c33] px-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
              <span className="ml-1 text-[7px] font-bold text-white/70">Terminal · Desktop 2</span>
            </div>
            <div className="p-2">
              <PadooWindowBody id="terminal" />
            </div>
          </div>
        </motion.div>

        {/* desktop dots */}
        <div className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 gap-1">
          {[0, 1].map((s) => (
            <span
              key={s}
              className="block h-1 w-1 rounded-full"
              style={{ background: s === space ? '#fff' : 'rgba(255,255,255,.4)' }}
            />
          ))}
        </div>

        {/* the Dock */}
        <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-lg bg-white/25 px-1.5 py-1 backdrop-blur-sm">
          {[...PADOO_DOCK, 'photos'].map((id) => (
            <motion.span
              key={id}
              className="relative block"
              animate={{ y: id === front ? -2 : 0, scale: id === front ? 1.12 : 1 }}
            >
              <PAppIcon id={id} size={14} radius={3.5} />
              {id === front && (
                <span className="absolute -bottom-[3px] left-1/2 block h-[2px] w-[2px] -translate-x-1/2 rounded-full bg-white" />
              )}
            </motion.span>
          ))}
        </div>

        {/* right-click menu */}
        <AnimatePresence>
          {menu && (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute z-40 w-[74px] origin-top-left rounded-[5px] bg-white/95 p-[3px] text-[7px] text-slate-800 shadow-xl ring-1 ring-black/10"
              style={{ left: `${Math.min(menu.x, 76)}%`, top: `${Math.min(menu.y, 62)}%`, marginLeft: 6, marginTop: 6 }}
            >
              {['Open', 'Get Info', 'Copy', 'Share…'].map((t, i) => (
                <div key={t} className={`rounded-[3px] px-1.5 py-[2px] ${i === 0 ? 'text-white' : ''}`} style={i === 0 ? { background: PADOO_BLUE } : undefined}>
                  {t}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* system HUD */}
        <AnimatePresence>
          {hud && (
            <motion.div
              key={hud.label + (hud.level ? '' : hud.id)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute right-1.5 top-6 z-40 flex min-w-[96px] items-center gap-1.5 rounded-lg bg-[#1d1d22]/85 px-2 py-1.5 text-[7.5px] font-semibold text-white shadow-xl backdrop-blur"
            >
              <PGlyph
                name={hud.icon}
                muted={hud.icon === 'mic' && micMuted}
                size={11}
                color={hud.icon === 'record' || (hud.icon === 'mic' && micMuted) ? '#ff6b61' : '#fff'}
              />
              {hud.level != null ? (
                <span className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/25">
                  <span className="block h-full rounded-full bg-white" style={{ width: `${hud.level * 100}%` }} />
                </span>
              ) : (
                <span>{hud.label}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* the cursor Padoo is driving */}
        <motion.span
          className="pointer-events-none absolute z-50 block h-3.5 w-3.5"
          animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.6 }}
          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.5))' }}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M4 2 L18 13 L11.4 13.4 L14.6 20.4 L11.6 21.8 L8.4 14.8 L4 19 Z"
              fill="#fff"
              stroke="#0d1230"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>

        <AnimatePresence>
          {ripple && (
            <motion.span
              key={ripple.id}
              initial={{ opacity: 0.8, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.7 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute z-40 block h-8 w-8 rounded-full border-2 border-white"
              style={{ left: `${ripple.x}%`, top: `${ripple.y}%`, marginLeft: -16, marginTop: -16 }}
            />
          )}
        </AnimatePresence>

        {/* brightness, from the deck's slider */}
        <div
          className="pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-150"
          style={{ opacity: (1 - brightness) * 0.62 }}
        />
      </div>

      {/* ===================== the phone ===================== */}
      <div className="mt-4 flex min-h-[244px] items-center justify-center" style={{ perspective: 700 }}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'air' ? (
            /* portrait, aimed like a remote */
            <motion.div
              key="portrait"
              initial={{ opacity: 0, rotateZ: 90, scale: 0.85 }}
              animate={{
                opacity: 1,
                rotateZ: 0,
                scale: 1,
                rotateY: (pos.x - 50) * 0.5,
                rotateX: (50 - pos.y) * 0.45,
              }}
              exit={{ opacity: 0, rotateZ: 90, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="w-[108px] rounded-[20px] p-[5px] shadow-2xl ring-1 ring-white/10"
              style={{ background: '#0b0c10' }}
            >
              <div className="relative flex aspect-[1/2.06] w-full flex-col items-center overflow-hidden rounded-[15px] bg-black px-1.5 pt-2.5">
                <span className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-[2px] text-[5.5px] font-semibold tracking-[0.18em] text-white/75">
                  <PAppIcon id={front} size={7} radius={2} />
                  {app.name.toUpperCase()}
                </span>
                <div className="mt-1.5 flex gap-1">
                  {['back', 'forward'].map((d) => (
                    <button
                      key={d}
                      onClick={airButton(() => showHud(d, d === 'back' ? 'Back' : 'Forward'))}
                      aria-label={d === 'back' ? 'Back' : 'Forward'}
                      className="grid h-[15px] w-[22px] cursor-pointer place-items-center rounded-[4px] border-0 bg-[#2a2c33] p-0"
                    >
                      <PGlyph name={d} size={9} />
                    </button>
                  ))}
                </div>
                <div className="flex-1" />
                {/* the ring: left/right change desktops, centre clicks */}
                <div className="relative mb-1 grid h-[62px] w-[62px] place-items-center rounded-full bg-[#1f2026]">
                  <button
                    onClick={airButton(() => goSpace(0))}
                    aria-label="Previous desktop"
                    className="absolute left-[3px] top-1/2 grid h-4 w-4 -translate-y-1/2 cursor-pointer place-items-center border-0 bg-transparent p-0"
                  >
                    <PGlyph name="back" size={8} color="rgba(255,255,255,.6)" />
                  </button>
                  <button
                    onClick={airButton(() => goSpace(1))}
                    aria-label="Next desktop"
                    className="absolute right-[3px] top-1/2 grid h-4 w-4 -translate-y-1/2 cursor-pointer place-items-center border-0 bg-transparent p-0"
                  >
                    <PGlyph name="forward" size={8} color="rgba(255,255,255,.6)" />
                  </button>
                  <button
                    onClick={airButton(() => click())}
                    aria-label="Click"
                    className="h-[22px] w-[22px] cursor-pointer rounded-full border-0 p-0 transition-transform active:scale-90"
                    style={{ background: '#0a84ff' }}
                  />
                </div>
                <div className="mb-2 flex w-full justify-between px-0.5">
                  <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#1f2026] text-[5px] font-semibold text-[#0a84ff]">
                    Drag
                  </span>
                  <button
                    onClick={airButton(rightClick)}
                    aria-label="Right-click"
                    className="grid h-[22px] w-[22px] cursor-pointer place-items-center rounded-full border-0 bg-[#1f2026] p-0 text-[5px] font-semibold text-[#0a84ff]"
                  >
                    Right
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* landscape: trackpad or deck */
            <motion.div
              key="landscape"
              initial={{ opacity: 0, rotateZ: -90, scale: 0.85 }}
              animate={{ opacity: 1, rotateZ: 0, scale: 1 }}
              exit={{ opacity: 0, rotateZ: -90, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="w-full max-w-[360px] rounded-[24px] p-[5px] shadow-2xl ring-1 ring-white/10"
              style={{ background: '#0b0c10' }}
            >
              <div className="relative aspect-[2.17/1] w-full overflow-hidden rounded-[19px] bg-black">
                {mode === 'pad' ? (
                  <div
                    ref={padRef}
                    onPointerDown={onPadDown}
                    onPointerMove={onPadMove}
                    onPointerUp={onPadUp}
                    onPointerCancel={onPadUp}
                    className="absolute inset-0 touch-none cursor-grab select-none active:cursor-grabbing"
                    style={{ background: 'radial-gradient(90% 120% at 50% 0%, #15171f, #000 70%)' }}
                  >
                    {/* focused app */}
                    <span className="absolute left-1/2 top-[9%] flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/[.08] px-2 py-[3px] text-[6.5px] font-semibold tracking-[0.18em] text-white/75">
                      <PAppIcon id={space === 0 ? front : 'terminal'} size={9} radius={2.5} />
                      {(space === 0 ? app.name : 'Terminal').toUpperCase()}
                    </span>
                    <span className="absolute left-[5%] top-[9%] grid h-[18px] w-[18px] place-items-center rounded-full bg-white/[.07] ring-1 ring-white/10">
                      <span className="block h-[6px] w-[8px] rounded-[1.5px] bg-white/60" />
                    </span>
                    <span className="absolute inset-x-0 top-[46%] text-center text-[7px] text-white/30">
                      {GESTURE_LABEL[gesture]}
                    </span>

                    {/* fingers on the glass */}
                    {touch && (
                      <span
                        className="pointer-events-none absolute block h-6 w-6 rounded-full"
                        style={{
                          left: `${touch.x}%`,
                          top: `${touch.y}%`,
                          marginLeft: -12,
                          marginTop: -12,
                          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.7), rgba(255,255,255,.18))',
                          boxShadow: '0 0 0 5px rgba(255,255,255,.08)',
                        }}
                      />
                    )}
                    <AnimatePresence>
                      {fingers &&
                        Array.from({ length: fingers.n }).map((_, k) => {
                          const off = (k - (fingers.n - 1) / 2) * 9
                          const vertical = fingers.from.y !== fingers.to.y
                          const ox = vertical || fingers.tap ? off : 0
                          const oy = vertical || fingers.tap ? 0 : off * 2.1
                          return (
                            <motion.span
                              key={`${fingers.id}-${k}`}
                              className="pointer-events-none absolute block h-5 w-5 rounded-full"
                              initial={{
                                left: `${fingers.from.x + ox}%`,
                                top: `${fingers.from.y + oy}%`,
                                opacity: 0,
                                scale: 0.6,
                              }}
                              animate={{
                                left: `${fingers.to.x + ox}%`,
                                top: `${fingers.to.y + oy}%`,
                                opacity: fingers.tap ? [0, 1, 0] : [0, 1, 1, 0],
                                scale: 1,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: fingers.tap ? 0.45 : 0.8, ease: 'easeInOut' }}
                              style={{
                                marginLeft: -10,
                                marginTop: -10,
                                background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.75), rgba(255,255,255,.2))',
                                boxShadow: '0 0 0 4px rgba(255,255,255,.08)',
                              }}
                            />
                          )
                        })}
                    </AnimatePresence>

                    {/* the trackpad's own dock */}
                    <div
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 gap-[5px] rounded-[9px] bg-[#16171c] px-[6px] py-[5px] ring-1 ring-white/10"
                    >
                      {PADOO_DOCK.map((id) => (
                        <button
                          key={id}
                          onClick={() => {
                            lastTouch.current = Date.now()
                            setFront(id)
                            goSpace(0)
                          }}
                          aria-label={`Bring ${PADOO_APPS[id].name} forward`}
                          className="relative cursor-pointer border-0 bg-transparent p-0 transition-transform active:scale-90"
                        >
                          <PAppIcon id={id} size={18} radius={5} />
                          {id === front && space === 0 && (
                            <span className="absolute -bottom-[3px] left-1/2 block h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#ff9f0a]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center gap-[3%] px-[4%] py-[5%]" style={{ background: '#0e0f13' }}>
                    {/* brightness */}
                    <div
                      {...slider(setBrightness, 'sun', 'Brightness')}
                      role="slider"
                      aria-label="Mac brightness"
                      aria-valuenow={Math.round(brightness * 100)}
                      className="relative h-full w-[7%] shrink-0 cursor-ns-resize touch-none overflow-hidden rounded-full bg-black ring-1 ring-white/10"
                    >
                      <span className="absolute inset-x-0 bottom-0 block bg-[#d9dade]" style={{ height: `${brightness * 100}%` }} />
                      <span className="absolute inset-x-0 top-[6%] flex justify-center mix-blend-difference">
                        <PGlyph name="sun" size={8} />
                      </span>
                    </div>
                    {/* fifteen glass keys */}
                    <div className="grid h-full flex-1 grid-cols-5 grid-rows-3 gap-[5%]">
                      {PADOO_DECK.map((key) => {
                        const isApp = !!PADOO_APPS[key]
                        const lit =
                          (isApp && key === front && space === 0) ||
                          (key === layout) ||
                          (key === 'mic' && micMuted) ||
                          (key === 'record' && recording) ||
                          (key === 'focus' && focusOn) ||
                          (key === 'play' && playing)
                        const ring =
                          key === 'mic' || key === 'record' ? '#ff6b61' : key === 'focus' ? '#a5b4fc' : ['prev', 'play', 'next'].includes(key) ? '#c084fc' : '#7cc4ff'
                        return (
                          <motion.button
                            key={key}
                            whileTap={{ scale: 0.88 }}
                            onClick={() => press(key)}
                            aria-label={isApp ? `Bring ${PADOO_APPS[key].name} forward` : key}
                            className="relative grid cursor-pointer place-items-center rounded-[22%] border-0 p-0"
                            style={{
                              ...glassKey,
                              outline: lit ? `1.5px solid ${isApp ? 'rgba(255,255,255,.85)' : ring}` : 'none',
                              outlineOffset: 1,
                            }}
                          >
                            {isApp ? (
                              <span className="block h-[72%] w-[72%]">
                                <span
                                  className="grid h-full w-full place-items-center rounded-[22%]"
                                  style={{ background: PADOO_APPS[key].bg }}
                                >
                                  <PGlyph name={key} size={13} color={PADOO_APPS[key].ink || '#fff'} />
                                </span>
                              </span>
                            ) : (
                              <span
                                className="grid h-[64%] w-[64%] place-items-center rounded-full"
                                style={{ boxShadow: `inset 0 0 0 1.5px ${ring}`, background: lit ? `${ring}33` : 'transparent' }}
                              >
                                <PGlyph name={key} size={11} color="#fff" muted={key === 'mic' && micMuted} />
                              </span>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                    {/* volume */}
                    <div
                      {...slider(setVolume, 'speaker', 'Volume')}
                      role="slider"
                      aria-label="Mac volume"
                      aria-valuenow={Math.round(volume * 100)}
                      className="relative h-full w-[7%] shrink-0 cursor-ns-resize touch-none overflow-hidden rounded-full bg-black ring-1 ring-white/10"
                    >
                      <span className="absolute inset-x-0 bottom-0 block bg-[#d9dade]" style={{ height: `${volume * 100}%` }} />
                      <span className="absolute inset-x-0 top-[6%] flex justify-center mix-blend-difference">
                        <PGlyph name="speaker" size={8} />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================== controls ===================== */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {[
          ['pad', 'Trackpad'],
          ['air', 'Air pointer'],
          ['deck', 'App Deck'],
        ].map(([m, label]) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setMenu(null)
              setFingers(null)
              lastTouch.current = 0
            }}
            className={btn(mode === m)}
            style={mode === m ? { background: PADOO_BLUE } : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'pad' && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {[
            ['Right-click', { kind: 'right' }],
            ['Scroll', { kind: 'scroll' }],
            ['Swipe desktops', { kind: 'swipe' }],
          ].map(([label, step]) => (
            <button
              key={label}
              onClick={() => {
                lastTouch.current = Date.now()
                play(step)
              }}
              className={chip(gesture === step.kind)}
              style={gesture === step.kind ? { background: PADOO_BLUE } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <p className={`mx-auto mt-3 max-w-sm text-center text-xs leading-relaxed ${dark ? 'text-white/60' : 'text-slate-500'}`}>
        {mode === 'pad'
          ? 'Drag on the glass to move the cursor, tap to click. About two milliseconds from finger to cursor, and your apps ride along the bottom edge.'
          : mode === 'air'
          ? 'Point the phone at the screen and the cursor follows, no calibration. Aim with your mouse over the Mac, or use the phone’s buttons.'
          : 'Apps, window snapping, media, a mic mute for every app, screen recording, plus brightness and volume sliders. Every key takes six gestures, all set from the Mac.'}
      </p>
    </div>
  )
}

export const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo, guitar: GuitarStudioDemo, poof: PoofDemo, padoo: PadooDemo }
