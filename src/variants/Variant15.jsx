import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APPS } from '../apps.js'

// ---------------------------------------------------------------------------
// Variant 15 — "Boarding Pass / Thermal Receipt"
// The whole page is printed paper. A long thermal-receipt header up top with
// dashed tear lines, dotted-leader item rows, a CSS barcode, a QR-ish block
// and a TOTAL. Then each of the 3 apps is an airline-style boarding pass with
// a perforated tear-off stub, repurposed fields (PASSENGER -> APP, GATE ->
// MENU BAR, SEAT -> FREE), a barcode and a BOARD NOW button.
// Self-contained. Imports only from react + framer-motion.
// ---------------------------------------------------------------------------

const MONO = "'Space Mono', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
const INK = '#16130f'
const PAPER = '#f7f5ef'
const STAMP = '#00a86b'

// --- prefers-reduced-motion ------------------------------------------------
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(!!mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])
  return reduced
}

// A CSS-only barcode rendered from a string seed (deterministic widths).
function Barcode({ seed = 'TALTOOLS', height = 34, style }) {
  const bars = []
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  for (let i = 0; i < 46; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    const w = (h % 4) + 1
    const dark = (h >> 3) % 3 !== 0
    bars.push(
      <span
        key={i}
        style={{
          width: w + 'px',
          height: '100%',
          background: dark ? INK : 'transparent',
          display: 'inline-block',
        }}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: '1px',
        height: height + 'px',
        ...style,
      }}
    >
      {bars}
    </div>
  )
}

// A small QR-ish block (deterministic checkerboard from a seed).
function QrBlock({ seed = 'QR', size = 72 }) {
  const n = 11
  const cells = []
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 131 + seed.charCodeAt(i)) >>> 0
  for (let i = 0; i < n * n; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    const r = Math.floor(i / n)
    const c = i % n
    // finder squares in 3 corners
    const finder =
      (r < 3 && c < 3) || (r < 3 && c >= n - 3) || (r >= n - 3 && c < 3)
    const on = finder ? (r === 0 || r === 2 || c === 0 || c === 2 || (r === 1 && c === 1) || r === n - 3 || r === n - 1 || c === n - 3 || c === n - 1) : (h >> 4) % 2 === 0
    cells.push(
      <span
        key={i}
        style={{ background: on ? INK : 'transparent', display: 'block' }}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      style={{
        width: size + 'px',
        height: size + 'px',
        display: 'grid',
        gridTemplateColumns: `repeat(${n}, 1fr)`,
        gridTemplateRows: `repeat(${n}, 1fr)`,
        gap: '0px',
        background: PAPER,
        padding: '4px',
        border: `2px solid ${INK}`,
      }}
    >
      {cells}
    </div>
  )
}

// Dotted-leader receipt row: label .......... price
function ItemRow({ label, price, dim }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        fontSize: '12.5px',
        lineHeight: 1.7,
        color: dim ? 'rgba(22,19,15,0.6)' : INK,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
      <span
        aria-hidden="true"
        style={{
          flex: 1,
          borderBottom: '1px dotted rgba(22,19,15,0.45)',
          transform: 'translateY(-4px)',
        }}
      />
      <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{price}</span>
    </div>
  )
}

// --- Boarding pass for one app --------------------------------------------
function BoardingPass({ app, index, reduced }) {
  const [torn, setTorn] = useState(false)
  const seat = String(12 + index * 11) + ['A', 'C', 'F'][index % 3]
  const gate = ['G', 'F', 'T'][index % 3] + String(index + 1)
  const flight = 'TT' + String(101 + index)

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 40, rotate: index % 2 ? 1.2 : -1.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 0.6 : -0.6 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduced ? undefined : { y: -8, rotate: 0, transition: { duration: 0.25 } }}
      style={{
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        background: PAPER,
        color: INK,
        fontFamily: MONO,
        borderRadius: '10px',
        boxShadow:
          '0 1px 0 rgba(22,19,15,0.25), 0 18px 40px -18px rgba(22,19,15,0.55)',
        overflow: 'hidden',
        maxWidth: '760px',
        width: '100%',
      }}
    >
      {/* ink texture / aged overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 80% at 90% -10%, rgba(22,19,15,0.05), transparent 60%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* MAIN STUB */}
      <div
        style={{
          flex: '1 1 360px',
          minWidth: 0,
          padding: '20px 22px 22px',
          borderRight: '2px dashed rgba(22,19,15,0.35)',
          position: 'relative',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '10px',
            paddingBottom: '12px',
            marginBottom: '14px',
            borderBottom: `2px solid ${INK}`,
          }}
        >
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.22em', opacity: 0.65 }}>
              TALTOOLS AIRLINES
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', fontWeight: 700 }}>
              BOARDING PASS
            </div>
          </div>
          <div
            style={{
              fontSize: '26px',
              lineHeight: 1,
              transform: 'rotate(-6deg)',
            }}
            aria-hidden="true"
          >
            {app.emoji}
          </div>
        </header>

        {/* field grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
            gap: '12px 14px',
            marginBottom: '14px',
          }}
        >
          <Field k="PASSENGER / APP" v={app.name.toUpperCase()} big />
          <Field k="FLIGHT" v={flight} />
          <Field k="SEAT" v={seat} />
          <Field k="GATE" v="MENU BAR" />
          <Field k="BOARDING" v="NOW" />
          <Field k="STATUS" v="FREE" stamp />
        </div>

        {/* route = tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            borderTop: '1px dotted rgba(22,19,15,0.4)',
            borderBottom: '1px dotted rgba(22,19,15,0.4)',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700 }}>DOCK</span>
          <span aria-hidden="true" style={{ flex: 1, position: 'relative', height: '1px', background: 'rgba(22,19,15,0.5)' }}>
            <span style={{ position: 'absolute', right: '-2px', top: '-7px', fontSize: '13px' }}>✈</span>
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>FOCUS</span>
        </div>
        <p
          style={{
            fontSize: '12px',
            lineHeight: 1.45,
            margin: '0 0 4px',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          “{app.tagline}”
        </p>

        {/* blurb = fine print */}
        <p
          style={{
            fontSize: '11px',
            lineHeight: 1.55,
            margin: '8px 0 12px',
            color: 'rgba(22,19,15,0.78)',
          }}
        >
          {app.blurb}
        </p>

        {/* bullets = baggage / fine print list */}
        <div style={{ fontSize: '10.5px', letterSpacing: '0.04em', marginBottom: '14px' }}>
          <div style={{ opacity: 0.6, marginBottom: '4px' }}>* INCLUDED IN FARE *</div>
          {app.bullets.map((b) => (
            <ItemRow key={b} label={b} price="✓" />
          ))}
        </div>

        <Barcode seed={app.id + flight} height={36} style={{ marginBottom: '12px' }} />

        <motion.a
          href="#"
          whileHover={reduced ? undefined : { scale: 1.03 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: INK,
            color: PAPER,
            fontFamily: MONO,
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textDecoration: 'none',
            padding: '11px 18px',
            borderRadius: '6px',
          }}
        >
          BOARD NOW — DOWNLOAD ↓
        </motion.a>
      </div>

      {/* perforation column (notches) */}
      <div
        aria-hidden="true"
        className="bp15-perf"
        style={{
          width: '14px',
          alignSelf: 'stretch',
        }}
      />

      {/* TEAR-OFF STUB */}
      <div
        style={{
          flex: '0 1 200px',
          minWidth: '160px',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '9px', letterSpacing: '0.2em', opacity: 0.6, alignSelf: 'flex-start' }}>
          STUB · KEEP
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>
          {app.name.toUpperCase()}
        </div>
        <QrBlock seed={app.id + 'STUB'} size={78} />
        <div style={{ display: 'grid', gap: '2px', width: '100%' }}>
          <MiniField k="GATE" v="MENU BAR" />
          <MiniField k="SEAT" v={seat} />
          <MiniField k="FARE" v="FREE" stamp />
        </div>

        <button
          type="button"
          onClick={() => setTorn(true)}
          disabled={torn}
          style={{
            marginTop: 'auto',
            background: 'transparent',
            border: `2px solid ${torn ? STAMP : INK}`,
            color: torn ? STAMP : INK,
            fontFamily: MONO,
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            padding: '7px 10px',
            borderRadius: '5px',
            cursor: torn ? 'default' : 'pointer',
            width: '100%',
          }}
        >
          {torn ? '✓ CHECKED IN' : 'TEAR TO CHECK IN'}
        </button>

        <AnimatePresence>
          {torn && (
            <motion.div
              key="stamp"
              initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.8, rotate: -24 }}
              animate={{ opacity: 1, scale: 1, rotate: -16 }}
              transition={{ type: 'spring', stiffness: 600, damping: 18 }}
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '38%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                color: STAMP,
                border: `3px solid ${STAMP}`,
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                opacity: 0.92,
                pointerEvents: 'none',
                boxShadow: 'inset 0 0 0 2px rgba(0,168,107,0.25)',
              }}
            >
              BOARDED
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

function Field({ k, v, big, stamp }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '8.5px', letterSpacing: '0.14em', opacity: 0.6, marginBottom: '2px' }}>
        {k}
      </div>
      <div
        style={{
          fontSize: big ? '15px' : '12.5px',
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: stamp ? STAMP : INK,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {v}
      </div>
    </div>
  )
}

function MiniField({ k, v, stamp }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', letterSpacing: '0.06em' }}>
      <span style={{ opacity: 0.6 }}>{k}</span>
      <span style={{ fontWeight: 700, color: stamp ? STAMP : INK }}>{v}</span>
    </div>
  )
}

// ===========================================================================
export default function Variant15() {
  const reduced = useReducedMotion()
  const fontRef = useRef(false)

  useEffect(() => {
    if (fontRef.current) return
    fontRef.current = true
    const pre1 = document.createElement('link')
    pre1.rel = 'preconnect'
    pre1.href = 'https://fonts.googleapis.com'
    const pre2 = document.createElement('link')
    pre2.rel = 'preconnect'
    pre2.href = 'https://fonts.gstatic.com'
    pre2.crossOrigin = 'anonymous'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap'
    document.head.appendChild(pre1)
    document.head.appendChild(pre2)
    document.head.appendChild(link)
  }, [])

  const now = new Date()
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, '.')

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background:
          'repeating-linear-gradient(135deg, #ddd9cf 0 2px, #e6e2d8 2px 22px), #e6e2d8',
        fontFamily: MONO,
        color: INK,
        padding: '64px 16px 96px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @keyframes bp15-printin {
          0%   { clip-path: inset(0 0 100% 0); opacity: 0; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        .bp15-receipt {
          animation: bp15-printin 1.1s cubic-bezier(.16,1,.3,1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bp15-receipt { animation: none !important; }
        }
        /* perforation column: white notches punched along a dashed seam */
        .bp15-perf {
          background:
            radial-gradient(circle 6px at 50% 0, transparent 5px, transparent 5px),
            repeating-linear-gradient(
              to bottom,
              transparent 0 8px,
              ${INK}55 8px 16px
            );
          -webkit-mask:
            radial-gradient(circle 6px at 50% -2px, transparent 6px, #000 6.5px) repeat-y,
            linear-gradient(#000 0 0);
          position: relative;
        }
        .bp15-perf::before,
        .bp15-perf::after {
          content: '';
          position: absolute;
          left: 50%;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e6e2d8;
          transform: translateX(-50%);
        }
        .bp15-perf::before { top: -8px; }
        .bp15-perf::after { bottom: -8px; }
        .bp15-tear {
          border: none;
          border-top: 2px dashed rgba(22,19,15,0.5);
          height: 0;
          position: relative;
        }
        .bp15-tear::before, .bp15-tear::after {
          content: '✂';
          position: absolute;
          top: -11px;
          font-size: 14px;
          opacity: 0.55;
        }
        .bp15-tear::before { left: 4px; }
        .bp15-tear::after { right: 4px; transform: scaleX(-1); }
      `}</style>

      {/* ================= THERMAL RECEIPT ================= */}
      <div
        className={reduced ? '' : 'bp15-receipt'}
        style={{
          maxWidth: '420px',
          margin: '0 auto 72px',
          background: PAPER,
          color: INK,
          padding: '26px 26px 30px',
          boxShadow:
            '0 1px 0 rgba(22,19,15,0.2), 0 24px 50px -22px rgba(22,19,15,0.6)',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', lineHeight: 1.5 }}>
          <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '0.14em' }}>
            TALTOOLS
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '0.22em' }}>GENERAL STORE</div>
          <div style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '0.18em' }}>
            EST. 2026 · MENU BAR DIVISION
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '8px', letterSpacing: '0.18em' }}>
            *** RECEIPT ***
          </div>
        </div>

        <hr className="bp15-tear" style={{ margin: '16px 0' }} />

        <div style={{ fontSize: '10px', opacity: 0.7, display: 'flex', justifyContent: 'space-between', marginBottom: '10px', letterSpacing: '0.06em' }}>
          <span>ORDER #TT-{Math.floor(now.getTime() / 1000) % 100000}</span>
          <span>{stamp}</span>
        </div>

        <div style={{ display: 'grid', gap: '2px' }}>
          {APPS.map((a) => (
            <ItemRow key={a.id} label={`${a.emoji} ${a.name}`} price="FREE" />
          ))}
          <ItemRow label="No accounts" price="FREE" dim />
          <ItemRow label="No tracking" price="FREE" dim />
          <ItemRow label="Notarized & native" price="FREE" dim />
        </div>

        <hr className="bp15-tear" style={{ margin: '16px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em' }}>
          <span>TOTAL</span>
          <span style={{ color: STAMP }}>$0.00</span>
        </div>
        <div style={{ fontSize: '10px', opacity: 0.65, marginTop: '4px', letterSpacing: '0.06em' }}>
          ITEMS: {APPS.length} · TENDER: GOOD TASTE · CHANGE: $0.00
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '14px',
            marginTop: '20px',
          }}
        >
          <Barcode seed="TALTOOLSGENERALSTORE" height={44} style={{ flex: 1 }} />
          <QrBlock seed="TALTOOLS2026" size={68} />
        </div>
        <div style={{ textAlign: 'center', fontSize: '9px', letterSpacing: '0.3em', marginTop: '8px', opacity: 0.7 }}>
          0 24026 01101 5
        </div>

        <hr className="bp15-tear" style={{ margin: '16px 0' }} />

        <div style={{ textAlign: 'center', fontSize: '10px', lineHeight: 1.7, opacity: 0.8, letterSpacing: '0.08em' }}>
          THANK YOU FOR SHOPPING SMALL<br />
          THREE TINY MAC APPS · ONE TINY LAB<br />
          *** PLEASE COME AGAIN ***
        </div>
      </div>

      {/* ================= BOARDING PASSES ================= */}
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            letterSpacing: '0.28em',
            fontWeight: 700,
            margin: '0 0 6px',
          }}
        >
          NOW BOARDING
        </motion.h2>
        <p style={{ textAlign: 'center', fontSize: '11px', opacity: 0.65, margin: '0 0 36px', letterSpacing: '0.12em' }}>
          PRESENT PASS AT THE MENU BAR · GATES OPEN
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '44px', alignItems: 'center' }}>
          {APPS.map((app, i) => (
            <BoardingPass key={app.id} app={app} index={i} reduced={reduced} />
          ))}
        </div>
      </div>

      <footer
        style={{
          maxWidth: '780px',
          margin: '64px auto 0',
          textAlign: 'center',
          fontSize: '10px',
          letterSpacing: '0.16em',
          opacity: 0.6,
        }}
      >
        TALTOOLS · {now.getFullYear()} · BOARDING PASS NON-TRANSFERABLE · ENJOY YOUR FLIGHT ✈
      </footer>
    </div>
  )
}
