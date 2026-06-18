import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

/* =========================================================================
 *  Variant21 — "Raycast Dark Pro"
 *  A sleek dark premium developer-tool aesthetic (Raycast / Linear / Vercel):
 *  near-black backgrounds, subtle violet/blue radial glow, glassy cards with
 *  fine 1px borders + inner highlights, a crisp baseline grid, Inter + a
 *  monospace accent for labels, a sticky translucent glass navbar, and
 *  restrained, confident micro-interactions.
 * ========================================================================= */

const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

// ── Palette ──────────────────────────────────────────────
const BG = '#08080c'
const CARD = 'rgba(20,20,28,0.66)'
const BORDER = 'rgba(255,255,255,0.09)'
const BORDER_STRONG = 'rgba(255,255,255,0.14)'
const TEXT = '#f4f4f7'
const MUTED = 'rgba(244,244,247,0.62)'
const FAINT = 'rgba(244,244,247,0.42)'
const VIOLET = '#7c5cff'
const BLUE = '#4cc9f0'

// ── Inline glyphs (no external images) ───────────────────
function ArrowGlyph({ external = false, className = '' }) {
  if (external) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className={className} style={{ flexShrink: 0 }}>
        <path d="M4 10L10 4M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className={className} style={{ flexShrink: 0 }}>
      <path d="M2 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckGlyph({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.25" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <path d="M4.6 8.2l2.2 2.2 4.4-4.6" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#tt-g)" strokeWidth="1.6" />
      <path d="M7 8.5h10M12 8.5v8" stroke="url(#tt-g)" strokeWidth="1.7" strokeLinecap="round" />
      <defs>
        <linearGradient id="tt-g" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor={VIOLET} />
          <stop offset="1" stopColor={BLUE} />
        </linearGradient>
      </defs>
    </svg>
  )
}

// hex -> rgba helper
function rgba(hex, a) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

// ── App icon (real macOS icon) ───────────────────────────
function AppIcon({ app, size = 44 }) {
  return (
    <img
      src={app.icon}
      alt={app.name + ' icon'}
      width={size}
      height={size}
      style={{
        display: 'block',
        borderRadius: '22%',
        flexShrink: 0,
        boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
      }}
    />
  )
}

// ── Glass card wrapper ───────────────────────────────────
function GlassCard({ children, style, className = '', accent }) {
  return (
    <div
      className={`rp-card ${className}`}
      style={{
        position: 'relative',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 60px -28px rgba(0,0,0,0.85)',
        ...style,
      }}
    >
      {accent && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 18,
            padding: 1,
            background: `linear-gradient(160deg, ${rgba(accent, 0.5)}, transparent 42%)`,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  )
}

// ── Per-app section ──────────────────────────────────────
function AppSection({ app, index, reduce }) {
  const Demo = DEMOS[app.id]
  const flip = index % 2 === 1
  const linkProps = app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <motion.section
      id={app.id}
      className="rp-appsec"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ scrollMarginTop: 96 }}
    >
      <div className={`rp-appgrid ${flip ? 'rp-flip' : ''}`}>
        {/* ── copy column ── */}
        <div className="rp-copy">
          <div className="rp-apphead">
            <AppIcon app={app} size={52} />
            <div>
              <span className="rp-mono" style={{ color: rgba(app.accent, 0.95) }}>
                {String(index + 1).padStart(2, '0')} / app
              </span>
              <h3 className="rp-appname">{app.name}</h3>
            </div>
          </div>

          <p className="rp-tagline" style={{ color: app.accent }}>
            {app.tagline}
          </p>
          <p className="rp-blurb">{app.blurb}</p>

          <ul className="rp-bullets">
            {app.bullets.map((b) => (
              <li key={b}>
                <CheckGlyph color={app.accent} />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <a
            href={app.site}
            {...linkProps}
            className="rp-applink rp-focus"
            style={{ color: app.accent }}
          >
            See the full demo
            <ArrowGlyph external={app.external} className="rp-arrow" />
          </a>
        </div>

        {/* ── demo column ── */}
        <div className="rp-demoholder">
          <GlassCard accent={app.accent} style={{ padding: 22, width: '100%' }}>
            <div className="rp-demohead">
              <span className="rp-dots" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="rp-mono rp-demolabel">
                {app.name.toLowerCase()}.app · live preview
              </span>
            </div>
            <div className="rp-demobody">
              <Demo tone="dark" />
            </div>
          </GlassCard>
          {/* glow behind the demo card */}
          <div
            aria-hidden="true"
            className="rp-demoglow"
            style={{ background: `radial-gradient(60% 60% at 50% 40%, ${rgba(app.accent, 0.22)}, transparent 70%)` }}
          />
        </div>
      </div>
    </motion.section>
  )
}

// ── Main component ───────────────────────────────────────
export default function Variant21() {
  const reduceHook = useReducedMotion()
  const reduce = !!reduceHook
  const rootRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120])

  // self-load Inter + JetBrains Mono
  useEffect(() => {
    const pre1 = document.createElement('link')
    pre1.rel = 'preconnect'
    pre1.href = 'https://fonts.googleapis.com'
    const pre2 = document.createElement('link')
    pre2.rel = 'preconnect'
    pre2.href = 'https://fonts.gstatic.com'
    pre2.crossOrigin = 'anonymous'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    document.head.appendChild(pre1)
    document.head.appendChild(pre2)
    document.head.appendChild(link)
    return () => {
      ;[pre1, pre2, link].forEach((l) => l.parentNode && l.parentNode.removeChild(l))
    }
  }, [])

  // navbar scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: BG,
        color: TEXT,
        overflowX: 'hidden',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        .rp-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
        .rp-wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        /* baseline grid + radial glow background */
        .rp-grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 78%);
          -webkit-mask-image: radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 78%);
        }
        .rp-glow {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
        }
        .rp-glow::before {
          content: ''; position: absolute; left: 50%; top: -240px; width: 920px; height: 920px;
          transform: translateX(-50%);
          background: radial-gradient(closest-side, ${rgba(VIOLET, 0.28)}, transparent 70%);
          filter: blur(20px);
        }
        .rp-glow::after {
          content: ''; position: absolute; right: -160px; top: 120px; width: 620px; height: 620px;
          background: radial-gradient(closest-side, ${rgba(BLUE, 0.16)}, transparent 70%);
          filter: blur(24px);
        }

        /* navbar */
        .rp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 800;
          transition: background .25s ease, border-color .25s ease, backdrop-filter .25s ease;
          border-bottom: 1px solid transparent;
        }
        .rp-nav.is-scrolled {
          background: rgba(8,8,12,0.72);
          backdrop-filter: saturate(160%) blur(14px);
          -webkit-backdrop-filter: saturate(160%) blur(14px);
          border-bottom: 1px solid ${BORDER};
        }
        .rp-navinner { display: flex; align-items: center; justify-content: space-between; height: 60px; }
        /* keep brand clear of the parent's top-left back button */
        .rp-brand { display: flex; align-items: center; gap: 10px; margin-left: 52px; font-weight: 700; letter-spacing: -0.01em; color: ${TEXT}; }
        .rp-navlinks { display: none; align-items: center; gap: 6px; }
        @media (min-width: 760px) { .rp-navlinks { display: flex; } }
        .rp-navlink {
          color: ${MUTED}; text-decoration: none; font-size: 14px; font-weight: 500;
          padding: 7px 12px; border-radius: 9px; transition: color .18s ease, background .18s ease;
        }
        .rp-navlink:hover { color: ${TEXT}; background: rgba(255,255,255,0.05); }
        .rp-navcta {
          display: inline-flex; align-items: center; gap: 7px; font-size: 13.5px; font-weight: 600;
          color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 10px;
          background: linear-gradient(180deg, ${rgba(VIOLET, 0.95)}, ${rgba(VIOLET, 0.75)});
          border: 1px solid ${rgba(VIOLET, 0.6)};
          box-shadow: 0 6px 20px -8px ${rgba(VIOLET, 0.9)}, 0 1px 0 rgba(255,255,255,0.18) inset;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .rp-navcta:hover { transform: translateY(-1px); box-shadow: 0 10px 26px -8px ${rgba(VIOLET, 0.95)}, 0 1px 0 rgba(255,255,255,0.2) inset; }

        /* hero */
        .rp-pill {
          display: inline-flex; align-items: center; gap: 9px; padding: 6px 14px 6px 8px;
          border-radius: 999px; border: 1px solid ${BORDER}; background: rgba(255,255,255,0.04);
          font-size: 12.5px; font-weight: 500; color: ${MUTED}; backdrop-filter: blur(6px);
        }
        .rp-pill b { color: ${TEXT}; font-weight: 600; }
        .rp-pilltag {
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
          padding: 3px 8px; border-radius: 999px; color: ${VIOLET};
          background: ${rgba(VIOLET, 0.16)}; border: 1px solid ${rgba(VIOLET, 0.4)};
        }
        .rp-h1 {
          font-size: clamp(38px, 7.4vw, 76px); line-height: 1.02; font-weight: 800;
          letter-spacing: -0.03em; margin: 22px 0 0;
        }
        .rp-h1 .grad {
          background: linear-gradient(120deg, ${VIOLET} 10%, ${BLUE} 90%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .rp-sub {
          font-size: clamp(16px, 2.2vw, 19px); line-height: 1.6; color: ${MUTED};
          max-width: 620px; margin: 22px auto 0;
        }
        .rp-herobtns { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 32px; }
        .rp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600;
          color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 12px;
          background: linear-gradient(180deg, ${rgba(VIOLET, 0.96)}, ${rgba(VIOLET, 0.74)});
          border: 1px solid ${rgba(VIOLET, 0.6)};
          box-shadow: 0 10px 30px -10px ${rgba(VIOLET, 0.9)}, 0 1px 0 rgba(255,255,255,0.18) inset;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .rp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 38px -10px ${rgba(VIOLET, 0.95)}, 0 1px 0 rgba(255,255,255,0.22) inset; }
        .rp-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600;
          color: ${TEXT}; text-decoration: none; padding: 12px 20px; border-radius: 12px;
          background: rgba(255,255,255,0.04); border: 1px solid ${BORDER_STRONG};
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }
        .rp-btn-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,0.08); border-color: ${rgba(BLUE, 0.5)}; }

        /* trust row */
        .rp-trust { display: flex; flex-wrap: wrap; gap: 10px 26px; justify-content: center; margin-top: 34px; }
        .rp-trust span { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; color: ${FAINT}; font-weight: 500; }

        /* hero app chips */
        .rp-chips { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 46px; }
        .rp-chip {
          display: inline-flex; align-items: center; gap: 11px; padding: 9px 16px 9px 10px;
          border-radius: 14px; border: 1px solid ${BORDER}; background: ${CARD};
          backdrop-filter: blur(10px); text-decoration: none; color: ${TEXT};
          transition: transform .2s ease, border-color .2s ease, background .2s ease;
        }
        .rp-chip:hover { transform: translateY(-3px); background: rgba(28,28,38,0.8); }
        .rp-chip .nm { font-weight: 600; font-size: 14.5px; line-height: 1.1; }
        .rp-chip .tg { font-size: 11.5px; color: ${FAINT}; }

        /* section heading */
        .rp-seclabel {
          display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase; color: ${BLUE};
          padding: 5px 12px; border-radius: 999px; border: 1px solid ${rgba(BLUE, 0.32)};
          background: ${rgba(BLUE, 0.08)};
        }
        .rp-sectitle { font-size: clamp(28px, 4.4vw, 44px); font-weight: 800; letter-spacing: -0.025em; margin: 16px 0 0; }
        .rp-secsub { font-size: 16px; color: ${MUTED}; max-width: 560px; margin: 14px auto 0; line-height: 1.6; }

        /* app section grid */
        .rp-appsec { position: relative; z-index: 1; padding: 46px 0; }
        .rp-appgrid { display: grid; grid-template-columns: 1fr; gap: 30px; align-items: center; }
        @media (min-width: 940px) {
          .rp-appgrid { grid-template-columns: 1.02fr 1.18fr; gap: 56px; }
          .rp-flip .rp-copy { order: 2; }
          .rp-flip .rp-demoholder { order: 1; }
        }
        .rp-apphead { display: flex; align-items: center; gap: 15px; }
        .rp-appname { font-size: clamp(28px, 4vw, 38px); font-weight: 800; letter-spacing: -0.025em; margin: 2px 0 0; line-height: 1; }
        .rp-tagline { font-size: 17px; font-weight: 600; margin: 20px 0 0; letter-spacing: -0.01em; }
        .rp-blurb { font-size: 15.5px; line-height: 1.66; color: ${MUTED}; margin: 12px 0 0; max-width: 480px; }
        .rp-bullets { list-style: none; padding: 0; margin: 22px 0 0; display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 460px) { .rp-bullets { grid-template-columns: 1fr 1fr; } }
        .rp-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: ${TEXT}; line-height: 1.4; }
        .rp-applink {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 26px;
          font-size: 14.5px; font-weight: 600; text-decoration: none; border-radius: 8px;
        }
        .rp-applink .rp-arrow { transition: transform .22s ease; }
        .rp-applink:hover .rp-arrow { transform: translateX(4px); }

        /* demo holder */
        .rp-demoholder { position: relative; }
        .rp-demoglow { position: absolute; inset: -10% -6% -16%; z-index: -1; filter: blur(14px); }
        .rp-demohead { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid ${BORDER}; margin-bottom: 18px; }
        .rp-dots { display: inline-flex; gap: 6px; }
        .rp-dots i { width: 11px; height: 11px; border-radius: 50%; display: block; }
        .rp-dots i:nth-child(1) { background: #ff5f57; }
        .rp-dots i:nth-child(2) { background: #febc2e; }
        .rp-dots i:nth-child(3) { background: #28c840; }
        .rp-demolabel { color: ${FAINT}; }
        .rp-demobody { display: flex; justify-content: center; }

        /* feature strip */
        .rp-feat { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 680px) { .rp-feat { grid-template-columns: repeat(3, 1fr); } }
        .rp-featcard { padding: 22px; }
        .rp-featicon { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; }
        .rp-feattitle { font-size: 16.5px; font-weight: 700; letter-spacing: -0.01em; margin: 16px 0 0; }
        .rp-featdesc { font-size: 14px; line-height: 1.6; color: ${MUTED}; margin: 8px 0 0; }

        /* footer */
        .rp-footer { position: relative; z-index: 1; border-top: 1px solid ${BORDER}; margin-top: 40px; }
        .rp-footgrid { display: flex; flex-wrap: wrap; gap: 26px; justify-content: space-between; align-items: flex-start; padding: 46px 0 18px; }
        .rp-footlinks { display: flex; flex-wrap: wrap; gap: 28px; }
        .rp-footcol h4 { font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; color: ${FAINT}; margin: 0 0 12px; font-weight: 600; }
        .rp-footcol a { display: flex; align-items: center; gap: 7px; color: ${MUTED}; text-decoration: none; font-size: 14px; padding: 4px 0; transition: color .18s ease; }
        .rp-footcol a:hover { color: ${TEXT}; }
        .rp-footbar { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; padding: 18px 0 40px; border-top: 1px solid ${BORDER}; font-size: 12.5px; color: ${FAINT}; }

        /* focus visibility */
        .rp-focus:focus-visible, .rp-navlink:focus-visible, .rp-navcta:focus-visible,
        .rp-btn-primary:focus-visible, .rp-btn-ghost:focus-visible, .rp-chip:focus-visible,
        .rp-footcol a:focus-visible {
          outline: 2px solid ${BLUE}; outline-offset: 3px; border-radius: 8px;
        }
        a, button { cursor: pointer; }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      {/* background layers */}
      <div className="rp-grid-bg" aria-hidden="true" />
      <motion.div className="rp-glow" aria-hidden="true" style={{ y: reduce ? 0 : glowY }} />

      {/* ── NAVBAR ──────────────────────────────── */}
      <nav className={`rp-nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="Primary">
        <div className="rp-wrap rp-navinner">
          <a href="#top" className="rp-brand rp-focus" style={{ textDecoration: 'none' }}>
            <Logo />
            TalTools
          </a>
          <div className="rp-navlinks">
            {APPS.map((app) => (
              <a key={app.id} href={`#${app.id}`} className="rp-navlink rp-focus">
                {app.name}
              </a>
            ))}
          </div>
          <a href="#apps" className="rp-navcta rp-focus">
            Get the apps
            <ArrowGlyph />
          </a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────── */}
      <header id="top" style={{ position: 'relative', zIndex: 1, paddingTop: 132, paddingBottom: 40 }}>
        <div className="rp-wrap" style={{ textAlign: 'center', maxWidth: 880 }}>
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="rp-pill">
              <span className="rp-pilltag">v1.0</span>
              Three native menu-bar apps, <b>built for macOS</b>
            </span>
          </motion.div>

          <motion.h1
            className="rp-h1"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Tiny tools that live
            <br />
            in your <span className="grad">menu bar.</span>
          </motion.h1>

          <motion.p
            className="rp-sub"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            TalTools makes fast, native macOS utilities that do exactly one thing well,
            with minimal permissions, no accounts, and nothing running in the background it
            does not need.
          </motion.p>

          <motion.div
            className="rp-herobtns"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26 }}
          >
            <a href="#apps" className="rp-btn-primary rp-focus">
              Explore the apps
              <ArrowGlyph />
            </a>
            <a href="#natcho" className="rp-btn-ghost rp-focus">
              Try a live demo
            </a>
          </motion.div>

          <motion.div
            className="rp-trust"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.36 }}
          >
            <span><CheckGlyph color={BLUE} /> Minimal permissions</span>
            <span><CheckGlyph color={BLUE} /> Fully local, no account</span>
            <span><CheckGlyph color={BLUE} /> Notarized &amp; native</span>
          </motion.div>

          {/* app quick-chips */}
          <motion.div
            className="rp-chips"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.46 }}
          >
            {APPS.map((app) => (
              <a key={app.id} href={`#${app.id}`} className="rp-chip rp-focus" style={{ borderColor: rgba(app.accent, 0.34) }}>
                <AppIcon app={app} size={36} />
                <span style={{ textAlign: 'left' }}>
                  <span className="nm" style={{ display: 'block' }}>{app.name}</span>
                  <span className="tg">{app.tagline}</span>
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ── APPS ────────────────────────────────── */}
      <main id="apps" className="rp-wrap" style={{ position: 'relative', zIndex: 1, paddingTop: 56 }}>
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 12 }}
        >
          <span className="rp-seclabel">The collection</span>
          <h2 className="rp-sectitle">Three apps. One philosophy.</h2>
          <p className="rp-secsub">
            Each one is small, focused, and respectful of your Mac. Poke at the live
            previews below. They are fully interactive.
          </p>
        </motion.div>

        {APPS.map((app, i) => (
          <AppSection key={app.id} app={app} index={i} reduce={reduce} />
        ))}
      </main>

      {/* ── WHY / FEATURE STRIP ─────────────────── */}
      <section className="rp-wrap" style={{ position: 'relative', zIndex: 1, paddingTop: 36, paddingBottom: 30 }}>
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 30 }}
        >
          <span className="rp-seclabel">Why TalTools</span>
          <h2 className="rp-sectitle">Built the way Mac apps should be.</h2>
        </motion.div>

        <div className="rp-feat">
          {[
            {
              t: 'Minimal permissions',
              d: 'Each app asks only for what it strictly needs to work, nothing more. No tracking, no surprises.',
              c: VIOLET,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2l7 3v6c0 5-3.4 8.5-7 10-3.6-1.5-7-5-7-10V5l7-3z" stroke={VIOLET} strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="M8.5 12l2.4 2.4L15.5 9.5" stroke={VIOLET} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              t: 'Native &amp; instant',
              d: 'No Electron, no bloat. These are tiny notarized binaries that launch instantly and sip resources.',
              c: BLUE,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M13 2L4 13h6l-1 9 9-11h-6l1-9z" stroke={BLUE} strokeWidth="1.7" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              t: 'Private by default',
              d: 'No accounts to create, no data shipped off your machine. What stays on your Mac, stays on your Mac.',
              c: '#2ec4b6',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="#2ec4b6" strokeWidth="1.7" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#2ec4b6" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              ),
            },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <GlassCard className="rp-featcard" accent={f.c}>
                <div className="rp-featicon" style={{ background: rgba(f.c, 0.14), border: `1px solid ${rgba(f.c, 0.34)}` }}>
                  {f.icon}
                </div>
                <h3 className="rp-feattitle" dangerouslySetInnerHTML={{ __html: f.t }} />
                <p className="rp-featdesc" dangerouslySetInnerHTML={{ __html: f.d }} />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="rp-wrap" style={{ position: 'relative', zIndex: 1, paddingTop: 40, paddingBottom: 20 }}>
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard
            accent={VIOLET}
            style={{
              padding: 'clamp(34px, 6vw, 56px)',
              textAlign: 'center',
              background: `radial-gradient(120% 140% at 50% 0%, ${rgba(VIOLET, 0.16)}, ${CARD} 60%)`,
            }}
          >
            <h2 className="rp-sectitle" style={{ margin: 0 }}>Ready to tidy up your Mac?</h2>
            <p className="rp-secsub" style={{ margin: '14px auto 0' }}>
              Grab any of the three. They are free, fast, and ask for almost nothing in return.
            </p>
            <div className="rp-herobtns">
              {APPS.map((app) => {
                const props = app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
                return (
                  <a
                    key={app.id}
                    href={app.site}
                    {...props}
                    className="rp-btn-ghost rp-focus"
                    style={{ borderColor: rgba(app.accent, 0.45) }}
                  >
                    <AppIcon app={app} size={22} />
                    {app.name}
                    <ArrowGlyph external={app.external} />
                  </a>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="rp-footer">
        <div className="rp-wrap">
          <div className="rp-footgrid">
            <div style={{ maxWidth: 280 }}>
              <div className="rp-brand" style={{ marginLeft: 0 }}>
                <Logo />
                TalTools
              </div>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, margin: '12px 0 0' }}>
                A small studio making focused, native menu-bar utilities for macOS.
              </p>
            </div>

            <div className="rp-footlinks">
              <div className="rp-footcol">
                <h4>Apps</h4>
                {APPS.map((app) => {
                  const props = app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
                  return (
                    <a key={app.id} href={app.site} {...props} className="rp-focus">
                      {app.name}
                      <ArrowGlyph external={app.external} />
                    </a>
                  )
                })}
              </div>
              <div className="rp-footcol">
                <h4>Jump to</h4>
                {APPS.map((app) => (
                  <a key={app.id} href={`#${app.id}`} className="rp-focus">
                    {app.tagline.length > 22 ? app.name : app.tagline}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rp-footbar">
            <span>© {new Date().getFullYear()} TalTools · taltools.site</span>
            <span className="rp-mono" style={{ color: FAINT }}>Crafted for macOS · Minimal permissions</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
