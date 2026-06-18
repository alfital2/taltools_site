import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { APPS } from '../apps.js'

const DISPLAY = '"Bangers", "Comic Sans MS", system-ui, sans-serif'
const BODY = '"Comic Neue", "Comic Sans MS", system-ui, sans-serif'

const STAR_CLIP =
  'polygon(50% 0%, 61% 18%, 83% 12%, 76% 34%, 98% 35%, 80% 50%, 98% 65%, 76% 66%, 83% 88%, 61% 82%, 50% 100%, 39% 82%, 17% 88%, 24% 66%, 2% 65%, 20% 50%, 2% 35%, 24% 34%, 17% 12%, 39% 18%)'

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

/* ---------- Jagged burst caption (BAM! POW! ZAP!) ---------- */
function Burst({ word, color, textColor = '#000', size = 120, rotate = -8, delay = 0, reduced }) {
  const [pop, setPop] = useState(0)
  return (
    <motion.button
      type="button"
      onClick={() => setPop((p) => p + 1)}
      initial={reduced ? false : { scale: 0, rotate: rotate - 40 }}
      whileInView={reduced ? {} : { scale: 1, rotate }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 12, delay }}
      animate={pop ? { scale: [1.3, 0.92, 1.12, 1] } : {}}
      style={{
        position: 'relative',
        width: size,
        height: size,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
        flex: '0 0 auto',
      }}
      aria-label={word}
    >
      {/* black outline star behind */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          clipPath: STAR_CLIP,
          transform: 'scale(1.12)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: color,
          clipPath: STAR_CLIP,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: size * 0.3,
            color: textColor,
            letterSpacing: '1px',
            transform: `rotate(${-rotate}deg)`,
            textShadow: textColor === '#fff' ? '2px 2px 0 #000' : 'none',
          }}
        >
          {word}
        </span>
      </span>
    </motion.button>
  )
}

/* ---------- Speech bubble with tail ---------- */
function SpeechBubble({ children, reduced }) {
  return (
    <motion.div
      whileHover={reduced ? {} : { rotate: [0, -2.5, 2.5, -1.5, 0] }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        background: '#fff',
        border: '4px solid #000',
        borderRadius: '28px',
        padding: '16px 20px',
        fontFamily: DISPLAY,
        fontSize: 'clamp(20px, 3.4vw, 30px)',
        lineHeight: 1.05,
        color: '#000',
        letterSpacing: '0.5px',
        boxShadow: '5px 5px 0 #000',
        display: 'inline-block',
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: -22,
          left: 36,
          width: 0,
          height: 0,
          borderLeft: '0 solid transparent',
          borderTop: '26px solid #000',
          borderRight: '26px solid transparent',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: -13,
          left: 41,
          width: 0,
          height: 0,
          borderTop: '17px solid #fff',
          borderRight: '17px solid transparent',
        }}
      />
    </motion.div>
  )
}

/* ---------- Caption box (MEANWHILE...) ---------- */
function Caption({ children, accent = '#ffe600' }) {
  return (
    <div
      style={{
        background: accent,
        border: '3px solid #000',
        padding: '8px 12px',
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#000',
        boxShadow: '3px 3px 0 #000',
        lineHeight: 1.2,
      }}
    >
      {children}
    </div>
  )
}

/* ---------- A single comic app panel ---------- */
function AppPanel({ app, idx, reduced }) {
  const bursts = ['BAM!', 'POW!', 'ZAP!']
  const burstColors = ['#ff2b2b', '#1f7bff', '#ffe600']
  const burstText = ['#fff', '#fff', '#000']
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 60, rotate: idx % 2 ? 2 : -2 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: 'spring', stiffness: 90, damping: 14 }}
      style={{
        position: 'relative',
        background: '#fff',
        border: '6px solid #000',
        boxShadow: '10px 10px 0 #000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* halftone hero strip */}
      <div
        className="cmc-halftone"
        style={{
          position: 'relative',
          background: app.accent,
          borderBottom: '6px solid #000',
          padding: '28px 20px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          overflow: 'hidden',
        }}
      >
        {/* speed lines */}
        <div className="cmc-speedlines" aria-hidden="true" />
        <Burst
          word={bursts[idx % 3]}
          color={burstColors[idx % 3]}
          textColor={burstText[idx % 3]}
          size={100}
          rotate={idx % 2 ? 10 : -10}
          delay={0.1}
          reduced={reduced}
        />
        <motion.div
          initial={reduced ? false : { scale: 0, rotate: -30 }}
          whileInView={reduced ? {} : { scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 11, delay: 0.18 }}
          style={{
            fontSize: 'clamp(72px, 14vw, 120px)',
            lineHeight: 1,
            filter: 'drop-shadow(4px 4px 0 #000)',
            zIndex: 2,
          }}
        >
          {app.emoji}
        </motion.div>
        {/* panel number tag */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 10,
            fontFamily: DISPLAY,
            fontSize: 26,
            color: '#fff',
            WebkitTextStroke: '2px #000',
            zIndex: 3,
          }}
        >
          #{idx + 1}
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '22px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        <h3
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(34px, 6vw, 48px)',
            margin: 0,
            color: '#000',
            letterSpacing: '1px',
            lineHeight: 0.95,
          }}
        >
          {app.name}
        </h3>

        <SpeechBubble reduced={reduced}>{app.tagline}</SpeechBubble>

        <Caption accent={app.accent}>Meanwhile, in your menu bar…</Caption>
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.45, color: '#111', margin: 0, fontWeight: 600 }}>
          {app.blurb}
        </p>

        <div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 24,
              letterSpacing: '1px',
              color: '#ff2b2b',
              WebkitTextStroke: '1px #000',
            }}
          >
            POWERS
          </div>
          <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'grid', gap: 6 }}>
            {app.bullets.map((b) => (
              <li
                key={b}
                style={{
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#000',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    flex: '0 0 auto',
                    marginTop: 2,
                    width: 16,
                    height: 16,
                    background: app.accent,
                    border: '2px solid #000',
                    clipPath: STAR_CLIP,
                  }}
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <motion.a
          href="#"
          whileHover={reduced ? {} : { scale: 1.06, rotate: -1.5 }}
          whileTap={reduced ? {} : { scale: 0.95 }}
          style={{
            marginTop: 'auto',
            alignSelf: 'flex-start',
            display: 'inline-block',
            fontFamily: DISPLAY,
            fontSize: 24,
            letterSpacing: '1px',
            color: '#fff',
            background: '#000',
            border: '4px solid #000',
            padding: '10px 24px',
            textDecoration: 'none',
            boxShadow: `5px 5px 0 ${app.accent}`,
            textShadow: '2px 2px 0 #ff2b2b',
          }}
        >
          DOWNLOAD ↓
        </motion.a>
      </div>
    </motion.article>
  )
}

export default function Variant17() {
  const reduced = usePrefersReducedMotion()
  const [kapow, setKapow] = useState(0)
  const rootRef = useRef(null)

  useEffect(() => {
    const id = 'cmc-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:ital,wght@0,400;0,700;1,700&display=swap'
    document.head.appendChild(link)
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#ffe600',
        fontFamily: BODY,
        color: '#000',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes cmc-pop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          70% { transform: scale(1.2) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes cmc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cmc-page-dots {
          background-image: radial-gradient(#000 1.6px, transparent 1.7px);
          background-size: 16px 16px;
        }
        .cmc-halftone::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(0,0,0,0.28) 2.2px, transparent 2.3px);
          background-size: 12px 12px;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        .cmc-speedlines {
          position: absolute;
          inset: -20%;
          background: repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(0,0,0,0.18) 0deg 2deg,
            transparent 2deg 9deg
          );
          animation: cmc-spin 24s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .cmc-speedlines { animation: none; }
        }
      `}</style>

      {/* page-wide halftone dot overlay */}
      <div
        className="cmc-page-dots"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', zIndex: 0 }}
      />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '88px 20px 80px',
        }}
      >
        {/* ---------- HERO COMIC COVER PANEL ---------- */}
        <motion.header
          initial={reduced ? false : { opacity: 0, scale: 0.95 }}
          animate={reduced ? {} : { opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 14 }}
          style={{
            position: 'relative',
            background: '#fff',
            border: '7px solid #000',
            boxShadow: '12px 12px 0 #000',
            padding: 'clamp(24px, 5vw, 48px)',
            overflow: 'hidden',
          }}
        >
          <div
            className="cmc-halftone"
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: '#1f7bff', opacity: 1, zIndex: 0 }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Caption accent="#ffe600">Issue #17 — The TalTools Files</Caption>
            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(56px, 13vw, 132px)',
                margin: '14px 0 6px',
                lineHeight: 0.88,
                color: '#ffe600',
                WebkitTextStroke: '3px #000',
                textShadow: '7px 7px 0 #ff2b2b',
                letterSpacing: '2px',
              }}
            >
              TALTOOLS!
            </h1>
            <div style={{ maxWidth: 560 }}>
              <SpeechBubble reduced={reduced}>
                Three tiny heroes. One menu bar. Infinite KAPOW.
              </SpeechBubble>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 18,
                marginTop: 26,
              }}
            >
              <Burst word="WHAM!" color="#ffe600" textColor="#000" size={120} rotate={-12} delay={0.2} reduced={reduced} />
              <Burst word="POW!" color="#ff2b2b" textColor="#fff" size={104} rotate={9} delay={0.32} reduced={reduced} />
              <motion.button
                type="button"
                onClick={() => setKapow((k) => k + 1)}
                animate={kapow ? { scale: [1, 1.4, 0.9, 1.1, 1], rotate: [0, -6, 6, -3, 0] } : {}}
                whileHover={reduced ? {} : { scale: 1.05 }}
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 'clamp(28px, 6vw, 44px)',
                  background: '#ffe600',
                  color: '#000',
                  border: '5px solid #000',
                  padding: '10px 26px',
                  cursor: 'pointer',
                  boxShadow: '6px 6px 0 #000',
                  letterSpacing: '1px',
                  transform: 'rotate(-2deg)',
                }}
                aria-label="KAPOW"
              >
                KA-POW! ×{kapow}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* transition caption */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 30px' }}>
          <div style={{ transform: 'rotate(-2deg)' }}>
            <Caption accent="#fff">Meanwhile… on the next page, our heroes assemble →</Caption>
          </div>
        </div>

        {/* ---------- APP PANELS — comic grid ---------- */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
            alignItems: 'stretch',
          }}
        >
          {APPS.map((app, i) => (
            <AppPanel key={app.id} app={app} idx={i} reduced={reduced} />
          ))}
        </section>

        {/* ---------- FINAL FRAME ---------- */}
        <motion.footer
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 80, damping: 14 }}
          style={{
            marginTop: 44,
            position: 'relative',
            background: '#ff2b2b',
            border: '7px solid #000',
            boxShadow: '12px 12px 0 #000',
            padding: 'clamp(28px, 5vw, 52px) 24px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <div className="cmc-halftone" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(40px, 9vw, 80px)',
                margin: 0,
                color: '#fff',
                WebkitTextStroke: '2px #000',
                textShadow: '5px 5px 0 #000',
                letterSpacing: '2px',
              }}
            >
              THE END? NEVER!
            </h2>
            <p
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 18,
                color: '#fff',
                margin: '12px auto 0',
                maxWidth: 480,
                textShadow: '1px 1px 0 #000',
              }}
            >
              Suit up your menu bar. Notarized, featherweight, and ready for action.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
              <Burst word="ZAP!" color="#ffe600" textColor="#000" size={110} rotate={-6} delay={0.1} reduced={reduced} />
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  )
}
