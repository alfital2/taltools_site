import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

/* =============================================================================
 *  Variant 25 - "Spotlight Command-K"
 *  A macOS Spotlight / Raycast command-palette experience. A blurred, colourful
 *  wallpaper backdrop with a centred glass command palette as the hero. Each app
 *  is a command row; selecting a row expands an inline panel with its tagline,
 *  blurb, bullets, live demo (dark tone) and a "See the full demo" link.
 * ========================================================================== */

const DEMOS = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Short, command-style subtitles per app (kept tight for a palette row). */
const SUBTITLE = {
  natcho: 'Hide the camera notch behind a black bar',
  flickey: 'Auto-switch keyboard language per app and site',
  tally: 'Track Claude.ai usage from the menu bar',
}

/* Fake keyboard-shortcut hint shown on the right of each row, Raycast-style. */
const HOTKEY = {
  natcho: ['⌘', '1'],
  flickey: ['⌘', '2'],
  tally: ['⌘', '3'],
}

/* ---------- glyphs ---------- */
function SearchGlyph({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <path d="M16.5 16.5L21 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ArrowGlyph({ external = false }) {
  return external ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M4 10L10 4M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckGlyph({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
      <circle cx="8" cy="8" r="7.25" stroke={color} strokeWidth="1.4" opacity="0.5" />
      <path d="M5 8.2l2 2 4-4.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Chevron({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transition: 'transform 0.25s ease',
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* hex -> rgba */
function rgba(hex, a) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* ---------- expanded detail panel ---------- */
function DetailPanel({ app }) {
  const Demo = DEMOS[app.id]
  const linkProps = app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <div className="ck-detail">
      <div className="ck-detail-grid">
        {/* copy side */}
        <div className="ck-detail-copy">
          <p className="ck-detail-tagline" style={{ color: app.accent }}>
            {app.tagline}
          </p>
          <p className="ck-detail-blurb">{app.blurb}</p>

          <ul className="ck-bullets">
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
            className="ck-cta"
            style={{
              color: '#0b0b14',
              background: app.accent,
              boxShadow: `0 8px 22px -8px ${rgba(app.accent, 0.8)}`,
            }}
          >
            See the full demo
            <ArrowGlyph external={app.external} />
          </a>
        </div>

        {/* live demo side */}
        <div className="ck-detail-demo">
          <div className="ck-demo-frame">
            <Demo tone="dark" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- command row ---------- */
function CommandRow({ app, index, active, expanded, onActivate, onHover, rowRef }) {
  return (
    <li role="presentation" ref={rowRef}>
      <button
        type="button"
        role="option"
        id={`ck-opt-${app.id}`}
        aria-selected={active}
        aria-expanded={expanded}
        aria-controls={`ck-panel-${app.id}`}
        onClick={() => onActivate(index)}
        onMouseEnter={() => onHover(index)}
        className={`ck-row${active ? ' ck-row-active' : ''}`}
        style={active ? { ['--accent']: app.accent } : undefined}
      >
        <span className="ck-row-glow" aria-hidden="true" style={{ background: rgba(app.accent, active ? 0.16 : 0) }} />
        <img
          src={app.icon}
          alt={app.name + ' icon'}
          width={44}
          height={44}
          className="ck-row-icon"
          style={{ borderRadius: '22%' }}
        />
        <span className="ck-row-text">
          <span className="ck-row-name">
            {app.name}
            <span
              className="ck-row-pill"
              style={{ background: rgba(app.accent, 0.18), color: app.accent }}
            >
              app
            </span>
          </span>
          <span className="ck-row-sub">{SUBTITLE[app.id]}</span>
        </span>
        <span className="ck-row-right" aria-hidden="true">
          <span className="ck-hotkey">
            {HOTKEY[app.id].map((k, i) => (
              <kbd key={i} className="ck-kbd">
                {k}
              </kbd>
            ))}
          </span>
          <span className="ck-row-chevron" style={{ color: active ? app.accent : 'rgba(255,255,255,0.4)' }}>
            <Chevron open={expanded} />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`ck-panel-${app.id}`}
            role="region"
            aria-label={`${app.name} details`}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <DetailPanel app={app} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default function Variant25() {
  const [active, setActive] = useState(0) // highlighted row
  const [expanded, setExpanded] = useState(0) // expanded row (-1 = none)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const rowRefs = useRef([])
  const listboxId = 'ck-listbox'

  /* self-load fonts */
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap'
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [])

  /* filter rows by query (over name + subtitle) */
  const q = query.trim().toLowerCase()
  const filtered = q
    ? APPS.filter(
        (a) => a.name.toLowerCase().includes(q) || SUBTITLE[a.id].toLowerCase().includes(q),
      )
    : APPS

  /* keep active index in range when the filtered list changes */
  useEffect(() => {
    if (filtered.length === 0) {
      setActive(-1)
      return
    }
    const stillThere = filtered.some((a) => APPS[active] && a.id === APPS[active].id)
    if (!stillThere) {
      setActive(APPS.indexOf(filtered[0]))
      setExpanded(-1)
    }
  }, [q]) // eslint-disable-line react-hooks/exhaustive-deps

  const activateIndex = useCallback(
    (i) => {
      setActive(i)
      setExpanded((cur) => (cur === i ? -1 : i))
    },
    [],
  )

  const moveActive = useCallback(
    (dir) => {
      if (filtered.length === 0) return
      const order = filtered.map((a) => APPS.indexOf(a))
      const pos = order.indexOf(active)
      const nextPos = pos === -1 ? 0 : (pos + dir + order.length) % order.length
      const nextIdx = order[nextPos]
      setActive(nextIdx)
      const node = rowRefs.current[nextIdx]
      if (node && node.scrollIntoView) node.scrollIntoView({ block: 'nearest' })
    },
    [active, filtered],
  )

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveActive(1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveActive(-1)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (active >= 0) activateIndex(active)
      } else if (e.key === 'Escape') {
        if (query) {
          setQuery('')
        } else {
          setExpanded(-1)
        }
      }
    },
    [active, activateIndex, moveActive, query],
  )

  const activeApp = active >= 0 ? APPS[active] : null

  return (
    <div className="ck-root">
      <style>{ckStyles}</style>

      {/* blurred colourful wallpaper backdrop */}
      <div className="ck-wallpaper" aria-hidden="true">
        <span className="ck-blob ck-blob-a" />
        <span className="ck-blob ck-blob-b" />
        <span className="ck-blob ck-blob-c" />
        <span className="ck-blob ck-blob-d" />
        <span className="ck-grid" />
        <span className="ck-vignette" />
      </div>

      {/* faux desktop menu bar for Mac-native flavour (kept clear of top-left) */}
      <div className="ck-menubar" aria-hidden="true">
        <div className="ck-menubar-inner">
          <span className="ck-menubar-left">
            <span className="ck-apple"></span>
            <span className="ck-menubar-app">TalTools</span>
            <span className="ck-menubar-item">File</span>
            <span className="ck-menubar-item">Window</span>
          </span>
          <span className="ck-menubar-right">
            <span className="ck-menubar-item">Spotlight</span>
            <SearchGlyph size={13} color="rgba(255,255,255,0.85)" />
            <span className="ck-menubar-time">Thu 9:41</span>
          </span>
        </div>
      </div>

      <main className="ck-stage">
        {/* eyebrow / brand line */}
        <motion.header
          className="ck-brand"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="ck-brand-kicker">TalTools</span>
          <h1 className="ck-brand-title">Three tiny Mac apps, one command away.</h1>
          <p className="ck-brand-sub">
            A little menu-bar toolkit. Search it like Spotlight, then press an app to open its live
            demo right here.
          </p>
        </motion.header>

        {/* the command palette */}
        <motion.section
          className="ck-palette"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-owns={listboxId}
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          {/* search field */}
          <div className="ck-search">
            <span className="ck-search-icon" aria-hidden="true">
              <SearchGlyph size={20} color="rgba(255,255,255,0.55)" />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search TalTools apps…"
              aria-label="Search TalTools apps"
              aria-controls={listboxId}
              aria-activedescendant={activeApp ? `ck-opt-${activeApp.id}` : undefined}
              autoComplete="off"
              spellCheck="false"
              className="ck-search-input"
            />
            <span className="ck-cmdk" aria-hidden="true">
              <kbd className="ck-kbd ck-kbd-lg">⌘</kbd>
              <kbd className="ck-kbd ck-kbd-lg">K</kbd>
            </span>
          </div>

          {/* section label */}
          <div className="ck-section-label">
            <span>Applications</span>
            <span className="ck-count">{filtered.length} result{filtered.length === 1 ? '' : 's'}</span>
          </div>

          {/* command rows */}
          {filtered.length > 0 ? (
            <ul className="ck-list" role="listbox" id={listboxId} aria-label="TalTools apps">
              {APPS.map((app, i) => {
                const visible = filtered.some((a) => a.id === app.id)
                if (!visible) return null
                return (
                  <CommandRow
                    key={app.id}
                    app={app}
                    index={i}
                    active={active === i}
                    expanded={expanded === i}
                    onActivate={activateIndex}
                    onHover={(idx) => setActive(idx)}
                    rowRef={(el) => (rowRefs.current[i] = el)}
                  />
                )
              })}
            </ul>
          ) : (
            <div className="ck-empty">
              <span className="ck-empty-icon" aria-hidden="true">
                <SearchGlyph size={26} color="rgba(255,255,255,0.4)" />
              </span>
              <p className="ck-empty-title">No matching apps</p>
              <p className="ck-empty-sub">
                Try <button className="ck-empty-clear" onClick={() => setQuery('')}>clearing the search</button>.
              </p>
            </div>
          )}

          {/* footer / shortcut legend */}
          <div className="ck-foot">
            <span className="ck-foot-left">
              <span className="ck-foot-hint">
                <kbd className="ck-kbd">↑</kbd>
                <kbd className="ck-kbd">↓</kbd>
                navigate
              </span>
              <span className="ck-foot-hint">
                <kbd className="ck-kbd">↵</kbd>
                open
              </span>
              <span className="ck-foot-hint ck-foot-hint-wide">
                <kbd className="ck-kbd">esc</kbd>
                close
              </span>
            </span>
            <span className="ck-foot-right">
              {activeApp ? (
                <>
                  <span
                    className="ck-foot-dot"
                    style={{ background: activeApp.accent, boxShadow: `0 0 10px ${rgba(activeApp.accent, 0.8)}` }}
                  />
                  {activeApp.name}
                </>
              ) : (
                'TalTools'
              )}
            </span>
          </div>
        </motion.section>

        <motion.p
          className="ck-tip"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Everything runs in your menu bar. No accounts, minimal permissions, fully local.
        </motion.p>
      </main>
    </div>
  )
}

/* ============================ styles ============================ */
const ckStyles = `
  .ck-root {
    --bg: #07070f;
    --glass: rgba(20, 21, 33, 0.62);
    --glass-edge: rgba(255, 255, 255, 0.12);
    --txt: #f4f4fb;
    --muted: rgba(244, 244, 251, 0.6);
    --muted-2: rgba(244, 244, 251, 0.42);
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    background: var(--bg);
    color: var(--txt);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ---------- wallpaper ---------- */
  .ck-wallpaper { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
  .ck-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.85;
    will-change: transform;
  }
  .ck-blob-a {
    width: 46vw; height: 46vw; left: -8vw; top: -10vw;
    background: radial-gradient(circle at 30% 30%, #ffb703, #ff7b54 60%, transparent 72%);
    animation: ckFloatA 22s ease-in-out infinite;
  }
  .ck-blob-b {
    width: 50vw; height: 50vw; right: -12vw; top: -6vw;
    background: radial-gradient(circle at 60% 40%, #7c5cff, #4338ca 60%, transparent 74%);
    animation: ckFloatB 26s ease-in-out infinite;
  }
  .ck-blob-c {
    width: 42vw; height: 42vw; left: 8vw; bottom: -16vw;
    background: radial-gradient(circle at 50% 50%, #2ec4b6, #0e7490 62%, transparent 74%);
    animation: ckFloatC 24s ease-in-out infinite;
  }
  .ck-blob-d {
    width: 38vw; height: 38vw; right: -6vw; bottom: -12vw;
    background: radial-gradient(circle at 50% 50%, #ff5d8f, #b5179e 60%, transparent 74%);
    animation: ckFloatA 28s ease-in-out infinite reverse;
  }
  .ck-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 100%);
  }
  .ck-vignette {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 90% 75% at 50% 35%, transparent 30%, rgba(5,5,12,0.55) 100%),
      linear-gradient(180deg, rgba(5,5,12,0.35), rgba(5,5,12,0.7));
  }
  @keyframes ckFloatA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(4vw, 3vw) scale(1.08); } }
  @keyframes ckFloatB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-3vw, 4vw) scale(1.06); } }
  @keyframes ckFloatC { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(3vw, -3vw) scale(1.1); } }

  /* ---------- menu bar ---------- */
  .ck-menubar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 30;
    height: 30px;
    background: rgba(8,8,16,0.55);
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .ck-menubar-inner {
    max-width: 1280px; margin: 0 auto; height: 100%;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px 0 96px; /* leave room for the parent back button */
    font-size: 12.5px; color: rgba(255,255,255,0.82);
  }
  .ck-menubar-left, .ck-menubar-right { display: flex; align-items: center; gap: 16px; }
  .ck-apple { font-size: 13px; }
  .ck-menubar-app { font-weight: 700; }
  .ck-menubar-item { color: rgba(255,255,255,0.6); }
  .ck-menubar-time { font-variant-numeric: tabular-nums; }
  @media (max-width: 640px) {
    .ck-menubar-item, .ck-menubar-app { display: none; }
    .ck-menubar-inner { padding-left: 84px; }
  }

  /* ---------- stage ---------- */
  .ck-stage {
    position: relative; z-index: 10;
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 84px 18px 56px;
    box-sizing: border-box;
  }

  /* ---------- brand ---------- */
  .ck-brand { text-align: center; max-width: 680px; margin-bottom: 28px; }
  .ck-brand-kicker {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 600; letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--muted);
    padding: 5px 12px; border-radius: 999px;
    border: 1px solid var(--glass-edge);
    background: rgba(255,255,255,0.04);
    margin-bottom: 18px;
  }
  .ck-brand-title {
    font-size: clamp(28px, 5.4vw, 50px);
    line-height: 1.06; font-weight: 800; letter-spacing: -0.02em;
    margin: 0 0 12px;
    background: linear-gradient(180deg, #ffffff, #c9c9e6);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .ck-brand-sub {
    font-size: clamp(14.5px, 2.2vw, 17px);
    line-height: 1.55; color: var(--muted); margin: 0 auto; max-width: 520px;
  }

  /* ---------- palette ---------- */
  .ck-palette {
    position: relative;
    width: 100%; max-width: 640px;
    background: var(--glass);
    border: 1px solid var(--glass-edge);
    border-radius: 22px;
    box-shadow:
      0 1px 0 rgba(255,255,255,0.08) inset,
      0 30px 80px -24px rgba(0,0,0,0.7),
      0 8px 30px -12px rgba(0,0,0,0.5);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    overflow: hidden;
  }

  /* ---------- search ---------- */
  .ck-search {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 16px 16px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .ck-search-icon { display: inline-flex; flex-shrink: 0; }
  .ck-search-input {
    flex: 1; min-width: 0;
    background: transparent; border: none; outline: none;
    color: var(--txt);
    font-family: inherit; font-size: clamp(16px, 2.4vw, 19px); font-weight: 500;
    letter-spacing: -0.01em;
  }
  .ck-search-input::placeholder { color: rgba(244,244,251,0.38); }
  .ck-cmdk { display: inline-flex; gap: 4px; flex-shrink: 0; }

  /* ---------- kbd ---------- */
  .ck-kbd {
    display: inline-grid; place-items: center;
    min-width: 19px; height: 19px; padding: 0 5px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.78);
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(0,0,0,0.3);
    line-height: 1;
  }
  .ck-kbd-lg { min-width: 22px; height: 22px; font-size: 12px; }

  /* ---------- section label ---------- */
  .ck-section-label {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 18px 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted-2);
  }
  .ck-count { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em; text-transform: none; }

  /* ---------- list ---------- */
  .ck-list { list-style: none; margin: 0; padding: 4px 8px 10px; }

  .ck-row {
    position: relative;
    display: flex; align-items: center; gap: 14px;
    width: 100%;
    padding: 12px 12px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: transparent;
    color: var(--txt);
    text-align: left;
    cursor: pointer;
    transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
    -webkit-appearance: none; appearance: none;
  }
  .ck-row:hover { background: rgba(255,255,255,0.05); }
  .ck-row-active {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.14);
  }
  .ck-row-active::before {
    content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--accent);
  }
  .ck-row:focus-visible {
    outline: 2px solid #8ab4ff;
    outline-offset: 2px;
  }
  .ck-row-glow {
    position: absolute; inset: 0; border-radius: 14px; pointer-events: none;
    transition: background 0.2s ease;
  }
  .ck-row-icon {
    flex-shrink: 0; display: block;
    box-shadow: 0 4px 12px -3px rgba(0,0,0,0.55);
    position: relative; z-index: 1;
  }
  .ck-row-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; position: relative; z-index: 1; }
  .ck-row-name {
    display: flex; align-items: center; gap: 9px;
    font-size: 16px; font-weight: 700; letter-spacing: -0.01em;
  }
  .ck-row-pill {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 6px;
  }
  .ck-row-sub {
    font-size: 13px; color: var(--muted);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ck-row-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; position: relative; z-index: 1; }
  .ck-hotkey { display: inline-flex; gap: 4px; }
  .ck-row-chevron { display: inline-flex; transition: color 0.2s ease; }
  @media (max-width: 480px) {
    .ck-hotkey { display: none; }
    .ck-row-sub { white-space: normal; }
  }

  /* ---------- detail panel ---------- */
  .ck-detail { padding: 6px 12px 16px; }
  .ck-detail-grid {
    display: grid; grid-template-columns: 1fr; gap: 22px;
    padding: 18px;
    border-radius: 16px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
  }
  @media (min-width: 720px) {
    .ck-detail-grid { grid-template-columns: 1fr 1fr; align-items: start; }
  }
  .ck-detail-copy { min-width: 0; }
  .ck-detail-tagline {
    font-size: 15px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 8px;
  }
  .ck-detail-blurb {
    font-size: 14.5px; line-height: 1.6; color: rgba(244,244,251,0.82); margin: 0 0 16px;
  }
  .ck-bullets { list-style: none; margin: 0 0 20px; padding: 0; display: grid; gap: 9px; }
  .ck-bullets li {
    display: flex; align-items: flex-start; gap: 9px;
    font-size: 13.5px; color: rgba(244,244,251,0.86); line-height: 1.4;
  }
  .ck-cta {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 700; letter-spacing: -0.01em;
    padding: 11px 18px; border-radius: 12px;
    text-decoration: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  }
  .ck-cta:hover { transform: translateY(-2px); filter: brightness(1.05); }
  .ck-cta:focus-visible { outline: 2px solid #8ab4ff; outline-offset: 3px; }
  .ck-detail-demo { min-width: 0; }
  .ck-demo-frame {
    border-radius: 14px;
    padding: 4px;
    background: rgba(0,0,0,0.18);
    border: 1px solid rgba(255,255,255,0.06);
  }

  /* ---------- empty ---------- */
  .ck-empty { text-align: center; padding: 38px 20px 30px; }
  .ck-empty-icon { display: inline-flex; margin-bottom: 12px; opacity: 0.8; }
  .ck-empty-title { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
  .ck-empty-sub { font-size: 13.5px; color: var(--muted); margin: 0; }
  .ck-empty-clear {
    background: none; border: none; padding: 0; cursor: pointer;
    color: #8ab4ff; font: inherit; text-decoration: underline; text-underline-offset: 2px;
  }
  .ck-empty-clear:hover { color: #aecbff; }
  .ck-empty-clear:focus-visible { outline: 2px solid #8ab4ff; outline-offset: 2px; border-radius: 3px; }

  /* ---------- footer ---------- */
  .ck-foot {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 10px 16px;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.2);
    font-size: 12px; color: var(--muted-2);
  }
  .ck-foot-left { display: flex; align-items: center; gap: 16px; min-width: 0; }
  .ck-foot-hint { display: inline-flex; align-items: center; gap: 5px; }
  .ck-foot-right { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; color: var(--muted); flex-shrink: 0; }
  .ck-foot-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  @media (max-width: 480px) {
    .ck-foot-hint-wide { display: none; }
    .ck-foot-left { gap: 12px; }
  }

  /* ---------- tip ---------- */
  .ck-tip {
    margin: 26px 0 0; max-width: 520px; text-align: center;
    font-size: 13px; color: var(--muted-2); line-height: 1.5;
  }

  /* ---------- reduced motion ---------- */
  @media (prefers-reduced-motion: reduce) {
    .ck-blob { animation: none !important; }
    .ck-row, .ck-cta, .ck-row-chevron { transition: none !important; }
  }
`
