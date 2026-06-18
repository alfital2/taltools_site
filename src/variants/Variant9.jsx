import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

const DEMO_FOR = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

// ── Hand-drawn sketchbook landing page for TalTools ──────────────────────────
// Cream paper, ruled grid, wobbly borders, doodled arrows, sticky notes & tape.

const HEADING_FONT = "'Caveat', 'Comic Sans MS', cursive"
const BODY_FONT = "'Patrick Hand', 'Comic Sans MS', cursive"

// A few sketchy border-radius presets so boxes don't all look identical.
const ROUGH = [
  '255px 15px 225px 15px/15px 225px 15px 255px',
  '15px 225px 15px 255px/255px 15px 225px 15px',
  '225px 25px 240px 18px/18px 235px 22px 245px',
]

const PAPER = '#fef9e7'
const INK = '#2b2b2b'

// Squiggly underline path that "draws on" when scrolled into view.
function Squiggle({ color = INK, reduce }) {
  return (
    <svg
      viewBox="0 0 300 24"
      width="100%"
      height="20"
      preserveAspectRatio="none"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <motion.path
        d="M4 14 C 40 4, 70 22, 110 12 S 180 2, 220 14 S 280 22, 296 10"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
    </svg>
  )
}

// Doodled arrow that curves and draws on.
function DoodleArrow({ color = INK, reduce, style }) {
  return (
    <svg viewBox="0 0 120 90" width="110" height="80" style={style} aria-hidden="true">
      <motion.path
        d="M8 12 C 30 40, 50 70, 90 64"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
      <motion.path
        d="M90 64 L 74 54 M90 64 L 80 80"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.7 }}
      />
    </svg>
  )
}

// Small hand-drawn arrow that sits inside the "see the full demo" link.
function InlineArrow({ color = INK }) {
  return (
    <svg viewBox="0 0 34 18" width="26" height="14" style={{ overflow: 'visible' }} aria-hidden="true">
      <path d="M2 9 C 12 6, 22 12, 30 9" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M30 9 L 23 5 M30 9 L 24 14" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

function StickyNote({ app, index, reduce }) {
  const tilt = [-2.5, 1.8, -1.4][index % 3]
  const Demo = DEMO_FOR[app.id]
  return (
    <motion.div
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40, rotate: tilt - 6 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.12, type: 'spring', stiffness: 90, damping: 12 }}
      whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
      className="sketch-note"
      style={{
        position: 'relative',
        background: '#fffdf3',
        border: `2.5px solid ${INK}`,
        borderRadius: ROUGH[index % 3],
        padding: '26px 22px 30px',
        boxShadow: '6px 7px 0 rgba(43,43,43,0.18)',
        color: INK,
        fontFamily: BODY_FONT,
      }}
    >
      {/* tape strip */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          width: 90,
          height: 30,
          transform: 'translateX(-50%) rotate(-3deg)',
          background: 'rgba(120,200,255,0.35)',
          border: '1px dashed rgba(43,43,43,0.25)',
        }}
      />
      {/* real app icon, pinned to the note like a photo with a hand-drawn frame */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <div
          style={{
            position: 'relative',
            padding: 5,
            background: '#fffdf3',
            border: `2.5px solid ${INK}`,
            borderRadius: ROUGH[(index + 1) % 3],
            boxShadow: '3px 4px 0 rgba(43,43,43,0.2)',
            display: 'inline-flex',
            transform: `rotate(${[-3, 2.5, -2][index % 3]}deg)`,
          }}
        >
          <img
            src={app.icon}
            alt={app.name + ' icon'}
            width={62}
            height={62}
            style={{ display: 'block', borderRadius: '22%' }}
          />
        </div>
      </div>

      <h3
        style={{
          fontFamily: HEADING_FONT,
          fontSize: 'clamp(30px, 6vw, 40px)',
          lineHeight: 1,
          margin: '4px 0 2px',
        }}
      >
        {app.name}
      </h3>
      <div style={{ height: 14, marginBottom: 6 }}>
        <Squiggle color={app.accent} reduce={reduce} />
      </div>

      <p style={{ fontSize: 19, fontStyle: 'italic', margin: '0 0 8px', opacity: 0.85 }}>{app.tagline}</p>
      <p style={{ fontSize: 17, lineHeight: 1.35, margin: '0 0 14px' }}>{app.blurb}</p>

      <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0, display: 'grid', gap: 7 }}>
        {app.bullets.map((b) => (
          <li key={b} style={{ display: 'flex', gap: 8, fontSize: 16.5, lineHeight: 1.2 }}>
            <CheckMark color={app.accent} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* live demo, taped into the page like a clipping */}
      {Demo && (
        <div
          style={{
            position: 'relative',
            margin: '0 0 18px',
            padding: '20px 14px 14px',
            background: '#fffdf5',
            border: `2px dashed rgba(43,43,43,0.45)`,
            borderRadius: ROUGH[index % 3],
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -14,
              left: 18,
              fontFamily: HEADING_FONT,
              fontSize: 19,
              background: app.accent,
              color: INK,
              padding: '1px 10px 2px',
              border: `2px solid ${INK}`,
              borderRadius: ROUGH[(index + 1) % 3],
              transform: 'rotate(-2deg)',
            }}
          >
            try it
          </span>
          <Demo tone="light" />
        </div>
      )}

      {/* see the full demo, drawn as an underlined sketch link */}
      <a
        href={app.site}
        className="sketch-link"
        {...(app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: INK,
          background: app.accent,
          fontFamily: HEADING_FONT,
          fontSize: 25,
          padding: '5px 18px 7px',
          border: `2.5px solid ${INK}`,
          borderRadius: ROUGH[(index + 2) % 3],
          boxShadow: '3px 4px 0 rgba(43,43,43,0.3)',
        }}
      >
        See the full demo
        <InlineArrow color={INK} />
      </a>
    </motion.div>
  )
}

// Hand-scribbled check mark for the feature list.
function CheckMark({ color }) {
  return (
    <svg viewBox="0 0 20 20" width="17" height="17" style={{ flex: '0 0 auto', marginTop: 2 }} aria-hidden="true">
      <path d="M3 11 C 5 13, 7 16, 9 17 C 12 11, 15 5, 18 2" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Variant9() {
  const reduce = useReducedMotion()
  const fontLoaded = useRef(false)

  useEffect(() => {
    if (fontLoaded.current) return
    fontLoaded.current = true
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
      'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Patrick+Hand&display=swap'
    document.head.appendChild(pre1)
    document.head.appendChild(pre2)
    document.head.appendChild(link)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        color: INK,
        fontFamily: BODY_FONT,
        background: PAPER,
        // ruled-paper grid: faint horizontal lines + a margin column
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(80,120,200,0.12) 31px, rgba(80,120,200,0.12) 32px), linear-gradient(90deg, transparent 0, transparent 52px, rgba(220,90,90,0.25) 52px, rgba(220,90,90,0.25) 54px, transparent 54px)',
      }}
    >
      <style>{`
        @keyframes wiggle {
          0%,100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes floaty {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-7px) rotate(-3deg); }
        }
        .sketch-link { cursor: pointer; transition: transform .15s ease, box-shadow .15s ease; }
        .sketch-link:hover { transform: translate(-1px,-2px); box-shadow: 5px 7px 0 rgba(43,43,43,0.35); }
        .sketch-link:active { transform: translate(2px,3px); box-shadow: 1px 1px 0 rgba(43,43,43,0.3); }
        .sketch-link:focus-visible { outline: 3px solid #2b2b2b; outline-offset: 3px; }
        .doodle-star { animation: wiggle 3.5s ease-in-out infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .doodle-star, .floaty-note, .sketch-note { animation: none !important; }
        }
      `}</style>

      {/* top-right floating doodle (keeps clear of top-left back button) */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 14, right: 16, zIndex: 50, pointerEvents: 'none' }}
        className="floaty-note"
      >
        <span
          style={{
            display: 'inline-block',
            background: '#fff7b0',
            border: `2px solid ${INK}`,
            fontFamily: HEADING_FONT,
            fontSize: 18,
            padding: '4px 12px 6px',
            borderRadius: ROUGH[0],
            boxShadow: '3px 4px 0 rgba(43,43,43,0.2)',
            animation: reduce ? 'none' : 'floaty 5s ease-in-out infinite',
            transform: 'rotate(-3deg)',
          }}
        >
          made by hand ✷
        </span>
      </div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <header
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '90px 24px 30px 72px',
          position: 'relative',
        }}
      >
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'inline-block' }}
        >
          <span
            style={{
              fontFamily: BODY_FONT,
              fontSize: 20,
              background: '#caf0d8',
              padding: '2px 10px',
              border: `2px solid ${INK}`,
              borderRadius: ROUGH[1],
              transform: 'rotate(-1.5deg)',
              display: 'inline-block',
            }}
          >
            a tiny lab of mac menu-bar apps
          </span>
        </motion.div>

        <h1
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            fontSize: 'clamp(64px, 16vw, 150px)',
            lineHeight: 0.85,
            margin: '14px 0 0',
            letterSpacing: '-0.5px',
          }}
        >
          TalTools
          <svg
            className="doodle-star"
            viewBox="0 0 40 40"
            width="42"
            height="42"
            style={{ display: 'inline-block', marginLeft: 8, verticalAlign: 'super' }}
            aria-hidden="true"
          >
            <path
              d="M20 3 L24 16 L37 16 L26 24 L30 37 L20 29 L10 37 L14 24 L3 16 L16 16 Z"
              fill="#ffb703"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </h1>

        <div style={{ maxWidth: 360, marginTop: 2 }}>
          <Squiggle reduce={reduce} />
        </div>

        <p
          style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(19px, 4.5vw, 26px)',
            maxWidth: 560,
            lineHeight: 1.35,
            marginTop: 16,
          }}
        >
          Three small, sharp tools that live up in your menu bar and quietly make
          your Mac nicer. No accounts, no fuss, just little fixes sketched into
          existence.
        </p>

        {/* arrow doodle pointing down toward the cards */}
        <div style={{ position: 'relative', height: 70, marginTop: 6 }}>
          <DoodleArrow
            reduce={reduce}
            style={{ position: 'absolute', left: 'min(38vw, 380px)', top: -6 }}
          />
          <span
            style={{
              position: 'absolute',
              left: 'min(46vw, 460px)',
              top: 18,
              fontFamily: HEADING_FONT,
              fontSize: 26,
              transform: 'rotate(-6deg)',
              color: '#7c5cff',
              whiteSpace: 'nowrap',
            }}
          >
            pick one!
          </span>
        </div>
      </header>

      {/* ── APP STICKY NOTES ──────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '10px 24px 40px 72px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 'clamp(28px, 5vw, 44px)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            alignItems: 'start',
          }}
        >
          {APPS.map((app, i) => (
            <StickyNote key={app.id} app={app} index={i} reduce={reduce} />
          ))}
        </div>

        {/* margin doodle note */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 56,
            fontFamily: HEADING_FONT,
            fontSize: 'clamp(26px, 6vw, 40px)',
            transform: 'rotate(-1deg)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span>all free. all notarized. all made with care.</span>
          <span style={{ fontSize: 30 }} aria-hidden="true">
            ♡
          </span>
        </motion.div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '20px 24px 70px 72px',
          fontFamily: BODY_FONT,
        }}
      >
        <div style={{ height: 18, maxWidth: 420 }}>
          <Squiggle color="#2ec4b6" reduce={reduce} />
        </div>
        <p style={{ fontSize: 18, marginTop: 10, opacity: 0.85 }}>
          TalTools, doodled and built for macOS. Thanks for flipping through the
          sketchbook.
        </p>
      </footer>
    </div>
  )
}
