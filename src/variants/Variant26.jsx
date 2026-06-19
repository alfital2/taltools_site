import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

// ---------------------------------------------------------------------------
// Variant 26 — "Daylight Glide"
// Variant10's cinematic, scroll-driven parallax journey transplanted into the
// bright, airy Cupertino-Light world of Variant22. Instead of gliding through a
// dark dusk/space sky, the viewer glides through a calm, sunlit landscape:
// soft clear-day blues fading to warm white, distant pastel clouds, gentle
// rolling ridges and drifting motes, each app revealed on a light, softly
// shadowed surface with refined Apple-style typography. Text stays dark and
// WCAG AA legible on the light backdrop.
// Imports only from react + framer-motion + shared data/demos.
// ---------------------------------------------------------------------------

const DISPLAY =
  '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif'
const TEXT =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

// Cupertino-Light ink + accessible muted grays (AA on the light sky).
const INK = '#1d1d1f'
const SUBTLE = '#5c5c63' // darkened for AA contrast on light surfaces
const HAIR = 'rgba(0,0,0,0.08)'
const BLUE = '#0a6cff' // Apple-style blue accent

// Daylight sky palette.
const SKY_TOP = '#cfe6ff' // clear-day blue
const SKY_MID = '#eaf3ff'
const SKY_WARM = '#fffaf2' // warm light at the horizon

const DEMO_BY_ID = {
  natcho: NatchoDemo,
  flickey: FlicKeyDemo,
  tally: TallyDemo,
}

// ---------- color helpers (from Cupertino-Light) ----------
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ]
}
function clamp8(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}
function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex)
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  return `rgb(${clamp8(r + (t - r) * p)}, ${clamp8(g + (t - g) * p)}, ${clamp8(
    b + (t - b) * p
  )})`
}
function rgba(hex, a) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
// darken an accent until it reads as legible text on a light surface (WCAG AA)
function readable(hex) {
  return shade(hex, -0.46)
}

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

// --- self-contained Google fonts (Cupertino-Light pairing) -----------------
function useDaylightFonts() {
  useEffect(() => {
    const id = 'dl-fonts'
    if (document.getElementById(id)) return
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
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap',
      },
    ]
    const nodes = links.map((attrs, i) => {
      const el = document.createElement('link')
      if (i === links.length - 1) el.id = id
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

// --- deterministic pseudo-random mote field --------------------------------
function makeMotes(count, seed) {
  const motes = []
  let s = seed
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < count; i++) {
    motes.push({
      x: rnd() * 100,
      y: rnd() * 100,
      size: rnd() * 3 + 1.2,
      delay: rnd() * 4,
      dur: rnd() * 3 + 3,
      op: rnd() * 0.4 + 0.25,
    })
  }
  return motes
}

const MOTES_FAR = makeMotes(60, 7)
const MOTES_NEAR = makeMotes(34, 99)

// small inline arrow (no external images)
function Arrow({ color }) {
  return (
    <svg
      className="dl-arrow"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path
        d="M3 8h9M8.5 3.5 13 8l-4.5 4.5"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Googly-eyes wordmark — the two "o"s of "Tools" become eyes whose pupils
// track the cursor (and blink). Degrades to plain centered pupils when the
// user prefers reduced motion.
function GooglyWordmark({ reduced }) {
  const pupils = useRef([])
  pupils.current = []
  const addPupil = (el) => {
    if (el && !pupils.current.includes(el)) pupils.current.push(el)
  }

  useEffect(() => {
    if (reduced) return
    const onMove = (e) => {
      for (const pupil of pupils.current) {
        const eye = pupil.parentElement
        if (!eye) continue
        const r = eye.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const ang = Math.atan2(dy, dx)
        const max = r.width * 0.17
        const off = Math.min(max, Math.hypot(dx, dy) * 0.4)
        pupil.style.transform = `translate(${Math.cos(ang) * off}px, ${
          Math.sin(ang) * off
        }px)`
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  const eye = (key) => (
    <span
      key={key}
      className={reduced ? 'dl-eye' : 'dl-eye dl-eye-blink'}
      aria-hidden
      style={{
        display: 'inline-block',
        width: '0.66em',
        height: '0.66em',
        borderRadius: '50%',
        background: '#fff',
        border: '0.05em solid currentColor',
        position: 'relative',
        verticalAlign: '-0.02em',
        margin: '0 0.005em',
      }}
    >
      <span
        ref={addPupil}
        style={{
          position: 'absolute',
          width: '0.3em',
          height: '0.3em',
          borderRadius: '50%',
          background: 'currentColor',
          left: '50%',
          top: '50%',
          marginLeft: '-0.15em',
          marginTop: '-0.15em',
          transition: 'transform 0.08s ease-out',
        }}
      />
    </span>
  )

  return (
    <span aria-hidden>
      Tal{'T'}
      {eye('o1')}
      {eye('o2')}
      {'ls'}
    </span>
  )
}

function Check({ color }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      aria-hidden
      style={{ flex: '0 0 auto' }}
    >
      <path
        d="M2.5 7.5 5.5 10.5 11.5 3.5"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ===========================================================================
// A single app "scene". Its own ref + useScroll drives a reveal envelope tied
// to where the scene sits in the page, just like Variant10's cinematic flow,
// but rendered on a light, softly shadowed Cupertino surface.
// ===========================================================================
function AppScene({ app, index, reduced }) {
  const left = index % 2 === 0
  const Demo = DEMO_BY_ID[app.id]
  const ac = app.accent
  const acText = readable(ac)
  const eyebrow =
    app.id === 'tally'
      ? 'Menu bar · Usage'
      : app.id === 'flickey'
      ? 'Menu bar · Typing'
      : 'Menu bar · Display'
  const linkProps = app.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <section
      className="dl-snap"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6vh 5vw',
      }}
      aria-labelledby={`dl-${app.id}-title`}
    >
      {/* Soft accent wash keyed to the app, kept faint for daylight calm */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(58vw 58vw at ${
            left ? '28%' : '72%'
          } 45%, ${rgba(ac, 0.12)}, transparent 62%)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 64, scale: 0.93 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ amount: 0.4, once: true }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
        style={{
          position: 'relative',
          width: 'min(1040px, 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(24px, 4vw, 56px)',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: left ? 'row' : 'row-reverse',
          willChange: 'transform, opacity',
        }}
      >
        {/* The emerging light scene card */}
        <div
          className="dl-card"
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            maxWidth: 500,
            borderRadius: 32,
            padding: 'clamp(24px, 3.4vw, 40px)',
            background: 'rgba(255,255,255,0.82)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: `0 1px 0 rgba(255,255,255,0.9) inset, 0 36px 80px -40px ${rgba(
              ac,
              0.4
            )}, 0 6px 22px rgba(20,20,40,0.06)`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
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
            <img
              src={app.icon}
              alt={app.name + ' icon'}
              width={62}
              height={62}
              style={{
                width: 62,
                height: 62,
                borderRadius: '22%',
                display: 'block',
                flex: '0 0 auto',
                boxShadow: '0 12px 28px -10px rgba(0,0,0,0.35)',
              }}
            />
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: DISPLAY,
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: acText,
                  background: rgba(ac, 0.13),
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                {eyebrow}
              </span>
              <div
                id={`dl-${app.id}-title`}
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 28,
                  color: INK,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  marginTop: 8,
                }}
              >
                {app.name}
              </div>
            </div>
          </div>

          <p
            style={{
              fontFamily: TEXT,
              fontSize: 'clamp(15px, 1.4vw, 17px)',
              lineHeight: 1.6,
              color: SUBTLE,
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
              gap: 11,
            }}
          >
            {app.bullets.map((b) => (
              <li
                key={b}
                style={{
                  fontFamily: TEXT,
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#3a3a3e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    flex: '0 0 auto',
                    display: 'inline-grid',
                    placeItems: 'center',
                    background: rgba(ac, 0.14),
                  }}
                >
                  <Check color={acText} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px 22px',
            }}
          >
            <a
              href={app.site}
              {...linkProps}
              className="dl-link dl-link-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                padding: '13px 24px',
                borderRadius: 999,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 15,
                color: '#fff',
                textDecoration: 'none',
                cursor: 'pointer',
                background: INK,
                boxShadow: '0 10px 26px -10px rgba(0,0,0,0.45)',
              }}
            >
              Get {app.name}
              <Arrow color="#fff" />
            </a>

            <a
              href={app.site}
              {...linkProps}
              className="dl-link dl-fulldemo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 15,
                color: acText,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              See the full demo
              <Arrow color={acText} />
            </a>
          </div>
        </div>

        {/* Big tagline + live interactive demo */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: left ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.4, once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1], delay: 0.08 }}
          style={{
            flex: '1 1 320px',
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontFamily: TEXT,
              fontSize: 13,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: SUBTLE,
              marginBottom: 14,
            }}
          >
            Scene {String(index + 1).padStart(2, '0')}
          </div>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 'clamp(32px, 5.6vw, 60px)',
              lineHeight: 1.04,
              letterSpacing: '-0.035em',
              margin: 0,
              color: INK,
            }}
          >
            {app.tagline}
          </h2>

          {Demo && (
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                marginTop: 'clamp(22px, 3vw, 30px)',
                borderRadius: 24,
                padding: 'clamp(16px, 2.4vw, 24px)',
                background: 'linear-gradient(165deg, #ffffff, #f4f4f7)',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: `0 30px 70px -34px ${rgba(
                  ac,
                  0.5
                )}, 0 6px 24px rgba(0,0,0,0.06)`,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: `radial-gradient(circle at 50% 0%, ${rgba(
                    ac,
                    0.16
                  )}, transparent 70%)`,
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Demo tone="light" />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

// ===========================================================================
// Root component
// ===========================================================================
export default function Variant26() {
  useDaylightFonts()
  const reduced = useReducedMotion()
  const scrollRef = useRef(null)

  // Scroll progress of our OWN dedicated scroll container (not the viewport, so
  // the scroll-snap is reliable and independent of body/html overflow quirks).
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  // Parallax layers driven by global scroll. Distance scaled by reduced flag.
  const D = reduced ? 0 : 1
  const motesFarY = useTransform(scrollYProgress, [0, 1], [0, -110 * D])
  const cloudsY = useTransform(scrollYProgress, [0, 1], [0, -340 * D])
  const hillsY = useTransform(scrollYProgress, [0, 1], [0, -500 * D])
  const hillsScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1, 1.3]
  )
  const foreY = useTransform(scrollYProgress, [0, 1], [0, -680 * D])

  // Warm horizon glow swells gently as you glide deeper into the daylight.
  const warmOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 1])

  // Hero copy fades as you begin to glide forward.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.08],
    reduced ? [0, 0] : [0, -70]
  )

  const year = new Date().getFullYear()

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: SKY_MID,
        color: INK,
        fontFamily: TEXT,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ---------------- Fixed background layers (the daylight world) ----- */}
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
        {/* Base clear-day gradient: blue up top fading to warm white below */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${SKY_TOP} 0%, ${SKY_MID} 46%, ${SKY_WARM} 100%)`,
          }}
        />

        {/* Warm light pooling at the horizon — swells as you travel */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: warmOpacity,
            background: `radial-gradient(120vw 70vh at 50% 100%, ${rgba(
              '#ffe6b8',
              0.7
            )}, ${rgba('#fff4e0', 0.35)} 45%, transparent 72%)`,
          }}
        />

        {/* Far motes — slowest, faint sunlit specks */}
        <motion.div
          style={{ position: 'absolute', inset: '-10% 0', y: motesFarY }}
        >
          {MOTES_FAR.map((s, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                borderRadius: 99,
                background: '#ffffff',
                opacity: s.op,
                boxShadow: '0 0 6px rgba(255,255,255,0.8)',
                animation: reduced
                  ? 'none'
                  : `dl-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </motion.div>

        {/* Distant soft clouds — pastel drifting bands */}
        <motion.div
          style={{ position: 'absolute', inset: '-15% -10%', y: cloudsY }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${i * 26 - 12}%`,
                top: `${10 + i * 18}%`,
                width: '56%',
                height: '34%',
                borderRadius: '50%',
                filter: 'blur(56px)',
                opacity: 0.65,
                background:
                  i % 2 === 0
                    ? 'radial-gradient(circle, rgba(255,255,255,0.95), transparent 70%)'
                    : `radial-gradient(circle, ${rgba(
                        '#bfe0ff',
                        0.8
                      )}, transparent 70%)`,
                animation: reduced
                  ? 'none'
                  : `dl-drift ${26 + i * 5}s ease-in-out ${i}s infinite alternate`,
              }}
            />
          ))}
        </motion.div>

        {/* Mid rolling ridge — soft daylight hill, SVG */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '58vh',
            y: hillsY,
            scale: hillsScale,
            transformOrigin: '50% 100%',
          }}
        >
          <svg
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMax slice"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M0,400 L0,270 C220,210 420,250 660,235 C900,220 1100,260 1440,225 L1440,400 Z"
              fill={rgba('#d6e8ff', 0.85)}
            />
          </svg>
        </motion.div>

        {/* Near foreground ridge — softest warm-white, fastest */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '40vh',
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
              d="M0,300 L0,170 C260,120 520,200 760,160 C1000,120 1240,200 1440,165 L1440,300 Z"
              fill={rgba('#fff6ea', 0.9)}
            />
          </svg>
        </motion.div>

        {/* Near motes drifting close to the camera */}
        <motion.div style={{ position: 'absolute', inset: '-10% 0', y: foreY }}>
          {MOTES_NEAR.map((s, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y * 0.6}%`,
                width: s.size + 1,
                height: s.size + 1,
                borderRadius: 99,
                background: '#ffffff',
                opacity: s.op * 0.8,
                boxShadow: '0 0 8px rgba(255,255,255,0.85)',
                animation: reduced
                  ? 'none'
                  : `dl-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* ---------------- Scroll progress bar (fixed, top, full width) ----- */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          zIndex: 9000,
          transformOrigin: '0% 50%',
          scaleX: progress,
          background: `linear-gradient(90deg, ${BLUE}, #59b4ff, #ffd27a)`,
        }}
      />

      {/* ---------------- Foreground content: OUR scroll container ----- */}
      <div
        ref={scrollRef}
        className="dl-scroller"
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        {/* HERO scene */}
        <section
          className="dl-snap"
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
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: TEXT,
                fontSize: 13.5,
                fontWeight: 600,
                color: SUBTLE,
                background: 'rgba(255,255,255,0.8)',
                border: `1px solid ${HAIR}`,
                padding: '7px 16px',
                borderRadius: 999,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${BLUE}, #59b4ff)`,
                }}
              />
              A lab of tiny Mac tools
            </span>
            <h1
              aria-label="TalTools"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 'clamp(46px, 10vw, 120px)',
                lineHeight: 0.98,
                letterSpacing: '-0.04em',
                margin: '26px auto 0',
                color: INK,
              }}
            >
              <GooglyWordmark reduced={reduced} />
            </h1>
            <p
              style={{
                fontFamily: TEXT,
                fontSize: 'clamp(16px, 2vw, 21px)',
                lineHeight: 1.6,
                maxWidth: 580,
                margin: '24px auto 0',
                color: SUBTLE,
              }}
            >
              Three small, sharp menu-bar apps. Scroll to glide through a calm,
              sunlit landscape and meet each one as it rises into view.
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
              fontFamily: TEXT,
              fontSize: 13,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: SUBTLE,
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
        <CtaScene reduced={reduced} year={year} />
      </div>

      {/* ---------------- Keyframes & shared CSS ---------------- */}
      <style>{`
        /* Free scrolling — magnetic scroll-snap was removed because it stuttered
           on mouse wheels (the discrete ticks fought the snap re-targeting). */
        .dl-snap { scroll-snap-align: none; }
        .dl-scroller { -webkit-overflow-scrolling: touch; }
        @keyframes dl-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50%      { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes dl-drift {
          0%   { transform: translateX(0) translateY(0); }
          100% { transform: translateX(36px) translateY(-26px); }
        }
        .dl-link { transition: transform 0.18s ease, box-shadow 0.18s ease, gap 0.2s ease; }
        .dl-link-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 32px -12px rgba(0,0,0,0.5); }
        .dl-fulldemo:hover { gap: 12px; }
        .dl-link:focus-visible,
        a:focus-visible {
          outline: 2.5px solid ${BLUE};
          outline-offset: 3px;
          border-radius: 8px;
        }
        .dl-arrow { transition: transform 0.2s ease; }
        .dl-link:hover .dl-arrow { transform: translateX(3px); }
        @keyframes dl-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          96%           { transform: scaleY(0.08); }
        }
        .dl-eye-blink { animation: dl-blink 4.5s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .dl-scroller { scroll-behavior: auto; }
          .dl-link { transition: none; }
          .dl-link:hover { transform: none; }
        }
      `}</style>
    </div>
  )
}

// ===========================================================================
// Final call-to-action scene
// ===========================================================================
function CtaScene({ reduced, year }) {
  return (
    <section
      className="dl-snap"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 6vw',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ amount: 0.4, once: true }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
        style={{ maxWidth: 740 }}
      >
        <div
          style={{
            fontFamily: TEXT,
            fontSize: 13,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: SUBTLE,
            marginBottom: 20,
          }}
        >
          End of the glide
        </div>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(34px, 6.4vw, 72px)',
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            margin: 0,
            color: INK,
          }}
        >
          Three tools.
          <br />
          One quiet menu bar.
        </h2>
        <p
          style={{
            fontFamily: TEXT,
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.6,
            margin: '22px auto 36px',
            maxWidth: 560,
            color: SUBTLE,
          }}
        >
          Native, local, and unobtrusive, built to disappear until you need them.
          No clutter, no accounts, minimal permissions. Pick one and bring a
          little calm to your Mac.
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
              href={app.site}
              {...(app.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="dl-link dl-link-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 11,
                padding: '12px 22px 12px 14px',
                borderRadius: 999,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                cursor: 'pointer',
                color: INK,
                background: 'rgba(255,255,255,0.85)',
                border: `1px solid ${rgba(app.accent, 0.5)}`,
                boxShadow: `0 18px 40px -22px ${rgba(app.accent, 0.7)}`,
              }}
            >
              <img
                src={app.icon}
                alt={app.name + ' icon'}
                width={30}
                height={30}
                style={{ borderRadius: '22%', display: 'block' }}
              />
              {app.name}
            </a>
          ))}
        </div>
        <div
          style={{
            marginTop: 56,
            fontFamily: TEXT,
            fontSize: 13.5,
            color: SUBTLE,
          }}
        >
          TalTools · Small Mac utilities, made with care · © {year}
        </div>
      </motion.div>
    </section>
  )
}
