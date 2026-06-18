import { useState } from 'react'
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
 *   - Tally: real menu-bar popover, two concentric segmented rings (cyan used /
 *     green remaining), static inner ring, and the session ring + number +
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

function GaugeRing({ r, pct, usedColor = T_CYAN }) {
  const c = 2 * Math.PI * r
  const GAP = 8
  const used = (c * pct) / 100
  const rem = c - used
  return (
    <>
      <circle cx="60" cy="60" r={r} fill="none" stroke={usedColor} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${Math.max(used - GAP, 0.001)} ${c}`} strokeDashoffset={-GAP / 2} />
      <circle cx="60" cy="60" r={r} fill="none" stroke={T_GREEN} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${Math.max(rem - GAP, 0.001)} ${c}`} strokeDashoffset={-(used + GAP / 2)} />
    </>
  )
}

function TallyGauge({ pct, innerPct, label, reset, dot, outerColor = T_CYAN, numberColor = T_GREEN }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <GaugeRing r={46} pct={pct} usedColor={outerColor} />
          <GaugeRing r={31} pct={innerPct} />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center leading-none">
          <span className="text-xl font-bold" style={{ color: numberColor }}>{pct}%</span>
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
  const [session, setSession] = useState(28)
  const weekly = 33
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: 'linear-gradient(135deg,#2a2350,#352a63 45%,#214a82)' }}>
      <div className="mb-2 flex items-center justify-end gap-3 rounded-lg bg-black/30 px-3 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur">
        <span className="rounded px-1.5 py-0.5 text-white" style={{ background: 'rgba(124,92,255,0.8)' }}>EN</span>
        <span className="flex items-center gap-1" style={{ color: severity(session, '#ffffff') }}>
          <MiniRing pct={session} />
          {session}%
        </span>
        <WifiGlyph />
        <BatteryGlyph />
        <span>9:41</span>
      </div>
      <div className="relative">
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-l border-t border-white/10" style={{ background: 'rgba(22,24,44,0.96)' }} />
        <div className="rounded-2xl border border-white/10 p-5 shadow-lg" style={{ background: 'rgba(22,24,44,0.96)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-start justify-around gap-4">
            <TallyGauge pct={session} innerPct={64} label="session" reset="1h 55m" dot="#f0a500" outerColor={severity(session, T_CYAN)} numberColor={severity(session, T_GREEN)} />
            <TallyGauge pct={weekly} innerPct={47} label="weekly" reset="12h 25m" dot={T_CYAN} />
          </div>
          <div className="mt-4 border-t border-white/10 pt-2 text-center text-[11px] font-semibold text-white/45">Plan: Max (5x) · Updated just now</div>
        </div>
      </div>
      <input type="range" min="0" max="100" value={session} onChange={(e) => setSession(+e.target.value)} aria-label="Simulated session usage percentage" className="mt-4 w-full" style={{ accentColor: '#2ec4b6' }} />
      <p className="text-center text-sm font-semibold text-white/55">Drag to simulate a busy day.</p>
    </div>
  )
}

/* Convenience: map app id -> its demo component. */
export const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }
