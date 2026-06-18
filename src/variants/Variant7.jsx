import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { APPS } from '../apps.js'

const DISPLAY = '"Orbitron", "Audiowide", system-ui, sans-serif'
const SANS = '"Rajdhani", "Inter", -apple-system, BlinkMacSystemFont, sans-serif'

const PINK = '#ff2a6d'
const CYAN = '#05d9e8'

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

/* ---------- Star field ---------- */
function Stars() {
  const stars = Array.from({ length: 70 }, (_, i) => {
    // deterministic pseudo-random placement
    const x = (i * 73.13) % 100
    const y = ((i * 41.7) % 55) // keep stars in upper sky region
    const size = (i % 3 === 0 ? 2.4 : 1.4)
    const delay = (i % 13) * 0.37
    const dur = 2.2 + (i % 5) * 0.6
    return { x, y, size, delay, dur, key: i }
  })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map((s) => (
        <span
          key={s.key}
          className="tt7-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ---------- Banded setting sun ---------- */
function Sun() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '38%',
        transform: 'translateX(-50%)',
        width: 'min(72vw, 460px)',
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        background:
          'linear-gradient(to bottom, #ffe45e 0%, #ff8e3c 38%, #ff2a6d 72%, #c2186a 100%)',
        boxShadow:
          '0 0 60px 20px rgba(255,142,60,0.55), 0 0 140px 60px rgba(255,42,109,0.35)',
        zIndex: 1,
        WebkitMaskImage:
          'repeating-linear-gradient(to bottom, #000 0 14px, transparent 14px 16px), linear-gradient(to bottom, #000 55%, transparent 92%)',
        WebkitMaskComposite: 'source-in',
        maskImage:
          'repeating-linear-gradient(to bottom, #000 0 14px, transparent 14px 16px), linear-gradient(to bottom, #000 55%, transparent 92%)',
        maskComposite: 'intersect',
      }}
    />
  )
}

/* ---------- Neon perspective grid floor ---------- */
function Grid({ reduced }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '62%',
        overflow: 'hidden',
        perspective: '320px',
        perspectiveOrigin: 'center top',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      {/* horizon glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: CYAN,
          boxShadow: `0 0 12px 2px ${CYAN}, 0 0 30px 6px ${hexToRgba(CYAN, 0.6)}`,
          zIndex: 3,
        }}
      />
      <div
        className={reduced ? '' : 'tt7-grid-anim'}
        style={{
          position: 'absolute',
          left: '-50%',
          right: '-50%',
          top: 0,
          height: '300%',
          transform: 'rotateX(78deg)',
          transformOrigin: 'center top',
          backgroundImage: `
            linear-gradient(${hexToRgba(PINK, 0.9)} 2px, transparent 2px),
            linear-gradient(90deg, ${hexToRgba(CYAN, 0.85)} 2px, transparent 2px)
          `,
          backgroundSize: '64px 64px',
          backgroundPosition: '0 0',
          filter: 'drop-shadow(0 0 4px rgba(255,42,109,0.6))',
        }}
      />
      {/* fade grid into horizon */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #1a0633 0%, transparent 28%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

/* ---------- App cassette card ---------- */
function Cassette({ app, reduced, index }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: reduced ? 0 : index * 0.12 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={reduced ? undefined : { y: -8 }}
      style={{
        position: 'relative',
        borderRadius: 18,
        padding: '1.6rem',
        background: 'linear-gradient(160deg, rgba(36,9,58,0.92), rgba(16,4,34,0.96))',
        border: `1.5px solid ${hexToRgba(app.accent, hover ? 0.95 : 0.55)}`,
        boxShadow: hover
          ? `0 0 26px ${hexToRgba(app.accent, 0.7)}, 0 0 60px ${hexToRgba(app.accent, 0.4)}, inset 0 0 30px ${hexToRgba(app.accent, 0.12)}`
          : `0 0 14px ${hexToRgba(app.accent, 0.35)}, inset 0 0 18px ${hexToRgba(app.accent, 0.08)}`,
        transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
        overflow: 'hidden',
      }}
    >
      {/* cassette top strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            fontSize: '1.8rem',
            lineHeight: 1,
            filter: `drop-shadow(0 0 8px ${hexToRgba(app.accent, 0.9)})`,
          }}
        >
          {app.emoji}
        </div>
        <h3
          style={{
            fontFamily: DISPLAY,
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            margin: 0,
            color: '#fff',
            textShadow: `0 0 10px ${hexToRgba(app.accent, 0.9)}, 0 0 22px ${hexToRgba(app.accent, 0.5)}`,
          }}
        >
          {app.name}
        </h3>
      </div>

      {/* reel-to-reel decoration */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1.2rem',
          marginBottom: '1rem',
          borderRadius: 10,
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${hexToRgba(app.accent, 0.3)}`,
        }}
      >
        {[0, 1].map((r) => (
          <span
            key={r}
            className={reduced ? '' : 'tt7-reel'}
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: `2px solid ${hexToRgba(app.accent, 0.8)}`,
              background:
                `radial-gradient(circle, transparent 30%, ${hexToRgba(app.accent, 0.25)} 32%, transparent 34%)`,
              boxShadow: `0 0 8px ${hexToRgba(app.accent, 0.6)}`,
              animationPlayState: hover && !reduced ? 'running' : undefined,
            }}
          />
        ))}
        <span
          style={{
            flex: 1,
            margin: '0 0.8rem',
            height: 6,
            borderRadius: 3,
            background: `repeating-linear-gradient(90deg, ${hexToRgba(app.accent, 0.5)} 0 6px, transparent 6px 12px)`,
          }}
        />
      </div>

      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: '0.95rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: app.accent,
          margin: '0 0 0.6rem',
          textShadow: `0 0 8px ${hexToRgba(app.accent, 0.6)}`,
        }}
      >
        {app.tagline}
      </p>
      <p
        style={{
          fontFamily: SANS,
          fontSize: '1rem',
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.78)',
          margin: '0 0 1.1rem',
        }}
      >
        {app.blurb}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.4rem' }}>
        {app.bullets.map((b) => (
          <li
            key={b}
            style={{
              fontFamily: SANS,
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.22rem 0',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                color: CYAN,
                textShadow: `0 0 8px ${CYAN}`,
                fontFamily: DISPLAY,
              }}
            >
              ▶
            </span>
            {b}
          </li>
        ))}
      </ul>

      <a
        href="#"
        style={{
          display: 'inline-block',
          width: '100%',
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: '0.95rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: '#fff',
          padding: '0.7rem 1rem',
          borderRadius: 10,
          border: `1.5px solid ${app.accent}`,
          background: hexToRgba(app.accent, hover ? 0.28 : 0.14),
          boxShadow: `0 0 14px ${hexToRgba(app.accent, hover ? 0.8 : 0.4)}, inset 0 0 12px ${hexToRgba(app.accent, 0.3)}`,
          textShadow: `0 0 8px ${hexToRgba(app.accent, 0.9)}`,
          transition: 'all 0.3s ease',
        }}
      >
        ▼ Download
      </a>
    </motion.div>
  )
}

export default function Variant7() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&display=swap'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        background: 'linear-gradient(to bottom, #1b0140 0%, #43006a 40%, #7a0f5b 70%, #1a0633 100%)',
        color: '#fff',
        fontFamily: SANS,
      }}
    >
      <style>{`
        @keyframes tt7-grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 64px; }
        }
        @keyframes tt7-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes tt7-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 24%, 55% { opacity: 0.55; }
        }
        @keyframes tt7-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes tt7-pulse {
          0%, 100% { box-shadow: 0 0 18px ${hexToRgba(PINK, 0.7)}, 0 0 40px ${hexToRgba(PINK, 0.4)}, inset 0 0 16px ${hexToRgba(CYAN, 0.3)}; }
          50% { box-shadow: 0 0 30px ${hexToRgba(PINK, 0.95)}, 0 0 70px ${hexToRgba(CYAN, 0.5)}, inset 0 0 22px ${hexToRgba(CYAN, 0.45)}; }
        }
        .tt7-grid-anim {
          animation: tt7-grid-scroll 1.6s linear infinite;
        }
        .tt7-star {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px #fff, 0 0 10px ${hexToRgba(CYAN, 0.8)};
          animation: tt7-twinkle 3s ease-in-out infinite;
        }
        .tt7-reel {
          display: inline-block;
          animation: tt7-spin 2.4s linear infinite;
          animation-play-state: paused;
        }
        .tt7-flicker {
          animation: tt7-flicker 4.5s infinite steps(1);
        }
        .tt7-cta {
          animation: tt7-pulse 2.6s ease-in-out infinite;
        }
        .tt7-scanlines::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 2px,
            rgba(0,0,0,0.18) 3px,
            rgba(0,0,0,0) 4px
          );
          mix-blend-mode: multiply;
        }
        @media (prefers-reduced-motion: reduce) {
          .tt7-grid-anim, .tt7-star, .tt7-reel, .tt7-flicker, .tt7-cta {
            animation: none !important;
          }
        }
      `}</style>

      {/* ===== Background scene (fixed behind content) ===== */}
      <div
        aria-hidden="true"
        className="tt7-scanlines"
        style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <Stars />
          <Sun />
          <Grid reduced={reduced} />
        </div>
      </div>

      {/* ===== Content ===== */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero */}
        <header
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '6rem 1.25rem 3rem',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={reduced ? '' : 'tt7-flicker'}
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(0.7rem, 2vw, 0.95rem)',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: CYAN,
              textShadow: `0 0 10px ${CYAN}, 0 0 22px ${hexToRgba(CYAN, 0.6)}`,
              marginBottom: '1.4rem',
            }}
          >
            est. 1984 · menu-bar lab
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: 'clamp(2.8rem, 12vw, 7rem)',
              lineHeight: 0.95,
              letterSpacing: '0.02em',
              margin: 0,
              textTransform: 'uppercase',
              background:
                'linear-gradient(180deg, #ffffff 0%, #cfd8ff 26%, #8aa0d8 48%, #4a5a8a 52%, #c0c8e8 60%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 14px ${hexToRgba(PINK, 0.7)}) drop-shadow(0 2px 0 ${hexToRgba(CYAN, 0.5)})`,
            }}
          >
            TalTools
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(1rem, 3.4vw, 1.4rem)',
              fontWeight: 600,
              maxWidth: 540,
              margin: '1.6rem auto 0',
              color: 'rgba(255,255,255,0.86)',
              textShadow: `0 0 14px ${hexToRgba(PINK, 0.4)}`,
            }}
          >
            Three tiny Mac menu-bar apps, tuned for the night drive. Pure neon,
            zero bloat.
          </motion.p>

          <motion.a
            href="#apps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className={reduced ? '' : 'tt7-cta'}
            style={{
              display: 'inline-block',
              marginTop: '2.4rem',
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: '#fff',
              padding: '0.95rem 2.4rem',
              borderRadius: 12,
              border: `2px solid ${PINK}`,
              background: `linear-gradient(120deg, ${hexToRgba(PINK, 0.25)}, ${hexToRgba(CYAN, 0.2)})`,
              textShadow: `0 0 10px ${hexToRgba(PINK, 0.9)}`,
            }}
          >
            Enter the Grid
          </motion.a>
        </header>

        {/* Apps */}
        <main
          id="apps"
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '2rem 1.25rem 4rem',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 'clamp(1.6rem, 6vw, 3rem)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 0.6rem',
              color: '#fff',
              textShadow: `0 0 14px ${hexToRgba(CYAN, 0.8)}, 0 0 30px ${hexToRgba(PINK, 0.5)}`,
            }}
          >
            The Collection
          </motion.h2>
          <p
            style={{
              textAlign: 'center',
              fontFamily: SANS,
              fontSize: '1.05rem',
              color: hexToRgba(CYAN, 0.85),
              margin: '0 0 3rem',
              letterSpacing: '0.04em',
            }}
          >
            Side A · Side B · Side C — load a cassette
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {APPS.map((app, i) => (
              <Cassette key={app.id} app={app} reduced={reduced} index={i} />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.25rem 3.5rem',
            borderTop: `1px solid ${hexToRgba(PINK, 0.3)}`,
          }}
        >
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: hexToRgba(PINK, 0.85),
              textShadow: `0 0 10px ${hexToRgba(PINK, 0.6)}`,
              margin: 0,
            }}
          >
            TalTools // riding the synthwave since &apos;84
          </p>
        </footer>
      </div>
    </div>
  )
}
