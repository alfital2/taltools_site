import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

/* =========================================================================
 *  Variant 23 - "Bento Mosaic"
 *  A polished, dark bento-grid landing page for the TalTools umbrella site.
 *  A responsive mosaic of rounded cards (apps, demos, stats, features) with a
 *  cohesive accent system, gentle hover lift, and immaculate alignment.
 *  Tone passed to the demos is 'dark' to match the surface.
 * ========================================================================= */

const DISPLAY = '"Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const BODY = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

/* ---------- color helpers ---------- */
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]
}
function rgba(hex, a) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const NATCHO = APPS.find((a) => a.id === 'natcho')
const FLICKEY = APPS.find((a) => a.id === 'flickey')
const TALLY = APPS.find((a) => a.id === 'tally')

/* ---------- small UI atoms ---------- */
function Arrow() {
  return (
    <svg className="bm-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Check({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flex: '0 0 auto' }}>
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AppIcon({ app, size = 44 }) {
  return (
    <img
      src={app.icon}
      alt={app.name + ' icon'}
      width={size}
      height={size}
      style={{ borderRadius: '22%', display: 'block', boxShadow: '0 6px 18px rgba(0,0,0,0.45)' }}
    />
  )
}

function FullDemoLink({ app }) {
  const ext = app.external
  return (
    <a
      className="bm-link"
      href={app.site}
      style={{ color: app.accent }}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      See the full demo
      <Arrow />
    </a>
  )
}

/* shared whileInView reveal */
function reveal(reduced, delay = 0) {
  if (reduced) return { initial: false }
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
  }
}

/* ---------- an app tile that hosts a live demo ---------- */
function AppTile({ app, reduced, children, className = '', span }) {
  return (
    <motion.section
      className={`bm-tile bm-app ${className}`}
      style={{ ['--ac']: app.accent, ['--acsoft']: rgba(app.accent, 0.16), gridColumn: span }}
      {...reveal(reduced)}
    >
      <div
        className="bm-app-glow"
        aria-hidden="true"
        style={{ background: `radial-gradient(120% 90% at 0% 0%, ${rgba(app.accent, 0.22)}, transparent 60%)` }}
      />
      <div className="bm-app-grid">
        <div className="bm-app-info">
          <header className="bm-app-head">
            <AppIcon app={app} size={52} />
            <div>
              <h3 className="bm-app-name">{app.name}</h3>
              <p className="bm-app-tag" style={{ color: app.accent }}>{app.tagline}</p>
            </div>
          </header>
          <p className="bm-app-blurb">{app.blurb}</p>
          <ul className="bm-bullets">
            {app.bullets.map((b) => (
              <li key={b}>
                <span className="bm-tick" style={{ background: rgba(app.accent, 0.16) }}>
                  <Check color={app.accent} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <FullDemoLink app={app} />
        </div>
        <div className="bm-app-demo">{children}</div>
      </div>
    </motion.section>
  )
}

/* ---------- generic small bento tiles ---------- */
function StatTile({ value, label, accent, reduced, delay }) {
  return (
    <motion.div className="bm-tile bm-stat" {...reveal(reduced, delay)}>
      <span className="bm-stat-value" style={{ color: accent }}>{value}</span>
      <span className="bm-stat-label">{label}</span>
    </motion.div>
  )
}

export default function Variant23() {
  const reduced = useReducedMotion()

  /* self-load Google Fonts */
  useEffect(() => {
    const id = 'bm-fonts'
    if (document.getElementById(id)) return
    const pre1 = document.createElement('link')
    pre1.rel = 'preconnect'
    pre1.href = 'https://fonts.googleapis.com'
    const pre2 = document.createElement('link')
    pre2.rel = 'preconnect'
    pre2.href = 'https://fonts.gstatic.com'
    pre2.crossOrigin = 'anonymous'
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap'
    document.head.appendChild(pre1)
    document.head.appendChild(pre2)
    document.head.appendChild(link)
  }, [])

  return (
    <div className="bm-root">
      <style>{CSS}</style>

      {/* ambient backdrop */}
      <div className="bm-backdrop" aria-hidden="true">
        <div className="bm-orb bm-orb-1" style={{ background: rgba(NATCHO.accent, 0.4) }} />
        <div className="bm-orb bm-orb-2" style={{ background: rgba(FLICKEY.accent, 0.4) }} />
        <div className="bm-orb bm-orb-3" style={{ background: rgba(TALLY.accent, 0.4) }} />
        <div className="bm-grid-lines" />
      </div>

      <main className="bm-wrap">
        {/* ============ HERO ============ */}
        <section className="bm-hero">
          <motion.span className="bm-eyebrow" {...reveal(reduced)}>
            <span className="bm-dot" />
            Mac menu-bar tools, beautifully small
          </motion.span>

          <motion.h1 className="bm-h1" {...reveal(reduced, 0.05)}>
            Tiny apps that do
            <br />
            <span className="bm-h1-grad">one thing, perfectly.</span>
          </motion.h1>

          <motion.p className="bm-lead" {...reveal(reduced, 0.1)}>
            TalTools is a small studio building focused macOS menu-bar apps. Native, fast, and
            respectful of your machine, each one asks for minimal permissions and stays out of
            your way until you need it.
          </motion.p>

          <motion.div className="bm-hero-chips" {...reveal(reduced, 0.15)}>
            {APPS.map((app) => (
              <a
                key={app.id}
                className="bm-chip"
                href={`#app-${app.id}`}
                style={{ ['--ac']: app.accent }}
              >
                <AppIcon app={app} size={26} />
                {app.name}
              </a>
            ))}
          </motion.div>
        </section>

        {/* ============ STAT STRIP ============ */}
        <section className="bm-statgrid" aria-label="At a glance">
          <StatTile value="3" label="focused apps" accent={NATCHO.accent} reduced={reduced} delay={0} />
          <StatTile value="0" label="accounts required" accent={FLICKEY.accent} reduced={reduced} delay={0.06} />
          <StatTile value="100%" label="native macOS" accent={TALLY.accent} reduced={reduced} delay={0.12} />
          <motion.div className="bm-tile bm-stat bm-stat-wide" {...reveal(reduced, 0.18)}>
            <span className="bm-stat-value bm-stat-mini">Minimal permissions</span>
            <span className="bm-stat-label">notarized, local-first, and light on resources</span>
          </motion.div>
        </section>

        {/* ============ NATCHO ============ */}
        <div id="app-natcho" className="bm-anchor" />
        <AppTile app={NATCHO} reduced={reduced}>
          <NatchoDemo tone="dark" className="bm-demo-inner" />
        </AppTile>

        {/* ============ FLICKEY ============ */}
        <div id="app-flickey" className="bm-anchor" />
        <AppTile app={FLICKEY} reduced={reduced} className="bm-app-rev">
          <FlicKeyDemo tone="dark" className="bm-demo-inner" />
        </AppTile>

        {/* ============ TALLY ============ */}
        <div id="app-tally" className="bm-anchor" />
        <AppTile app={TALLY} reduced={reduced}>
          <TallyDemo className="bm-demo-inner" />
        </AppTile>

        {/* ============ FEATURE MOSAIC ============ */}
        <section className="bm-mosaic" aria-label="Why TalTools">
          <motion.div className="bm-tile bm-feature bm-feat-lg" {...reveal(reduced)}>
            <span className="bm-feat-emoji" aria-hidden="true">🔒</span>
            <h4 className="bm-feat-title">Local-first &amp; private</h4>
            <p className="bm-feat-body">
              No accounts to create, no telemetry funnels. Your data stays on your Mac, secured
              with the system Keychain when credentials are needed.
            </p>
          </motion.div>

          <motion.div className="bm-tile bm-feature" {...reveal(reduced, 0.06)} style={{ ['--ac']: NATCHO.accent }}>
            <span className="bm-feat-emoji" aria-hidden="true">⚡️</span>
            <h4 className="bm-feat-title">Featherweight</h4>
            <p className="bm-feat-body">Notarized builds that sip resources. Natcho is just 0.6 MB.</p>
          </motion.div>

          <motion.div className="bm-tile bm-feature" {...reveal(reduced, 0.12)} style={{ ['--ac']: FLICKEY.accent }}>
            <span className="bm-feat-emoji" aria-hidden="true">🎛️</span>
            <h4 className="bm-feat-title">Lives in the menu bar</h4>
            <p className="bm-feat-body">Always a glance away, never in your dock or your face.</p>
          </motion.div>

          <motion.div className="bm-tile bm-feature bm-feat-accent" {...reveal(reduced, 0.18)}>
            <span className="bm-feat-emoji" aria-hidden="true">✨</span>
            <h4 className="bm-feat-title">Crafted, not cranked out</h4>
            <p className="bm-feat-body">
              Every detail tuned by hand, from rounded corners to reset countdowns. Three tools,
              one obsessive standard.
            </p>
          </motion.div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="bm-footer">
          <div className="bm-footer-brand">
            <span className="bm-foot-logo">Tal<span style={{ color: TALLY.accent }}>Tools</span></span>
            <span className="bm-foot-tag">Tiny Mac apps, made with care.</span>
          </div>
          <nav className="bm-footer-links" aria-label="Apps">
            {APPS.map((app) => (
              <a
                key={app.id}
                className="bm-foot-link"
                href={app.site}
                style={{ ['--ac']: app.accent }}
                {...(app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {app.name}
              </a>
            ))}
          </nav>
          <span className="bm-foot-copy">© {new Date().getFullYear()} TalTools</span>
        </footer>
      </main>
    </div>
  )
}

const CSS = `
.bm-root {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background: #0a0a12;
  color: #e9e9f2;
  font-family: ${BODY};
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.bm-root *, .bm-root *::before, .bm-root *::after { box-sizing: border-box; }

/* ---------- backdrop ---------- */
.bm-backdrop { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.bm-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.55; }
.bm-orb-1 { width: 46vw; height: 46vw; top: -10vw; left: -8vw; }
.bm-orb-2 { width: 40vw; height: 40vw; top: 38vh; right: -10vw; }
.bm-orb-3 { width: 42vw; height: 42vw; bottom: -12vw; left: 22vw; }
.bm-grid-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 80%);
}

.bm-wrap {
  position: relative; z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 20px 64px;
}

/* ---------- hero ---------- */
.bm-hero { padding: 116px 0 18px; text-align: center; max-width: 820px; margin: 0 auto; }
.bm-eyebrow {
  display: inline-flex; align-items: center; gap: 9px;
  font-size: 13px; font-weight: 600; letter-spacing: 0.01em;
  color: #c7c7d8;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 7px 15px; border-radius: 999px;
  backdrop-filter: blur(8px);
}
.bm-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: ${TALLY.accent};
  box-shadow: 0 0 0 4px ${rgba(TALLY.accent, 0.2)};
}
.bm-h1 {
  font-family: ${DISPLAY};
  font-size: clamp(38px, 7.4vw, 76px);
  font-weight: 800; line-height: 1.02; letter-spacing: -0.03em;
  margin: 24px 0 0;
}
.bm-h1-grad {
  background: linear-gradient(100deg, ${NATCHO.accent}, ${FLICKEY.accent} 52%, ${TALLY.accent});
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.bm-lead {
  max-width: 600px; margin: 22px auto 0;
  font-size: clamp(15px, 2.1vw, 18px); line-height: 1.6;
  color: #b3b3c6;
}
.bm-hero-chips {
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
  margin-top: 30px;
}
.bm-chip {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 14px; font-weight: 600; color: #e9e9f2;
  text-decoration: none;
  padding: 9px 16px 9px 10px; border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.bm-chip:hover { transform: translateY(-2px); border-color: var(--ac); background: rgba(255,255,255,0.08); }

/* ---------- shared tile ---------- */
.bm-tile {
  position: relative;
  background: rgba(20,20,30,0.66);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  backdrop-filter: blur(14px);
  transition: transform 0.25s cubic-bezier(.16,1,.3,1), border-color 0.25s ease, box-shadow 0.25s ease;
}
.bm-tile:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.16);
  box-shadow: 0 18px 50px rgba(0,0,0,0.4);
}

/* ---------- stat strip ---------- */
.bm-statgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 1.6fr;
  gap: 16px;
  margin-top: 44px;
}
.bm-stat {
  display: flex; flex-direction: column; gap: 4px;
  padding: 22px 24px; justify-content: center;
}
.bm-stat-value {
  font-family: ${DISPLAY};
  font-size: clamp(30px, 5vw, 44px); font-weight: 800; line-height: 1; letter-spacing: -0.02em;
}
.bm-stat-mini { font-size: clamp(20px, 3vw, 26px); color: #f2f2fa; }
.bm-stat-label { font-size: 13.5px; font-weight: 500; color: #9a9ab0; }
.bm-stat-wide { gap: 6px; }

/* ---------- app tiles ---------- */
.bm-anchor { position: relative; top: -90px; visibility: hidden; }
.bm-app { margin-top: 40px; overflow: hidden; padding: 0; }
.bm-app-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0.9; }
.bm-app-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 8px;
  align-items: center;
}
.bm-app-rev .bm-app-grid { grid-template-columns: 1.05fr 1fr; }
.bm-app-rev .bm-app-info { order: 2; }
.bm-app-rev .bm-app-demo { order: 1; }

.bm-app-info { padding: 40px clamp(24px, 3vw, 44px); }
.bm-app-head { display: flex; align-items: center; gap: 16px; }
.bm-app-name { font-family: ${DISPLAY}; font-size: clamp(26px, 3.4vw, 34px); font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.bm-app-tag { font-size: 14.5px; font-weight: 600; margin: 4px 0 0; }
.bm-app-blurb { font-size: 15.5px; line-height: 1.6; color: #c2c2d4; margin: 20px 0 0; }

.bm-bullets { list-style: none; margin: 22px 0 26px; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 11px 18px; }
.bm-bullets li { display: flex; align-items: center; gap: 9px; font-size: 14px; font-weight: 500; color: #d4d4e2; }
.bm-tick { width: 22px; height: 22px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; }

.bm-link {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 15px; font-weight: 700; text-decoration: none;
  cursor: pointer;
  transition: gap 0.2s ease;
}
.bm-link:hover { gap: 11px; }
.bm-link:hover .bm-arrow { transform: translateX(2px); }
.bm-arrow { transition: transform 0.2s ease; }

.bm-app-demo {
  padding: 34px clamp(20px, 3vw, 40px);
  align-self: stretch;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.22);
  border-left: 1px solid rgba(255,255,255,0.06);
}
.bm-app-rev .bm-app-demo { border-left: none; border-right: 1px solid rgba(255,255,255,0.06); }
.bm-demo-inner { width: 100%; max-width: 420px; }

/* ---------- feature mosaic ---------- */
.bm-mosaic {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 40px;
}
.bm-feature { padding: 26px 26px 28px; display: flex; flex-direction: column; }
.bm-feat-lg { grid-column: span 2; grid-row: span 2; justify-content: flex-end; }
.bm-feat-accent { grid-column: span 2; --ac: ${TALLY.accent}; }
.bm-feat-emoji { font-size: 26px; margin-bottom: 14px; }
.bm-feat-lg .bm-feat-emoji { font-size: 34px; }
.bm-feat-title { font-family: ${DISPLAY}; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 8px; }
.bm-feat-lg .bm-feat-title { font-size: clamp(22px, 2.6vw, 28px); }
.bm-feat-body { font-size: 14px; line-height: 1.55; color: #aaaabf; margin: 0; }
.bm-feat-lg .bm-feat-body { font-size: 15.5px; max-width: 36ch; }

/* ---------- footer ---------- */
.bm-footer {
  margin-top: 56px; padding: 30px clamp(20px, 3vw, 34px);
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px;
  background: rgba(20,20,30,0.5);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
}
.bm-footer-brand { display: flex; flex-direction: column; gap: 3px; }
.bm-foot-logo { font-family: ${DISPLAY}; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
.bm-foot-tag { font-size: 13px; color: #9a9ab0; }
.bm-footer-links { display: flex; gap: 8px; flex-wrap: wrap; }
.bm-foot-link {
  font-size: 14px; font-weight: 600; color: #d4d4e2; text-decoration: none;
  padding: 8px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}
.bm-foot-link:hover { border-color: var(--ac); color: #fff; background: rgba(255,255,255,0.05); }
.bm-foot-copy { font-size: 13px; color: #84849a; }

/* ---------- focus states ---------- */
.bm-root a:focus-visible,
.bm-root button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
  border-radius: 8px;
}

/* ---------- responsive ---------- */
@media (max-width: 920px) {
  .bm-statgrid { grid-template-columns: 1fr 1fr; }
  .bm-stat-wide { grid-column: 1 / -1; }
  .bm-app-grid, .bm-app-rev .bm-app-grid { grid-template-columns: 1fr; }
  .bm-app-rev .bm-app-info { order: 1; }
  .bm-app-rev .bm-app-demo { order: 2; }
  .bm-app-demo { border-left: none; border-top: 1px solid rgba(255,255,255,0.06); }
  .bm-app-rev .bm-app-demo { border-right: none; border-top: 1px solid rgba(255,255,255,0.06); }
  .bm-mosaic { grid-template-columns: repeat(2, 1fr); }
  .bm-feat-lg { grid-column: span 2; grid-row: auto; }
  .bm-feat-accent { grid-column: span 2; }
}

@media (max-width: 560px) {
  .bm-hero { padding-top: 96px; }
  .bm-statgrid { grid-template-columns: 1fr 1fr; }
  .bm-app-info { padding: 30px 22px; }
  .bm-app-demo { padding: 26px 18px; }
  .bm-bullets { grid-template-columns: 1fr; }
  .bm-mosaic { grid-template-columns: 1fr; }
  .bm-feat-lg, .bm-feat-accent { grid-column: auto; }
  .bm-footer { flex-direction: column; align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .bm-tile { transition: border-color 0.2s ease; }
  .bm-tile:hover { transform: none; }
  .bm-chip:hover, .bm-link:hover { transform: none; }
}
`
