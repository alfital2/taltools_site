import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

const MAST = '"UnifrakturCook", "Playfair Display", Georgia, serif'
const HEAD = '"Playfair Display", Georgia, "Times New Roman", serif'
const BODY = '"PT Serif", Georgia, "Times New Roman", serif'

const INK = '#1a1714'
const PAPER = '#f4f1ea'
const RED = '#8b0000'

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

/* ---------- "Press photo" block: real app icon printed on newsprint ---------- */
function PressPhoto({ app, label }) {
  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${INK}`,
        background: PAPER,
        overflow: 'hidden',
        aspectRatio: '4 / 3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${INK} 1.4px, transparent 1.6px)`,
          backgroundSize: '6px 6px',
          opacity: 0.5,
          maskImage: 'radial-gradient(ellipse at 50% 45%, #000 0%, #000 35%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, #000 0%, #000 35%, transparent 78%)',
        }}
      />
      <img
        src={app.icon}
        alt={app.name + ' icon'}
        width={108}
        height={108}
        style={{
          position: 'relative',
          width: 'clamp(74px, 18vw, 108px)',
          height: 'auto',
          borderRadius: '22%',
          filter: 'grayscale(1) contrast(1.18)',
          mixBlendMode: 'multiply',
          boxShadow: `2px 3px 0 rgba(26,23,20,0.18)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: `1px solid ${INK}`,
          background: PAPER,
          fontFamily: BODY,
          fontStyle: 'italic',
          fontSize: 11,
          padding: '3px 8px',
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </div>
    </div>
  )
}

/* ---------- Hairline rule with optional ornament ---------- */
function Rule({ thick, ornament }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: ornament ? '6px 0' : 0 }}>
      <div style={{ flex: 1, borderTop: `${thick ? 3 : 1}px solid ${INK}` }} />
      {ornament && <span style={{ fontFamily: HEAD, fontSize: 12, letterSpacing: '0.2em' }}>{ornament}</span>}
      {ornament && <div style={{ flex: 1, borderTop: `${thick ? 3 : 1}px solid ${INK}` }} />}
    </div>
  )
}

function ExtraBadge() {
  return (
    <span
      style={{
        display: 'inline-block',
        transform: 'rotate(-4deg)',
        border: `2px solid ${RED}`,
        color: RED,
        fontFamily: HEAD,
        fontWeight: 900,
        fontSize: 11,
        letterSpacing: '0.18em',
        padding: '2px 7px',
        textTransform: 'uppercase',
      }}
    >
      Extra!
    </span>
  )
}

/* ---------- Live "wire dispatch" inset that frames a shared demo ---------- */
function WireInset({ app }) {
  const Demo = DEMOS[app.id]
  if (!Demo) return null
  return (
    <div style={{ border: `1.5px solid ${INK}`, marginTop: 2 }}>
      <div
        style={{
          fontFamily: HEAD,
          fontWeight: 900,
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          borderBottom: `1px solid ${INK}`,
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span>Live Wire</span>
        <span style={{ color: RED, fontStyle: 'italic', fontWeight: 700, letterSpacing: '0.04em' }}>
          try it
        </span>
      </div>
      <div style={{ padding: 8 }}>
        <Demo tone="light" />
      </div>
    </div>
  )
}

/* ---------- "See the full demo" dispatch link ---------- */
function DemoLink({ app }) {
  const ext = app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a
      href={app.site}
      {...ext}
      className="np-demolink"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: BODY,
        fontStyle: 'italic',
        fontSize: 13,
        color: INK,
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <span style={{ borderBottom: `1px solid ${INK}`, paddingBottom: 1 }}>See the full demo</span>
      <span aria-hidden="true" style={{ color: RED, fontWeight: 900, transform: 'translateX(0)' }}>
        →
      </span>
    </a>
  )
}

/* ---------- One front-page article ---------- */
function Article({ app, index, reduced }) {
  const [hovered, setHovered] = useState(false)
  const dropCap = app.blurb.charAt(0)
  const rest = app.blurb.slice(1)
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 18, rotateX: -6 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        breakInside: 'avoid',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        paddingBottom: 14,
        transformOrigin: 'top center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ExtraBadge />
        <span
          style={{
            fontFamily: BODY,
            fontStyle: 'italic',
            fontSize: 12,
            color: INK,
            opacity: 0.7,
          }}
        >
          Filed from the Menu Bar Desk
        </span>
      </div>

      <h2
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: HEAD,
          fontWeight: 900,
          lineHeight: 0.98,
          fontSize: 'clamp(30px, 4.6vw, 46px)',
          margin: 0,
          letterSpacing: '-0.01em',
          cursor: 'default',
          textShadow: hovered ? `1px 1px 0 ${RED}` : 'none',
          transition: 'text-shadow 0.2s ease',
        }}
      >
        <span
          style={{
            backgroundImage: `linear-gradient(${INK}, ${INK})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 100%',
            backgroundSize: hovered ? '100% 2px' : '0% 2px',
            transition: 'background-size 0.35s ease',
            paddingBottom: 2,
          }}
        >
          {app.name}
        </span>
      </h2>

      <p
        style={{
          fontFamily: HEAD,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 'clamp(15px, 1.7vw, 18px)',
          lineHeight: 1.25,
          margin: 0,
          color: INK,
        }}
      >
        {app.tagline}
      </p>

      <Rule />

      <PressPhoto app={app} label={`Fig. ${index + 1}. ${app.name} on duty`} />

      <p style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.5, margin: '4px 0', textAlign: 'justify', hyphens: 'auto' }}>
        <span
          style={{
            float: 'left',
            fontFamily: HEAD,
            fontWeight: 900,
            fontSize: 56,
            lineHeight: 0.78,
            paddingRight: 6,
            marginTop: 4,
            color: RED,
          }}
        >
          {dropCap}
        </span>
        {rest}
      </p>

      {/* AT A GLANCE box */}
      <div style={{ border: `1.5px solid ${INK}`, padding: '8px 10px 10px', marginTop: 2 }}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 900,
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            borderBottom: `1px solid ${INK}`,
            paddingBottom: 4,
            marginBottom: 6,
          }}
        >
          At a Glance
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 4 }}>
          {app.bullets.map((b) => (
            <li
              key={b}
              style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.35, display: 'flex', gap: 7, alignItems: 'baseline' }}
            >
              <span style={{ color: RED, fontWeight: 900, transform: 'translateY(1px)' }}>§</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <WireInset app={app} />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 6 }}>
        <a
          href={app.site}
          {...(app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="np-cta"
          style={{
            fontFamily: HEAD,
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: PAPER,
            background: INK,
            border: `2px solid ${INK}`,
            padding: '7px 14px',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = RED
            e.currentTarget.style.borderColor = RED
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = INK
            e.currentTarget.style.borderColor = INK
          }}
        >
          Get {app.name} ▸
        </a>
        <DemoLink app={app} />
      </div>
    </motion.article>
  )
}

export default function Variant12() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700&family=PT+Serif:ital@0;1&display=swap'
    link.setAttribute('data-np-fonts', 'true')
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAPER,
        color: INK,
        fontFamily: BODY,
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @keyframes np-foldin {
          0%   { opacity: 0; transform: perspective(1400px) rotateX(34deg) translateY(-26px); }
          100% { opacity: 1; transform: perspective(1400px) rotateX(0deg) translateY(0); }
        }
        .np-sheet { animation: np-foldin 1.05s cubic-bezier(.2,.7,.25,1) both; transform-origin: top center; }
        @media (prefers-reduced-motion: reduce) { .np-sheet { animation: none !important; } }
        .np-cols { column-count: 3; column-gap: 26px; column-rule: 1px solid ${INK}; }
        @media (max-width: 900px) { .np-cols { column-count: 2; } }
        @media (max-width: 640px) { .np-cols { column-count: 1; column-rule: none; } }
        .np-link:hover { color: ${RED}; }
        .np-demolink:hover { color: ${RED}; }
        .np-demolink:hover span:last-child { transform: translateX(3px); }
        .np-demolink span:last-child { transition: transform 0.18s ease; display: inline-block; }
        a:focus-visible { outline: 2px solid ${RED}; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .np-demolink span:last-child { transition: none; }
        }
      `}</style>

      {/* Paper grain / aging overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          mixBlendMode: 'multiply',
          opacity: 0.5,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(120,100,60,0.10), transparent 40%), radial-gradient(circle at 80% 70%, rgba(90,70,40,0.10), transparent 45%), radial-gradient(rgba(40,30,15,0.05) 0.5px, transparent 0.6px)',
          backgroundSize: '100% 100%, 100% 100%, 4px 4px',
        }}
      />
      {/* Vignette edges */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          boxShadow: 'inset 0 0 140px rgba(60,45,20,0.25)',
        }}
      />

      <div
        className="np-sheet"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(56px, 6vw, 64px) clamp(16px, 4vw, 48px) 64px',
        }}
      >
        {/* Top thin meta line, kept clear of top-left corner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            fontFamily: BODY,
            fontStyle: 'italic',
            fontSize: 12,
            opacity: 0.75,
            paddingBottom: 6,
          }}
        >
          Late City Final · Weather: clear, slight chance of shipping
        </div>
        <Rule thick />

        {/* Masthead */}
        <header style={{ textAlign: 'center', padding: '14px 0 8px' }}>
          <h1
            style={{
              fontFamily: MAST,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1,
              fontSize: 'clamp(40px, 9vw, 96px)',
              letterSpacing: '0.01em',
            }}
          >
            The TalTools Times
          </h1>
          <div
            style={{
              fontFamily: HEAD,
              fontStyle: 'italic',
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              marginTop: 6,
              opacity: 0.85,
            }}
          >
            “All the Apps That Fit in the Bar”
          </div>
        </header>

        {/* Dateline rule */}
        <div style={{ borderTop: `3px solid ${INK}`, borderBottom: `1px solid ${INK}`, padding: '5px 0' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'center',
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 'clamp(10px, 1.4vw, 13px)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            <span>Vol. I</span>
            <span style={{ color: RED }}>·</span>
            <span>No. 1</span>
            <span style={{ color: RED }}>·</span>
            <span>Mac Edition</span>
            <span style={{ color: RED }}>·</span>
            <span style={{ color: RED }}>Price: Free</span>
          </div>
        </div>

        {/* Banner lead headline */}
        <div style={{ textAlign: 'center', padding: '22px 0 6px' }}>
          <motion.h2
            initial={reduced ? false : { opacity: 0, letterSpacing: '0.3em' }}
            animate={reduced ? {} : { opacity: 1, letterSpacing: '-0.005em' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              fontFamily: HEAD,
              fontWeight: 900,
              margin: 0,
              lineHeight: 0.95,
              fontSize: 'clamp(34px, 6.4vw, 74px)',
              maxWidth: 980,
              marginInline: 'auto',
            }}
          >
            THREE TINY APPS SEIZE THE <span style={{ color: RED }}>MENU BAR</span>
          </motion.h2>
          <p
            style={{
              fontFamily: HEAD,
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 'clamp(14px, 1.9vw, 19px)',
              marginTop: 10,
              opacity: 0.9,
            }}
          >
            A lab of three handcrafted utilities promises to make macOS quieter, smarter, and altogether more civilized.
          </p>
        </div>

        <Rule ornament="◆ ◆ ◆" />

        {/* Three-column articles */}
        <div className="np-cols" style={{ marginTop: 16 }}>
          {APPS.map((app, i) => (
            <Article key={app.id} app={app} index={i} reduced={reduced} />
          ))}
        </div>

        {/* Pull quote band */}
        <div style={{ margin: '20px 0' }}>
          <Rule thick />
          <blockquote
            style={{
              fontFamily: HEAD,
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 'clamp(20px, 3.4vw, 34px)',
              textAlign: 'center',
              lineHeight: 1.2,
              padding: '20px clamp(8px, 5vw, 60px)',
              margin: 0,
            }}
          >
            “Small software, <span style={{ color: RED }}>boldly</span> set in the top-right of your screen.”
            <footer style={{ fontFamily: BODY, fontStyle: 'normal', fontSize: 13, marginTop: 10, opacity: 0.7 }}>
              The Editorial Board, somewhere near the clock
            </footer>
          </blockquote>
          <Rule thick />
        </div>

        {/* Classifieds-style footer */}
        <footer
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginTop: 18,
            paddingTop: 14,
            borderTop: `1px solid ${INK}`,
          }}
        >
          <div>
            <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              The Fine Print
            </div>
            <p style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.5, marginTop: 6, opacity: 0.85 }}>
              All three titles are notarized for macOS, run entirely on your own machine, and require no account to enjoy.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Subscriptions
            </div>
            <p style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.5, marginTop: 6, opacity: 0.85 }}>
              There are none. Download today; cancel never. <a href="#" className="np-link" style={{ color: INK }}>Read more ▸</a>
            </p>
          </div>
          <div>
            <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              The TalTools Times
            </div>
            <p style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.5, marginTop: 6, opacity: 0.85 }}>
              Printed daily on the freshest pixels. © {new Date().getFullYear()} TalTools Lab. Set in Playfair &amp; PT Serif.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
