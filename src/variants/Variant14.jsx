import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { APPS } from '../apps.js'

const DISPLAY = '"Anton", "Arial Narrow", Impact, sans-serif'
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const INK = '#0a0a0a'
const PAPER = '#f4f4f2'
const RED = '#ff3b3b'

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

/* Letter-by-letter reveal that scale-springs in */
function KineticWord({ text, color, reduced, delay = 0, style }) {
  const letters = String(text).split('')
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.045, delayChildren: delay },
    },
  }
  const child = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: '0.5em', scaleY: 0.4, filter: 'blur(8px)' },
        show: {
          opacity: 1,
          y: 0,
          scaleY: 1,
          filter: 'blur(0px)',
          transition: { type: 'spring', stiffness: 320, damping: 22 },
        },
      }
  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
      style={{ display: 'inline-flex', flexWrap: 'wrap', lineHeight: 0.86, color, ...style }}
    >
      {letters.map((l, i) => (
        <motion.span
          key={i}
          variants={child}
          aria-hidden="true"
          style={{ display: 'inline-block', transformOrigin: 'bottom', whiteSpace: 'pre' }}
        >
          {l}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* A line that scrubs horizontally as you scroll past it */
function ScrubLine({ text, color, from, to, reduced, weight = 900 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], reduced ? [from, from] : [from, to])
  return (
    <div ref={ref} style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{
          x,
          whiteSpace: 'nowrap',
          fontFamily: DISPLAY,
          fontWeight: weight,
          color,
          fontSize: 'clamp(3rem, 14vw, 13rem)',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
        }}
      >
        {text}
      </motion.div>
    </div>
  )
}

/* Hover: shift letter-spacing + color */
function HoverWord({ children, color }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.span
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      animate={{ letterSpacing: hover ? '0.06em' : '-0.01em', color: hover ? RED : color }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ display: 'inline-block', cursor: 'default' }}
    >
      {children}
    </motion.span>
  )
}

function Marquee({ items, reduced, reverse = false }) {
  const row = [...items, ...items, ...items]
  return (
    <div style={{ overflow: 'hidden', width: '100%', borderTop: `2px solid ${INK}`, borderBottom: `2px solid ${INK}` }}>
      <div
        className="kt-marquee"
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          animation: reduced ? 'none' : `kt-scroll 26s linear infinite ${reverse ? 'reverse' : 'normal'}`,
          willChange: 'transform',
        }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2rem, 7vw, 5.5rem)',
              padding: '0.15em 0.4em',
              color: i % 2 === 0 ? INK : 'transparent',
              WebkitTextStroke: i % 2 === 0 ? '0' : `2px ${INK}`,
              lineHeight: 1,
            }}
          >
            {t}
            <span style={{ color: RED, padding: '0 0.3em' }}>/</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Variant14() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const links = [
      { id: 'kt-font-display', href: 'https://fonts.googleapis.com/css2?family=Anton&display=swap' },
      {
        id: 'kt-font-sans',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
      },
    ]
    const created = []
    links.forEach((l) => {
      if (!document.getElementById(l.id)) {
        const el = document.createElement('link')
        el.id = l.id
        el.rel = 'stylesheet'
        el.href = l.href
        document.head.appendChild(el)
        created.push(el)
      }
    })
    return () => created.forEach((el) => el.remove())
  }, [])

  /* hero subtle parallax of the giant red word */
  const heroRef = useRef(null)
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroShift = useTransform(heroProg, [0, 1], reduced ? ['0%', '0%'] : ['0%', '-22%'])
  const heroFade = useTransform(heroProg, [0, 0.8], [1, 0])

  return (
    <div
      style={{
        background: PAPER,
        color: INK,
        fontFamily: SANS,
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes kt-scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        .kt-blink { animation: kt-blink 1.1s steps(2, start) infinite; }
        @keyframes kt-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .kt-blink { animation: none; } }
        ::selection { background: ${RED}; color: ${PAPER}; }
      `}</style>

      {/* Top bar — kept clear of top-left corner for the overlay button */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '14px 20px',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontFamily: DISPLAY, color: '#fff', fontSize: 18, letterSpacing: '0.18em' }}>
          TAL<span style={{ color: RED }}>TOOLS</span>
        </span>
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(64px, 9vh, 120px) clamp(16px, 4vw, 64px) 40px',
          position: 'relative',
        }}
      >
        <motion.div style={{ y: heroShift, opacity: heroFade }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 'clamp(0.7rem, 1.4vw, 1rem)',
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              marginBottom: 'clamp(12px, 2vh, 28px)',
            }}
          >
            A lab of three <span style={{ color: RED }}>Mac menu-bar</span> apps
          </div>

          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(3.4rem, 16vw, 15rem)',
              lineHeight: 0.82,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            <KineticWord text="SMALL" color={INK} reduced={reduced} delay={0.05} />
            <br />
            <KineticWord text="TOOLS." color={RED} reduced={reduced} delay={0.45} />
            <br />
            <KineticWord text="BIG NERVE." color={INK} reduced={reduced} delay={0.9} />
          </h1>

          <motion.p
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 1.5, duration: 0.6 }}
            style={{
              maxWidth: 560,
              marginTop: 'clamp(20px, 4vh, 40px)',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)',
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            Three tiny, sharp utilities that live in your menu bar and do exactly one thing
            ridiculously well. No accounts. No bloat.
            <span className="kt-blink" style={{ color: RED, marginLeft: 6 }}>
              ▌
            </span>
          </motion.p>
        </motion.div>

        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: 'clamp(16px, 4vw, 64px)',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Scroll ↓
        </div>
      </section>

      {/* SCRUB band */}
      <section style={{ padding: 'clamp(40px, 10vh, 120px) 0', display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
        <ScrubLine text="MENU BAR · MENU BAR · MENU BAR" color={INK} from="-12%" to="-40%" reduced={reduced} />
        <ScrubLine text="ZERO BLOAT — FULLY LOCAL — NO ACCOUNT" color={RED} from="-45%" to="0%" reduced={reduced} weight={900} />
        <ScrubLine text="NOTARIZED · NATIVE · FAST" color={INK} from="-10%" to="-38%" reduced={reduced} />
      </section>

      <Marquee items={APPS.map((a) => a.name.toUpperCase())} reduced={reduced} />

      {/* APPS */}
      {APPS.map((app, idx) => (
        <section
          key={app.id}
          style={{
            padding: 'clamp(64px, 14vh, 180px) clamp(16px, 4vw, 64px)',
            borderTop: idx === 0 ? 'none' : `2px solid ${INK}`,
            position: 'relative',
          }}
        >
          {/* big index numeral */}
          <div
            aria-hidden="true"
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
              letterSpacing: '0.2em',
              color: RED,
              marginBottom: 'clamp(8px, 2vh, 20px)',
            }}
          >
            0{idx + 1} / 03
          </div>

          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(3.2rem, 19vw, 18rem)',
              lineHeight: 0.82,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            <HoverWord color={INK}>
              <KineticWord
                text={app.name.toUpperCase()}
                color={INK}
                reduced={reduced}
                style={{ fontSize: 'inherit' }}
              />
            </HoverWord>
          </h2>

          {/* kinetic tagline */}
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(1.4rem, 5vw, 4rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              marginTop: 'clamp(10px, 2vh, 24px)',
            }}
          >
            <KineticWord text={app.tagline} color={RED} reduced={reduced} delay={0.15} style={{ fontSize: 'inherit' }} />
          </div>

          {/* small clean copy */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: 'clamp(24px, 4vw, 56px)',
              marginTop: 'clamp(28px, 5vh, 56px)',
              maxWidth: 1100,
            }}
            className="kt-app-grid"
          >
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}
            >
              <div style={{ display: 'flex', gap: 'clamp(24px, 5vw, 64px)', flexWrap: 'wrap' }}>
                <p
                  style={{
                    flex: '1 1 280px',
                    maxWidth: 520,
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    lineHeight: 1.55,
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {app.blurb}
                </p>

                <ul
                  style={{
                    flex: '1 1 240px',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'grid',
                    gap: 10,
                    alignContent: 'start',
                  }}
                >
                  {app.bullets.map((b) => (
                    <li
                      key={b}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 12,
                        fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
                        fontWeight: 600,
                        borderBottom: `1px solid rgba(10,10,10,0.15)`,
                        paddingBottom: 8,
                      }}
                    >
                      <span style={{ color: RED, fontFamily: DISPLAY, fontSize: '1.1em' }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <motion.a
                  href="#"
                  whileHover={reduced ? undefined : { scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    background: INK,
                    color: PAPER,
                    textDecoration: 'none',
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(1.1rem, 2.4vw, 1.8rem)',
                    letterSpacing: '0.04em',
                    padding: '0.5em 1em',
                    border: `2px solid ${INK}`,
                  }}
                >
                  DOWNLOAD <span style={{ color: RED }}>{app.name.toUpperCase()}</span> ↓
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* OUTRO */}
      <Marquee items={['NATCHO', 'FLICKEY', 'TALLY', 'BY TAL']} reduced={reduced} reverse />

      <footer
        style={{
          padding: 'clamp(80px, 18vh, 220px) clamp(16px, 4vw, 64px) clamp(48px, 8vh, 100px)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(3rem, 18vw, 16rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
          }}
        >
          <KineticWord text="GET" color={INK} reduced={reduced} style={{ fontSize: 'inherit' }} />{' '}
          <KineticWord text="THEM" color={INK} reduced={reduced} delay={0.2} style={{ fontSize: 'inherit' }} />{' '}
          <KineticWord text="ALL." color={RED} reduced={reduced} delay={0.4} style={{ fontSize: 'inherit' }} />
        </div>
        <p
          style={{
            marginTop: 32,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          TALTOOLS — built tiny, on purpose · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
