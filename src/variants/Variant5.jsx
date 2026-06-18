import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

// ---------------------------------------------------------------------------
// TalOS, a fake, fully interactive macOS-style desktop, in the browser.
// Self-contained showstopper variant. Imports only from react + framer-motion.
// ---------------------------------------------------------------------------

const FONT_STACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
const DISPLAY_STACK =
  "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

// A "Finder"-ish welcome app id that isn't part of APPS.
const FINDER_ID = '__finder__'

// Tiny prefers-reduced-motion hook.
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(!!mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])
  return reduced
}

// Track whether we're on a small screen (stack + disable drag).
function useIsSmall() {
  const [small, setSmall] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(max-width: 640px)')
    const apply = () => setSmall(!!mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])
  return small
}

// ---------------------------------------------------------------------------
// Live clock for the menu bar.
// ---------------------------------------------------------------------------
function MenuClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const day = now.toLocaleDateString(undefined, { weekday: 'short' })
  const date = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const time = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {day} {date}&nbsp;&nbsp;{time}
    </span>
  )
}

// ---------------------------------------------------------------------------
// SVG glyphs (no external images).
// ---------------------------------------------------------------------------
function WifiGlyph() {
  return (
    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true">
      <path d="M8.5 11.5l2.2-2.7a3.4 3.4 0 0 0-4.4 0L8.5 11.5z" fill="currentColor" />
      <path
        d="M3.2 6.6a8.2 8.2 0 0 1 10.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M1 4a11.6 11.6 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

function BatteryGlyph() {
  return (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden="true">
      <rect x="0.7" y="0.7" width="21" height="11.6" rx="3.2" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
      <rect x="2.2" y="2.2" width="14" height="8.6" rx="1.8" fill="currentColor" />
      <rect x="23" y="4" width="2.2" height="5" rx="1.1" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function AppleGlyph() {
  return (
    <svg width="15" height="18" viewBox="0 0 15 18" fill="currentColor" aria-hidden="true">
      <path d="M11.7 9.5c0-2 1.6-3 1.7-3a3.6 3.6 0 0 0-2.9-1.6c-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7C3.3 5 1.8 6.1 1 7.9c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2a9 9 0 0 0 1.2-2.6c-.1 0-2.4-.9-2.4-3.5z" transform="translate(0 -3)" />
      <path d="M9.6 3.2A3.4 3.4 0 0 0 10.4.6 3.5 3.5 0 0 0 8.1 1.8 3.2 3.2 0 0 0 7.3 4.3 2.9 2.9 0 0 0 9.6 3.2z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// A draggable macOS-style window.
// ---------------------------------------------------------------------------
function AppWindow({
  win,
  app,
  zIndex,
  isActive,
  isSmall,
  reduced,
  dragRef,
  onFocus,
  onClose,
}) {
  // Drag position is held in motion values so dragging never triggers React
  // re-renders. We do NOT use framer's built-in `drag` here so that only the
  // title bar initiates movement; we drive these from a manual pointer handler.
  const x = useMotionValue(win.x)
  const y = useMotionValue(win.y)
  const accent = app?.accent || '#7c5cff'

  // The position transform lives on an inner wrapper; the OUTER motion.div owns
  // the enter/exit (opacity + scale) animation. Keeping them on separate
  // elements avoids framer fighting over the same `y`/`scale` properties.
  return (
    <motion.div
      onMouseDown={() => onFocus(win.uid)}
      onTouchStart={() => onFocus(win.uid)}
      initial={reduced ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      style={{
        position: 'absolute',
        left: isSmall ? '50%' : 0,
        top: isSmall ? win.stackTop : 0,
        x: isSmall ? '-50%' : x,
        y: isSmall ? 0 : y,
        zIndex,
        width: isSmall ? 'min(94vw, 420px)' : win.w,
        maxWidth: '94vw',
      }}
    >
      <div
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          background: 'rgba(250,250,252,0.78)',
          backdropFilter: 'blur(26px) saturate(180%)',
          WebkitBackdropFilter: 'blur(26px) saturate(180%)',
          boxShadow: isActive
            ? '0 30px 70px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.5) inset'
            : '0 18px 50px -22px rgba(0,0,0,0.5)',
          border: isActive
            ? `1px solid ${accent}66`
            : '1px solid rgba(0,0,0,0.08)',
          color: '#16161c',
        }}
      >
        {/* Title bar (manual drag handle) */}
        <div
          onPointerDown={(e) => {
            if (!isSmall) dragStart(e)
          }}
          style={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 12px',
            cursor: isSmall ? 'default' : 'grab',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            userSelect: 'none',
          }}
        >
          {/* traffic lights */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              aria-label="Close window"
              onClick={(e) => {
                e.stopPropagation()
                onClose(win.uid)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              style={trafficStyle('#ff5f57')}
            />
            <span style={trafficStyle('#febc2e')} />
            <span style={trafficStyle('#28c840')} />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              fontSize: 13,
              fontWeight: 600,
              opacity: 0.78,
              marginRight: 52,
            }}
          >
            {win.id === FINDER_ID ? (
              'Welcome to TalOS'
            ) : (
              <>
                <img
                  src={app.icon}
                  alt=""
                  width={18}
                  height={18}
                  style={{ borderRadius: '22%', display: 'block' }}
                />
                {app.name}
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 20, maxHeight: '64vh', overflowY: 'auto' }}>
          {win.id === FINDER_ID ? (
            <FinderContent />
          ) : (
            <AppContent app={app} accent={accent} />
          )}
        </div>
      </div>
    </motion.div>
  )

  // Manual drag start: convert pointer movement into x/y motion values so the
  // window only drags from the title bar. We avoid leaving listeners attached.
  function dragStart(e) {
    if (e.button != null && e.button !== 0) return
    const startX = e.clientX
    const startY = e.clientY
    const baseX = x.get()
    const baseY = y.get()
    const bounds = dragRef.current?.getBoundingClientRect()
    const winW = win.w
    const winH = 360 // generous; clamping below keeps title visible
    const target = e.currentTarget
    target.setPointerCapture?.(e.pointerId)

    const onMove = (ev) => {
      let nx = baseX + (ev.clientX - startX)
      let ny = baseY + (ev.clientY - startY)
      if (bounds) {
        const minX = 0
        const maxX = Math.max(0, bounds.width - winW)
        const minY = 0
        const maxY = Math.max(0, bounds.height - 48)
        nx = Math.min(Math.max(nx, minX), maxX)
        ny = Math.min(Math.max(ny, minY), maxY)
      }
      x.set(nx)
      y.set(ny)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }
}

function trafficStyle(color) {
  return {
    width: 13,
    height: 13,
    borderRadius: '50%',
    background: color,
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)',
    display: 'inline-block',
  }
}

// ---------------------------------------------------------------------------
// Window content for the 3 real apps.
// ---------------------------------------------------------------------------
function AppContent({ app, accent }) {
  const externalProps = app.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <img
          src={app.icon}
          alt={`${app.name} icon`}
          width={56}
          height={56}
          style={{
            borderRadius: '22%',
            flex: '0 0 auto',
            boxShadow: `0 6px 18px ${accent}40`,
            display: 'block',
          }}
        />
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: DISPLAY_STACK }}>
            {app.name}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: accent, fontWeight: 600 }}>
            {app.tagline}
          </p>
        </div>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.82, margin: '0 0 14px' }}>
        {app.blurb}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'grid', gap: 7 }}>
        {app.bullets.map((b) => (
          <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: accent,
                color: '#fff',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
              }}
              aria-hidden="true"
            >
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>

      {/* Live, fully interactive demo per app */}
      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: 'rgba(0,0,0,0.035)',
          border: '1px solid rgba(0,0,0,0.05)',
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.5, marginBottom: 12 }}>
          Live demo
        </div>
        {app.id === 'tally' && <TallyDemo />}
        {app.id === 'flickey' && <FlicKeyDemo tone="light" />}
        {app.id === 'natcho' && <NatchoDemo tone="light" />}
      </div>

      <a
        href={app.site}
        {...externalProps}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: '#fff',
          background: accent,
          padding: '11px 20px',
          borderRadius: 11,
          fontWeight: 700,
          fontSize: 14,
          boxShadow: `0 8px 22px ${accent}55`,
          cursor: 'pointer',
        }}
      >
        See the full demo
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  )
}

function FinderContent() {
  return (
    <div style={{ textAlign: 'center', padding: '6px 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
        {APPS.map((a) => (
          <img
            key={a.id}
            src={a.icon}
            alt={`${a.name} icon`}
            width={40}
            height={40}
            style={{ borderRadius: '22%', display: 'block', boxShadow: `0 6px 14px ${a.accent}40` }}
          />
        ))}
      </div>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, fontFamily: DISPLAY_STACK }}>
        Welcome to TalOS
      </h2>
      <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.78, maxWidth: 320, margin: '0 auto 8px' }}>
        A tiny desktop running three real Mac menu-bar apps. Click an icon in the
        dock below to launch it, drag the windows around, and try the live demos
        inside each.
      </p>
      <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>
        Pro tip: click the camera notch up top to hide it.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// A dock icon with magnify + bounce.
// ---------------------------------------------------------------------------
function FolderGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path
        d="M3 9.5a2.5 2.5 0 0 1 2.5-2.5h7l2.6 2.6h11.4A2.5 2.5 0 0 1 29 12.1V25a2.5 2.5 0 0 1-2.5 2.5h-21A2.5 2.5 0 0 1 3 25V9.5z"
        fill="#cfe6ff"
      />
      <path
        d="M3 13h26v12a2.5 2.5 0 0 1-2.5 2.5h-21A2.5 2.5 0 0 1 3 25V13z"
        fill="#8fc4ff"
      />
    </svg>
  )
}

function DockIcon({ icon, label, accent, bouncing, onClick, reduced, isFolder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.button
        onClick={onClick}
        aria-label={`Open ${label}`}
        title={label}
        className="talos-focusable"
        whileHover={reduced ? {} : { scale: 1.45, y: -14 }}
        whileTap={reduced ? {} : { scale: 1.1 }}
        animate={
          bouncing && !reduced
            ? { y: [0, -22, 0, -11, 0] }
            : { y: 0 }
        }
        transition={
          bouncing
            ? { duration: 0.7, ease: 'easeOut' }
            : { type: 'spring', stiffness: 400, damping: 16 }
        }
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isFolder
            ? 'linear-gradient(145deg, rgba(255,255,255,0.55), rgba(255,255,255,0.2))'
            : 'transparent',
          boxShadow: isFolder
            ? `0 8px 18px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.5)`
            : `0 8px 18px ${accent}55`,
          transformOrigin: 'bottom center',
        }}
      >
        {isFolder ? (
          <FolderGlyph />
        ) : (
          <img
            src={icon}
            alt={`${label} icon`}
            width={52}
            height={52}
            style={{
              borderRadius: '22%',
              display: 'block',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.28))',
            }}
          />
        )}
      </motion.button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main desktop.
// ---------------------------------------------------------------------------
export default function Variant5() {
  const reduced = useReducedMotion()
  const isSmall = useIsSmall()
  const desktopRef = useRef(null)

  const [booted, setBooted] = useState(false)
  const [notchHidden, setNotchHidden] = useState(false)
  const [bouncing, setBouncing] = useState(null) // app id currently bouncing
  const bounceTimer = useRef(null)

  // Open windows. Each: { uid, id, x, y, w, z, stackTop }
  const [wins, setWins] = useState([])
  const [activeUid, setActiveUid] = useState(null)
  const uidCounter = useRef(0)
  // Monotonic z-index allocator (ref-based so it's never stale in closures).
  const zRef = useRef(10)
  const nextZ = useCallback(() => {
    zRef.current += 1
    return zRef.current
  }, [])

  // Load fonts once.
  useEffect(() => {
    const links = []
    const add = (href) => {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      document.head.appendChild(l)
      links.push(l)
    }
    const pre1 = document.createElement('link')
    pre1.rel = 'preconnect'
    pre1.href = 'https://fonts.googleapis.com'
    const pre2 = document.createElement('link')
    pre2.rel = 'preconnect'
    pre2.href = 'https://fonts.gstatic.com'
    pre2.crossOrigin = 'anonymous'
    document.head.appendChild(pre1)
    document.head.appendChild(pre2)
    add('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fredoka:wght@500;600;700&display=swap')
    return () => {
      links.forEach((l) => l.remove())
      pre1.remove()
      pre2.remove()
    }
  }, [])

  // Boot fade-in + open the welcome window.
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), reduced ? 0 : 250)
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    // Open the Finder welcome window once on mount.
    uidCounter.current += 1
    const uid = uidCounter.current
    setWins([{ uid, id: FINDER_ID, x: 0, y: 0, w: 380, z: nextZ(), stackTop: 84 }])
    setActiveUid(uid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup bounce timer on unmount.
  useEffect(() => {
    return () => {
      if (bounceTimer.current) clearTimeout(bounceTimer.current)
    }
  }, [])

  const bringToFront = useCallback(
    (uid) => {
      const nz = nextZ()
      setActiveUid(uid)
      setWins((ws) => ws.map((w) => (w.uid === uid ? { ...w, z: nz } : w)))
    },
    [nextZ]
  )

  const openApp = useCallback(
    (id) => {
      // Bounce the dock icon.
      setBouncing(id)
      if (bounceTimer.current) clearTimeout(bounceTimer.current)
      bounceTimer.current = setTimeout(() => setBouncing(null), 750)

      setWins((ws) => {
        const existing = ws.find((w) => w.id === id)
        const nz = nextZ()
        if (existing) {
          // Focus the existing window instead of duplicating.
          setActiveUid(existing.uid)
          return ws.map((w) => (w.uid === existing.uid ? { ...w, z: nz } : w))
        }
        uidCounter.current += 1
        const uid = uidCounter.current
        const idx = ws.length
        const bounds = desktopRef.current?.getBoundingClientRect()
        const w = 400
        const maxX = bounds ? Math.max(0, bounds.width - w - 24) : 480
        const baseX = Math.min(60 + idx * 34, maxX)
        const baseY = Math.min(60 + idx * 30, 220)
        setActiveUid(uid)
        return [
          ...ws,
          { uid, id, x: baseX, y: baseY, w, z: nz, stackTop: 84 + idx * 18 },
        ]
      })
    },
    [nextZ]
  )

  const closeWin = useCallback((uid) => {
    setWins((ws) => ws.filter((w) => w.uid !== uid))
  }, [])

  const dockItems = [
    ...APPS.map((a) => ({ id: a.id, icon: a.icon, label: a.name, accent: a.accent })),
    { id: '__downloads__', isFolder: true, label: 'Downloads', accent: '#5b8cff' },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        fontFamily: FONT_STACK,
        opacity: booted || reduced ? 1 : 0,
        transition: reduced ? 'none' : 'opacity 0.6s ease',
      }}
    >
      <style>{`
        @keyframes talosFloat {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(2%, -2%, 0) scale(1.08); }
        }
        .talos-blob { will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .talos-blob { animation: none !important; }
        }
        .talos-scroll::-webkit-scrollbar { width: 8px; }
        .talos-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 8px; }
        .talos-focusable:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
          border-radius: 14px;
        }
      `}</style>

      {/* Wallpaper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 120% at 0% 0%, #ffd0e8 0%, transparent 45%),' +
            'radial-gradient(120% 120% at 100% 0%, #c8e8ff 0%, transparent 50%),' +
            'radial-gradient(120% 130% at 80% 100%, #ffe9b0 0%, transparent 50%),' +
            'linear-gradient(135deg, #7b6cff 0%, #b06cff 40%, #ff8fb1 75%, #ffd28a 100%)',
        }}
      />
      {/* Dreamy floating blobs */}
      <div
        className="talos-blob"
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          left: '-8%',
          top: '12%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,92,255,0.55), transparent 70%)',
          filter: 'blur(40px)',
          animation: reduced ? 'none' : 'talosFloat 18s ease-in-out infinite',
        }}
      />
      <div
        className="talos-blob"
        style={{
          position: 'absolute',
          width: 460,
          height: 460,
          right: '-6%',
          bottom: '8%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,196,182,0.5), transparent 70%)',
          filter: 'blur(48px)',
          animation: reduced ? 'none' : 'talosFloat 22s ease-in-out infinite reverse',
        }}
      />

      {/* ===================== MENU BAR ===================== */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px 0 60px', // leave top-left corner for parent's button
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: '1px solid rgba(255,255,255,0.25)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(0,0,0,0.25)',
          zIndex: 800,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', marginRight: 14 }}>
          <AppleGlyph />
        </span>
        <span style={{ fontWeight: 800, fontFamily: DISPLAY_STACK, fontSize: 15, marginRight: 18 }}>
          TalOS
        </span>
        {!isSmall &&
          ['File', 'Apps', 'Help'].map((m) => (
            <span key={m} style={{ marginRight: 16, opacity: 0.92, cursor: 'default' }}>
              {m}
            </span>
          ))}

        {/* Centered notch */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <div style={{ marginTop: 0 }}>
            <NotchTop hidden={notchHidden} onToggle={() => setNotchHidden((h) => !h)} />
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'flex' }}>
            <BatteryGlyph />
          </span>
          <span style={{ display: 'flex' }}>
            <WifiGlyph />
          </span>
          <span style={{ display: 'flex' }}>
            <SearchGlyph />
          </span>
          <MenuClock />
        </div>
      </div>

      {/* ===================== DESKTOP / WINDOW LAYER ===================== */}
      <div
        ref={desktopRef}
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence>
          {wins.map((win) => {
            const app = APPS.find((a) => a.id === win.id)
            return (
              <AppWindowWrapper
                key={win.uid}
                win={win}
                app={app}
                zIndex={win.z || 10}
                isActive={activeUid === win.uid}
                isSmall={isSmall}
                reduced={reduced}
                dragRef={desktopRef}
                onFocus={bringToFront}
                onClose={closeWin}
              />
            )
          })}
        </AnimatePresence>
      </div>

      {/* ===================== DOCK ===================== */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 900,
          maxWidth: '96vw',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            padding: '8px 12px',
            borderRadius: 22,
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.35)',
            boxShadow: '0 18px 50px -20px rgba(0,0,0,0.5)',
          }}
        >
          {dockItems.map((d) => (
            <DockIcon
              key={d.id}
              icon={d.icon}
              isFolder={d.isFolder}
              label={d.label}
              accent={d.accent}
              bouncing={bouncing === d.id}
              reduced={reduced}
              onClick={() => {
                if (d.id === '__downloads__') {
                  setBouncing('__downloads__')
                  if (bounceTimer.current) clearTimeout(bounceTimer.current)
                  bounceTimer.current = setTimeout(() => setBouncing(null), 750)
                } else {
                  openApp(d.id)
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Small wrapper that applies the scroll class to the content region.
function AppWindowWrapper(props) {
  return <AppWindow {...props} />
}

// Top notch component used in the menu bar (no label, fits the 30px bar).
function NotchTop({ hidden, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={hidden ? 'Notch hidden, click to reveal' : 'Click to hide the notch (Natcho)'}
      aria-label={hidden ? 'Reveal camera notch' : 'Hide camera notch'}
      className="talos-focusable"
      style={{
        position: 'relative',
        width: 150,
        height: 30,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        background: 'transparent',
        display: 'block',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#05060a',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <AnimatePresence initial={false}>
          {!hidden && (
            <motion.div
              key="cam"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 7 }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, #3b6fd6, #0a1f4d)',
                  boxShadow: '0 0 5px rgba(80,140,255,0.9)',
                }}
              />
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)' }}>Natcho</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  )
}
