import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { APPS } from '../apps.js'

const DISPLAY = "'Archivo Black', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const YELLOW = '#ffde00'
const RED = '#ff4040'
const INK = '#1b1233'
const PAPER = '#fffdf5'

// ---- tactile chunky button -------------------------------------------------
function ChunkyButton({ children, href = '#', bg = INK, fg = PAPER, className = '', style = {} }) {
  const [pressed, setPressed] = useState(false)
  return (
    <a
      href={href}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className={`inline-block select-none uppercase tracking-tight ${className}`}
      style={{
        fontFamily: DISPLAY,
        background: bg,
        color: fg,
        border: `4px solid ${INK}`,
        padding: '0.7rem 1.4rem',
        textDecoration: 'none',
        transform: pressed ? 'translate(6px, 6px)' : 'translate(0,0)',
        boxShadow: pressed ? '0px 0px 0 #1b1233' : '8px 8px 0 #1b1233',
        transition: 'transform 80ms ease, box-shadow 80ms ease',
        ...style,
      }}
    >
      {children}
    </a>
  )
}

// ---- color-inverting sticker badge ----------------------------------------
function Sticker({ children, rotate = -8, bg = RED, top, left, right, bottom }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        transform: `rotate(${rotate}deg) scale(${hover ? 1.08 : 1})`,
        transition: 'transform 140ms ease, background 140ms ease, color 140ms ease',
        background: hover ? INK : bg,
        color: hover ? bg : INK,
        border: `4px solid ${INK}`,
        boxShadow: '6px 6px 0 #1b1233',
        padding: '0.4rem 0.9rem',
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        zIndex: 5,
      }}
    >
      {children}
    </div>
  )
}

// ---- one app block ---------------------------------------------------------
function AppBlock({ app, index }) {
  const [hover, setHover] = useState(false)
  const num = String(index + 1).padStart(2, '0')
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: hover ? INK : PAPER,
        color: hover ? PAPER : INK,
        border: `4px solid ${INK}`,
        boxShadow: hover ? '14px 14px 0 #1b1233' : '8px 8px 0 #1b1233',
        transition: 'background 160ms ease, color 160ms ease, box-shadow 160ms ease',
        padding: 'clamp(1.25rem, 3vw, 2.25rem)',
        overflow: 'hidden',
      }}
    >
      {/* giant ghost number */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-1.5rem',
          right: '-0.5rem',
          fontFamily: DISPLAY,
          fontSize: 'clamp(6rem, 16vw, 11rem)',
          lineHeight: 1,
          color: app.accent,
          opacity: hover ? 0.9 : 0.35,
          pointerEvents: 'none',
          transition: 'opacity 160ms ease',
        }}
      >
        {num}
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
            border: `4px solid ${hover ? PAPER : INK}`,
            background: app.accent,
            padding: '0.25rem 0.75rem',
            lineHeight: 1,
            boxShadow: '5px 5px 0 #1b1233',
          }}
        >
          {app.emoji}
        </div>

        <h3
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            margin: '1rem 0 0.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          {app.name}
        </h3>

        <p
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 'clamp(0.95rem, 2.4vw, 1.15rem)',
            background: hover ? app.accent : 'transparent',
            color: hover ? INK : app.accent,
            display: 'inline-block',
            padding: hover ? '0.1rem 0.4rem' : 0,
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {app.tagline}
        </p>

        <p
          style={{
            fontFamily: MONO,
            fontSize: '0.95rem',
            lineHeight: 1.5,
            maxWidth: '38ch',
            margin: '1rem 0 1.25rem',
          }}
        >
          {app.blurb}
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem' }}>
          {app.bullets.map((b) => (
            <li
              key={b}
              style={{
                fontFamily: MONO,
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.35rem 0',
                borderBottom: `2px dashed ${hover ? 'rgba(255,253,245,0.3)' : 'rgba(27,18,51,0.25)'}`,
              }}
            >
              <span
                style={{
                  background: app.accent,
                  color: INK,
                  border: `3px solid ${hover ? PAPER : INK}`,
                  width: '1.4rem',
                  height: '1.4rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.8rem',
                }}
              >
                ✓
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <ChunkyButton
          href="#"
          bg={app.accent}
          fg={INK}
          style={{ fontSize: '1.1rem' }}
        >
          Get it →
        </ChunkyButton>
      </div>
    </motion.article>
  )
}

// ---- marquee strip ---------------------------------------------------------
function Marquee({ reduce }) {
  const items = ['MENU-BAR APPS', '★', 'MADE FOR MAC', '★', 'ZERO BLOAT', '★', 'NOTARIZED', '★', 'NO ACCOUNTS', '★']
  const run = [...items, ...items, ...items]
  return (
    <div
      style={{
        background: INK,
        color: YELLOW,
        borderTop: `4px solid ${INK}`,
        borderBottom: `4px solid ${INK}`,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '0.75rem 0',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          animation: reduce ? 'none' : 'tt-marquee 22s linear infinite',
          fontFamily: DISPLAY,
          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        {run.map((t, i) => (
          <span key={i} style={{ padding: '0 1.25rem', color: t === '★' ? RED : YELLOW }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---- page ------------------------------------------------------------------
export default function Variant2() {
  const reduce = useReducedMotion()

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div
      style={{
        background: PAPER,
        color: INK,
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        fontFamily: MONO,
      }}
    >
      <style>{`
        @keyframes tt-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes tt-bob {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
        .tt-link:hover { background:${INK} !important; color:${YELLOW} !important; }
      `}</style>

      {/* top bar */}
      <header
        style={{
          borderBottom: `4px solid ${INK}`,
          background: YELLOW,
          padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 3rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
          }}
        >
          Tal<span style={{ color: RED }}>/</span>Tools
        </div>
        <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {APPS.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="tt-link"
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: INK,
                border: `3px solid ${INK}`,
                background: PAPER,
                padding: '0.3rem 0.7rem',
                fontSize: '0.8rem',
                transition: 'background 120ms ease, color 120ms ease',
              }}
            >
              {a.name}
            </a>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem) clamp(2rem, 6vw, 4rem)',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <Sticker rotate={-10} bg={RED} top="1rem" right="clamp(1rem,5vw,3rem)">
          3 apps · 1 lab
        </Sticker>

        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            right: 'clamp(0.5rem, 6vw, 5rem)',
            bottom: 'clamp(1rem, 4vw, 3rem)',
            fontSize: 'clamp(3rem, 12vw, 8rem)',
            animation: reduce ? 'none' : 'tt-bob 4s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          🌮
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div
            style={{
              display: 'inline-block',
              fontFamily: MONO,
              fontWeight: 700,
              textTransform: 'uppercase',
              background: INK,
              color: YELLOW,
              padding: '0.3rem 0.8rem',
              border: `4px solid ${INK}`,
              marginBottom: '1.25rem',
              boxShadow: `6px 6px 0 ${RED}`,
            }}
          >
            Tiny mac menu-bar apps
          </div>

          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2.75rem, 13vw, 9rem)',
              lineHeight: 0.86,
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              margin: '0 0 1.25rem',
              maxWidth: '14ch',
            }}
          >
            Small{' '}
            <span style={{ color: RED, WebkitTextStroke: `2px ${INK}` }}>apps.</span>
            <br />
            Loud{' '}
            <span
              style={{
                background: YELLOW,
                border: `4px solid ${INK}`,
                boxShadow: `8px 8px 0 ${INK}`,
                padding: '0 0.3rem',
                display: 'inline-block',
                transform: 'rotate(-2deg)',
              }}
            >
              impact.
            </span>
          </h1>

          <p
            style={{
              fontFamily: MONO,
              fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
              maxWidth: '46ch',
              lineHeight: 1.5,
              marginBottom: '2rem',
            }}
          >
            A one-person lab building sharp, no-nonsense utilities that live in your menu bar and stay out of your way.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <ChunkyButton href="#apps" bg={RED} fg={PAPER} style={{ fontSize: '1.2rem' }}>
              See the apps ▾
            </ChunkyButton>
            <ChunkyButton href="#apps" bg={PAPER} fg={INK} style={{ fontSize: '1.2rem' }}>
              ⌥ Why menu-bar?
            </ChunkyButton>
          </div>
        </motion.div>
      </section>

      <Marquee reduce={reduce} />

      {/* APPS GRID */}
      <section
        id="apps"
        style={{
          padding: 'clamp(2.5rem, 7vw, 5rem) clamp(1rem, 5vw, 3rem)',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div style={{ position: 'relative', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2.25rem, 9vw, 6rem)',
              textTransform: 'uppercase',
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            The lineup
          </h2>
          <Sticker rotate={6} bg={YELLOW} top="-0.5rem" right="0">
            all free-ish
          </Sticker>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {APPS.map((app, i) => (
            <AppBlock key={app.id} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section
        style={{
          background: RED,
          borderTop: `4px solid ${INK}`,
          borderBottom: `4px solid ${INK}`,
          padding: 'clamp(2.5rem, 7vw, 5rem) clamp(1rem, 5vw, 3rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              fontFamily: DISPLAY,
              color: PAPER,
              fontSize: 'clamp(2rem, 8vw, 5.5rem)',
              textTransform: 'uppercase',
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              margin: '0 0 1.5rem',
              maxWidth: '16ch',
            }}
          >
            Live in your menu bar. Not in your way.
          </h2>
          <ChunkyButton href="#apps" bg={YELLOW} fg={INK} style={{ fontSize: '1.3rem' }}>
            Grab all three →
          </ChunkyButton>
        </div>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: '-1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(5rem, 20vw, 14rem)',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        >
          📊
        </div>
      </section>

      {/* footer */}
      <footer
        style={{
          background: INK,
          color: PAPER,
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 5vw, 3rem)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
          }}
        >
          Tal<span style={{ color: RED }}>/</span>Tools
        </div>
        <div style={{ fontFamily: MONO, fontSize: '0.85rem', color: YELLOW, textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} · Built for macOS · No trackers
        </div>
      </footer>
    </div>
  )
}
