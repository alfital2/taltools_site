import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

// ── Palette ──────────────────────────────────────────────
const PAPER = '#e8e0cf'
const PAPER_DEEP = '#ddd2bb'
const FOREST = '#2f5d3a'
const FOREST_SOFT = '#3f7049'
const TERRA = '#e08e45'
const INK = '#243528'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Latin-ish specimen names per app id
const LATIN = {
  natcho: 'Velamen nigrum',
  flickey: 'Lingua mutabilis',
  tally: 'Modus vigilans',
}
const FAMILY = {
  natcho: 'fam. Occultaceae',
  flickey: 'fam. Tastieraceae',
  tally: 'fam. Observaceae',
}

// ── Draw-on path helper ──────────────────────────────────
function GrowPath({ d, stroke = FOREST, width = 3, delay = 0, fill = 'none', dur = 1.6 }) {
  return (
    <motion.path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={prefersReduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: prefersReduced ? 0 : dur, delay: prefersReduced ? 0 : delay, ease: 'easeInOut' }}
    />
  )
}

// Leaf that unfurls (scale-in)
function UnfurlLeaf({ children, delay = 0, origin = 'bottom center' }) {
  return (
    <motion.g
      style={{ transformOrigin: origin }}
      initial={prefersReduced ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0, rotate: -12 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: prefersReduced ? 0 : 0.9, delay: prefersReduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.g>
  )
}

// A single botanical leaf shape
function leafPath(cx, cy, len, tilt) {
  const a = (tilt * Math.PI) / 180
  const tx = cx + len * Math.sin(a)
  const ty = cy - len * Math.cos(a)
  const w = len * 0.42
  const px = Math.cos(a) * w
  const py = Math.sin(a) * w
  return `M ${cx} ${cy} C ${cx + px} ${cy + py - len * 0.3}, ${tx + px * 0.4} ${ty + py * 0.4}, ${tx} ${ty} C ${tx - px * 0.4} ${ty - py * 0.4}, ${cx - px} ${cy - py - len * 0.3}, ${cx} ${cy} Z`
}

// ── Big fern motif for hero / sections ───────────────────
function FernMotif({ flip = false, color = FOREST, accent = TERRA }) {
  const leaves = []
  for (let i = 0; i < 7; i++) {
    const t = i / 6
    const cy = 360 - t * 300
    const len = 60 - t * 34
    leaves.push(
      <UnfurlLeaf key={`l${i}`} delay={0.4 + i * 0.12} origin="0% 100%">
        <path d={leafPath(80, cy, len, -55)} fill={color} opacity={0.85 - t * 0.2} />
      </UnfurlLeaf>,
    )
    leaves.push(
      <UnfurlLeaf key={`r${i}`} delay={0.5 + i * 0.12} origin="0% 100%">
        <path d={leafPath(80, cy, len, 55)} fill={color} opacity={0.85 - t * 0.2} />
      </UnfurlLeaf>,
    )
  }
  return (
    <svg
      viewBox="0 0 160 380"
      width="100%"
      height="100%"
      style={{ transform: flip ? 'scaleX(-1)' : 'none', overflow: 'visible' }}
      aria-hidden="true"
    >
      <GrowPath d="M 80 380 C 70 280, 90 180, 80 60" stroke={color} width={4} delay={0.1} dur={1.8} />
      {leaves}
      <motion.circle
        cx="80" cy="48" r="9" fill={accent}
        initial={prefersReduced ? { scale: 1 } : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: prefersReduced ? 0 : 1.4, type: 'spring', stiffness: 180 }}
      />
    </svg>
  )
}

// ── Trailing vine (horizontal divider) ───────────────────
function VineDivider() {
  return (
    <svg viewBox="0 0 1200 80" width="100%" height="80" preserveAspectRatio="none" aria-hidden="true" style={{ overflow: 'visible' }}>
      <GrowPath
        d="M 0 40 C 200 10, 320 70, 520 38 S 880 8, 1080 42 1200 36 1200 36"
        stroke={FOREST_SOFT} width={3} dur={2}
      />
      {[180, 420, 660, 900, 1120].map((x, i) => (
        <UnfurlLeaf key={i} delay={0.6 + i * 0.18} origin="50% 100%">
          <path d={leafPath(x, 40, 30, i % 2 ? 40 : -40)} fill={FOREST} opacity={0.7} />
          <circle cx={x} cy={20} r={4} fill={TERRA} opacity={0.8} />
        </UnfurlLeaf>
      ))}
    </svg>
  )
}

// ── Per-app plant motif (seed-packet illustration) ───────
function SpecimenPlant({ index, accent }) {
  // three distinct plant silhouettes
  if (index === 0) {
    // Broad dark frond (Natcho)
    return (
      <svg viewBox="0 0 200 220" width="100%" height="100%" aria-hidden="true" style={{ overflow: 'visible' }}>
        <GrowPath d="M 100 220 C 96 160, 104 100, 100 30" width={4} delay={0.1} />
        {[0, 1, 2, 3, 4].map((i) => {
          const cy = 200 - i * 36
          const len = 70 - i * 8
          return (
            <UnfurlLeaf key={i} delay={0.3 + i * 0.13} origin="50% 100%">
              <path d={leafPath(100, cy, len, -60)} fill={FOREST} opacity={0.9} />
              <path d={leafPath(100, cy, len, 60)} fill={FOREST_SOFT} opacity={0.9} />
            </UnfurlLeaf>
          )
        })}
        <UnfurlLeaf delay={1} origin="50% 100%">
          <circle cx="100" cy="26" r="11" fill={accent} />
          <circle cx="100" cy="26" r="5" fill={INK} opacity={0.4} />
        </UnfurlLeaf>
      </svg>
    )
  }
  if (index === 1) {
    // Sprouting tendrils (FlicKey)
    return (
      <svg viewBox="0 0 200 220" width="100%" height="100%" aria-hidden="true" style={{ overflow: 'visible' }}>
        <GrowPath d="M 100 220 C 100 170, 100 120, 100 80" width={4} delay={0.1} />
        <GrowPath d="M 100 120 C 60 100, 40 60, 56 28" width={3} stroke={FOREST_SOFT} delay={0.5} />
        <GrowPath d="M 100 120 C 140 100, 160 60, 144 28" width={3} stroke={FOREST_SOFT} delay={0.6} />
        <GrowPath d="M 100 160 C 70 150, 56 120, 64 96" width={2.5} stroke={FOREST_SOFT} delay={0.7} />
        <GrowPath d="M 100 160 C 130 150, 144 120, 136 96" width={2.5} stroke={FOREST_SOFT} delay={0.8} />
        {[[56, 28], [144, 28], [64, 96], [136, 96], [100, 78]].map(([x, y], i) => (
          <UnfurlLeaf key={i} delay={1 + i * 0.1} origin="50% 100%">
            <path d={leafPath(x, y, 30, i % 2 ? 30 : -30)} fill={FOREST} opacity={0.85} />
            <circle cx={x} cy={y - 26} r={4.5} fill={accent} />
          </UnfurlLeaf>
        ))}
      </svg>
    )
  }
  // Flowering stem (Tally)
  return (
    <svg viewBox="0 0 200 220" width="100%" height="100%" aria-hidden="true" style={{ overflow: 'visible' }}>
      <GrowPath d="M 100 220 C 94 150, 106 90, 100 44" width={4} delay={0.1} />
      {[170, 130, 90].map((cy, i) => (
        <UnfurlLeaf key={i} delay={0.4 + i * 0.16} origin="50% 100%">
          <path d={leafPath(100, cy, 46, i % 2 ? 58 : -58)} fill={FOREST} opacity={0.85} />
        </UnfurlLeaf>
      ))}
      <UnfurlLeaf delay={1.1} origin="50% 100%">
        {[0, 1, 2, 3, 4, 5].map((p) => {
          const a = (p / 6) * Math.PI * 2
          return (
            <ellipse
              key={p}
              cx={100 + Math.cos(a) * 16}
              cy={40 + Math.sin(a) * 16}
              rx={11} ry={6}
              fill={accent}
              opacity={0.92}
              transform={`rotate(${(a * 180) / Math.PI} ${100 + Math.cos(a) * 16} ${40 + Math.sin(a) * 16})`}
            />
          )
        })}
        <circle cx="100" cy="40" r="9" fill={FOREST} />
      </UnfurlLeaf>
    </svg>
  )
}

// ── Small arrow glyph for links ──────────────────────────
function ArrowGlyph({ external = false }) {
  if (external) {
    return (
      <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M4 10L10 4M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Specimen card ────────────────────────────────────────
function SpecimenCard({ app, index }) {
  const Demo = DEMOS[app.id]
  const linkProps = app.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <motion.article
      initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={prefersReduced ? undefined : { y: -8, rotate: index % 2 ? 0.6 : -0.6 }}
      className="bot-card"
      style={{
        position: 'relative',
        background: '#f3ecdd',
        border: `1.5px solid ${FOREST}`,
        borderRadius: 6,
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `7px 9px 0 ${PAPER_DEEP}, 0 1px 0 rgba(255,255,255,0.6) inset`,
        overflow: 'hidden',
      }}
    >
      {/* herbarium top label strip with real specimen icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '10px 16px',
          borderBottom: `1px dashed ${FOREST_SOFT}`,
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: FOREST_SOFT,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <img
            src={app.icon}
            alt={app.name + ' icon'}
            width={26}
            height={26}
            style={{ borderRadius: '22%', display: 'block', boxShadow: '0 1px 3px rgba(36,53,40,0.28)' }}
          />
          No. {String(index + 1).padStart(2, '0')}
        </span>
        <span>{FAMILY[app.id]}</span>
      </div>

      {/* illustration plate */}
      <div
        style={{
          position: 'relative',
          height: 200,
          margin: '14px 16px 0',
          borderRadius: 4,
          background:
            'radial-gradient(120% 90% at 50% 100%, #ece4d2 0%, #e3dac6 100%)',
          border: `1px solid ${PAPER_DEEP}`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '64%', height: '92%' }}>
          <SpecimenPlant index={index} accent={app.accent} />
        </div>
        {/* "living specimen" marker, CSS only */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 9,
            right: 11,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: FOREST_SOFT,
            opacity: 0.7,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: app.accent,
              boxShadow: `0 0 0 2px ${app.accent}33`,
            }}
          />
          Living
        </span>
      </div>

      <div style={{ padding: '16px 18px 22px' }}>
        <h3
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: 26,
            lineHeight: 1.05,
            color: FOREST,
            margin: '0 0 2px',
          }}
        >
          {app.name}
        </h3>
        <p
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: 'italic',
            fontSize: 14.5,
            color: TERRA,
            margin: '0 0 12px',
          }}
        >
          {LATIN[app.id]}, “{app.tagline}”
        </p>

        <p
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: 14.5,
            lineHeight: 1.6,
            color: INK,
            margin: '0 0 16px',
            opacity: 0.9,
          }}
        >
          {app.blurb}
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
          {app.bullets.map((b) => (
            <li
              key={b}
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: 13.5,
                color: INK,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '4px 0',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginTop: 3, flexShrink: 0 }} aria-hidden="true">
                <path d={leafPath(7, 13, 11, 0)} fill={FOREST_SOFT} />
              </svg>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* live specimen, pressed under glass */}
        {Demo && (
          <div
            style={{
              position: 'relative',
              margin: '0 0 18px',
              padding: '12px 12px 14px',
              borderRadius: 5,
              background: 'rgba(232,224,207,0.5)',
              border: `1px solid ${PAPER_DEEP}`,
              boxShadow: '0 1px 0 rgba(255,255,255,0.55) inset',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: FOREST_SOFT,
                margin: '0 0 9px',
              }}
            >
              Specimen under glass · try it
            </span>
            <Demo tone="light" />
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 18px' }}>
          <a
            href={app.site}
            {...linkProps}
            className="bot-dl"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              fontSize: 13.5,
              letterSpacing: '0.04em',
              color: PAPER,
              background: FOREST,
              border: `1.5px solid ${FOREST}`,
              borderRadius: 999,
              padding: '10px 20px',
              textDecoration: 'none',
              transition: 'background .25s, color .25s, transform .2s',
              cursor: 'pointer',
            }}
          >
            Download specimen
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 1v9M3 6l4 4 4-4M2 13h10" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href={app.site}
            {...linkProps}
            className="bot-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              fontSize: 13.5,
              letterSpacing: '0.02em',
              color: FOREST,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            See the full demo
            <ArrowGlyph external={app.external} />
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// ── Main component ───────────────────────────────────────
export default function Variant18() {
  const rootRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroFernY = useTransform(scrollYProgress, [0, 0.3], [0, -40])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Nunito+Sans:wght@400;600;700&display=swap'
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: PAPER,
        color: INK,
        overflowX: 'hidden',
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes botSway {
          0%, 100% { transform: rotate(-1.4deg); }
          50% { transform: rotate(1.4deg); }
        }
        .bot-sway { transform-origin: 50% 100%; animation: botSway 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bot-sway { animation: none; }
        }
        .bot-card:hover .bot-dl { background: ${TERRA}; border-color: ${TERRA}; color: ${INK}; }
        .bot-dl:hover { transform: translateY(-2px); }
        .bot-link { position: relative; }
        .bot-link::after {
          content: ''; position: absolute; left: 0; bottom: -2px; height: 1.5px; width: 100%;
          background: ${TERRA}; transform: scaleX(0); transform-origin: left; transition: transform .3s ease;
        }
        .bot-link:hover::after { transform: scaleX(1); }
        .bot-link:focus-visible::after { transform: scaleX(1); }
        .bot-dl:focus-visible, .bot-link:focus-visible {
          outline: 2px solid ${TERRA}; outline-offset: 3px; border-radius: 6px;
        }
        a { cursor: pointer; }
        .bot-grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.5;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
        }
        .bot-wrap { max-width: 1180px; margin: 0 auto; padding: 0 22px; }
        .bot-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
        @media (min-width: 760px) { .bot-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1040px) { .bot-grid { grid-template-columns: repeat(3, 1fr); } }
        .bot-h1 { font-size: clamp(40px, 9vw, 92px); }
        .bot-sidefern { display: none; }
        @media (min-width: 900px) { .bot-sidefern { display: block; } }
      `}</style>

      {/* grain + paper texture */}
      <div className="bot-grain" aria-hidden="true" />

      {/* fixed corner herbarium tag — kept away from top-left */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 18,
          zIndex: 60,
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: FOREST,
          background: 'rgba(243,236,221,0.78)',
          border: `1px solid ${FOREST_SOFT}`,
          borderRadius: 4,
          padding: '5px 12px',
          backdropFilter: 'blur(4px)',
        }}
      >
        Herbarium · TalTools
      </div>

      {/* ── HERO ─────────────────────────────────── */}
      <header style={{ position: 'relative', paddingTop: 96, paddingBottom: 40 }}>
        {/* side ferns */}
        <motion.div
          className="bot-sidefern"
          style={{
            position: 'absolute',
            left: 0,
            bottom: -20,
            width: 150,
            height: 420,
            y: prefersReduced ? 0 : heroFernY,
          }}
        >
          <div className="bot-sway"><FernMotif /></div>
        </motion.div>
        <motion.div
          className="bot-sidefern"
          style={{
            position: 'absolute',
            right: 0,
            bottom: -20,
            width: 150,
            height: 420,
            y: prefersReduced ? 0 : heroFernY,
          }}
        >
          <div className="bot-sway"><FernMotif flip /></div>
        </motion.div>

        <div className="bot-wrap" style={{ position: 'relative', textAlign: 'center', maxWidth: 820 }}>
          <motion.p
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: 'italic',
              fontSize: 16,
              color: TERRA,
              letterSpacing: '0.04em',
              margin: '0 0 14px',
            }}
          >
            A small field-lab of three cultivated Mac specimens
          </motion.p>

          <motion.h1
            className="bot-h1"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              lineHeight: 0.98,
              color: FOREST,
              margin: '0 0 22px',
              letterSpacing: '-0.01em',
            }}
          >
            TalTools
            <span style={{ display: 'block', fontStyle: 'italic', fontWeight: 400, fontSize: '0.42em', color: INK, marginTop: 8 }}>
              menu-bar apps, grown slowly &amp; by hand
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: INK,
              opacity: 0.85,
              maxWidth: 560,
              margin: '0 auto 30px',
            }}
          >
            Three tiny, well-rooted utilities that live quietly in your menu bar,
            no accounts, no clutter, just careful little things that do one job beautifully.
          </motion.p>

          <motion.a
            href="#bot-specimens"
            className="bot-dl"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: PAPER,
              background: FOREST,
              border: `1.5px solid ${FOREST}`,
              borderRadius: 999,
              padding: '13px 28px',
              textDecoration: 'none',
            }}
          >
            View the collection
            <span aria-hidden="true">↓</span>
          </motion.a>
        </div>
      </header>

      <div className="bot-wrap" style={{ margin: '10px auto 50px' }}>
        <VineDivider />
      </div>

      {/* ── SPECIMENS ────────────────────────────── */}
      <section id="bot-specimens" className="bot-wrap" style={{ paddingBottom: 70 }}>
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 44 }}
        >
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: 12,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: FOREST_SOFT,
              margin: '0 0 10px',
            }}
          >
            The Collection · Plate I–III
          </p>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 'clamp(28px, 5vw, 46px)',
              color: FOREST,
              margin: 0,
            }}
          >
            Three pressed specimens
          </h2>
          <p
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: 'italic',
              fontSize: 16,
              color: TERRA,
              marginTop: 8,
            }}
          >
            collected &amp; catalogued for your menu bar
          </p>
        </motion.div>

        <div className="bot-grid">
          {APPS.map((app, i) => (
            <SpecimenCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </section>

      <div className="bot-wrap" style={{ margin: '0 auto 60px' }}>
        <VineDivider />
      </div>

      {/* ── PHILOSOPHY ───────────────────────────── */}
      <section className="bot-wrap" style={{ paddingBottom: 80 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 36,
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: 12,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: FOREST_SOFT,
                margin: '0 0 12px',
              }}
            >
              Field notes
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: 'clamp(26px, 4.5vw, 40px)',
                lineHeight: 1.12,
                color: FOREST,
                margin: '0 0 18px',
              }}
            >
              Software, tended like a garden.
            </h2>
            {[
              ['Native &amp; light', 'Each app is a tiny notarized macOS binary, no Electron, no background bloat. It sits in your menu bar and stays out of the way.'],
              ['Fully local', 'No accounts to grow, no data shipped off. What happens on your Mac stays on your Mac, tucked safely in the Keychain when needed.'],
              ['Made by one pair of hands', 'A small, slow lab. Things are planted with care, pruned often, and only released when they’re ready to thrive.'],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{ display: 'flex', gap: 14, padding: '12px 0', borderTop: `1px dashed ${PAPER_DEEP}` }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" style={{ marginTop: 2, flexShrink: 0 }} aria-hidden="true">
                  <path d={leafPath(11, 21, 18, 0)} fill={TERRA} />
                </svg>
                <div>
                  <h3
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: INK, margin: '0 0 3px' }}
                    dangerouslySetInnerHTML={{ __html: t }}
                  />
                  <p
                    style={{ fontSize: 14.5, lineHeight: 1.6, color: INK, opacity: 0.82, margin: 0 }}
                    dangerouslySetInnerHTML={{ __html: d }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer
        style={{
          position: 'relative',
          background: FOREST,
          color: PAPER,
          padding: '64px 0 48px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{ position: 'absolute', left: -10, top: 0, width: 130, height: 360, opacity: 0.5 }}
          aria-hidden="true"
        >
          <div className="bot-sway"><FernMotif color="#9bc4a3" accent={TERRA} /></div>
        </div>
        <div
          style={{ position: 'absolute', right: -10, top: 0, width: 130, height: 360, opacity: 0.5 }}
          aria-hidden="true"
        >
          <div className="bot-sway"><FernMotif flip color="#9bc4a3" accent={TERRA} /></div>
        </div>

        <div className="bot-wrap" style={{ position: 'relative', textAlign: 'center', maxWidth: 640 }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 'clamp(28px, 5vw, 44px)',
              margin: '0 0 14px',
            }}
          >
            Take a cutting home.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.85, margin: '0 0 26px' }}>
            All three specimens are free to download and easy to keep alive. They ask
            for almost nothing and give back quietly, every day.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
            {APPS.map((app) => (
              <a
                key={app.id}
                href={app.site}
                {...(app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="bot-dl"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: FOREST,
                  background: PAPER,
                  border: `1.5px solid ${PAPER}`,
                  borderRadius: 999,
                  padding: '9px 20px 9px 9px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={app.icon}
                  alt={app.name + ' icon'}
                  width={24}
                  height={24}
                  style={{ borderRadius: '22%', display: 'block' }}
                />
                {app.name}
              </a>
            ))}
          </div>
          <p
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: 'italic',
              fontSize: 14,
              opacity: 0.7,
              margin: 0,
            }}
          >
            TalTools Herbarium · cultivated for macOS · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
