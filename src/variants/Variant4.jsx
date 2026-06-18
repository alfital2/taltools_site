import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

// ── Palette ────────────────────────────────────────────────────────────────
const BG = '#2d1b69'
const PINK = '#ff2e88'
const YELLOW = '#ffd23f'
const CYAN = '#3df0ff'
const DARK = '#1a0f40'

const PIXEL = '"Press Start 2P", "Courier New", monospace'
const BODY = '"Courier New", ui-monospace, monospace'

// Per-level theming derived from the shared APPS data.
const LEVEL_COLORS = [PINK, YELLOW, CYAN]

// Shared interactive demo per app id. Rendered inside the pixel dialog frame.
const DEMOS = {
  natcho: NatchoDemo,
  flickey: FlicKeyDemo,
  tally: TallyDemo,
}

// ── A chunky CSS-pixel button that "presses" down ───────────────────────────
function PixelButton({ children, onClick, color = PINK, textColor = '#fff', style, href, external }) {
  const [down, setDown] = useState(false)
  const shadow = down
    ? `0 0 0 4px ${DARK}, 0 0 0 8px ${color}`
    : `0 0 0 4px ${DARK}, 0 0 0 8px ${color}, 0 8px 0 8px rgba(0,0,0,0.5)`
  const common = {
    fontFamily: PIXEL,
    background: color,
    color: textColor,
    border: 'none',
    cursor: 'pointer',
    padding: '14px 18px',
    fontSize: 'clamp(8px, 2.4vw, 12px)',
    lineHeight: 1.6,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    textDecoration: 'none',
    display: 'inline-block',
    transform: down ? 'translateY(8px)' : 'translateY(0)',
    boxShadow: shadow,
    transition: 'transform 0.05s linear, box-shadow 0.05s linear',
    textAlign: 'center',
    ...style,
  }
  const handlers = {
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    onMouseLeave: () => setDown(false),
    onTouchStart: () => setDown(true),
    onTouchEnd: () => setDown(false),
  }
  if (href) {
    const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className="v4-btn" style={common} {...handlers} {...ext} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className="v4-btn" style={common} {...handlers} onClick={onClick}>
      {children}
    </button>
  )
}

// ── A tiny bobbing CSS-pixel sprite (a little space invader-ish guy) ─────────
function Sprite({ color = YELLOW, size = 6 }) {
  // 11x8 grid; 1 = pixel
  const grid = [
    '00100000100',
    '00010001000',
    '00111111100',
    '01101110110',
    '11111111111',
    '10111111101',
    '10100000101',
    '00011011000',
  ]
  const shadows = []
  grid.forEach((row, y) => {
    row.split('').forEach((c, x) => {
      if (c === '1') shadows.push(`${x * size}px ${y * size}px 0 0 ${color}`)
    })
  })
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        background: color,
        boxShadow: shadows.join(','),
        marginRight: 10 * size,
        marginBottom: 7 * size,
        imageRendering: 'pixelated',
      }}
    />
  )
}

// A blocky pixel arrow built from CSS box-shadows (no emoji, no external image).
function PixelArrow({ color = '#fff', size = 3 }) {
  // 5x5-ish chevron pointing right.
  const grid = [
    '10000',
    '01000',
    '00100',
    '01000',
    '10000',
  ]
  const shadows = []
  grid.forEach((row, y) => {
    row.split('').forEach((c, x) => {
      if (c === '1') shadows.push(`${x * size}px ${y * size}px 0 0 ${color}`)
    })
  })
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        marginLeft: size * 3,
        marginRight: size * 5,
        marginBottom: size * 4,
        verticalAlign: 'middle',
        boxShadow: shadows.join(','),
      }}
    />
  )
}

// HUD stat block.
function Stat({ label, value, color }) {
  return (
    <div style={{ fontFamily: PIXEL, fontSize: 'clamp(7px, 1.8vw, 10px)', lineHeight: 1.8, whiteSpace: 'nowrap' }}>
      <span style={{ color: CYAN }}>{label}</span>{' '}
      <span style={{ color }}>{value}</span>
    </div>
  )
}

export default function Variant4() {
  const [started, setStarted] = useState(false)
  const [selected, setSelected] = useState(null) // index into APPS
  const [coins, setCoins] = useState(0)
  const dialogRef = useRef(null)

  // Self-contained Google Font load.
  useEffect(() => {
    const id = 'press-start-2p-font'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
    document.head.appendChild(link)
  }, [])

  const start = () => {
    setStarted(true)
    setCoins((c) => c + 1)
  }

  const pick = (i) => {
    setSelected(i)
    setCoins((c) => c + 1)
    // bring the dialog into view on small screens
    setTimeout(() => dialogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60)
  }

  const score = String(1337 + coins * 250).padStart(7, '0')

  return (
    <div
      style={{
        fontFamily: BODY,
        background: BG,
        color: '#fff',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes v4-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        @keyframes v4-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes v4-stars1 { from { background-position: 0 0 } to { background-position: 0 -1000px } }
        @keyframes v4-stars2 { from { background-position: 0 0 } to { background-position: 0 -1000px } }
        @keyframes v4-coin { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-4px) rotate(180deg) } }
        @keyframes v4-pulse { 0%,100% { text-shadow: 0 0 0 ${PINK} } 50% { text-shadow: 0 0 16px ${PINK}, 0 0 28px ${PINK} } }
        .v4-btn { cursor: pointer; }
        .v4-btn:focus-visible,
        .v4-level:focus-visible {
          outline: 3px dashed ${CYAN};
          outline-offset: 5px;
        }
        @media (prefers-reduced-motion: reduce) {
          .v4-anim, .v4-stars1, .v4-stars2 { animation: none !important }
        }
      `}</style>

      {/* Starfield (two parallax layers built from radial-gradient dots) */}
      <div
        className="v4-stars1"
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(1px 1px at 20px 30px, #fff, transparent), radial-gradient(1px 1px at 120px 80px, #fff, transparent), radial-gradient(2px 2px at 200px 160px, #cdd, transparent), radial-gradient(1px 1px at 300px 50px, #fff, transparent), radial-gradient(1px 1px at 360px 220px, #fff, transparent)',
          backgroundSize: '400px 300px',
          opacity: 0.7,
          animation: 'v4-stars1 16s linear infinite',
        }}
      />
      <div
        className="v4-stars2"
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(2px 2px at 80px 120px, ' + YELLOW + ', transparent), radial-gradient(2px 2px at 250px 260px, ' + CYAN + ', transparent), radial-gradient(2px 2px at 330px 90px, ' + PINK + ', transparent)',
          backgroundSize: '380px 320px',
          opacity: 0.5,
          animation: 'v4-stars2 9s linear infinite',
        }}
      />
      {/* Scanlines overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 50,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* HUD */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          padding: '64px 16px 8px',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <Stat label="SCORE" value={score} color={YELLOW} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="v4-anim" aria-hidden style={{ display: 'inline-block', width: 12, height: 12, background: YELLOW, borderRadius: '50%', boxShadow: `inset -2px -2px 0 rgba(0,0,0,0.3)`, animation: 'v4-coin 1s linear infinite' }} />
          <Stat label="COINS" value={'×' + String(coins).padStart(2, '0')} color={YELLOW} />
        </div>
        <Stat label="1UP" value="∞" color={PINK} />
      </div>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '16px 16px 80px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ fontFamily: PIXEL, color: CYAN, fontSize: 'clamp(8px,2.4vw,11px)', letterSpacing: '2px', margin: '0 0 18px' }}>
            ★ TALTOOLS ARCADE ★
          </p>
          <h1
            className="v4-anim"
            style={{
              fontFamily: PIXEL,
              color: '#fff',
              fontSize: 'clamp(20px, 7vw, 56px)',
              lineHeight: 1.4,
              margin: 0,
              textShadow: `4px 4px 0 ${PINK}, 8px 8px 0 ${DARK}`,
              animation: 'v4-pulse 2s ease-in-out infinite',
            }}
          >
            TAL<span style={{ color: YELLOW }}>TOOLS</span>
          </h1>
          <p style={{ fontFamily: BODY, color: '#d7cffb', fontSize: 'clamp(13px,3.6vw,18px)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.7 }}>
            Three tiny Mac menu-bar apps. One pixel-perfect lab. Insert a coin and pick your level.
          </p>
        </div>

        {/* PRESS START */}
        {!started && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
          >
            <div className="v4-anim" style={{ animation: 'v4-bob 1.6s ease-in-out infinite', height: 56 }}>
              <Sprite color={YELLOW} size={5} />
            </div>
            <PixelButton onClick={start} color={PINK} style={{ fontSize: 'clamp(12px,4vw,20px)', padding: '20px 26px' }}>
              <span className="v4-anim" style={{ animation: 'v4-blink 1s step-end infinite', display: 'inline-block' }}>
                ▶ PRESS START
              </span>
            </PixelButton>
            <p style={{ fontFamily: PIXEL, fontSize: 'clamp(7px,1.8vw,9px)', color: CYAN, letterSpacing: 1, lineHeight: 2 }}>
              © 2026 TALTOOLS · 3 LEVELS · BARELY ANY PERMISSIONS
            </p>
          </motion.div>
        )}

        {/* LEVEL SELECT */}
        <AnimatePresence>
          {started && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: 48 }}
            >
              <h2 style={{ fontFamily: PIXEL, fontSize: 'clamp(11px,3.4vw,18px)', color: YELLOW, textAlign: 'center', letterSpacing: 2, margin: '0 0 30px', textShadow: `2px 2px 0 ${DARK}` }}>
                ⬇ LEVEL SELECT ⬇
              </h2>

              <div
                style={{
                  display: 'grid',
                  gap: 22,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                }}
              >
                {APPS.map((app, i) => {
                  const color = LEVEL_COLORS[i % LEVEL_COLORS.length]
                  const active = selected === i
                  return (
                    <motion.button
                      type="button"
                      key={app.id}
                      className="v4-level"
                      aria-label={'Play level ' + (i + 1) + ': ' + app.name}
                      onClick={() => pick(i)}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -6 }}
                      whileTap={{ y: 2 }}
                      style={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        padding: '24px 16px',
                        background: DARK,
                        border: 'none',
                        color: '#fff',
                        // pixelated stair-step border via stacked box-shadows
                        boxShadow: active
                          ? `0 0 0 3px ${BG}, 0 0 0 6px ${color}, 0 0 0 9px ${BG}, 0 0 0 12px ${color}, 0 0 26px ${color}`
                          : `0 0 0 3px ${BG}, 0 0 0 6px ${color}, 0 0 0 9px ${BG}, 0 0 0 12px ${color}`,
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontFamily: PIXEL, fontSize: 'clamp(7px,1.8vw,9px)', color: CYAN, letterSpacing: 1 }}>
                        LV-{String(i + 1).padStart(2, '0')}
                      </div>
                      <div
                        className="v4-anim"
                        style={{ margin: '14px 0', display: 'flex', justifyContent: 'center', animation: 'v4-bob 1.8s ease-in-out infinite', animationDelay: `${i * 0.25}s` }}
                      >
                        <img
                          src={app.icon}
                          alt={app.name + ' icon'}
                          width={60}
                          height={60}
                          style={{
                            width: 'clamp(48px,13vw,64px)',
                            height: 'clamp(48px,13vw,64px)',
                            borderRadius: '22%',
                            // pixel-art drop shadow to seat the icon in the arcade frame
                            filter: `drop-shadow(3px 3px 0 ${DARK})`,
                            imageRendering: 'auto',
                          }}
                        />
                      </div>
                      <div style={{ fontFamily: PIXEL, fontSize: 'clamp(11px,3vw,15px)', color, letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1.5 }}>
                        {app.name}
                      </div>
                      <div style={{ fontFamily: PIXEL, fontSize: 'clamp(7px,1.8vw,9px)', color: '#b9aef0', marginTop: 14, letterSpacing: 1 }}>
                        {active ? '◆ SELECTED ◆' : 'TAP TO PLAY'}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Arcade RPG-style dialog box */}
              <AnimatePresence mode="wait">
                {selected !== null && (
                  <motion.div
                    ref={dialogRef}
                    key={APPS[selected].id}
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 16 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      marginTop: 40,
                      background: DARK,
                      padding: 'clamp(18px,5vw,32px)',
                      // double pixel frame
                      boxShadow: `0 0 0 4px #fff, 0 0 0 8px ${DARK}, 0 0 0 12px ${LEVEL_COLORS[selected % 3]}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                      <img
                        src={APPS[selected].icon}
                        alt={APPS[selected].name + ' icon'}
                        width={48}
                        height={48}
                        style={{
                          width: 'clamp(40px,11vw,52px)',
                          height: 'clamp(40px,11vw,52px)',
                          borderRadius: '22%',
                          filter: `drop-shadow(2px 2px 0 ${BG})`,
                        }}
                      />
                      <div>
                        <div style={{ fontFamily: PIXEL, fontSize: 'clamp(12px,3.4vw,18px)', color: LEVEL_COLORS[selected % 3], letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1.5 }}>
                          {APPS[selected].name}
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: 'clamp(13px,3.6vw,16px)', color: YELLOW, marginTop: 8, fontWeight: 700 }}>
                          “{APPS[selected].tagline}”
                        </div>
                      </div>
                    </div>

                    <p style={{ fontFamily: BODY, fontSize: 'clamp(14px,3.8vw,17px)', lineHeight: 1.8, color: '#e9e4ff', marginTop: 18 }}>
                      {APPS[selected].blurb}
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'grid', gap: 10 }}>
                      {APPS[selected].bullets.map((b) => (
                        <li key={b} style={{ fontFamily: BODY, fontSize: 'clamp(13px,3.4vw,15px)', color: '#d7cffb', lineHeight: 1.5, display: 'flex', gap: 10 }}>
                          <span aria-hidden style={{ color: LEVEL_COLORS[selected % 3] }}>►</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Bonus stage: the real interactive demo, framed in pixel chrome */}
                    {(() => {
                      const app = APPS[selected]
                      const Demo = DEMOS[app.id]
                      if (!Demo) return null
                      const color = LEVEL_COLORS[selected % 3]
                      return (
                        <div style={{ marginTop: 26 }}>
                          <div style={{ fontFamily: PIXEL, fontSize: 'clamp(7px,1.8vw,9px)', color, letterSpacing: 1, marginBottom: 12 }}>
                            ★ BONUS STAGE · TRY IT ★
                          </div>
                          <div
                            style={{
                              background: BG,
                              padding: 'clamp(12px,4vw,20px)',
                              boxShadow: `0 0 0 4px ${DARK}, 0 0 0 7px ${color}`,
                            }}
                          >
                            <Demo tone="dark" />
                          </div>
                        </div>
                      )
                    })()}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 26, alignItems: 'center' }}>
                      <PixelButton
                        href={APPS[selected].site}
                        color={YELLOW}
                        textColor={DARK}
                        external={APPS[selected].external}
                      >
                        See the full demo
                        <PixelArrow color={DARK} />
                      </PixelButton>
                      <PixelButton onClick={() => setSelected(null)} color={DARK} textColor="#fff" style={{ boxShadow: `0 0 0 4px ${BG}, 0 0 0 8px ${CYAN}` }}>
                        Back to levels
                      </PixelButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <p style={{ fontFamily: PIXEL, fontSize: 'clamp(7px,1.8vw,9px)', color: CYAN, letterSpacing: 1, lineHeight: 2 }}>
            GAME OVER? NEVER. MADE WITH ♥ ON A MAC.
          </p>
        </div>
      </main>
    </div>
  )
}
