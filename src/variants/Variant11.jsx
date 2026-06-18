import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { APPS } from '../apps.js'

const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace'
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

const BP_BG = '#0a2540'
const BP_LINE = 'rgba(140, 210, 255, 0.85)'
const BP_GRID = 'rgba(120, 190, 255, 0.10)'
const BP_GRID_MAJOR = 'rgba(120, 190, 255, 0.18)'
const BP_INK = '#e9f6ff'
const BP_CYAN = '#7fdfff'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

/* ---------- Grid + vignette background ---------- */
function Backdrop() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: BP_BG }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${BP_GRID} 1px, transparent 1px),
            linear-gradient(90deg, ${BP_GRID} 1px, transparent 1px),
            linear-gradient(${BP_GRID_MAJOR} 1px, transparent 1px),
            linear-gradient(90deg, ${BP_GRID_MAJOR} 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 24px 24px, 120px 120px, 120px 120px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(20,70,120,0.35), rgba(5,18,34,0.65) 75%)',
        }}
      />
    </div>
  )
}

/* ---------- Shared SVG defs (unique ids) ---------- */
function BpDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <marker id="bp-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L8,3 L0,6 Z" fill={BP_LINE} />
        </marker>
        <marker id="bp-arrow-start" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M8,0 L0,3 L8,6 Z" fill={BP_LINE} />
        </marker>
        <marker id="bp-dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
          <circle cx="3" cy="3" r="2.4" fill={BP_CYAN} />
        </marker>
      </defs>
    </svg>
  )
}

/* line that draws itself on scroll */
function DrawLine({ children, reduced, delay = 0, ...rest }) {
  if (reduced) return <g {...rest}>{children}</g>
  return (
    <motion.g
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      {...rest}
    >
      {children}
    </motion.g>
  )
}

const drawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay: 0.15 * i, ease: 'easeInOut' }, opacity: { duration: 0.2, delay: 0.15 * i } },
  }),
}

function Pl({ reduced, custom = 0, ...rest }) {
  if (reduced) return <path {...rest} />
  return <motion.path variants={drawVariants} custom={custom} {...rest} />
}

/* ---------- Title block (CAD corner) ---------- */
function TitleBlock() {
  const cell = (label, value, w) => (
    <div style={{ borderLeft: `1px solid ${BP_LINE}`, padding: '5px 10px', minWidth: w }}>
      <div style={{ fontSize: 8, letterSpacing: 1.5, color: BP_CYAN, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 12, color: BP_INK, marginTop: 2 }}>{value}</div>
    </div>
  )
  return (
    <div
      style={{
        position: 'fixed',
        right: 14,
        bottom: 14,
        zIndex: 50,
        fontFamily: MONO,
        display: 'flex',
        alignItems: 'stretch',
        border: `1px solid ${BP_LINE}`,
        background: 'rgba(8,28,52,0.82)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ padding: '5px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: BP_INK }}>TALTOOLS</div>
        <div style={{ fontSize: 8, letterSpacing: 1.5, color: BP_CYAN, opacity: 0.8 }}>DRAFTING LAB</div>
      </div>
      {cell('SHEET', '1 / 3')}
      {cell('SCALE', '1:1')}
      {cell('REV', 'A')}
    </div>
  )
}

/* ---------- Annotation callout ---------- */
function Callout({ index, text, side = 'right' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontFamily: MONO,
        flexDirection: side === 'left' ? 'row-reverse' : 'row',
        textAlign: side === 'left' ? 'right' : 'left',
      }}
    >
      <span
        style={{
          flex: '0 0 auto',
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: `1px solid ${BP_CYAN}`,
          color: BP_CYAN,
          fontSize: 11,
          display: 'grid',
          placeItems: 'center',
          marginTop: 1,
        }}
      >
        {index}
      </span>
      <span style={{ fontSize: 13, lineHeight: 1.45, color: BP_INK }}>{text}</span>
    </div>
  )
}

/* ====================================================================== */
/*  Diagrams — one simple SVG line drawing per app                        */
/* ====================================================================== */

function NatchoDiagram({ reduced, accent }) {
  const [hover, setHover] = useState(false)
  return (
    <svg viewBox="0 0 320 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="img" aria-label="Natcho menu bar with notch diagram">
      <DrawLine reduced={reduced}>
        {/* menu bar */}
        <Pl reduced={reduced} custom={0} d="M20 60 H300" stroke={BP_LINE} strokeWidth="1.4" fill="none" />
        <Pl reduced={reduced} custom={0} d="M20 90 H300" stroke={BP_LINE} strokeWidth="1.4" fill="none" />
        <Pl reduced={reduced} custom={0} d="M20 60 V90" stroke={BP_LINE} strokeWidth="1.4" fill="none" />
        <Pl reduced={reduced} custom={0} d="M300 60 V90" stroke={BP_LINE} strokeWidth="1.4" fill="none" />
        {/* notch (filled black bar) */}
        <motion.rect
          x="135" y="58" width="50" height="22" rx="6"
          fill={hover ? '#000' : 'rgba(0,0,0,0.85)'}
          stroke={accent} strokeWidth="1.4"
          animate={reduced ? {} : { opacity: [0.7, 1, 0.7] }}
          transition={reduced ? {} : { duration: 2.4, repeat: Infinity }}
        />
        {/* menu items */}
        <Pl reduced={reduced} custom={1} d="M210 75 h14 M232 75 h14 M254 75 h20" stroke={BP_CYAN} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="75" r="5" fill="none" stroke={BP_CYAN} strokeWidth="1.4" />
        {/* rounded corner detail (exploded) */}
        <Pl reduced={reduced} custom={2} d="M40 130 q0 18 18 18" stroke={accent} strokeWidth="1.6" fill="none" />
        <Pl reduced={reduced} custom={2} d="M40 130 V120 M40 148 H50" stroke={BP_LINE} strokeWidth="1" fill="none" strokeDasharray="3 3" />
        {/* dimension line under bar */}
        <Pl reduced={reduced} custom={3} d="M20 108 H300" stroke={BP_LINE} strokeWidth="0.8" fill="none" markerStart="url(#bp-arrow-start)" markerEnd="url(#bp-arrow)" />
        <text x="160" y="103" textAnchor="middle" fontFamily={MONO} fontSize="9" fill={BP_CYAN}>MENU BAR · W=AUTO</text>
        {/* leader to notch */}
        <Pl reduced={reduced} custom={3} d="M160 45 V58" stroke={BP_CYAN} strokeWidth="1" fill="none" markerStart="url(#bp-dot)" />
        <text x="160" y="40" textAnchor="middle" fontFamily={MONO} fontSize="9" fill={accent}>NOTCH MASK</text>
      </DrawLine>
      {/* invisible hover target */}
      <rect x="0" y="40" width="320" height="120" fill="transparent" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} />
    </svg>
  )
}

function FlickeyDiagram({ reduced, accent }) {
  const [hover, setHover] = useState(false)
  const keys = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      keys.push({ x: 30 + c * 38, y: 70 + r * 32, lit: r === 0 && c === 0 })
    }
  }
  return (
    <svg viewBox="0 0 320 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="img" aria-label="FlicKey keyboard layout diagram">
      <DrawLine reduced={reduced}>
        {/* keyboard outline */}
        <Pl reduced={reduced} custom={0} d="M16 56 H272 V172 H16 Z" stroke={BP_LINE} strokeWidth="1.4" fill="none" />
        {keys.map((k, i) => (
          <rect
            key={i}
            x={k.x} y={k.y} width="30" height="24" rx="4"
            fill={k.lit ? (hover ? accent : 'rgba(124,92,255,0.35)') : 'transparent'}
            stroke={k.lit ? accent : BP_CYAN}
            strokeWidth={k.lit ? 1.6 : 0.9}
            opacity={k.lit ? 1 : 0.55}
          />
        ))}
        {/* language badge bubble */}
        <motion.g animate={reduced ? {} : { y: [0, -3, 0] }} transition={reduced ? {} : { duration: 2, repeat: Infinity }}>
          <circle cx="290" cy="60" r="16" fill="none" stroke={accent} strokeWidth="1.6" />
          <text x="290" y="64" textAnchor="middle" fontFamily={MONO} fontSize="11" fill={accent}>EN</text>
        </motion.g>
        {/* leader to badge */}
        <Pl reduced={reduced} custom={2} d="M290 76 V96 H250" stroke={accent} strokeWidth="1" fill="none" markerEnd="url(#bp-arrow)" />
        <text x="246" y="100" textAnchor="end" fontFamily={MONO} fontSize="9" fill={accent}>LIVE BADGE</text>
        {/* dimension */}
        <Pl reduced={reduced} custom={3} d="M16 184 H272" stroke={BP_LINE} strokeWidth="0.8" fill="none" markerStart="url(#bp-arrow-start)" markerEnd="url(#bp-arrow)" />
        <text x="144" y="180" textAnchor="middle" fontFamily={MONO} fontSize="9" fill={BP_CYAN}>LAYOUT · PER-APP STATE</text>
      </DrawLine>
      <rect x="0" y="40" width="320" height="150" fill="transparent" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} />
    </svg>
  )
}

function TallyDiagram({ reduced, accent }) {
  const [hover, setHover] = useState(false)
  // gauge arc
  const cx = 110, cy = 130, r = 64
  const a0 = Math.PI, a1 = 0
  const pct = hover ? 0.78 : 0.62
  const ang = a0 + (a1 - a0) * pct
  const nx = cx + Math.cos(ang) * (r - 8)
  const ny = cy + Math.sin(ang) * (r - 8)
  return (
    <svg viewBox="0 0 320 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="img" aria-label="Tally usage gauge diagram">
      <DrawLine reduced={reduced}>
        {/* gauge track */}
        <Pl reduced={reduced} custom={0} d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`} stroke={BP_CYAN} strokeWidth="1.4" fill="none" opacity="0.55" />
        {/* gauge value arc */}
        <motion.path
          d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={reduced ? undefined : { pathLength: pct }}
          animate={reduced ? { pathLength: pct } : undefined}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* needle */}
        <Pl reduced={reduced} custom={1} d={`M${cx} ${cy} L${nx} ${ny}`} stroke={BP_INK} strokeWidth="1.6" fill="none" />
        <circle cx={cx} cy={cy} r="4" fill={accent} />
        {/* tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const aa = a0 + (a1 - a0) * t
          const x1 = cx + Math.cos(aa) * r, y1 = cy + Math.sin(aa) * r
          const x2 = cx + Math.cos(aa) * (r + 9), y2 = cy + Math.sin(aa) * (r + 9)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BP_LINE} strokeWidth="1" />
        })}
        {/* countdown readout */}
        <Pl reduced={reduced} custom={2} d="M210 70 H300 V120 H210 Z" stroke={BP_LINE} strokeWidth="1.2" fill="none" />
        <text x="255" y="92" textAnchor="middle" fontFamily={MONO} fontSize="16" fill={accent}>04:12</text>
        <text x="255" y="108" textAnchor="middle" fontFamily={MONO} fontSize="8" fill={BP_CYAN}>RESET COUNTDOWN</text>
        {/* leader */}
        <Pl reduced={reduced} custom={3} d="M174 130 H205" stroke={accent} strokeWidth="1" fill="none" markerEnd="url(#bp-arrow)" />
        <text x="110" y="180" textAnchor="middle" fontFamily={MONO} fontSize="9" fill={BP_CYAN}>SESSION LOAD · 62%</text>
      </DrawLine>
      <rect x="0" y="40" width="320" height="150" fill="transparent" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} />
    </svg>
  )
}

const DIAGRAMS = { natcho: NatchoDiagram, flickey: FlickeyDiagram, tally: TallyDiagram }

/* ---------- App sheet ---------- */
function AppSheet({ app, num, reduced }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const Diagram = DIAGRAMS[app.id] || NatchoDiagram
  const sheetNo = String(num).padStart(2, '0')
  return (
    <motion.section
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      animate={reduced ? {} : inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        border: `1px solid ${BP_LINE}`,
        background: 'rgba(8,30,56,0.55)',
        backdropFilter: 'blur(2px)',
        padding: 'clamp(18px, 3vw, 34px)',
        position: 'relative',
      }}
    >
      {/* corner tick marks */}
      {[
        { top: -1, left: -1, r: 'rotate(0deg)' },
        { top: -1, right: -1, r: 'rotate(90deg)' },
        { bottom: -1, right: -1, r: 'rotate(180deg)' },
        { bottom: -1, left: -1, r: 'rotate(270deg)' },
      ].map((c, i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', width: 14, height: 14, borderTop: `2px solid ${app.accent}`, borderLeft: `2px solid ${app.accent}`, transform: c.r, ...c }} />
      ))}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: BP_CYAN }}>
            FIG. {sheetNo} — DETAIL
          </div>
          <h2 style={{ fontFamily: SANS, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: BP_INK, margin: '4px 0 2px', letterSpacing: -0.5 }}>
            <span style={{ marginRight: 10 }}>{app.emoji}</span>{app.name}
          </h2>
          <div style={{ fontFamily: MONO, fontSize: 14, color: app.accent }}>{app.tagline}</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: BP_CYAN, opacity: 0.7, textAlign: 'right' }}>
          PART No.<br />TT-{app.id.slice(0, 3).toUpperCase()}-{sheetNo}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
          gap: 'clamp(18px, 3vw, 36px)',
          alignItems: 'center',
        }}
        className="bp-sheet-grid"
      >
        {/* diagram */}
        <div style={{ border: `1px dashed ${BP_LINE}`, padding: '18px 14px', background: 'rgba(4,20,40,0.4)' }}>
          <Diagram reduced={reduced} accent={app.accent} />
        </div>

        {/* annotations + content */}
        <div>
          <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.6, color: 'rgba(233,246,255,0.86)', margin: '0 0 18px' }}>
            {app.blurb}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
            {app.bullets.map((b, i) => (
              <Callout key={i} index={String(i + 1).padStart(2, '0')} text={b} />
            ))}
          </div>
          <a
            href="#"
            className="bp-dl"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: 1,
              color: BP_BG,
              background: app.accent,
              padding: '11px 20px',
              border: `1px solid ${app.accent}`,
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            ↓ DOWNLOAD · {app.name.toUpperCase()}
          </a>
        </div>
      </div>
    </motion.section>
  )
}

/* ====================================================================== */
export default function Variant11() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Inter:wght@400;600;800&display=swap'
    document.head.appendChild(link)
    return () => { try { document.head.removeChild(link) } catch (e) { /* noop */ } }
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', color: BP_INK, fontFamily: SANS, background: BP_BG }}>
      <Backdrop />
      <BpDefs />

      <style>{`
        @keyframes bp-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(2000px); }
        }
        .bp-dl { transition: transform .15s ease, box-shadow .15s ease, filter .15s ease; }
        .bp-dl:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 10px 24px rgba(0,0,0,0.4); }
        .bp-dl:focus-visible { outline: 2px solid ${BP_INK}; outline-offset: 3px; }
        @media (max-width: 760px) {
          .bp-sheet-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bp-scan { display: none !important; }
        }
      `}</style>

      {/* scan sweep line */}
      {!reduced && (
        <div aria-hidden="true" className="bp-scan" style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 140, background: 'linear-gradient(180deg, transparent, rgba(127,223,255,0.07), transparent)', animation: 'bp-sweep 9s linear infinite' }} />
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1120, margin: '0 auto', padding: 'clamp(64px, 9vw, 120px) clamp(16px, 4vw, 40px) 140px' }}>
        {/* ---------- Hero ---------- */}
        <header style={{ marginBottom: 'clamp(48px, 7vw, 90px)' }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 3, color: BP_CYAN, marginBottom: 14 }}>
            ⌖ GENERAL ARRANGEMENT DRAWING · TALTOOLS
          </div>
          <h1 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 'clamp(40px, 8vw, 88px)', lineHeight: 0.98, letterSpacing: -2, margin: 0, color: BP_INK }}>
            Three small tools,
            <br />
            <span style={{ color: BP_CYAN }}>engineered</span> for the menu bar.
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 'clamp(15px, 2vw, 19px)', lineHeight: 1.6, color: 'rgba(233,246,255,0.78)', maxWidth: 640, marginTop: 22 }}>
            A drafting lab of three native macOS utilities. Each one drawn to spec, measured,
            and notarized. Read the schematics below.
          </p>

          {/* spec dimension strip */}
          <svg viewBox="0 0 800 40" style={{ width: '100%', maxWidth: 720, marginTop: 30, overflow: 'visible' }} aria-hidden="true">
            <DrawLine reduced={reduced}>
              <Pl reduced={reduced} custom={0} d="M0 20 H800" stroke={BP_LINE} strokeWidth="1" fill="none" markerStart="url(#bp-arrow-start)" markerEnd="url(#bp-arrow)" />
              {[0, 266, 533, 800].map((x, i) => (
                <Pl key={i} reduced={reduced} custom={0} d={`M${x} 12 V28`} stroke={BP_LINE} strokeWidth="1" fill="none" />
              ))}
            </DrawLine>
            {['NATCHO', 'FLICKEY', 'TALLY'].map((t, i) => (
              <text key={t} x={133 + i * 266} y="14" textAnchor="middle" fontFamily={MONO} fontSize="11" fill={BP_CYAN}>{t}</text>
            ))}
          </svg>
        </header>

        {/* ---------- Sheets ---------- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 5vw, 56px)' }}>
          {APPS.map((app, i) => (
            <AppSheet key={app.id} app={app} num={i + 1} reduced={reduced} />
          ))}
        </div>

        {/* ---------- Footer notes ---------- */}
        <footer style={{ marginTop: 'clamp(50px, 7vw, 90px)', borderTop: `1px solid ${BP_LINE}`, paddingTop: 22, fontFamily: MONO, fontSize: 11, color: BP_CYAN, display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'space-between' }}>
          <span>NOTES: ALL DIMENSIONS NATIVE macOS · TOLERANCE ±0 BUGS</span>
          <span>DRAWN BY TALTOOLS · © {new Date().getFullYear()} · NOT TO SCALE</span>
        </footer>
      </div>

      <TitleBlock />
    </div>
  )
}
