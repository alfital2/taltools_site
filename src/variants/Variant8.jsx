import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { APPS } from '../apps.js'

const FONT = "'Quicksand', system-ui, -apple-system, sans-serif"

// Vivid goo palette
const PALETTE = ['#ff006e', '#8338ec', '#3a86ff']

// A handful of organic blob border-radius shapes to morph between.
const BLOB_SHAPES = [
  '42% 58% 63% 37% / 41% 44% 56% 59%',
  '63% 37% 38% 62% / 49% 60% 40% 51%',
  '38% 62% 57% 43% / 60% 38% 62% 40%',
  '55% 45% 36% 64% / 38% 63% 37% 62%',
]

// Free-drifting background blobs (lava lamp).
const DRIFT_BLOBS = [
  { size: 280, color: '#ff006e', top: '12%', left: '8%', dur: 17, delay: 0 },
  { size: 340, color: '#8338ec', top: '55%', left: '70%', dur: 21, delay: -4 },
  { size: 220, color: '#3a86ff', top: '70%', left: '18%', dur: 19, delay: -8 },
  { size: 260, color: '#ff006e', top: '5%', left: '62%', dur: 23, delay: -2 },
  { size: 180, color: '#3a86ff', top: '38%', left: '40%', dur: 15, delay: -6 },
]

export default function Variant8() {
  const reduce = useReducedMotion()
  const [coarse, setCoarse] = useState(false)

  // Cursor-following blob position (raw motion values + springs for smooth lag).
  const mx = useMotionValue(-9999)
  const my = useMotionValue(-9999)
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.6 })

  // Load Google Font self-contained.
  useEffect(() => {
    const id = 'tt-v8-font'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap'
    document.head.appendChild(link)
  }, [])

  // Detect touch / coarse pointer so the cursor blob degrades gracefully.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(pointer: coarse)')
    const apply = () => setCoarse(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // Mouse tracking for the follower blob, with proper cleanup.
  useEffect(() => {
    if (coarse) return
    const onMove = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [coarse, mx, my])

  return (
    <div
      style={{
        fontFamily: FONT,
        background:
          'radial-gradient(120% 120% at 20% 10%, #1a0033 0%, #0a0118 55%, #04010d 100%)',
        color: '#fff',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* The classic SVG goo filter — unique id so it won't collide. */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <defs>
          <filter id="tt-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes ttDrift {
          0%   { transform: translate(0,0) scale(1); }
          25%  { transform: translate(40px,-30px) scale(1.08); }
          50%  { transform: translate(-25px,35px) scale(0.94); }
          75%  { transform: translate(30px,20px) scale(1.05); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ttMorph {
          0%,100% { border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; }
          25%     { border-radius: 63% 37% 38% 62% / 49% 60% 40% 51%; }
          50%     { border-radius: 38% 62% 57% 43% / 60% 38% 62% 40%; }
          75%     { border-radius: 55% 45% 36% 64% / 38% 63% 37% 62%; }
        }
        @keyframes ttPulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.12); }
        }
        .tt-card-blob { animation: ttMorph 12s ease-in-out infinite; }
        .tt-card:hover .tt-card-blob { animation-duration: 4s; }
        @media (prefers-reduced-motion: reduce) {
          .tt-drift, .tt-card-blob, .tt-cursor-core { animation: none !important; }
          .tt-card:hover .tt-card-blob { animation: none !important; }
        }
      `}</style>

      {/* ===== Goo background layer (lava lamp + cursor follower) ===== */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          filter: 'url(#tt-goo)',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        {DRIFT_BLOBS.map((b, i) => (
          <div
            key={i}
            className="tt-drift"
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              width: b.size,
              height: b.size,
              maxWidth: '60vw',
              maxHeight: '60vw',
              borderRadius: '50%',
              background: b.color,
              animation: reduce
                ? 'none'
                : `ttDrift ${b.dur}s ease-in-out ${b.delay}s infinite`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Cursor-following blob merges with the drifters via the goo filter. */}
        {!coarse && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              x: sx,
              y: sy,
              width: 150,
              height: 150,
              marginLeft: -75,
              marginTop: -75,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 35%, #ff4d9d, #8338ec)',
              willChange: 'transform',
            }}
          >
            <div
              className="tt-cursor-core"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'inherit',
                animation: reduce ? 'none' : 'ttPulse 3s ease-in-out infinite',
              }}
            />
          </motion.div>
        )}
      </div>

      {/* ===== Content ===== */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <header
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '120px 24px 60px',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              marginBottom: 28,
            }}
          >
            A tiny lab of Mac menu-bar apps
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            style={{
              fontWeight: 700,
              lineHeight: 1.02,
              margin: '0 0 22px',
              fontSize: 'clamp(48px, 12vw, 120px)',
              background:
                'linear-gradient(95deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            TalTools
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            style={{
              maxWidth: 560,
              margin: '0 auto 36px',
              fontSize: 'clamp(17px, 2.4vw, 21px)',
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.78)',
              fontWeight: 500,
            }}
          >
            Three small, fast, native apps that melt into your menu bar and quietly
            make your Mac nicer to live in.
          </motion.p>

          <motion.a
            href="#apps"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 17,
              color: '#fff',
              textDecoration: 'none',
              background:
                'linear-gradient(95deg, #ff006e, #8338ec 55%, #3a86ff)',
              boxShadow: '0 12px 40px rgba(131,56,236,0.5)',
            }}
          >
            Meet the blobs ↓
          </motion.a>
        </header>

        {/* Apps revealed inside liquid blob shapes */}
        <section
          id="apps"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '40px 24px 120px',
            display: 'grid',
            gap: 48,
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          }}
        >
          {APPS.map((app, i) => {
            const c = PALETTE[i % PALETTE.length]
            return (
              <motion.div
                key={app.id}
                className="tt-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                style={{ position: 'relative', isolation: 'isolate' }}
              >
                {/* The liquid blob body */}
                <div
                  className="tt-card-blob"
                  style={{
                    position: 'relative',
                    padding: 'clamp(32px, 5vw, 52px)',
                    borderRadius: BLOB_SHAPES[i % BLOB_SHAPES.length],
                    background: `linear-gradient(150deg, ${c}, ${PALETTE[(i + 1) % PALETTE.length]})`,
                    boxShadow: `0 24px 60px ${c}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
                    overflow: 'hidden',
                    minHeight: 360,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* glossy highlight */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '-30%',
                      left: '-10%',
                      width: '70%',
                      height: '70%',
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      fontSize: 54,
                      lineHeight: 1,
                      marginBottom: 18,
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))',
                    }}
                  >
                    {app.emoji}
                  </div>

                  <h3
                    style={{
                      margin: '0 0 4px',
                      fontSize: 30,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {app.name}
                  </h3>
                  <p
                    style={{
                      margin: '0 0 14px',
                      fontWeight: 600,
                      fontSize: 16,
                      color: 'rgba(255,255,255,0.92)',
                    }}
                  >
                    {app.tagline}
                  </p>
                  <p
                    style={{
                      margin: '0 0 18px',
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {app.blurb}
                  </p>

                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 24px',
                      display: 'grid',
                      gap: 8,
                    }}
                  >
                    {app.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.92)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            flex: '0 0 auto',
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.9)',
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    style={{
                      marginTop: 'auto',
                      alignSelf: 'flex-start',
                      padding: '12px 28px',
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: 15,
                      textDecoration: 'none',
                      color: c,
                      background: '#fff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    }}
                  >
                    Download {app.name}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </section>

        {/* Footer CTA */}
        <footer
          style={{
            textAlign: 'center',
            padding: '0 24px 120px',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(22px, 4vw, 34px)',
              fontWeight: 700,
              margin: '0 0 8px',
            }}
          >
            Made with too much CSS and a little goo.
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 14,
              margin: 0,
            }}
          >
            TalTools — one human, three menu-bar apps.
          </p>
        </footer>
      </div>
    </div>
  )
}
