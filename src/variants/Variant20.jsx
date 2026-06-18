import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { APPS } from '../apps.js'

const DISPLAY = '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const PAPER = '#f3efe6'
const INK = '#2a2620'

/* ---------- color helpers: derive folded-facet shades from an accent hex ---------- */
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]
}
function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))) }
/* shade: amt -1..1 (negative darkens, positive lightens) */
function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex)
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  return `rgb(${clamp(r + (t - r) * p)}, ${clamp(g + (t - g) * p)}, ${clamp(b + (t - b) * p)})`
}
function rgba(hex, a) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
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

/* ---------- a single folded-paper "gem" that unfolds to reveal app content ---------- */
function PaperApp({ app, index, reduced }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // open on scroll-into-view too (and stay open if reduced motion)
  useEffect(() => {
    if (reduced) { setOpen(true); return }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setOpen(true) }),
      { threshold: 0.45 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const a = app.accent
  // facet palette derived from accent
  const f = {
    lit: shade(a, 0.42),
    light: shade(a, 0.24),
    mid: shade(a, 0.04),
    dark: shade(a, -0.22),
    deep: shade(a, -0.4),
  }

  const ease = [0.16, 1, 0.3, 1]
  const tInit = reduced ? false : { opacity: 0, y: 40, rotateX: -8 }
  const tWhile = { opacity: 1, y: 0, rotateX: 0 }

  return (
    <motion.article
      ref={ref}
      initial={tInit}
      whileInView={tWhile}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease, delay: reduced ? 0 : index * 0.08 }}
      onMouseEnter={() => !reduced && setOpen(true)}
      onMouseLeave={() => !reduced && setOpen(false)}
      onFocus={() => setOpen(true)}
      className="ori-card"
      style={{ ['--ac']: a }}
    >
      {/* The folded object (left): a faceted paper gem that "unfolds" */}
      <div className="ori-gemwrap" style={{ perspective: '900px' }}>
        <div
          className="ori-gem"
          style={{
            transformStyle: 'preserve-3d',
            transform: open ? 'rotateX(0deg) rotateY(0deg) scale(1.02)' : 'rotateX(14deg) rotateY(-18deg)',
            transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(.16,1,.3,1)',
          }}
        >
          {/* facets — each a clip-path polygon in a slightly different shade */}
          <span
            className="ori-facet"
            style={{
              background: f.lit,
              clipPath: 'polygon(50% 0%, 100% 38%, 50% 50%, 0% 38%)',
              transform: open ? 'translateZ(26px) rotateX(-32deg)' : 'translateZ(0px) rotateX(0deg)',
              transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <span
            className="ori-facet"
            style={{
              background: f.light,
              clipPath: 'polygon(100% 38%, 50% 100%, 50% 50%)',
              transform: open ? 'translateX(30px) rotateY(34deg)' : 'none',
              transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(.16,1,.3,1) 0.06s',
            }}
          />
          <span
            className="ori-facet"
            style={{
              background: f.deep,
              clipPath: 'polygon(0% 38%, 50% 50%, 50% 100%)',
              transform: open ? 'translateX(-30px) rotateY(-34deg)' : 'none',
              transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(.16,1,.3,1) 0.06s',
            }}
          />
          <span
            className="ori-facet"
            style={{
              background: f.dark,
              clipPath: 'polygon(0% 38%, 50% 50%, 50% 0%)',
              transform: open ? 'translateZ(-10px) rotateY(-12deg)' : 'none',
              transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <span
            className="ori-facet"
            style={{
              background: f.mid,
              clipPath: 'polygon(100% 38%, 50% 50%, 50% 0%)',
              transform: open ? 'translateZ(-10px) rotateY(12deg)' : 'none',
              transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <span className="ori-emoji" style={{ transform: open ? 'translateZ(60px)' : 'translateZ(28px)' }}>
            {app.emoji}
          </span>
        </div>
      </div>

      {/* The unfolded paper (right): tagline + blurb + bullets, revealed when open */}
      <div className="ori-leaf" style={{ perspective: '1100px' }}>
        <motion.div
          className="ori-leaf-inner"
          initial={false}
          animate={
            reduced
              ? { rotateY: 0, opacity: 1 }
              : open
                ? { rotateY: 0, opacity: 1 }
                : { rotateY: -62, opacity: 0 }
          }
          transition={{ duration: 0.8, ease }}
          style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d', background: `linear-gradient(155deg, ${shade(a, 0.92)}, ${shade(a, 0.78)})`, borderLeft: `4px solid ${rgba(a, 0.55)}` }}
        >
          <div className="ori-leaf-corner" style={{ background: shade(a, 0.6) }} />
          <span className="ori-kicker" style={{ color: shade(a, -0.35) }}>{app.name}</span>
          <h3 className="ori-tag" style={{ color: INK }}>{app.tagline}</h3>
          <p className="ori-blurb">{app.blurb}</p>
          <ul className="ori-bullets">
            {app.bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={open || reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.4, ease, delay: reduced ? 0 : 0.25 + i * 0.07 }}
              >
                <span className="ori-tick" style={{ background: a, clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
                {b}
              </motion.li>
            ))}
          </ul>
          <a href="#" className="ori-dl" style={{ background: shade(a, -0.1), boxShadow: `0 6px 0 ${shade(a, -0.35)}` }}>
            Download {app.name}
          </a>
        </motion.div>
      </div>
    </motion.article>
  )
}

export default function Variant20() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] })
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-14%'])
  const ridgeY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '24%'])

  // parallax tilt of the hero crane following pointer
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const onMove = (e) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: py * -16, y: px * 22 })
  }

  useEffect(() => {
    const id = 'ori-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'
    document.head.appendChild(l)
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'clip',
        background: PAPER,
        fontFamily: DISPLAY,
        color: INK,
      }}
    >
      <style>{ORI_CSS}</style>

      {/* ===== Low-poly faceted background: sky + triangle mountains ===== */}
      <div className="ori-bg" aria-hidden="true">
        <motion.svg
          className="ori-sky"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ y: skyY }}
        >
          <defs>
            <linearGradient id="ori-skyg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbe4c4" />
              <stop offset="55%" stopColor="#f6d2bd" />
              <stop offset="100%" stopColor="#f3efe6" />
            </linearGradient>
          </defs>
          <rect width="1440" height="900" fill="url(#ori-skyg)" />
          {/* faint paper-fold triangles in the sky */}
          <polygon points="0,0 360,0 0,260" fill="#fce9cf" opacity="0.7" />
          <polygon points="1440,0 1040,0 1440,300" fill="#f8dcc4" opacity="0.7" />
          <polygon points="600,0 980,0 760,210" fill="#fbe6cb" opacity="0.55" />
          <polygon points="200,120 520,40 470,300" fill="#fce4c8" opacity="0.45" />
          {/* paper sun */}
          <polygon points="1180,150 1245,120 1260,200 1190,225" fill="#ffd9a0" opacity="0.9" />
          <polygon points="1245,120 1300,165 1260,200" fill="#ffe6bf" opacity="0.9" />
        </motion.svg>

        <motion.svg
          className="ori-ridge"
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMax slice"
          style={{ y: ridgeY }}
        >
          {/* back ridge */}
          <polygon points="0,520 0,360 230,210 470,330 700,200 940,340 1180,190 1440,330 1440,520" fill="#e6d9c4" />
          <polygon points="230,210 470,330 360,360 130,360" fill="#dfd0b6" />
          <polygon points="700,200 940,340 800,360 580,360" fill="#dfd0b6" />
          <polygon points="1180,190 1440,330 1440,360 1090,360" fill="#dccaad" />
          {/* front ridge */}
          <polygon points="0,520 0,430 180,330 420,440 640,320 880,440 1120,300 1440,440 1440,520" fill="#cdbf9f" />
          <polygon points="180,330 420,440 300,460 80,460" fill="#c2b390" />
          <polygon points="640,320 880,440 760,460 540,460" fill="#c2b390" />
          <polygon points="1120,300 1440,440 1440,470 1010,470" fill="#b9a983" />
          {/* near hills */}
          <polygon points="0,520 0,490 320,400 560,500 820,420 1080,500 1440,420 1440,520" fill="#a99a72" />
          <polygon points="320,400 560,500 420,510 180,510" fill="#9d8e66" />
          <polygon points="820,420 1080,500 940,512 700,512" fill="#9d8e66" />
        </motion.svg>
      </div>

      {/* ===== HERO ===== */}
      <header className="ori-hero">
        <motion.div
          className="ori-badge"
          initial={reduced ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="ori-foldmark" /> TalTools — a paper-folded lab
        </motion.div>

        <motion.h1
          className="ori-h1"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Tiny tools,<br />
          <span className="ori-h1-accent">precisely folded.</span>
        </motion.h1>

        <motion.p
          className="ori-sub"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Three small Mac menu-bar apps, each crafted from a single sheet of attention.
          Hover a shape to unfold what it does.
        </motion.p>

        {/* hero paper crane built from facets, parallax tilt */}
        <div className="ori-cranestage" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
          <motion.div
            className="ori-crane"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: 'spring', stiffness: 80, damping: 14 }}
          >
            <span className="ori-cf" style={{ background: '#e9573f', clipPath: 'polygon(50% 0, 100% 70%, 50% 55%)' }} />
            <span className="ori-cf" style={{ background: '#f47b62', clipPath: 'polygon(50% 0, 50% 55%, 0 70%)' }} />
            <span className="ori-cf" style={{ background: '#c8412c', clipPath: 'polygon(0 70%, 50% 55%, 35% 100%)' }} />
            <span className="ori-cf" style={{ background: '#d94a33', clipPath: 'polygon(100% 70%, 50% 55%, 65% 100%)' }} />
            <span className="ori-cf" style={{ background: '#ff9e88', clipPath: 'polygon(50% 55%, 65% 100%, 35% 100%)' }} />
            <span className="ori-cf ori-cf-wing" style={{ background: '#ffb39f', clipPath: 'polygon(50% 30%, 120% 5%, 60% 60%)', transform: 'translateZ(40px)' }} />
            <span className="ori-cf ori-cf-wing" style={{ background: '#b8381f', clipPath: 'polygon(50% 30%, -20% 5%, 40% 60%)', transform: 'translateZ(40px)' }} />
          </motion.div>
          <div className="ori-craneshadow" />
        </div>

        <motion.a
          href="#ori-apps"
          className="ori-scroll"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          unfold the lab ↓
        </motion.a>
      </header>

      {/* ===== APPS ===== */}
      <main id="ori-apps" className="ori-apps">
        <motion.h2
          className="ori-h2"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          Three folds. Three tools.
        </motion.h2>

        <div className="ori-grid">
          {APPS.map((app, i) => (
            <PaperApp key={app.id} app={app} index={i} reduced={reduced} />
          ))}
        </div>
      </main>

      <footer className="ori-footer">
        <span className="ori-foldmark" />
        Made by hand from flat sheets · TalTools © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

const ORI_CSS = `
.ori-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.ori-sky { position: absolute; top: 0; left: 0; width: 100%; height: 78vh; }
.ori-ridge { position: absolute; bottom: 0; left: 0; width: 100%; height: 46vh; filter: drop-shadow(0 -10px 18px rgba(80,60,30,0.12)); }

.ori-hero {
  position: relative; z-index: 2;
  max-width: 1100px; margin: 0 auto;
  padding: 130px 24px 60px;
  text-align: center;
}
.ori-badge {
  display: inline-flex; align-items: center; gap: 9px;
  font-size: 13px; font-weight: 600; letter-spacing: 0.02em;
  color: #6b5d44; background: rgba(255,255,255,0.62);
  padding: 8px 16px; border-radius: 2px;
  box-shadow: 3px 3px 0 rgba(120,95,55,0.18);
}
.ori-foldmark {
  width: 12px; height: 12px; display: inline-block;
  background: #e9573f; clip-path: polygon(0 0, 100% 0, 0 100%);
}
.ori-h1 {
  font-size: clamp(40px, 8.5vw, 84px);
  font-weight: 800; line-height: 0.98; letter-spacing: -0.02em;
  margin: 26px 0 0; color: #2a2620;
  text-shadow: 2px 3px 0 rgba(255,255,255,0.5);
}
.ori-h1-accent {
  background: linear-gradient(120deg, #e9573f, #f0902e);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.ori-sub {
  max-width: 560px; margin: 22px auto 0;
  font-size: clamp(15px, 2.2vw, 18px); font-weight: 400;
  line-height: 1.55; color: #5a5040;
}

.ori-cranestage { position: relative; height: 230px; margin: 30px auto 8px; perspective: 1000px; }
.ori-crane {
  position: absolute; left: 50%; top: 50%;
  width: 220px; height: 220px; margin: -110px 0 0 -110px;
  transform-style: preserve-3d;
}
.ori-cf {
  position: absolute; inset: 0; display: block;
  filter: drop-shadow(2px 4px 5px rgba(90,40,25,0.28));
}
.ori-craneshadow {
  position: absolute; left: 50%; bottom: 24px; width: 150px; height: 26px;
  margin-left: -75px; background: rgba(70,45,20,0.22);
  border-radius: 50%; filter: blur(9px);
}
.ori-scroll {
  display: inline-block; margin-top: 18px;
  font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
  color: #8a7a5c; text-decoration: none; text-transform: uppercase;
}

.ori-apps { position: relative; z-index: 2; max-width: 1080px; margin: 0 auto; padding: 20px 22px 110px; }
.ori-h2 {
  font-size: clamp(26px, 4.6vw, 44px); font-weight: 800; letter-spacing: -0.02em;
  text-align: center; margin: 0 0 48px; color: #2a2620;
  text-shadow: 2px 2px 0 rgba(255,255,255,0.45);
}
.ori-grid { display: flex; flex-direction: column; gap: 56px; }

.ori-card {
  position: relative;
  display: grid; grid-template-columns: 260px 1fr; gap: 30px; align-items: center;
  background: rgba(255,255,255,0.55);
  padding: 28px; border-radius: 4px;
  box-shadow: 8px 12px 0 rgba(120,95,55,0.15), 0 2px 30px rgba(80,55,25,0.07);
}
.ori-card:nth-child(even) { grid-template-columns: 1fr 260px; }
.ori-card:nth-child(even) .ori-gemwrap { order: 2; }
.ori-card:nth-child(even) .ori-leaf { order: 1; }
.ori-card:nth-child(even) .ori-leaf-inner { transform-origin: right center !important; border-left: none !important; border-right: 4px solid var(--ac); }

.ori-gemwrap { display: flex; align-items: center; justify-content: center; height: 230px; }
.ori-gem { position: relative; width: 190px; height: 190px; transform-style: preserve-3d; }
.ori-facet {
  position: absolute; inset: 0; display: block;
  filter: drop-shadow(2px 3px 4px rgba(60,40,15,0.25));
}
.ori-emoji {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 54px; transition: transform 0.9s cubic-bezier(.16,1,.3,1);
  filter: drop-shadow(0 6px 6px rgba(0,0,0,0.25));
}

.ori-leaf { min-height: 200px; }
.ori-leaf-inner {
  position: relative; height: 100%;
  padding: 26px 28px 28px; border-radius: 3px;
  box-shadow: 5px 7px 14px rgba(90,65,30,0.18);
  overflow: hidden;
}
.ori-leaf-corner {
  position: absolute; top: 0; right: 0; width: 36px; height: 36px;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  opacity: 0.8;
}
.ori-kicker { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.ori-tag { font-size: clamp(19px, 3vw, 25px); font-weight: 700; margin: 6px 0 10px; line-height: 1.15; }
.ori-blurb { font-size: 14.5px; line-height: 1.55; color: #4d4534; margin: 0 0 16px; }
.ori-bullets { list-style: none; margin: 0 0 20px; padding: 0; display: grid; gap: 9px; }
.ori-bullets li { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: #3b3426; }
.ori-tick { width: 11px; height: 11px; display: inline-block; flex: 0 0 auto; }
.ori-dl {
  display: inline-block; color: #fff; font-weight: 700; font-size: 14px;
  text-decoration: none; padding: 11px 22px; border-radius: 3px;
  transition: transform 0.15s ease;
}
.ori-dl:hover { transform: translateY(-2px); }
.ori-dl:active { transform: translateY(4px); box-shadow: none !important; }

.ori-footer {
  position: relative; z-index: 2; text-align: center;
  padding: 30px 20px 46px; font-size: 13px; color: #7a6c50;
  display: flex; align-items: center; justify-content: center; gap: 9px; flex-wrap: wrap;
}

@media (max-width: 720px) {
  .ori-card, .ori-card:nth-child(even) { grid-template-columns: 1fr; gap: 8px; }
  .ori-card:nth-child(even) .ori-gemwrap { order: 0; }
  .ori-card:nth-child(even) .ori-leaf { order: 0; }
  .ori-card:nth-child(even) .ori-leaf-inner { transform-origin: left center !important; border-right: none; border-left: 4px solid var(--ac) !important; }
  .ori-gemwrap { height: 180px; }
  .ori-gem { width: 150px; height: 150px; }
}

@media (prefers-reduced-motion: reduce) {
  .ori-gem { transform: none !important; }
  .ori-facet { transform: none !important; }
}
`
