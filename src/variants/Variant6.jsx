import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { APPS } from '../apps.js'

// ── Claymorphism "Toy" landing page for TalTools ──────────────────────────
// Soft, puffy, molded-plasticine aesthetic. Pastel candy palette, rounded
// fonts, squishy physical interactions. Self-contained, no external assets.

const FONT = "'Baloo 2', 'Quicksand', system-ui, -apple-system, sans-serif"

// Per-app candy themes (blob body + soft shadow tints)
const THEMES = {
  natcho: { body: '#ffe7b3', body2: '#ffd089', shadow: '#e89a1f', text: '#7a4d00' },
  flickey: { body: '#e4dbff', body2: '#cdbcff', shadow: '#7c5cff', text: '#3a2a7a' },
  tally: { body: '#cdf3ee', body2: '#a6eadf', shadow: '#2ec4b6', text: '#0d5a52' },
}

// Build the signature clay shadow: soft dark drop + light inner highlight +
// dark inner core. tone is the shadow hex.
function claySoft(tone) {
  return [
    `10px 14px 30px ${hexA(tone, 0.45)}`,
    `-6px -8px 22px rgba(255,255,255,0.9)`,
    `inset 4px 4px 10px rgba(255,255,255,0.85)`,
    `inset -6px -8px 16px ${hexA(tone, 0.32)}`,
  ].join(', ')
}
function clayPressed(tone) {
  return [
    `4px 6px 12px ${hexA(tone, 0.3)}`,
    `inset 6px 8px 16px ${hexA(tone, 0.4)}`,
    `inset -3px -4px 10px rgba(255,255,255,0.7)`,
  ].join(', ')
}

// hex (#rrggbb) -> rgba string with alpha
function hexA(hex, a) {
  const h = hex.replace('#', '').replace(/\s/g, '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

export default function Variant6() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Quicksand:wght@500;600;700&display=swap'
    document.head.appendChild(link)
    return () => {
      try {
        document.head.removeChild(link)
      } catch (e) {
        /* noop */
      }
    }
  }, [])

  return (
    <div
      style={{
        fontFamily: FONT,
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        color: '#5b4a63',
        background:
          'radial-gradient(120% 90% at 15% 0%, #ffe1ee 0%, #ffd6e8 22%, #ffeaf3 45%, #eaf4ff 70%, #e7fbef 100%)',
      }}
    >
      <ClayStyles />

      {/* floating squishy background blobs */}
      <BackgroundBlobs />

      <main
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(72px, 9vw, 120px) clamp(18px, 4vw, 40px) 64px',
        }}
      >
        <Hero />
        <AppGrid />
        <WhyClay />
        <CTA />
        <Footer />
      </main>
    </div>
  )
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  return (
    <section style={{ textAlign: 'center', marginBottom: 'clamp(56px, 8vw, 96px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 14 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          borderRadius: 999,
          background: 'linear-gradient(145deg,#ffffff,#ffe9f2)',
          boxShadow: claySoft('#ff9ec4'),
          fontWeight: 700,
          fontSize: 14,
          color: '#c43a78',
          letterSpacing: 0.3,
        }}
      >
        <span className="clay-wobble" style={{ fontSize: 18, display: 'inline-block' }}>
          🧸
        </span>
        a tiny lab of three squishy Mac apps
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 120, damping: 16 }}
        style={{
          fontWeight: 800,
          lineHeight: 1.02,
          margin: '26px auto 0',
          fontSize: 'clamp(46px, 9vw, 104px)',
          letterSpacing: -1,
          color: '#56344f',
          maxWidth: 920,
          textShadow: '0 3px 0 rgba(255,255,255,0.7), 0 8px 18px rgba(196,58,120,0.18)',
        }}
      >
        Tal
        <span style={{ color: '#ff5fa2' }}>Tools</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        style={{
          margin: '20px auto 0',
          maxWidth: 560,
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 600,
          fontSize: 'clamp(17px, 2.4vw, 21px)',
          lineHeight: 1.5,
          color: '#7c6479',
        }}
      >
        Three little menu-bar apps molded out of pure joy. Soft, fast, friendly,
        and just a click away from living in your Mac.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        style={{
          marginTop: 34,
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <ClayButton href="#apps" tone="#ff7eb3" bg="linear-gradient(145deg,#ff9ec9,#ff5fa2)" textColor="#fff">
          Meet the gang
        </ClayButton>
        <ClayButton href="#why" tone="#9fd3ff" bg="linear-gradient(145deg,#ffffff,#e6f3ff)" textColor="#3573a8">
          Why so soft?
        </ClayButton>
      </motion.div>
    </section>
  )
}

/* ───────────────────────── APP GRID ───────────────────────── */
function AppGrid() {
  return (
    <section id="apps" style={{ marginBottom: 'clamp(64px, 9vw, 110px)' }}>
      <SectionTitle emoji="🍬" title="Squeeze one of these" />
      <div
        style={{
          marginTop: 38,
          display: 'grid',
          gap: 'clamp(24px, 4vw, 40px)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {APPS.map((app, i) => (
          <AppCard key={app.id} app={app} index={i} />
        ))}
      </div>
    </section>
  )
}

function AppCard({ app, index }) {
  const theme = THEMES[app.id] || THEMES.natcho
  const tone = theme.shadow

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 120, damping: 14 }}
      whileHover={{ y: -10, rotate: index % 2 ? 0.8 : -0.8 }}
      style={{
        position: 'relative',
        padding: 'clamp(24px, 3.4vw, 34px)',
        borderRadius: 38,
        background: `linear-gradient(150deg, ${theme.body}, ${theme.body2})`,
        boxShadow: claySoft(tone),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* puffy emoji blob avatar that bobs */}
      <div
        className={`clay-bob clay-bob-${index % 3}`}
        style={{
          width: 92,
          height: 92,
          borderRadius: '42% 58% 56% 44% / 50% 44% 56% 50%',
          background: 'linear-gradient(150deg,#ffffff,' + hexA(tone, 0.18) + ')',
          boxShadow: claySoft(tone),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 46,
          marginBottom: 22,
        }}
      >
        <span style={{ filter: 'drop-shadow(0 3px 4px ' + hexA(tone, 0.4) + ')' }}>{app.emoji}</span>
      </div>

      <h3
        style={{
          fontWeight: 800,
          fontSize: 'clamp(26px, 3.2vw, 32px)',
          color: theme.text,
          margin: 0,
          letterSpacing: -0.4,
        }}
      >
        {app.name}
      </h3>
      <p
        style={{
          margin: '6px 0 0',
          fontWeight: 700,
          fontSize: 15,
          color: hexA(tone, 0.95),
          fontFamily: "'Quicksand', sans-serif",
        }}
      >
        {app.tagline}
      </p>

      <p
        style={{
          margin: '16px 0 0',
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          lineHeight: 1.55,
          color: '#6a5566',
        }}
      >
        {app.blurb}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'grid', gap: 10 }}>
        {app.bullets.map((b) => (
          <li
            key={b}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: theme.text,
            }}
          >
            <span
              aria-hidden
              style={{
                flex: '0 0 auto',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(150deg,#ffffff,' + theme.body2 + ')',
                boxShadow: `inset 2px 2px 4px rgba(255,255,255,0.9), inset -2px -2px 5px ${hexA(tone, 0.45)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: tone,
              }}
            >
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: 26 }}>
        <ClayButton
          href="#"
          tone={tone}
          full
          bg={`linear-gradient(150deg, ${hexA(tone, 0.95)}, ${tone})`}
          textColor="#fff"
        >
          ⬇ Download {app.name}
        </ClayButton>
      </div>
    </motion.article>
  )
}

/* ───────────────────────── WHY CLAY ───────────────────────── */
function WhyClay() {
  const items = [
    { e: '🪶', t: 'Featherweight', d: 'Each app is tiny, native, and notarized. No Electron bloat, just soft pure Swift.' },
    { e: '🔒', t: 'Zero snooping', d: 'Local-first by design. No accounts to invent, no data leaving your squishy machine.' },
    { e: '✨', t: 'Made with love', d: 'Hand-molded interactions and gentle details, because tools you touch daily should feel good.' },
  ]
  return (
    <section id="why" style={{ marginBottom: 'clamp(64px, 9vw, 110px)' }}>
      <SectionTitle emoji="💗" title="Why so soft?" />
      <div
        style={{
          marginTop: 38,
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        {items.map((it, i) => (
          <motion.div
            key={it.t}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 130, damping: 15 }}
            whileHover={{ y: -6 }}
            style={{
              padding: 28,
              borderRadius: 32,
              background: 'linear-gradient(150deg,#ffffff,#f3f7ff)',
              boxShadow: claySoft('#aeb9e8'),
            }}
          >
            <div
              className={`clay-bob clay-bob-${i % 3}`}
              style={{ fontSize: 40, marginBottom: 12, display: 'inline-block' }}
            >
              {it.e}
            </div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: 21, color: '#4f4567' }}>{it.t}</h4>
            <p
              style={{
                margin: '8px 0 0',
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 600,
                fontSize: 14.5,
                lineHeight: 1.55,
                color: '#6f6385',
              }}
            >
              {it.d}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── CTA ───────────────────────── */
function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      style={{
        position: 'relative',
        textAlign: 'center',
        padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 56px)',
        borderRadius: 48,
        background: 'linear-gradient(150deg,#fff0bb,#ffd6e8 55%,#c5e8ff)',
        boxShadow: claySoft('#f3a8c8'),
        overflow: 'hidden',
      }}
    >
      <div className="clay-bob clay-bob-1" style={{ fontSize: 54 }}>
        🎈
      </div>
      <h2
        style={{
          margin: '12px auto 0',
          fontWeight: 800,
          fontSize: 'clamp(30px, 5vw, 46px)',
          color: '#56344f',
          letterSpacing: -0.6,
          maxWidth: 620,
        }}
      >
        Three apps. One squishy lab.
      </h2>
      <p
        style={{
          margin: '14px auto 0',
          maxWidth: 460,
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 600,
          fontSize: 17,
          color: '#7c6479',
        }}
      >
        Free to try, gentle on your Mac, and very pleasant to poke.
      </p>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
        <ClayButton href="#apps" tone="#ff7eb3" bg="linear-gradient(145deg,#ff9ec9,#ff5fa2)" textColor="#fff">
          Grab them all ✨
        </ClayButton>
      </div>
    </motion.section>
  )
}

/* ───────────────────────── FOOTER ───────────────────────── */
function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        marginTop: 56,
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: '#9a89a4',
      }}
    >
      <span style={{ display: 'inline-block', marginBottom: 6 }} className="clay-wobble">
        🧸
      </span>
      <div>Molded by hand · TalTools · {new Date().getFullYear()}</div>
    </footer>
  )
}

/* ───────────────────────── SHARED BITS ───────────────────────── */
function SectionTitle({ emoji, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: 'spring', stiffness: 130, damping: 15 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: '46% 54% 52% 48% / 50% 46% 54% 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          background: 'linear-gradient(150deg,#ffffff,#ffe9f4)',
          boxShadow: claySoft('#ffb3d4'),
        }}
        className="clay-bob clay-bob-0"
      >
        {emoji}
      </span>
      <h2
        style={{
          margin: 0,
          fontWeight: 800,
          fontSize: 'clamp(28px, 4.4vw, 40px)',
          color: '#56344f',
          letterSpacing: -0.5,
        }}
      >
        {title}
      </h2>
    </motion.div>
  )
}

function ClayButton({ href, children, tone, bg, textColor, full }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.93, y: 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className="clay-btn"
      style={{
        '--clay-rest': claySoft(tone),
        '--clay-press': clayPressed(tone),
        display: full ? 'flex' : 'inline-flex',
        width: full ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '15px 28px',
        borderRadius: 999,
        background: bg,
        color: textColor,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 16,
        textDecoration: 'none',
        boxShadow: claySoft(tone),
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </motion.a>
  )
}

function BackgroundBlobs() {
  const blobs = [
    { c1: '#ffd6e8', c2: '#ffb3d4', size: 320, top: '6%', left: '-6%', dur: 13, cls: 0 },
    { c1: '#c5e8ff', c2: '#9fd3ff', size: 260, top: '38%', left: '82%', dur: 16, cls: 1 },
    { c1: '#d4f5d4', c2: '#a9e9b0', size: 300, top: '72%', left: '4%', dur: 18, cls: 2 },
    { c1: '#fff0bb', c2: '#ffe08a', size: 220, top: '14%', left: '70%', dur: 15, cls: 1 },
  ]
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {blobs.map((b, i) => (
        <span
          key={i}
          className={`clay-float clay-float-${b.cls}`}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: '46% 54% 58% 42% / 52% 44% 56% 48%',
            background: `linear-gradient(150deg, ${b.c1}, ${b.c2})`,
            boxShadow: `12px 16px 40px ${hexA(b.c2, 0.4)}, inset 6px 6px 14px rgba(255,255,255,0.7), inset -8px -10px 20px ${hexA(
              b.c2,
              0.4
            )}`,
            opacity: 0.55,
            animationDuration: `${b.dur}s`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  )
}

function ClayStyles() {
  return (
    <style>{`
      .clay-btn:active { box-shadow: var(--clay-press) !important; }

      @keyframes clayBob {
        0%,100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-7px) rotate(2deg); }
      }
      .clay-bob { animation: clayBob 4.2s ease-in-out infinite; }
      .clay-bob-0 { animation-delay: 0s; }
      .clay-bob-1 { animation-delay: 0.8s; animation-duration: 4.8s; }
      .clay-bob-2 { animation-delay: 1.6s; animation-duration: 5.4s; }

      @keyframes clayWobble {
        0%,100% { transform: rotate(-8deg); }
        50% { transform: rotate(8deg); }
      }
      .clay-wobble { animation: clayWobble 2.6s ease-in-out infinite; }

      @keyframes clayFloat0 {
        0%,100% { transform: translate(0,0) rotate(0deg); }
        50% { transform: translate(18px,26px) rotate(8deg); }
      }
      @keyframes clayFloat1 {
        0%,100% { transform: translate(0,0) rotate(0deg); }
        50% { transform: translate(-22px,20px) rotate(-9deg); }
      }
      @keyframes clayFloat2 {
        0%,100% { transform: translate(0,0) rotate(0deg); }
        50% { transform: translate(20px,-24px) rotate(7deg); }
      }
      .clay-float { animation: clayFloat0 14s ease-in-out infinite; }
      .clay-float-0 { animation-name: clayFloat0; }
      .clay-float-1 { animation-name: clayFloat1; }
      .clay-float-2 { animation-name: clayFloat2; }

      @media (prefers-reduced-motion: reduce) {
        .clay-bob, .clay-wobble, .clay-float { animation: none !important; }
      }
    `}</style>
  )
}
