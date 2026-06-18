import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

const DEMO_BY_ID = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

const DISPLAY = '"Baloo 2", "Trebuchet MS", sans-serif'
const SANS = '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

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

function shade(hex, amt) {
  const h = hex.replace('#', '')
  const clamp = (n) => Math.max(0, Math.min(255, n))
  const r = clamp(parseInt(h.slice(0, 2), 16) + amt)
  const g = clamp(parseInt(h.slice(2, 4), 16) + amt)
  const b = clamp(parseInt(h.slice(4, 6), 16) + amt)
  return `rgb(${r}, ${g}, ${b})`
}

/* ---------- A single faceted isometric box ---------- */
function IsoBox({ w, d, h, color, children, signIcon, signAlt }) {
  const top = shade(color, 36)
  const left = shade(color, -28)
  const right = shade(color, -52)
  const half = h / 2
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: d,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* top face */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${shade(color, 52)}, ${top})`,
          transform: `translateZ(${h}px)`,
          backfaceVisibility: 'hidden',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
      {/* front (right-facing) face */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: d,
          width: w,
          height: h,
          transformOrigin: 'top',
          transform: 'rotateX(-90deg)',
          background: `linear-gradient(${right}, ${shade(color, -70)})`,
          backfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {signIcon && (
          <img
            src={signIcon}
            alt={signAlt}
            width={Math.max(34, w * 0.5)}
            height={Math.max(34, w * 0.5)}
            style={{
              borderRadius: '22%',
              filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
            }}
          />
        )}
      </div>
      {/* side (left-facing) face */}
      <div
        style={{
          position: 'absolute',
          left: w,
          top: 0,
          width: h,
          height: d,
          transformOrigin: 'left',
          transform: 'rotateY(90deg)',
          background: `linear-gradient(${left}, ${shade(color, -60)})`,
          backfaceVisibility: 'hidden',
        }}
      />
      {/* hidden faces unused; half var kept for clarity */}
      <span style={{ display: 'none' }}>{half}</span>
    </div>
  )
}

/* ---------- A little iso tree ---------- */
function Tree({ scale = 1, reduced, delay = 0 }) {
  return (
    <motion.div
      style={{ transformStyle: 'preserve-3d', position: 'relative', transform: `scale(${scale})` }}
      animate={reduced ? {} : { rotateZ: [0, 2, 0, -2, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div
        style={{
          position: 'absolute',
          width: 8,
          height: 8,
          left: -4,
          top: -4,
          background: 'linear-gradient(#a06a3c, #6b4423)',
          transform: 'translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 34,
          height: 34,
          left: -17,
          top: -17,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #9be58f, #4caf6d)',
          transform: 'translateZ(22px) rotateX(-55deg)',
          boxShadow: '0 0 0 4px rgba(255,255,255,0.18) inset',
        }}
      />
    </motion.div>
  )
}

/* ---------- A floating iso cloud ---------- */
function Cloud({ top, left, size, dur, reduced, delay = 0 }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ position: 'absolute', top, left, width: size, height: size * 0.5, pointerEvents: 'none' }}
      animate={reduced ? {} : { x: [0, 30, 0], y: [0, -8, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: size * 0.04 }}>
        {[0.5, 0.85, 1, 0.7].map((s, i) => (
          <div
            key={i}
            style={{
              width: size * 0.34 * s,
              height: size * 0.34 * s,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #ffffff, #e7eefc)',
              boxShadow: '0 8px 16px rgba(120,140,200,0.18)',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function Variant13() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(null)

  useEffect(() => {
    const links = [
      'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap',
    ]
    const els = links.map((href) => {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      l.dataset.isoFont = '1'
      document.head.appendChild(l)
      return l
    })
    return () => els.forEach((l) => l.remove())
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const activeApp = APPS.find((a) => a.id === active) || null

  // building footprints per app
  const buildings = [
    { app: APPS[0], w: 96, d: 96, h: 80 },
    { app: APPS[1], w: 96, d: 96, h: 120 },
    { app: APPS[2], w: 96, d: 96, h: 96 },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        fontFamily: SANS,
        color: '#3a3556',
        background:
          'linear-gradient(180deg, #dff0ff 0%, #eaf3ff 38%, #fbf3ff 72%, #fff7f0 100%)',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes iso-bob {
          0%, 100% { transform: translateZ(0px); }
          50% { transform: translateZ(14px); }
        }
        .iso-scene {
          transform-style: preserve-3d;
          transform: rotateX(55deg) rotateZ(45deg);
        }
        .iso-shadow {
          background: radial-gradient(ellipse at center, rgba(80,90,150,0.32), rgba(80,90,150,0) 70%);
          filter: blur(2px);
        }
        .iso-dl:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .iso-fulldemo { transition: gap 0.15s ease, background 0.15s ease; }
        .iso-fulldemo:hover { gap: 10px; background: rgba(120,110,170,0.1); }
        .iso-fulldemo:hover svg { transform: translateX(2px); }
        .iso-fulldemo svg { transition: transform 0.15s ease; }
        .iso-focusable:focus-visible,
        .iso-dl:focus-visible,
        .iso-fulldemo:focus-visible {
          outline: 3px solid #4b3f7a;
          outline-offset: 3px;
        }
        @media (max-width: 720px) {
          .iso-stage { transform: scale(0.62) !important; }
        }
        @media (min-width: 721px) and (max-width: 1024px) {
          .iso-stage { transform: scale(0.82) !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: 'center', paddingTop: 70, paddingInline: 16, position: 'relative', zIndex: 5 }}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(34px, 7vw, 62px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: '#4b3f7a',
            textShadow: '0 3px 0 rgba(255,255,255,0.7)',
          }}
        >
          TalTools
        </div>
        <p
          style={{
            margin: '12px auto 0',
            maxWidth: 460,
            fontSize: 'clamp(14px, 2.4vw, 18px)',
            fontWeight: 600,
            color: '#6a6391',
          }}
        >
          A tiny village of three Mac menu-bar apps. Wander in and tap a building.
        </p>
      </header>

      {/* Clouds */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
        <Cloud top="14%" left="8%" size={150} dur={16} reduced={reduced} />
        <Cloud top="22%" left="72%" size={190} dur={20} reduced={reduced} delay={2} />
        <Cloud top="50%" left="80%" size={120} dur={18} reduced={reduced} delay={1} />
        <Cloud top="58%" left="4%" size={140} dur={22} reduced={reduced} delay={3} />
      </div>

      {/* Iso stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 540,
          padding: '40px 16px 90px',
          perspective: 1400,
        }}
      >
        <div className="iso-stage" style={{ transformStyle: 'preserve-3d', transform: 'scale(1)' }}>
          <div className="iso-scene" style={{ position: 'relative', width: 420, height: 420 }}>
            {/* ground plane with grid */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 24,
                background:
                  'linear-gradient(135deg, #c9f0d6, #a8e6c0)',
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(135deg, #c9f0d6, #a8e6c0)',
                backgroundSize: '42px 42px, 42px 42px, 100% 100%',
                boxShadow: '0 40px 60px -20px rgba(80,90,150,0.45), inset 0 0 0 2px rgba(255,255,255,0.4)',
                transform: 'translateZ(0px)',
              }}
            />

            {/* decorative trees */}
            <div style={{ position: 'absolute', top: 40, left: 40, transformStyle: 'preserve-3d' }}>
              <Tree scale={0.9} reduced={reduced} />
            </div>
            <div style={{ position: 'absolute', top: 350, left: 360, transformStyle: 'preserve-3d' }}>
              <Tree scale={1.1} reduced={reduced} delay={1.5} />
            </div>
            <div style={{ position: 'absolute', top: 360, left: 60, transformStyle: 'preserve-3d' }}>
              <Tree scale={0.8} reduced={reduced} delay={0.8} />
            </div>
            <div style={{ position: 'absolute', top: 30, left: 350, transformStyle: 'preserve-3d' }}>
              <Tree scale={1} reduced={reduced} delay={2.2} />
            </div>

            {/* buildings */}
            {buildings.map((b, i) => {
              const positions = [
                { left: 60, top: 90 },
                { left: 210, top: 60 },
                { left: 150, top: 230 },
              ]
              const pos = positions[i]
              const isActive = active === b.app.id
              const lift = isActive ? 60 : 0
              return (
                <div
                  key={b.app.id}
                  style={{ position: 'absolute', left: pos.left, top: pos.top, transformStyle: 'preserve-3d' }}
                >
                  {/* long soft shadow on ground */}
                  <div
                    className="iso-shadow"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: -10,
                      top: -6,
                      width: b.w + 60,
                      height: b.d + 30,
                      transform: 'translateZ(1px)',
                      opacity: isActive ? 0.5 : 0.8,
                    }}
                  />
                  <motion.button
                    onClick={() => setActive(isActive ? null : b.app.id)}
                    aria-label={`Open ${b.app.name}`}
                    aria-pressed={isActive}
                    className="iso-focusable"
                    style={{
                      position: 'relative',
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      cursor: 'pointer',
                      transformStyle: 'preserve-3d',
                      animation: reduced || isActive ? 'none' : `iso-bob 4s ease-in-out ${i * 0.6}s infinite`,
                    }}
                    animate={{ translateZ: lift }}
                    whileHover={reduced ? {} : { translateZ: lift + 22 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  >
                    <IsoBox w={b.w} d={b.d} h={b.h} color={b.app.accent} signIcon={b.app.icon} signAlt={`${b.app.name} icon`}>
                      <span
                        style={{
                          fontFamily: DISPLAY,
                          fontWeight: 800,
                          fontSize: 15,
                          color: '#fff',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          transform: 'rotateZ(-45deg)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {b.app.name}
                      </span>
                    </IsoBox>
                  </motion.button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* App card overlay */}
      <AnimatePresence>
        {activeApp && (
          <>
            <motion.div
              key="scrim"
              onClick={() => setActive(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                background: 'rgba(60,55,90,0.32)',
                backdropFilter: 'blur(3px)',
              }}
            />
            <motion.div
              key="card"
              role="dialog"
              aria-modal="true"
              aria-label={`${activeApp.name} details`}
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              style={{
                position: 'fixed',
                zIndex: 51,
                left: '50%',
                bottom: 'clamp(20px, 6vh, 60px)',
                transform: 'translateX(-50%)',
                width: 'min(92vw, 420px)',
                maxHeight: 'min(86vh, 760px)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                background: 'rgba(255,255,255,0.94)',
                borderRadius: 26,
                padding: '26px 26px 24px',
                boxShadow: '0 30px 60px -18px rgba(80,90,150,0.5), inset 0 0 0 1px rgba(255,255,255,0.7)',
              }}
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="iso-focusable"
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  background: '#eef0fa',
                  color: '#6a6391',
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                ×
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img
                  src={activeApp.icon}
                  alt={`${activeApp.name} icon`}
                  width={56}
                  height={56}
                  style={{
                    borderRadius: '22%',
                    boxShadow: `0 8px 18px ${activeApp.accent}55`,
                  }}
                />
                <div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, color: '#42396f', lineHeight: 1 }}>
                    {activeApp.name}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: activeApp.accent, marginTop: 4 }}>
                    {activeApp.tagline}
                  </div>
                </div>
              </div>
              <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.5, color: '#54507a', fontWeight: 600 }}>
                {activeApp.blurb}
              </p>
              <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'grid', gap: 8 }}>
                {activeApp.bullets.map((b) => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700, color: '#4b4570' }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 6,
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        background: activeApp.accent,
                        color: '#fff',
                        fontSize: 11,
                      }}
                    >
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              {(() => {
                const Demo = DEMO_BY_ID[activeApp.id]
                return Demo ? (
                  <div
                    style={{
                      marginTop: 18,
                      padding: 14,
                      borderRadius: 18,
                      background: '#f4f1fb',
                      boxShadow: 'inset 0 0 0 1px rgba(120,110,170,0.16)',
                    }}
                  >
                    <Demo tone="light" />
                  </div>
                ) : null
              })()}

              <a
                href={activeApp.site}
                className="iso-dl"
                {...(activeApp.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{
                  display: 'block',
                  marginTop: 18,
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#fff',
                  padding: '14px 18px',
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${shade(activeApp.accent, 30)}, ${shade(activeApp.accent, -20)})`,
                  boxShadow: `0 12px 22px ${activeApp.accent}55`,
                  transition: 'transform 0.15s ease, filter 0.15s ease',
                }}
              >
                Get {activeApp.name}
              </a>

              <a
                href={activeApp.site}
                className="iso-fulldemo"
                {...(activeApp.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 12,
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: 14,
                  color: shade(activeApp.accent, -40),
                  borderRadius: 12,
                  padding: '6px 8px',
                }}
              >
                See the full demo
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer hint */}
      <footer style={{ textAlign: 'center', paddingBottom: 40, position: 'relative', zIndex: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#8d87b3' }}>
          Three apps · macOS menu bar · free to try
        </span>
      </footer>
    </div>
  )
}
