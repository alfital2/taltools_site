import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

/* =========================================================================
 *  Variant 22 - "Cupertino Light"
 *  An Apple.com-style product page: clean, airy, premium. Large SF-like
 *  display headings, generous whitespace, a centered hero, big softly
 *  shadowed product cards, calm scroll-reveal motion, restrained color.
 * ========================================================================= */

const DISPLAY = '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif'
const TEXT = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

const INK = '#1d1d1f'
const SUBTLE = '#6e6e73'
const HAIR = 'rgba(0,0,0,0.08)'

/* ---------- color helpers ---------- */
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]
}
function clamp8(v) { return Math.max(0, Math.min(255, Math.round(v))) }
function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex)
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  return `rgb(${clamp8(r + (t - r) * p)}, ${clamp8(g + (t - g) * p)}, ${clamp8(b + (t - b) * p)})`
}
function rgba(hex, a) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
/* darken an accent until it is legible as text on white (WCAG AA) */
function readable(hex) {
  return shade(hex, -0.42)
}

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

/* shared reveal config */
const EASE = [0.22, 1, 0.36, 1]
function reveal(reduced, delay = 0) {
  return {
    initial: reduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, ease: EASE, delay: reduced ? 0 : delay },
  }
}

/* arrow used in "See the full demo" links */
function Arrow({ color }) {
  return (
    <svg className="cu-arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Check({ color }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden style={{ flex: '0 0 auto' }}>
      <path d="M2.5 7.5 5.5 10.5 11.5 3.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------- demo lookup ---------- */
const DEMO_FOR = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

/* =========================  APP SECTION  ========================= */
function AppSection({ app, index, reduced }) {
  const Demo = DEMO_FOR[app.id]
  const ac = app.accent
  const acText = readable(ac)
  const flip = index % 2 === 1
  const linkProps = app.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.section
      {...reveal(reduced, 0.02)}
      className="cu-card"
      style={{ ['--ac']: ac, ['--ac-text']: acText }}
      aria-labelledby={`cu-${app.id}-title`}
    >
      {/* faint accent wash bleeding from one corner */}
      <span
        className="cu-card-wash"
        aria-hidden
        style={{ background: `radial-gradient(120% 90% at ${flip ? '100% 0%' : '0% 0%'}, ${rgba(ac, 0.13)}, transparent 60%)` }}
      />
      <div className={`cu-card-grid ${flip ? 'cu-flip' : ''}`}>
        {/* ---- copy ---- */}
        <div className="cu-copy">
          <div className="cu-app-head">
            <img
              src={app.icon}
              alt={app.name + ' icon'}
              width={62}
              height={62}
              className="cu-app-icon"
              style={{ borderRadius: '22%' }}
            />
            <div>
              <span className="cu-eyebrow" style={{ color: acText, background: rgba(ac, 0.12) }}>
                {app.id === 'tally' ? 'Menu bar · Usage' : app.id === 'flickey' ? 'Menu bar · Typing' : 'Menu bar · Display'}
              </span>
              <h3 id={`cu-${app.id}-title`} className="cu-app-name">{app.name}</h3>
            </div>
          </div>

          <p className="cu-tagline">{app.tagline}</p>
          <p className="cu-blurb">{app.blurb}</p>

          <ul className="cu-bullets">
            {app.bullets.map((b) => (
              <li key={b}>
                <span className="cu-tick" style={{ background: rgba(ac, 0.14) }}>
                  <Check color={acText} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <a className="cu-fulldemo" href={app.site} {...linkProps} style={{ color: acText }}>
            See the full demo
            <Arrow color={acText} />
          </a>
        </div>

        {/* ---- live demo ---- */}
        <div className="cu-demo">
          <div className="cu-demo-frame" style={{ boxShadow: `0 30px 70px -32px ${rgba(ac, 0.5)}, 0 6px 24px rgba(0,0,0,0.06)` }}>
            <div className="cu-demo-glow" aria-hidden style={{ background: `radial-gradient(circle at 50% 0%, ${rgba(ac, 0.16)}, transparent 70%)` }} />
            <Demo tone="light" />
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* =========================  HERO ORBIT ICONS  ========================= */
function HeroIcons({ reduced }) {
  return (
    <div className="cu-hero-icons" aria-hidden>
      {APPS.map((app, i) => (
        <motion.div
          key={app.id}
          className="cu-hero-chip"
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.5 + i * 0.12 }}
          whileHover={reduced ? undefined : { y: -8, scale: 1.06 }}
          style={{ ['--ac']: app.accent }}
        >
          <span className="cu-hero-chip-glow" style={{ background: rgba(app.accent, 0.4) }} />
          <img
            src={app.icon}
            alt={app.name + ' icon'}
            width={72}
            height={72}
            style={{ borderRadius: '22%', display: 'block', position: 'relative' }}
          />
          <span className="cu-hero-chip-name" style={{ color: readable(app.accent) }}>{app.name}</span>
        </motion.div>
      ))}
    </div>
  )
}

/* =========================  MAIN  ========================= */
export default function Variant22() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)

  // subtle scroll-driven progress bar
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const heroFade = useTransform(scrollYProgress, [0, 0.12], [1, reduced ? 1 : 0])
  const heroLift = useTransform(scrollYProgress, [0, 0.12], [0, reduced ? 0 : -40])

  // self-load fonts
  useEffect(() => {
    const id = 'cu-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap'
    document.head.appendChild(l)
  }, [])

  const year = new Date().getFullYear()

  return (
    <div ref={rootRef} className="cu-root">
      <style>{CU_CSS}</style>

      {/* thin top progress bar; kept clear of the top-left back button */}
      <motion.div className="cu-progress" style={{ scaleX: progress }} aria-hidden />

      {/* soft ambient color field behind everything */}
      <div className="cu-ambient" aria-hidden>
        <span className="cu-blob cu-blob-1" />
        <span className="cu-blob cu-blob-2" />
        <span className="cu-blob cu-blob-3" />
      </div>

      {/* slim sticky top brand bar (below the back button's z-index, clear of corner) */}
      <header className="cu-topbar">
        <div className="cu-topbar-inner">
          <span className="cu-wordmark">TalTools</span>
          <nav className="cu-topnav" aria-label="Apps">
            {APPS.map((a) => (
              <a key={a.id} href={`#cu-${a.id}`} className="cu-topnav-link">{a.name}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <motion.section className="cu-hero" style={{ opacity: heroFade, y: heroLift }}>
        <motion.span
          className="cu-pill"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="cu-pill-dot" /> Three small Mac apps. One careful studio.
        </motion.span>

        <motion.h1
          className="cu-h1"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.06 }}
        >
          Little tools that<br />
          <span className="cu-h1-grad">make the Mac feel yours.</span>
        </motion.h1>

        <motion.p
          className="cu-lede"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.16 }}
        >
          Quiet, focused utilities that live in your menu bar. No clutter, no accounts,
          minimal permissions. Just thoughtful details that disappear into your day.
        </motion.p>

        <motion.div
          className="cu-hero-cta"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.28 }}
        >
          <a href="#cu-natcho" className="cu-btn cu-btn-primary">Explore the apps</a>
          <a href="#cu-natcho" className="cu-btn cu-btn-ghost">
            See them in action <Arrow color="#1d1d1f" />
          </a>
        </motion.div>

        <HeroIcons reduced={reduced} />

        <motion.div
          className="cu-scrollcue"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          aria-hidden
        >
          <span className="cu-scrollcue-mouse"><span className="cu-scrollcue-wheel" /></span>
        </motion.div>
      </motion.section>

      {/* ===== INTRO STRIP ===== */}
      <motion.section className="cu-strip" {...reveal(reduced)}>
        <h2 className="cu-strip-h">Designed to get out of the way.</h2>
        <p className="cu-strip-p">
          Each app does exactly one thing, beautifully. Try the live demos below, then take
          the full tour. Everything runs locally and respects your privacy.
        </p>
      </motion.section>

      {/* ===== APP SECTIONS ===== */}
      <main className="cu-apps">
        {APPS.map((app, i) => (
          <div key={app.id} id={`cu-${app.id}`} className="cu-anchor">
            <AppSection app={app} index={i} reduced={reduced} />
          </div>
        ))}
      </main>

      {/* ===== CLOSING / TRUST ===== */}
      <motion.section className="cu-trust" {...reveal(reduced)}>
        <h2 className="cu-trust-h">Built quietly. Shipped carefully.</h2>
        <p className="cu-trust-p">
          Notarized, lightweight, and respectful of your machine and your attention.
        </p>
        <ul className="cu-trust-grid">
          <li>
            <span className="cu-trust-icon">{lockSvg}</span>
            <strong>Minimal permissions</strong>
            <span>Only what each tool truly needs, nothing more.</span>
          </li>
          <li>
            <span className="cu-trust-icon">{featherSvg}</span>
            <strong>Featherweight</strong>
            <span>Tiny downloads that stay out of your way.</span>
          </li>
          <li>
            <span className="cu-trust-icon">{barSvg}</span>
            <strong>Lives in the menu bar</strong>
            <span>Always a glance away, never in your face.</span>
          </li>
        </ul>
      </motion.section>

      <footer className="cu-footer">
        <span className="cu-wordmark cu-wordmark-sm">TalTools</span>
        <span className="cu-footer-meta">Small Mac utilities, made with care · © {year}</span>
      </footer>
    </div>
  )
}

/* ---------- inline trust SVGs (no external images) ---------- */
const lockSvg = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4.5" y="10.5" width="15" height="10" rx="3" stroke="#1d1d1f" strokeWidth="1.6" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="15.5" r="1.4" fill="#1d1d1f" />
  </svg>
)
const featherSvg = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M20 4c-7 0-13 6-13 13l-2 3 3-2c7 0 13-6 13-13 0 0-.5-1-1-1Z" stroke="#1d1d1f" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6.5 17.5 15 9M13 9h2.5M11 12h2.5" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
const barSvg = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="#1d1d1f" strokeWidth="1.6" />
    <path d="M3.5 9.5h17" stroke="#1d1d1f" strokeWidth="1.6" />
    <circle cx="6.3" cy="7.5" r="0.8" fill="#1d1d1f" />
    <circle cx="8.6" cy="7.5" r="0.8" fill="#1d1d1f" />
  </svg>
)

/* =========================  STYLES  ========================= */
const CU_CSS = `
.cu-root {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background:
    radial-gradient(140% 80% at 50% -10%, #ffffff 0%, #f7f7f9 42%, #f1f1f4 100%);
  color: ${INK};
  font-family: ${TEXT};
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.cu-root *::selection { background: rgba(124,92,255,0.18); }

/* focus visibility everywhere */
.cu-root a:focus-visible,
.cu-root button:focus-visible {
  outline: 2.5px solid #0a84ff;
  outline-offset: 3px;
  border-radius: 8px;
}

/* scroll progress bar starts at top; the back button sits above it (z-9999) */
.cu-progress {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  transform-origin: 0% 50%;
  background: linear-gradient(90deg, #ffb703, #7c5cff 50%, #2ec4b6);
  z-index: 60;
}

/* ambient blobs */
.cu-ambient { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.cu-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
.cu-blob-1 { width: 46vw; height: 46vw; top: -12vw; right: -8vw; background: rgba(255,183,3,0.22); }
.cu-blob-2 { width: 40vw; height: 40vw; top: 38vh; left: -12vw; background: rgba(124,92,255,0.18); }
.cu-blob-3 { width: 44vw; height: 44vw; bottom: -14vw; right: -6vw; background: rgba(46,196,182,0.18); }

/* top bar */
.cu-topbar {
  position: sticky; top: 0; z-index: 40;
  backdrop-filter: saturate(180%) blur(18px);
  background: rgba(255,255,255,0.7);
  border-bottom: 1px solid ${HAIR};
}
.cu-topbar-inner {
  max-width: 1120px; margin: 0 auto;
  /* extra left padding keeps the wordmark clear of the fixed back button */
  padding: 11px 22px 11px 86px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.cu-wordmark {
  font-family: ${DISPLAY};
  font-weight: 800; font-size: 18px; letter-spacing: -0.02em; color: ${INK};
}
.cu-topnav { display: flex; gap: 6px; }
.cu-topnav-link {
  font-size: 14px; font-weight: 600; color: ${SUBTLE};
  text-decoration: none; padding: 6px 12px; border-radius: 999px;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.cu-topnav-link:hover { color: ${INK}; background: rgba(0,0,0,0.045); }

/* ===== HERO ===== */
.cu-hero {
  position: relative; z-index: 2;
  max-width: 1000px; margin: 0 auto;
  padding: clamp(64px, 11vw, 130px) 24px clamp(40px, 7vw, 80px);
  text-align: center;
}
.cu-pill {
  display: inline-flex; align-items: center; gap: 9px;
  font-size: 13.5px; font-weight: 600; letter-spacing: 0.01em;
  color: ${SUBTLE}; background: rgba(255,255,255,0.8);
  border: 1px solid ${HAIR};
  padding: 7px 16px; border-radius: 999px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.cu-pill-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: linear-gradient(135deg, #ffb703, #7c5cff);
}
.cu-h1 {
  font-family: ${DISPLAY};
  font-size: clamp(40px, 8.2vw, 82px);
  font-weight: 800; line-height: 1.02; letter-spacing: -0.035em;
  margin: 26px auto 0; max-width: 14ch; color: ${INK};
}
.cu-h1-grad {
  background: linear-gradient(108deg, #f5a300 0%, #7c5cff 52%, #1fa99b 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.cu-lede {
  max-width: 600px; margin: 24px auto 0;
  font-size: clamp(16px, 2.3vw, 20px); font-weight: 400; line-height: 1.55;
  color: ${SUBTLE};
}
.cu-hero-cta {
  margin-top: 32px;
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
}
.cu-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 600; text-decoration: none;
  padding: 13px 26px; border-radius: 999px; cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  border: 1px solid transparent;
}
.cu-btn-primary {
  color: #fff; background: ${INK};
  box-shadow: 0 8px 24px -8px rgba(0,0,0,0.45);
}
.cu-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -10px rgba(0,0,0,0.5); }
.cu-btn-ghost {
  color: ${INK}; background: rgba(255,255,255,0.7);
  border-color: ${HAIR};
}
.cu-btn-ghost:hover { transform: translateY(-2px); background: #fff; }
.cu-btn-ghost .cu-arrow { transition: transform 0.2s ease; }
.cu-btn-ghost:hover .cu-arrow { transform: translateX(3px); }

/* hero icon chips */
.cu-hero-icons {
  margin: clamp(44px, 8vw, 72px) auto 0;
  display: flex; flex-wrap: wrap; gap: clamp(20px, 6vw, 56px);
  align-items: flex-end; justify-content: center;
}
.cu-hero-chip {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  cursor: default;
}
.cu-hero-chip-glow {
  position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
  width: 84px; height: 84px; border-radius: 24px;
  filter: blur(26px); opacity: 0.55; z-index: 0;
}
.cu-hero-chip img { box-shadow: 0 16px 34px -14px rgba(0,0,0,0.4); }
.cu-hero-chip-name {
  font-family: ${DISPLAY};
  font-size: 15px; font-weight: 700; letter-spacing: -0.01em;
}

.cu-scrollcue { margin: clamp(40px, 7vw, 64px) auto 0; width: fit-content; }
.cu-scrollcue-mouse {
  display: block; width: 24px; height: 38px; border-radius: 13px;
  border: 2px solid rgba(0,0,0,0.22); position: relative;
}
.cu-scrollcue-wheel {
  position: absolute; left: 50%; top: 7px; width: 4px; height: 7px; border-radius: 2px;
  background: rgba(0,0,0,0.4); transform: translateX(-50%);
  animation: cu-wheel 1.6s ease-in-out infinite;
}
@keyframes cu-wheel { 0%,100% { opacity: 0; transform: translate(-50%, 0); } 40% { opacity: 1; } 70% { opacity: 0; transform: translate(-50%, 11px); } }

/* ===== INTRO STRIP ===== */
.cu-strip {
  position: relative; z-index: 2;
  max-width: 760px; margin: 0 auto; padding: clamp(30px, 6vw, 60px) 24px;
  text-align: center;
}
.cu-strip-h {
  font-family: ${DISPLAY};
  font-size: clamp(26px, 4.6vw, 42px); font-weight: 800; letter-spacing: -0.03em;
  margin: 0; color: ${INK};
}
.cu-strip-p {
  margin: 16px auto 0; max-width: 560px;
  font-size: clamp(15px, 2.1vw, 18px); line-height: 1.55; color: ${SUBTLE};
}

/* ===== APP SECTIONS ===== */
.cu-apps {
  position: relative; z-index: 2;
  max-width: 1120px; margin: 0 auto;
  padding: clamp(20px, 4vw, 40px) 22px clamp(40px, 7vw, 80px);
  display: flex; flex-direction: column; gap: clamp(28px, 5vw, 56px);
}
.cu-anchor { scroll-margin-top: 80px; }

.cu-card {
  position: relative; overflow: hidden;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 32px;
  padding: clamp(24px, 4vw, 52px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.9) inset,
    0 30px 60px -34px rgba(20,20,40,0.28),
    0 4px 14px rgba(20,20,40,0.05);
  backdrop-filter: blur(8px);
}
.cu-card-wash { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

.cu-card-grid {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1.02fr 1fr; gap: clamp(28px, 4.5vw, 56px);
  align-items: center;
}
.cu-flip .cu-copy { order: 2; }
.cu-flip .cu-demo { order: 1; }

.cu-copy { min-width: 0; }
.cu-app-head { display: flex; align-items: center; gap: 16px; }
.cu-app-icon { box-shadow: 0 10px 24px -10px rgba(0,0,0,0.35); flex: 0 0 auto; }
.cu-eyebrow {
  display: inline-block;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 999px;
}
.cu-app-name {
  font-family: ${DISPLAY};
  font-size: clamp(28px, 4.2vw, 40px); font-weight: 800; letter-spacing: -0.03em;
  margin: 7px 0 0; color: ${INK};
}
.cu-tagline {
  font-family: ${DISPLAY};
  font-size: clamp(18px, 2.6vw, 23px); font-weight: 600; letter-spacing: -0.01em;
  margin: 18px 0 0; color: ${INK};
}
.cu-blurb {
  margin: 12px 0 0; font-size: clamp(15px, 1.9vw, 17px); line-height: 1.58; color: ${SUBTLE};
}
.cu-bullets { list-style: none; margin: 22px 0 0; padding: 0; display: grid; gap: 11px; }
.cu-bullets li {
  display: flex; align-items: center; gap: 11px;
  font-size: 15px; font-weight: 500; color: #3a3a3e;
}
.cu-tick {
  width: 22px; height: 22px; border-radius: 50%;
  display: inline-grid; place-items: center; flex: 0 0 auto;
}
.cu-fulldemo {
  display: inline-flex; align-items: center; gap: 7px;
  margin-top: 26px; font-size: 16px; font-weight: 700; text-decoration: none;
  transition: gap 0.2s ease;
}
.cu-fulldemo:hover { gap: 12px; }
.cu-arrow { transition: transform 0.2s ease; }

/* demo column */
.cu-demo { min-width: 0; }
.cu-demo-frame {
  position: relative; overflow: hidden;
  border-radius: 24px;
  padding: clamp(18px, 3vw, 28px);
  background: linear-gradient(165deg, #ffffff, #f4f4f7);
  border: 1px solid rgba(0,0,0,0.06);
}
.cu-demo-glow { position: absolute; inset: 0; pointer-events: none; }
.cu-demo-frame > :not(.cu-demo-glow) { position: relative; z-index: 1; }

/* ===== TRUST ===== */
.cu-trust {
  position: relative; z-index: 2;
  max-width: 1040px; margin: 0 auto; padding: clamp(30px, 6vw, 70px) 24px;
  text-align: center;
}
.cu-trust-h {
  font-family: ${DISPLAY};
  font-size: clamp(26px, 4.6vw, 44px); font-weight: 800; letter-spacing: -0.03em;
  margin: 0; color: ${INK};
}
.cu-trust-p {
  margin: 14px auto 0; max-width: 520px;
  font-size: clamp(15px, 2.1vw, 18px); line-height: 1.55; color: ${SUBTLE};
}
.cu-trust-grid {
  list-style: none; margin: clamp(32px, 5vw, 48px) 0 0; padding: 0;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
}
.cu-trust-grid li {
  background: rgba(255,255,255,0.8);
  border: 1px solid ${HAIR};
  border-radius: 22px; padding: 26px 22px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  box-shadow: 0 18px 40px -28px rgba(20,20,40,0.3);
}
.cu-trust-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: grid; place-items: center; margin-bottom: 6px;
  background: rgba(0,0,0,0.04);
}
.cu-trust-grid strong { font-family: ${DISPLAY}; font-size: 17px; font-weight: 700; color: ${INK}; }
.cu-trust-grid span:last-child { font-size: 14px; line-height: 1.5; color: ${SUBTLE}; }

/* ===== FOOTER ===== */
.cu-footer {
  position: relative; z-index: 2;
  max-width: 1120px; margin: 0 auto;
  padding: 28px 24px 56px;
  border-top: 1px solid ${HAIR};
  display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
}
.cu-wordmark-sm { font-size: 16px; }
.cu-footer-meta { font-size: 13.5px; color: ${SUBTLE}; }

/* ===== RESPONSIVE ===== */
@media (max-width: 860px) {
  .cu-card-grid { grid-template-columns: 1fr; gap: clamp(24px, 6vw, 36px); }
  .cu-flip .cu-copy, .cu-flip .cu-demo { order: 0; }
  .cu-trust-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .cu-topnav { display: none; }
  .cu-topbar-inner { padding-left: 78px; }
  .cu-hero-icons { gap: 26px; }
  .cu-hero-chip-glow { width: 64px; height: 64px; }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .cu-scrollcue-wheel { animation: none; }
  .cu-root * { scroll-behavior: auto !important; }
}
`
