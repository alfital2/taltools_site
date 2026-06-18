import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { APPS } from '../apps.js'

const SERIF = '"Fraunces", "Times New Roman", serif'
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

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

function hexToRgba(hex, a) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/* ---------- Animated aurora blobs background ---------- */
function Aurora({ reduced }) {
  const blobs = [
    { c1: '#ffd6a5', c2: '#ffb703', top: '-10%', left: '-8%', size: 540, dur: 22, dx: 60, dy: 40 },
    { c1: '#c8b6ff', c2: '#7c5cff', top: '20%', left: '55%', size: 620, dur: 28, dx: -80, dy: 50 },
    { c1: '#a0f0e6', c2: '#2ec4b6', top: '55%', left: '5%', size: 580, dur: 25, dx: 70, dy: -60 },
    { c1: '#bde0fe', c2: '#5b8def', top: '70%', left: '60%', size: 500, dur: 30, dx: -50, dy: -40 },
  ]
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={reduced ? {} : { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.12, 1] }}
          transition={reduced ? {} : { duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            maxWidth: '85vw',
            maxHeight: '85vw',
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${b.c1}, ${b.c2})`,
            filter: 'blur(70px)',
            opacity: 0.55,
            mixBlendMode: 'multiply',
          }}
        />
      ))}
    </div>
  )
}

/* ---------- Glass app card with mouse-parallax tilt ---------- */
function AppCard({ app, index, reduced }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 18 })
  const sy = useSpring(my, { stiffness: 150, damping: 18 })
  const rotateX = useTransform(sy, [-0.5, 0.5], reduced ? [0, 0] : [8, -8])
  const rotateY = useTransform(sx, [-0.5, 0.5], reduced ? [0, 0] : [-8, 8])
  const [hover, setHover] = useState(false)

  function onMove(e) {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
    setHover(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          transition: 'box-shadow 300ms ease, border-color 300ms ease',
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: `1px solid ${hover ? hexToRgba(app.accent, 0.4) : 'rgba(255,255,255,0.7)'}`,
          borderRadius: 28,
          padding: '32px 28px',
          boxShadow: hover
            ? `0 30px 70px -20px ${hexToRgba(app.accent, 0.45)}, 0 0 0 1px rgba(255,255,255,0.4) inset`
            : '0 20px 50px -25px rgba(60, 50, 90, 0.35), 0 0 0 1px rgba(255,255,255,0.4) inset',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ transform: 'translateZ(40px)' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: 'grid',
              placeItems: 'center',
              fontSize: 32,
              background: `linear-gradient(140deg, ${hexToRgba(app.accent, 0.25)}, ${hexToRgba(app.accent, 0.08)})`,
              border: `1px solid ${hexToRgba(app.accent, 0.35)}`,
              boxShadow: `0 8px 24px -8px ${hexToRgba(app.accent, 0.5)}`,
            }}
          >
            <span role="img" aria-label={app.name}>
              {app.emoji}
            </span>
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 30,
              fontWeight: 600,
              margin: '20px 0 4px',
              color: '#2b2440',
              letterSpacing: '-0.01em',
            }}
          >
            {app.name}
          </h3>
          <p style={{ margin: 0, fontWeight: 600, color: app.accent, fontSize: 15 }}>{app.tagline}</p>
          <p style={{ margin: '14px 0 0', color: '#52496b', lineHeight: 1.6, fontSize: 15 }}>{app.blurb}</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'grid', gap: 10 }}>
            {app.bullets.map((b) => (
              <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#3f3658' }}>
                <span
                  style={{
                    flex: '0 0 auto',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: hexToRgba(app.accent, 0.18),
                    color: app.accent,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>

          <motion.a
            href="#"
            whileHover={reduced ? {} : { scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: 26,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '13px 22px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 15,
              color: '#fff',
              background: `linear-gradient(135deg, ${app.accent}, ${hexToRgba(app.accent, 0.78)})`,
              boxShadow: `0 12px 30px -10px ${hexToRgba(app.accent, 0.7)}`,
            }}
          >
            Download ↓
          </motion.a>
        </div>
      </motion.article>
    </motion.div>
  )
}

export default function Variant1() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const id = 'taltools-aurora-fonts'
    if (document.getElementById(id)) return
    const pre1 = document.createElement('link')
    pre1.rel = 'preconnect'
    pre1.href = 'https://fonts.googleapis.com'
    const pre2 = document.createElement('link')
    pre2.rel = 'preconnect'
    pre2.href = 'https://fonts.gstatic.com'
    pre2.crossOrigin = 'anonymous'
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap'
    document.head.append(pre1, pre2, link)
  }, [])

  function scrollTo(e, sel) {
    e.preventDefault()
    document.querySelector(sel)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div
      style={{
        fontFamily: SANS,
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        color: '#2b2440',
        background:
          'linear-gradient(180deg, #fbf7ff 0%, #f3f0ff 35%, #eef7f6 70%, #fff7ef 100%)',
      }}
    >
      <style>{`
        @keyframes auroraSheen {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        html { scroll-behavior: smooth; }
        .tt-grad-text {
          background: linear-gradient(110deg, #ffb703, #7c5cff 45%, #2ec4b6);
          background-size: 220% 220%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: auroraSheen 9s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tt-grad-text { animation: none; }
          html { scroll-behavior: auto; }
        }
        .tt-cards {
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 720px) {
          .tt-cards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1040px) {
          .tt-cards { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <Aurora reduced={reduced} />

      {/* Floating glass navbar */}
      <header
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          width: 'min(940px, calc(100% - 100px))',
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '12px 18px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 14px 40px -22px rgba(60,50,90,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #ffb703, #7c5cff)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15,
                boxShadow: '0 6px 16px -6px rgba(124,92,255,0.7)',
              }}
            >
              T
            </span>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 19, letterSpacing: '-0.01em' }}>
              TalTools
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <a
              href="#apps"
              onClick={(e) => scrollTo(e, '#apps')}
              style={{
                textDecoration: 'none',
                color: '#4a4166',
                fontWeight: 600,
                fontSize: 14,
                padding: '8px 12px',
                borderRadius: 10,
              }}
            >
              The Lab
            </a>
            <a
              href="#apps"
              onClick={(e) => scrollTo(e, '#apps')}
              style={{
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                padding: '9px 16px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7c5cff, #2ec4b6)',
                boxShadow: '0 10px 24px -10px rgba(124,92,255,0.7)',
              }}
            >
              Get the apps
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <section
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '160px 24px 90px',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.8)',
              fontSize: 13,
              fontWeight: 600,
              color: '#5a4f7a',
              boxShadow: '0 10px 30px -18px rgba(60,50,90,0.5)',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ec4b6' }} />
            A tiny lab of Mac menu-bar apps
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 'clamp(40px, 8vw, 84px)',
              lineHeight: 1.04,
              letterSpacing: '-0.025em',
              margin: '26px auto 0',
              maxWidth: 12 + 'ch',
              maxInlineSize: '15ch',
            }}
          >
            Small apps,
            <br />
            <span className="tt-grad-text">quietly delightful.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: '24px auto 0',
              maxWidth: 560,
              fontSize: 'clamp(16px, 2.2vw, 19px)',
              lineHeight: 1.6,
              color: '#564c75',
            }}
          >
            Three focused tools that live in your menu bar, do one thing beautifully, and stay out of
            your way. Native, private, and feather-light.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: 34, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.a
              href="#apps"
              onClick={(e) => scrollTo(e, '#apps')}
              whileHover={reduced ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 16,
                padding: '15px 28px',
                borderRadius: 16,
                color: '#fff',
                background: 'linear-gradient(135deg, #ffb703, #7c5cff 60%, #2ec4b6)',
                boxShadow: '0 18px 40px -14px rgba(124,92,255,0.65)',
              }}
            >
              Explore the lab
            </motion.a>
            <motion.a
              href="#apps"
              onClick={(e) => scrollTo(e, '#apps')}
              whileHover={reduced ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 16,
                padding: '15px 28px',
                borderRadius: 16,
                color: '#3f3658',
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 12px 30px -18px rgba(60,50,90,0.5)',
              }}
            >
              Why menu-bar?
            </motion.a>
          </motion.div>
        </section>

        {/* App cards */}
        <section id="apps" style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 24px 40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 44 }}
          >
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 'clamp(30px, 5vw, 48px)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              The collection
            </h2>
            <p style={{ color: '#564c75', margin: '12px auto 0', maxWidth: 460, fontSize: 16 }}>
              Each one is free to try, notarized, and designed to disappear into your day.
            </p>
          </motion.div>

          <div className="tt-cards">
            {APPS.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} reduced={reduced} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ position: 'relative', zIndex: 1, padding: '60px 24px 50px', textAlign: 'center' }}>
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              padding: '34px 28px',
              borderRadius: 26,
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 20px 50px -28px rgba(60,50,90,0.45)',
            }}
          >
            <p style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, margin: 0, color: '#2b2440' }}>
              Made with care for macOS.
            </p>
            <p style={{ color: '#6a6088', fontSize: 14, margin: '10px 0 0' }}>
              © {new Date().getFullYear()} TalTools — Natcho · FlicKey · Tally
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
