import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

const DEMO_BY_ID = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

// ── Mission Control / Live Ops Dashboard ──────────────────────────────────
// Dark navy operations console: cyan + orange data accents, thin grid lines,
// monospace readouts, animated SVG gauges + sparklines, a live clock and
// ticking telemetry. Each of the 3 apps is a monitored SYSTEM panel.

const NAVY = '#05101f'
const PANEL = '#0a1a2e'
const GRID = 'rgba(0,229,255,0.07)'
const CYAN = '#00e5ff'
const ORANGE = '#ff6b35'
const GREEN = '#3ee07a'
const TEXT = '#cfe8f5'
const DIM = '#6f93a8'

// Per-system base metrics keyed to each app id.
const SYS_META = {
  natcho: { code: 'SYS-01', load: 12, latency: 4, uptime: 99.99, target: 88, gaugeColor: CYAN },
  flickey: { code: 'SYS-02', load: 34, latency: 9, uptime: 99.97, target: 94, gaugeColor: ORANGE },
  tally: { code: 'SYS-03', load: 21, latency: 6, uptime: 99.98, target: 91, gaugeColor: GREEN },
}

// Deterministic pseudo-random walk seed per system, so sparklines start filled.
function seedSeries(seed, n = 28) {
  const out = []
  let v = 50 + (seed % 17)
  for (let i = 0; i < n; i++) {
    v += Math.sin(i * 0.7 + seed) * 6 + (((i * 31 + seed * 7) % 13) - 6)
    v = Math.max(8, Math.min(92, v))
    out.push(v)
  }
  return out
}

function sparkPath(series, w, h) {
  if (!series || series.length < 2) return `M0,${h.toFixed(2)} L${w.toFixed(2)},${h.toFixed(2)}`
  const n = series.length
  const step = w / (n - 1)
  return series
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(2)},${(h - (v / 100) * h).toFixed(2)}`)
    .join(' ')
}

// Radial gauge: animated stroke from 0 → value.
function Gauge({ value, color, label, reduced }) {
  const R = 46
  const C = 2 * Math.PI * R
  const frac = Math.max(0, Math.min(1, value / 100))
  const dash = C * frac
  return (
    <svg viewBox="0 0 120 120" width="118" height="118" style={{ display: 'block' }} aria-hidden>
      <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <motion.circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={C}
        transform="rotate(-90 60 60)"
        initial={{ strokeDashoffset: C }}
        whileInView={reduced ? { strokeDashoffset: C - dash } : { strokeDashoffset: C - dash }}
        animate={{ strokeDashoffset: C - dash }}
        viewport={{ once: true }}
        transition={reduced ? { duration: 0 } : { duration: 1.1, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      {/* ticks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2 - Math.PI / 2
        const r1 = 53
        const r2 = i % 6 === 0 ? 58 : 56
        return (
          <line
            key={i}
            x1={(60 + Math.cos(a) * r1).toFixed(2)}
            y1={(60 + Math.sin(a) * r1).toFixed(2)}
            x2={(60 + Math.cos(a) * r2).toFixed(2)}
            y2={(60 + Math.sin(a) * r2).toFixed(2)}
            stroke="rgba(0,229,255,0.18)"
            strokeWidth="1"
          />
        )
      })}
      <text x="60" y="55" textAnchor="middle" fill={TEXT} fontSize="22" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        {Math.round(value)}
      </text>
      <text x="60" y="73" textAnchor="middle" fill={DIM} fontSize="9" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.5">
        {label}
      </text>
    </svg>
  )
}

function StatusPill({ text, color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: 1.5,
        color,
        border: `1px solid ${color}55`,
        background: `${color}12`,
        borderRadius: 4,
        padding: '3px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}` }} />
      {text}
    </span>
  )
}

function SystemPanel({ app, idx, reduced }) {
  const meta = SYS_META[app.id]
  const [load, setLoad] = useState(meta.load)
  const [latency, setLatency] = useState(meta.latency)
  const [series, setSeries] = useState(() => seedSeries((idx + 1) * 13 + 5))
  const [hover, setHover] = useState(false)
  const W = 220
  const H = 56

  // Live ticking values + sparkline scroll. Cleaned up on unmount.
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setLoad((p) => {
        const next = p + (Math.random() * 8 - 4)
        return Math.max(4, Math.min(96, next))
      })
      setLatency((p) => Math.max(2, Math.min(40, p + (Math.random() * 3 - 1.5))))
      setSeries((prev) => {
        const last = prev[prev.length - 1]
        let nv = last + (Math.random() * 16 - 8)
        nv = Math.max(8, Math.min(92, nv))
        return [...prev.slice(1), nv]
      })
    }, 1400)
    return () => clearInterval(id)
  }, [reduced])

  const uid = `mc-sys-${app.id}`
  const Demo = DEMO_BY_ID[app.id]
  const linkProps = app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduced ? { duration: 0 } : { duration: 0.5, delay: idx * 0.08 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      className="mc-panel"
      style={{
        position: 'relative',
        background: PANEL,
        border: `1px solid ${hover ? meta.gaugeColor + '99' : 'rgba(0,229,255,0.14)'}`,
        borderRadius: 10,
        padding: '18px 18px 20px',
        outline: 'none',
        boxShadow: hover ? `0 0 0 1px ${meta.gaugeColor}33, 0 10px 40px -12px ${meta.gaugeColor}55` : '0 8px 30px -16px #000',
        transition: 'border-color .2s, box-shadow .25s',
        overflow: 'hidden',
      }}
    >
      {/* corner brackets */}
      <span style={{ position: 'absolute', top: 8, left: 8, width: 12, height: 12, borderTop: `2px solid ${meta.gaugeColor}66`, borderLeft: `2px solid ${meta.gaugeColor}66` }} />
      <span style={{ position: 'absolute', top: 8, right: 8, width: 12, height: 12, borderTop: `2px solid ${meta.gaugeColor}66`, borderRight: `2px solid ${meta.gaugeColor}66` }} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={app.icon}
            alt={app.name + ' icon'}
            width={40}
            height={40}
            style={{
              borderRadius: '22%',
              display: 'block',
              flexShrink: 0,
              boxShadow: `0 0 0 1px ${meta.gaugeColor}33, 0 4px 14px -6px ${meta.gaugeColor}88`,
            }}
          />
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: DIM, letterSpacing: 2 }}>{meta.code}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{app.name}</div>
          </div>
        </div>
        <StatusPill text={idx % 2 === 0 ? 'NOMINAL' : 'ONLINE'} color={meta.gaugeColor} />
      </div>

      {/* gauge + sparkline */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <Gauge value={load} color={meta.gaugeColor} label="LOAD %" reduced={reduced} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: DIM, letterSpacing: 1, marginBottom: 4 }}>
            <span>SIGNAL FEED</span>
            <span style={{ color: meta.gaugeColor }}>{latency.toFixed(1)} ms</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={meta.gaugeColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={meta.gaugeColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* grid lines */}
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke={GRID} strokeWidth="1" />
            ))}
            <path d={`${sparkPath(series, W, H)} L${W},${H} L0,${H} Z`} fill={`url(#${uid}-fill)`} />
            <motion.path
              d={sparkPath(series, W, H)}
              fill="none"
              stroke={meta.gaugeColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 3px ${meta.gaugeColor})` }}
              initial={false}
              animate={{ d: sparkPath(series, W, H) }}
              transition={reduced ? { duration: 0 } : { duration: 0.8, ease: 'linear' }}
            />
            <circle
              cx={W}
              cy={H - (series[series.length - 1] / 100) * H}
              r="2.6"
              fill="#fff"
            />
          </svg>
          <div style={{ display: 'flex', gap: 14, marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: DIM }}>
            <span>UPTIME <b style={{ color: GREEN }}>{meta.uptime}%</b></span>
            <span>TGT <b style={{ color: TEXT }}>{meta.target}</b></span>
          </div>
        </div>
      </div>

      {/* descriptor + blurb */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: meta.gaugeColor, letterSpacing: 0.5, marginBottom: 6 }}>
        // {app.tagline}
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.55, color: TEXT, margin: '0 0 14px' }}>{app.blurb}</p>

      {/* telemetry bullets */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: DIM, letterSpacing: 1.5, marginBottom: 6 }}>TELEMETRY</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'grid', gap: 6 }}>
        {app.bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: TEXT }}>
            <span style={{ color: meta.gaugeColor, flexShrink: 0 }}>▸</span>
            <span>{b}</span>
            <span style={{ marginLeft: 'auto', color: GREEN, opacity: 0.7 }}>OK</span>
          </li>
        ))}
      </ul>

      {/* live feed: embedded interactive demo */}
      {Demo && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: DIM, letterSpacing: 1.5, marginBottom: 8 }}>
            <span>LIVE FEED</span>
            <span className="mc-blink" style={{ width: 6, height: 6, borderRadius: 99, background: meta.gaugeColor, boxShadow: `0 0 6px ${meta.gaugeColor}` }} />
            <span style={{ marginLeft: 'auto', color: meta.gaugeColor }}>INTERACTIVE</span>
          </div>
          <div
            style={{
              border: `1px solid ${meta.gaugeColor}33`,
              borderRadius: 8,
              padding: 10,
              background: '#040c17',
            }}
          >
            <Demo tone="dark" />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <a
          href={app.site}
          {...linkProps}
          className="mc-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            color: NAVY,
            background: meta.gaugeColor,
            borderRadius: 6,
            padding: '9px 16px',
            textDecoration: 'none',
            cursor: 'pointer',
            boxShadow: `0 4px 18px -6px ${meta.gaugeColor}`,
          }}
        >
          OPEN {app.name.toUpperCase()}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a
          href={app.site}
          {...linkProps}
          className="mc-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 0.5,
            color: meta.gaugeColor,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          See the full demo
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke={meta.gaugeColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </motion.div>
  )
}

export default function Variant19() {
  const reduced = useReducedMotion()
  const [clock, setClock] = useState('')
  const [tick, setTick] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const logRef = useRef(null)

  const LOG_LINES = [
    'boot   :: mission control online',
    'auth   :: keychain handshake OK',
    'sys-01 :: notch mask applied · minimal perms',
    'sys-02 :: layout switch · per-tab memory hit',
    'sys-03 :: claude window polled · 6ms',
    'net    :: telemetry stream nominal',
    'core   :: all systems go',
    'sys-02 :: gibberish corrected via ⇧⇧',
    'sys-03 :: reset countdown synced',
    'sys-01 :: multi-display scan complete',
  ]

  // Self-contained Google Fonts.
  useEffect(() => {
    const links = [
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;600;700;800&display=swap',
    ]
    const els = links.map((href) => {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      document.head.appendChild(l)
      return l
    })
    return () => els.forEach((l) => l.remove())
  }, [])

  // Live clock + global tick. Cleaned up on unmount.
  useEffect(() => {
    if (reduced) {
      const d = new Date()
      setClock(d.toUTCString().slice(17, 25) + ' UTC')
      return
    }
    const id = setInterval(() => {
      const d = new Date()
      setClock(d.toUTCString().slice(17, 25) + ' UTC')
      setTick((t) => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [reduced])

  // Telemetry log ticker. Cleaned up on unmount.
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setLogIndex((i) => (i + 1) % LOG_LINES.length)
    }, 2200)
    return () => clearInterval(id)
  }, [reduced])

  const visibleLog = []
  for (let i = 0; i < 5; i++) {
    visibleLog.push(LOG_LINES[(logIndex + i) % LOG_LINES.length])
  }

  const uptimeSec = 3_540_000 + tick

  return (
    <div
      style={{
        minHeight: '100vh',
        background: NAVY,
        color: TEXT,
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @keyframes mc-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes mc-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0.25; } }
        @keyframes mc-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .mc-blink { animation: mc-blink 1.1s steps(1) infinite; }
        .mc-link:focus-visible { outline: 2px solid #fff; outline-offset: 3px; border-radius: 6px; }
        .mc-panel:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .mc-blink, .mc-scanline, .mc-sweep { animation: none !important; }
        }
      `}</style>

      {/* grid background */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, #000 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 40%, transparent 90%)',
          pointerEvents: 'none',
        }}
      />
      {/* scanline */}
      {!reduced && (
        <div
          aria-hidden
          className="mc-scanline"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            height: 140,
            background: `linear-gradient(180deg, transparent, ${CYAN}0a)`,
            animation: 'mc-scan 7s linear infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* TOP STATUS BAR */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          padding: '8px 16px 8px 120px',
          background: 'rgba(5,16,31,0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${CYAN}33`,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 1,
        }}
      >
        <span style={{ color: ORANGE, fontWeight: 700 }}>◢ TALTOOLS // OPS</span>
        <StatusPill text="ALL SYSTEMS GO" color={GREEN} />
        <span style={{ color: DIM }} className="mc-blink">● LIVE</span>
        <span style={{ marginLeft: 'auto', color: CYAN, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{clock || '--:--:-- UTC'}</span>
        <span style={{ color: DIM }}>UPTIME {Math.floor(uptimeSec / 3600)}h</span>
      </div>

      {/* HERO */}
      <header style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '54px 20px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 16, height: 16 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: 99, border: `2px solid ${CYAN}` }} />
            {!reduced && (
              <span
                className="mc-sweep"
                style={{ position: 'absolute', inset: 0, borderRadius: 99, borderTop: `2px solid ${ORANGE}`, borderRight: '2px solid transparent', borderBottom: '2px solid transparent', borderLeft: '2px solid transparent', animation: 'mc-sweep 1.6s linear infinite' }}
              />
            )}
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, color: DIM }}>
            MISSION CONTROL · 3 MONITORED SYSTEMS
          </span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.6 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(34px, 6vw, 68px)',
            lineHeight: 1.02,
            margin: 0,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          A lab of three<br />
          <span style={{ color: CYAN }}>Mac menu-bar</span> apps,{' '}
          <span style={{ color: ORANGE }}>fully instrumented.</span>
        </motion.h1>
        <p style={{ maxWidth: 560, marginTop: 18, fontSize: 16, lineHeight: 1.6, color: DIM }}>
          TalTools runs small, sharp utilities that live in your menu bar. Below is the live operations
          board. Three systems, real telemetry, all nominal.
        </p>
      </header>

      {/* OPS GRID */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '8px 20px 40px',
          display: 'grid',
          gap: 18,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {APPS.map((app, i) => (
          <SystemPanel key={app.id} app={app} idx={i} reduced={reduced} />
        ))}
      </main>

      {/* TELEMETRY LOG */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
        <div
          ref={logRef}
          style={{
            background: '#040c17',
            border: `1px solid ${CYAN}22`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: DIM }}>TELEMETRY LOG</span>
            <span className="mc-blink" style={{ width: 7, height: 7, borderRadius: 99, background: ORANGE, boxShadow: `0 0 6px ${ORANGE}` }} />
            <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: DIM }}>tail -f /var/log/taltools</span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.9, color: TEXT, minHeight: 96 }}>
            {visibleLog.map((line, i) => (
              <motion.div
                key={`${logIndex}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: i === 0 ? 1 : 0.45 - i * 0.06 }}
                transition={reduced ? { duration: 0 } : { duration: 0.4 }}
                style={{ display: 'flex', gap: 10 }}
              >
                <span style={{ color: CYAN }}>{String((tick - i + 1000) % 1000).padStart(3, '0')}</span>
                <span style={{ color: i === 0 ? GREEN : DIM }}>{line}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: `1px solid ${CYAN}1f`,
          padding: '20px',
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: DIM,
          letterSpacing: 1,
        }}
      >
        TALTOOLS OPS CONSOLE · STATUS <span style={{ color: GREEN }}>NOMINAL</span> · {clock || '--:--:--'}
      </footer>
    </div>
  )
}
