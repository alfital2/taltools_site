import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

const SANS =
  '"Nunito Sans", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'

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

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}
function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/* ---------- Glossy aqua button ---------- */
function GlossButton({ accent = '#3aa0ff', children, href = '#', small = false }) {
  const { r, g, b } = hexToRgb(accent)
  const light = `rgb(${Math.min(255, r + 70)}, ${Math.min(255, g + 70)}, ${Math.min(255, b + 70)})`
  const dark = `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`
  return (
    <motion.a
      href={href}
      whileHover={{ y: -1 }}
      whileTap={{ y: 1, scale: 0.985 }}
      className="aero-glossbtn"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        textDecoration: 'none',
        fontFamily: SANS,
        fontWeight: 800,
        letterSpacing: '0.01em',
        color: '#fff',
        textShadow: `0 1px 1px ${rgba(dark, 0.6)}`,
        fontSize: small ? 13 : 15,
        padding: small ? '9px 18px' : '13px 26px',
        borderRadius: 999,
        border: `1px solid ${rgba(dark, 0.7)}`,
        background: `linear-gradient(${light}, ${accent} 48%, ${dark})`,
        boxShadow: `0 6px 16px ${rgba(dark, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -8px 14px ${rgba(dark, 0.5)}`,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* top sheen */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 1,
          left: 3,
          right: 3,
          height: '46%',
          borderRadius: 999,
          background:
            'linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.18))',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.a>
  )
}

/* ---------- Rising bubble field ---------- */
function Bubbles({ reduced }) {
  const bubbles = useMemo(() => {
    const arr = []
    const n = 26
    for (let i = 0; i < n; i++) {
      const size = 14 + Math.random() * 70
      arr.push({
        id: i,
        size,
        left: Math.random() * 100,
        delay: -Math.random() * 18,
        dur: 14 + Math.random() * 16,
        drift: (Math.random() - 0.5) * 60,
        op: 0.22 + Math.random() * 0.4,
      })
    }
    return arr
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="aero-bubble"
          style={{
            position: 'absolute',
            bottom: -120,
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            opacity: b.op,
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 18%, rgba(180,225,255,0.18) 45%, rgba(120,180,230,0.05) 70%)',
            boxShadow:
              'inset 0 0 12px rgba(255,255,255,0.6), inset -6px -8px 14px rgba(80,140,200,0.25), 0 2px 8px rgba(60,120,180,0.18)',
            border: '1px solid rgba(255,255,255,0.45)',
            animation: reduced
              ? 'none'
              : `aero-rise ${b.dur}s linear ${b.delay}s infinite`,
            ['--aero-drift']: `${b.drift}px`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '14%',
              left: '20%',
              width: '34%',
              height: '24%',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0))',
            }}
          />
        </span>
      ))}
    </div>
  )
}

/* ---------- Soft bokeh dots ---------- */
function Bokeh() {
  const dots = useMemo(() => {
    const arr = []
    for (let i = 0; i < 14; i++) {
      arr.push({
        id: i,
        size: 60 + Math.random() * 180,
        top: Math.random() * 100,
        left: Math.random() * 100,
        op: 0.06 + Math.random() * 0.16,
      })
    }
    return arr
  }, [])
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {dots.map((d) => (
        <span
          key={d.id}
          style={{
            position: 'absolute',
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            opacity: d.op,
            background:
              'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.9), rgba(255,255,255,0))',
            filter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  )
}

/* ---------- Glossy water orb (pure CSS, no emoji) ---------- */
function Orb({ accent = '#3aa0ff', size = 96 }) {
  const { r, g, b } = hexToRgb(accent)
  const dark = `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`
  const light = `rgb(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)})`
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 30%, ${rgba(light, 0.95)} 0%, ${rgba(accent, 0.95)} 46%, ${rgba(dark, 0.95)} 78%)`,
        boxShadow: `0 10px 22px ${rgba(dark, 0.45)}, inset 0 -10px 18px ${rgba(dark, 0.6)}, inset 0 4px 10px rgba(255,255,255,0.55)`,
        border: `1px solid ${rgba(dark, 0.5)}`,
        flexShrink: 0,
      }}
    >
      {/* big top highlight */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '7%',
          left: '15%',
          width: '70%',
          height: '44%',
          borderRadius: '50%',
          background:
            'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.05))',
          filter: 'blur(0.5px)',
          pointerEvents: 'none',
        }}
      />
      {/* small specular dot */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '16%',
          right: '20%',
          width: '14%',
          height: '14%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0))',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

/* ---------- Real app icon set in a glossy water bubble ---------- */
function IconOrb({ app, size = 72 }) {
  const { r, g, b } = hexToRgb(app.accent)
  const dark = `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`
  const icon = Math.round(size * 0.64)
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 38% 28%, rgba(255,255,255,0.95), ${rgba(app.accent, 0.4)} 70%, ${rgba(dark, 0.55)})`,
        boxShadow: `0 10px 20px ${rgba(dark, 0.4)}, inset 0 -8px 16px ${rgba(dark, 0.45)}, inset 0 3px 9px rgba(255,255,255,0.7)`,
        border: '1px solid rgba(255,255,255,0.7)',
        flexShrink: 0,
      }}
    >
      <img
        src={app.icon}
        alt={app.name + ' icon'}
        width={icon}
        height={icon}
        style={{
          borderRadius: '22%',
          display: 'block',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 3px 8px rgba(20,60,90,0.35)',
        }}
      />
      {/* glassy top sheen over the bubble */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '6%',
          left: '12%',
          width: '76%',
          height: '40%',
          borderRadius: '50%',
          background:
            'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0))',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </div>
  )
}

/* ---------- App card (glossy aqua with reflection) ---------- */
function AppCard({ app, i, reduced }) {
  const [hover, setHover] = useState(false)
  const Demo = DEMOS[app.id]
  const { r, g, b } = hexToRgb(app.accent)
  const tint = rgba(app.accent, 0.14)
  const tintHover = rgba(app.accent, 0.24)
  const dark = `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`

  const Surface = ({ reflection }) => (
    <div
      style={{
        position: 'relative',
        borderRadius: 26,
        padding: 24,
        overflow: 'hidden',
        background: `linear-gradient(160deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62) 42%, ${
          hover ? tintHover : tint
        })`,
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: reflection
          ? 'none'
          : `0 18px 34px rgba(40,90,140,0.28), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -14px 26px ${rgba(dark, 0.12)}`,
        height: '100%',
      }}
    >
      {/* gloss sheen sweep */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '52%',
          background:
            'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.0))',
          borderRadius: '26px 26px 60% 60% / 26px 26px 30% 30%',
          pointerEvents: 'none',
        }}
      />
      {/* moving gleam */}
      {!reflection && (
        <span
          aria-hidden
          className={hover && !reduced ? 'aero-sheen-run' : ''}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '-60%',
            width: '45%',
            transform: 'skewX(-18deg)',
            background:
              'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))',
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconOrb app={app} size={72} />
          <div>
            <h3
              style={{
                margin: 0,
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 22,
                color: '#103a52',
                letterSpacing: '-0.01em',
              }}
            >
              {app.name}
            </h3>
            <p
              style={{
                margin: '3px 0 0',
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 13.5,
                color: rgba(dark, 0.95),
              }}
            >
              {app.tagline}
            </p>
          </div>
        </div>

        <p
          style={{
            margin: '16px 0 14px',
            fontFamily: SANS,
            fontSize: 14.5,
            lineHeight: 1.55,
            color: '#2a5066',
          }}
        >
          {app.blurb}
        </p>

        <ul
          style={{
            listStyle: 'none',
            margin: '0 0 18px',
            padding: 0,
            display: 'grid',
            gap: 8,
          }}
        >
          {app.bullets.map((bl) => (
            <li
              key={bl}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: SANS,
                fontSize: 13.5,
                fontWeight: 600,
                color: '#244a5e',
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: '#fff',
                  background: `radial-gradient(circle at 40% 30%, ${rgba(app.accent, 1)}, ${dark})`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                ✓
              </span>
              {bl}
            </li>
          ))}
        </ul>

        {/* live interactive demo (only on the real surface, not the mirror) */}
        {!reflection && Demo && (
          <div
            style={{
              margin: '0 0 18px',
              borderRadius: 18,
              padding: 12,
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.78), rgba(255,255,255,0.5))',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(40,90,140,0.16)',
            }}
          >
            <Demo tone="light" />
          </div>
        )}

        {!reflection && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <GlossButton accent={app.accent} small>
            Download
          </GlossButton>
          <a
            href={app.site}
            {...(app.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="aero-demolink"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 13,
              color: dark,
              cursor: 'pointer',
            }}
          >
            See the full demo
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke={app.accent}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        )}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: i * 0.1 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative' }}
    >
      <motion.div animate={{ y: hover ? -6 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
        <Surface />
      </motion.div>
      {/* mirror reflection */}
      <div
        aria-hidden
        style={{
          marginTop: 4,
          height: 90,
          transform: 'scaleY(-1)',
          opacity: hover ? 0.4 : 0.28,
          WebkitMaskImage: 'linear-gradient(rgba(0,0,0,0.7), transparent 70%)',
          maskImage: 'linear-gradient(rgba(0,0,0,0.7), transparent 70%)',
          overflow: 'hidden',
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}
      >
        <div style={{ filter: 'blur(0.5px)' }}>
          <Surface reflection />
        </div>
      </div>
    </motion.div>
  )
}

export default function Variant16() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const id = 'aero-font-link'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400..900&display=swap'
    document.head.appendChild(link)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        fontFamily: SANS,
        background:
          'linear-gradient(180deg, #7ec8e3 0%, #8fd2d9 38%, #b6e08f 78%, #a8e063 100%)',
      }}
    >
      <style>{`
        @keyframes aero-rise {
          0%   { transform: translate(0, 0) scale(0.9); }
          100% { transform: translate(var(--aero-drift, 0), -118vh) scale(1.05); }
        }
        @keyframes aero-sheen {
          0%   { left: -60%; }
          100% { left: 130%; }
        }
        .aero-sheen-run { animation: aero-sheen 0.9s ease-out forwards; }
        @keyframes aero-floaty {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        .aero-hero-orb { animation: aero-floaty 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .aero-bubble, .aero-hero-orb { animation: none !important; }
        }
        .aero-glossbtn:focus-visible {
          outline: 3px solid rgba(255,255,255,0.9);
          outline-offset: 2px;
        }
        .aero-demolink {
          transition: gap 0.18s ease, opacity 0.18s ease;
        }
        .aero-demolink:hover { opacity: 0.82; gap: 9px !important; }
        .aero-demolink:focus-visible {
          outline: 3px solid rgba(255,255,255,0.95);
          outline-offset: 3px;
          border-radius: 8px;
        }
      `}</style>

      <Bokeh />
      <Bubbles reduced={reduced} />

      {/* glossy water-line gradient at very bottom for depth */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          zIndex: 0,
          background:
            'linear-gradient(rgba(168,224,99,0) , rgba(120,200,90,0.35))',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0 20px 80px',
        }}
      >
        {/* ---------- Hero ---------- */}
        <header
          style={{
            paddingTop: 76,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="aero-hero-orb"
          >
            <Orb accent="#3aa0ff" size={104} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              marginTop: 22,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 16px',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 12.5,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#0d4a66',
              background:
                'linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.55))',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow:
                '0 4px 10px rgba(40,90,140,0.2), inset 0 1px 0 rgba(255,255,255,0.95)',
            }}
          >
            A tiny lab of Mac menu-bar apps
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              margin: '20px 0 0',
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 'clamp(40px, 8.5vw, 78px)',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              color: '#0c4868',
              textShadow:
                '0 1px 0 rgba(255,255,255,0.9), 0 3px 18px rgba(40,100,150,0.25)',
            }}
          >
            TalTools
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            style={{
              margin: '16px auto 0',
              maxWidth: 540,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 'clamp(16px, 2.6vw, 20px)',
              lineHeight: 1.5,
              color: '#13506e',
            }}
          >
            Three crisp, glossy little tools that live quietly in your menu bar
            and just make your Mac feel better.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            style={{
              marginTop: 28,
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <GlossButton accent="#33b5ff" href="#aero-apps">
              Explore the apps
            </GlossButton>
            <GlossButton accent="#5ec45a" href="#aero-apps">
              Download all
            </GlossButton>
          </motion.div>
        </header>

        {/* ---------- Apps ---------- */}
        <section id="aero-apps" style={{ marginTop: 72 }}>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center',
              margin: '0 0 8px',
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 'clamp(26px, 4.5vw, 38px)',
              color: '#0c4868',
              letterSpacing: '-0.02em',
              textShadow: '0 1px 0 rgba(255,255,255,0.85)',
            }}
          >
            The collection
          </motion.h2>
          <p
            style={{
              textAlign: 'center',
              margin: '0 auto 40px',
              maxWidth: 480,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 15,
              color: '#1d566f',
            }}
          >
            Each one is small, fast, and notarized. Pick a bubble.
          </p>

          <div
            style={{
              display: 'grid',
              gap: 26,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              alignItems: 'start',
            }}
          >
            {APPS.map((app, i) => (
              <AppCard key={app.id} app={app} i={i} reduced={reduced} />
            ))}
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer
          style={{
            marginTop: 80,
            textAlign: 'center',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 13.5,
            color: '#0e4a67',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '14px 26px',
              borderRadius: 18,
              background:
                'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.5))',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow:
                '0 6px 14px rgba(40,90,140,0.2), inset 0 1px 0 rgba(255,255,255,0.95)',
            }}
          >
            Made with sunshine and gloss. © {new Date().getFullYear()} TalTools.
          </div>
        </footer>
      </div>
    </div>
  )
}
