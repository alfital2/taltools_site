import { useState, useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import { APPS } from '../apps.js'

// ---------------------------------------------------------------------------
// Variant 10 — "Cinematic Scroll"
// A scroll-driven depth journey. The viewer glides forward through layered
// parallax scenes against a deep dusk/space gradient. Each of the three apps
// emerges from the distance as its own scene, tied to its scroll range.
// Self-contained. Imports only from react + framer-motion.
// ---------------------------------------------------------------------------

const DISPLAY =
  "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const BODY =
  "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

// Deep dusk -> space palette.
const SPACE = '#0b1026'
const HORIZON = '#ff9e64'
const VIOLET = '#7c5cff'

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

// --- self-contained Google fonts -------------------------------------------
function useCinematicFonts() {
  useEffect(() => {
    const links = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600&display=swap',
      },
    ]
    const nodes = links.map((attrs) => {
      const el = document.createElement('link')
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'crossOrigin') el.crossOrigin = v
        else el.setAttribute(k, v)
      })
      document.head.appendChild(el)
      return el
    })
    return () => nodes.forEach((n) => n.remove())
  }, [])
}

// --- deterministic pseudo-random star field --------------------------------
function makeStars(count, seed) {
  const stars = []
  let s = seed
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rnd() * 100,
      y: rnd() * 100,
      size: rnd() * 2 + 0.6,
      delay: rnd() * 4,
      dur: rnd() * 3 + 2,
      op: rnd() * 0.6 + 0.3,
    })
  }
  return stars
}

const STARS_FAR = makeStars(120, 7)
const STARS_NEAR = makeStars(50, 99)

// ===========================================================================
// A single app "scene". Uses its own ref + useScroll for clean reveals tied
// to where this scene sits in the page.
// ===========================================================================
function AppScene({ app, index, reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Reveal envelope: emerges from distance, holds, drifts away.
  const D = reduced ? 0 : 1 // distance multiplier

  // Scale up from far away to full size, then slightly past.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    reduced ? [1, 1, 1, 1] : [0.65, 1, 1, 1.12]
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.5, 0.78, 1],
    [0, 1, 1, 1, 0]
  )
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [120 * D, 0, -120 * D]
  )
  const blur = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    reduced ? [0, 0, 0, 0] : [14, 0, 0, 14]
  )
  const filter = useTransform(blur, (b) => `blur(${b}px)`)

  // Big tagline arrives slightly before the card.
  const titleX = useTransform(
    scrollYProgress,
    [0.05, 0.4],
    reduced ? [0, 0] : [index % 2 === 0 ? -80 : 80, 0]
  )
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.32, 0.7, 0.92],
    [0, 1, 1, 0]
  )

  const left = index % 2 === 0

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '160vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 5vw',
      }}
    >
      {/* Atmospheric glow keyed to the app accent */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(60vw 60vw at ${
            left ? '30%' : '70%'
          } 45%, ${app.accent}26, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        style={{
          position: 'relative',
          width: 'min(1000px, 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(24px, 4vw, 56px)',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: left ? 'row' : 'row-reverse',
          opacity,
          y,
          scale,
          filter,
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* The emerging "device" / scene card */}
        <div
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            maxWidth: 480,
            borderRadius: 28,
            padding: 'clamp(22px, 3vw, 34px)',
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: `0 40px 120px -30px ${app.accent}55, 0 0 0 1px rgba(255,255,255,0.04) inset`,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: 16,
                display: 'grid',
                placeItems: 'center',
                fontSize: 32,
                background: `linear-gradient(145deg, ${app.accent}, ${app.accent}88)`,
                boxShadow: `0 12px 30px -8px ${app.accent}aa`,
              }}
            >
              {app.emoji}
            </div>
            <div>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 26,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {app.name}
              </div>
              <div
                style={{
                  fontFamily: BODY,
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: app.accent,
                  marginTop: 6,
                }}
              >
                Mac menu-bar app
              </div>
            </div>
          </div>

          <p
            style={{
              fontFamily: BODY,
              fontSize: 'clamp(15px, 1.4vw, 17px)',
              lineHeight: 1.6,
              color: 'rgba(233,238,255,0.86)',
              margin: '0 0 22px',
            }}
          >
            {app.blurb}
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 26px',
              display: 'grid',
              gap: 10,
            }}
          >
            {app.bullets.map((b) => (
              <li
                key={b}
                style={{
                  fontFamily: BODY,
                  fontSize: 14,
                  color: 'rgba(233,238,255,0.92)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    flex: '0 0 auto',
                    background: app.accent,
                    boxShadow: `0 0 10px ${app.accent}`,
                  }}
                />
                {b}
              </li>
            ))}
          </ul>

          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '13px 24px',
              borderRadius: 999,
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 15,
              color: '#0b1026',
              textDecoration: 'none',
              background: `linear-gradient(135deg, ${app.accent}, #fff)`,
              boxShadow: `0 16px 40px -12px ${app.accent}`,
            }}
          >
            Download {app.name}
            <span aria-hidden>↓</span>
          </a>
        </div>

        {/* Big cinematic tagline */}
        <motion.div
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            x: titleX,
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              fontFamily: BODY,
              fontSize: 13,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 14,
            }}
          >
            Scene {String(index + 1).padStart(2, '0')}
          </div>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 'clamp(34px, 6vw, 68px)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              margin: 0,
              color: '#fff',
              textShadow: `0 8px 50px ${app.accent}55`,
            }}
          >
            {app.tagline}
          </h2>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ===========================================================================
// Root component
// ===========================================================================
export default function Variant10() {
  useCinematicFonts()
  const reduced = useReducedMotion()
  const rootRef = useRef(null)

  // Page-level scroll progress (whole document).
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%'])

  // Parallax layers driven by global scroll. Distance scaled by reduced flag.
  const D = reduced ? 0 : 1
  const starsFarY = useTransform(scrollYProgress, [0, 1], [0, -120 * D])
  const cloudsY = useTransform(scrollYProgress, [0, 1], [0, -360 * D])
  const mountainsY = useTransform(scrollYProgress, [0, 1], [0, -520 * D])
  const mountainsScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1, 1.35]
  )
  const foreY = useTransform(scrollYProgress, [0, 1], [0, -700 * D])

  // Sky shifts from dusk warmth (top of journey) into deep space.
  const skyOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.15])

  // Hero copy fades as you begin to glide forward.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.08],
    reduced ? [0, 0] : [0, -80]
  )

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        width: '100%',
        overflowX: 'hidden',
        background: SPACE,
        color: '#fff',
        fontFamily: BODY,
      }}
    >
      {/* ---------------- Fixed background layers (the world) ------------- */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Base deep-space gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${SPACE} 0%, #131a3c 45%, #1c1633 75%, #2a1b3d 100%)`,
          }}
        />

        {/* Warm dusk horizon glow — fades into space as you travel */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: skyOpacity,
            background: `radial-gradient(120vw 70vh at 50% 100%, ${HORIZON}66, ${VIOLET}22 45%, transparent 70%)`,
          }}
        />

        {/* Far star field — slowest */}
        <motion.div
          style={{ position: 'absolute', inset: '-10% 0', y: starsFarY }}
        >
          {STARS_FAR.map((s, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                borderRadius: 99,
                background: '#fff',
                opacity: s.op,
                animation: reduced
                  ? 'none'
                  : `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </motion.div>

        {/* Mid clouds — soft drifting nebula bands */}
        <motion.div
          style={{ position: 'absolute', inset: '-15% -10%', y: cloudsY }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${i * 28 - 10}%`,
                top: `${20 + i * 22}%`,
                width: '55%',
                height: '38%',
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.5,
                background:
                  i % 2 === 0
                    ? `radial-gradient(circle, ${VIOLET}55, transparent 70%)`
                    : `radial-gradient(circle, ${HORIZON}44, transparent 70%)`,
                animation: reduced
                  ? 'none'
                  : `drift ${24 + i * 6}s ease-in-out ${i}s infinite alternate`,
              }}
            />
          ))}
        </motion.div>

        {/* Mid mountain / silhouette ridge — SVG */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '60vh',
            y: mountainsY,
            scale: mountainsScale,
            transformOrigin: '50% 100%',
          }}
        >
          <svg
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMax slice"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M0,400 L0,250 L160,180 L320,240 L480,140 L660,220 L820,120 L1000,210 L1180,150 L1340,230 L1440,190 L1440,400 Z"
              fill="#1a1336"
              opacity="0.9"
            />
          </svg>
        </motion.div>

        {/* Near foreground ridge — darkest, fastest */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '42vh',
            y: foreY,
            transformOrigin: '50% 100%',
          }}
        >
          <svg
            viewBox="0 0 1440 300"
            preserveAspectRatio="xMidYMax slice"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M0,300 L0,180 L220,120 L460,200 L720,90 L980,200 L1240,130 L1440,210 L1440,300 Z"
              fill="#0a0a1c"
            />
          </svg>
        </motion.div>

        {/* Near twinkles drifting close to the camera */}
        <motion.div
          style={{ position: 'absolute', inset: '-10% 0', y: foreY }}
        >
          {STARS_NEAR.map((s, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y * 0.6}%`,
                width: s.size + 1,
                height: s.size + 1,
                borderRadius: 99,
                background: '#fff',
                opacity: s.op * 0.7,
                animation: reduced
                  ? 'none'
                  : `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* ---------------- Scroll progress bar (fixed, top, full width) ---- */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          zIndex: 9000,
          transformOrigin: '0% 50%',
          width: progressWidth,
          background: `linear-gradient(90deg, ${HORIZON}, ${VIOLET}, #fff)`,
          boxShadow: `0 0 14px ${VIOLET}`,
        }}
      />

      {/* ---------------- Foreground content (scrolls over the world) ----- */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* HERO scene */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 6vw',
          }}
        >
          <motion.div style={{ opacity: heroOpacity, y: heroY }}>
            <div
              style={{
                fontFamily: BODY,
                fontSize: 13,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 24,
              }}
            >
              A lab of tiny Mac tools
            </div>
            <h1
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 'clamp(48px, 11vw, 140px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                margin: 0,
                background: `linear-gradient(180deg, #fff, ${HORIZON})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 20px 80px ${VIOLET}66`,
              }}
            >
              TalTools
            </h1>
            <p
              style={{
                fontFamily: BODY,
                fontSize: 'clamp(16px, 2vw, 21px)',
                lineHeight: 1.6,
                maxWidth: 560,
                margin: '26px auto 0',
                color: 'rgba(233,238,255,0.82)',
              }}
            >
              Three small, sharp menu-bar apps. Scroll to glide through the
              dusk and meet each one as it emerges from the distance.
            </p>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 'clamp(28px, 6vh, 64px)',
              left: '50%',
              x: '-50%',
              opacity: heroOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              fontFamily: BODY,
              fontSize: 13,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
            }}
            animate={reduced ? undefined : { y: [0, 10, 0] }}
            transition={
              reduced
                ? undefined
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <span>Scroll</span>
            <span style={{ fontSize: 20 }} aria-hidden>
              ↓
            </span>
          </motion.div>
        </section>

        {/* APP scenes */}
        {APPS.map((app, i) => (
          <AppScene key={app.id} app={app} index={i} reduced={reduced} />
        ))}

        {/* FINAL CTA scene */}
        <CtaScene reduced={reduced} />
      </div>

      {/* ---------------- Keyframes ---------------- */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1.25); }
        }
        @keyframes drift {
          0%   { transform: translateX(0) translateY(0); }
          100% { transform: translateX(40px) translateY(-30px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  )
}

// ===========================================================================
// Final call-to-action scene
// ===========================================================================
function CtaScene({ reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(
    scrollYProgress,
    [0, 0.6],
    reduced ? [1, 1] : [0.8, 1]
  )

  return (
    <section
      ref={ref}
      style={{
        minHeight: '110vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 6vw',
        textAlign: 'center',
      }}
    >
      <motion.div style={{ opacity, scale, maxWidth: 720 }}>
        <div
          style={{
            fontFamily: BODY,
            fontSize: 13,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 22,
          }}
        >
          End of the journey
        </div>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(36px, 7vw, 84px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            margin: 0,
            color: '#fff',
            textShadow: `0 16px 70px ${VIOLET}66`,
          }}
        >
          Three tools.
          <br />
          One quiet menu bar.
        </h2>
        <p
          style={{
            fontFamily: BODY,
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.6,
            margin: '24px auto 36px',
            color: 'rgba(233,238,255,0.82)',
          }}
        >
          Native, local, and unobtrusive — built to disappear until you need
          them. Pick one and bring a little calm to your Mac.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            justifyContent: 'center',
          }}
        >
          {APPS.map((app) => (
            <a
              key={app.id}
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 26px',
                borderRadius: 999,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                color: '#fff',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${app.accent}88`,
                boxShadow: `0 0 30px -10px ${app.accent}`,
              }}
            >
              <span aria-hidden>{app.emoji}</span>
              {app.name}
            </a>
          ))}
        </div>
        <div
          style={{
            marginTop: 64,
            fontFamily: BODY,
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          TalTools — crafted with care.
        </div>
      </motion.div>
    </section>
  )
}
