import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { APPS } from '../apps.js'

const MONO = "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
const GREEN = '#00ff9c'
const CYAN = '#39c5ff'
const BG = '#0d1117'

const ASCII_LOGO = `
 ████████╗ █████╗ ██╗     ████████╗ ██████╗  ██████╗ ██╗     ███████╗
 ╚══██╔══╝██╔══██╗██║     ╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝
    ██║   ███████║██║        ██║   ██║   ██║██║   ██║██║     ███████╗
    ██║   ██╔══██║██║        ██║   ██║   ██║██║   ██║██║     ╚════██║
    ██║   ██║  ██║███████╗   ██║   ╚██████╔╝╚██████╔╝███████╗███████║
    ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝`

const WELCOME_TEXT = `$ taltools --welcome

  Welcome to TALTOOLS // a tiny lab of three Mac menu-bar apps.
  Small, fast, notarized. They live up there ▲ next to your clock.

  Type a command, or click a chip below.  ('help' lists everything)`

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Build the list of available commands off APPS.
const OPEN_COMMANDS = APPS.map((a) => `open ${a.id}`)

// ---- Command handlers: each returns an array of output "lines" objects ----
function runCommand(raw) {
  const cmd = raw.trim().toLowerCase()
  const lines = []
  // echo the entered command as a prompt line
  lines.push({ id: `cmd-${Date.now()}-${Math.random()}`, type: 'prompt', text: raw.trim() })

  if (cmd === '' ) {
    return lines
  }

  if (cmd === 'help' || cmd === '?' || cmd === '--help' || cmd === '-h') {
    lines.push({
      id: rid(),
      type: 'help',
      rows: [
        ['list', 'show all apps in the lab'],
        ...APPS.map((a) => [`open ${a.id}`, `view details for ${a.name}`]),
        ['download', 'how to get the apps'],
        ['about', 'what is TalTools?'],
        ['clear', 'wipe the terminal'],
        ['help', 'show this message'],
      ],
    })
    return lines
  }

  if (cmd === 'list' || cmd === 'ls' || cmd === 'apps') {
    lines.push({ id: rid(), type: 'list', apps: APPS })
    return lines
  }

  if (cmd === 'about') {
    lines.push({
      id: rid(),
      type: 'text',
      text:
        'TALTOOLS is a one-person workshop of small, opinionated macOS utilities.\nEach app does exactly one thing, lives in the menu bar, and gets out of your way.\nNo accounts. No telemetry. Notarized & signed.',
      accent: GREEN,
    })
    return lines
  }

  if (cmd === 'download' || cmd === 'install' || cmd === 'get') {
    lines.push({ id: rid(), type: 'download' })
    return lines
  }

  if (cmd === 'clear' || cmd === 'cls') {
    lines.push({ id: rid(), type: 'clear' })
    return lines
  }

  // open <id>
  if (cmd.startsWith('open')) {
    const arg = cmd.replace(/^open\s*/, '').trim()
    const app = APPS.find((a) => a.id === arg)
    if (app) {
      lines.push({ id: rid(), type: 'app', app })
      return lines
    }
    if (arg === '') {
      lines.push({
        id: rid(),
        type: 'error',
        text: `open: missing argument. try one of: ${APPS.map((a) => a.id).join(', ')}`,
      })
      return lines
    }
    lines.push({
      id: rid(),
      type: 'error',
      text: `open: '${arg}' is not an app. known apps: ${APPS.map((a) => a.id).join(', ')}`,
    })
    return lines
  }

  lines.push({
    id: rid(),
    type: 'error',
    text: `command not found: ${cmd}.  type 'help' to see what i can do.`,
  })
  return lines
}

let _ridCounter = 0
function rid() {
  _ridCounter += 1
  return `l-${Date.now()}-${_ridCounter}`
}

const CHIPS = ['list', ...OPEN_COMMANDS, 'download', 'about', 'help']

export default function Variant3() {
  const [history, setHistory] = useState([]) // committed output lines
  const [typed, setTyped] = useState('') // current typewriter text for welcome
  const [typingDone, setTypingDone] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // ---- Typewriter for the welcome message (runs once) ----
  useEffect(() => {
    const reduce = prefersReducedMotion()
    if (reduce) {
      setTyped(WELCOME_TEXT)
      setTypingDone(true)
      return
    }
    let i = 0
    let cancelled = false
    let timer
    const tick = () => {
      if (cancelled) return
      i += 1
      setTyped(WELCOME_TEXT.slice(0, i))
      if (i >= WELCOME_TEXT.length) {
        setTypingDone(true)
        return
      }
      // vary speed slightly; pause longer on newlines
      const ch = WELCOME_TEXT[i - 1]
      const delay = ch === '\n' ? 90 : 14 + Math.random() * 16
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 350)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  // ---- Autoscroll to bottom whenever output changes ----
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history, typed])

  // ---- Load monospace Google Font ----
  useEffect(() => {
    const id = 'taltools-mono-font'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap'
    document.head.appendChild(link)
  }, [])

  const submit = useCallback((raw) => {
    const value = raw.trim()
    const out = runCommand(value)
    setHistory((prev) => {
      // handle 'clear' by wiping everything
      if (out.some((l) => l.type === 'clear')) {
        return []
      }
      return [...prev, ...out]
    })
    setInput('')
  }, [])

  const onChipClick = (chip) => {
    submit(chip)
    if (inputRef.current) inputRef.current.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit(input)
    }
  }

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        color: '#c9d1d9',
        fontFamily: MONO,
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <StyleBlock />

      {/* CRT scanline + glow overlays (non-interactive) */}
      <div className="tt-scanlines" aria-hidden="true" />
      <div className="tt-glow" aria-hidden="true" />
      <div className="tt-flicker" aria-hidden="true" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 960,
          margin: '0 auto',
          padding: '64px 16px 48px',
        }}
      >
        {/* ASCII logo */}
        <motion.pre
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="tt-logo"
          style={{
            color: GREEN,
            textShadow: `0 0 8px ${GREEN}66`,
            fontSize: 'clamp(4px, 1.6vw, 13px)',
            lineHeight: 1.05,
            margin: 0,
            whiteSpace: 'pre',
            overflowX: 'auto',
            fontFamily: MONO,
          }}
        >
          {ASCII_LOGO}
        </motion.pre>

        <div
          style={{
            color: CYAN,
            fontSize: 'clamp(11px, 2.5vw, 14px)',
            marginTop: 8,
            marginBottom: 18,
            letterSpacing: 1,
            opacity: 0.85,
          }}
        >
          // a tiny lab of three mac menu-bar apps &mdash; v3.0.0
        </div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onClick={focusInput}
          style={{
            border: `1px solid ${GREEN}44`,
            borderRadius: 10,
            background: 'rgba(13, 17, 23, 0.72)',
            boxShadow: `0 0 0 1px #ffffff08, 0 0 40px ${GREEN}1a, inset 0 0 60px #00000040`,
            overflow: 'hidden',
            backdropFilter: 'blur(2px)',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderBottom: `1px solid ${GREEN}22`,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span style={dot('#ff5f56')} />
            <span style={dot('#ffbd2e')} />
            <span style={dot('#27c93f')} />
            <span
              style={{
                marginLeft: 10,
                fontSize: 12,
                color: '#8b949e',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              tal@taltools: ~/lab &mdash; zsh
            </span>
          </div>

          {/* Output area */}
          <div
            ref={scrollRef}
            style={{
              padding: '16px 16px 8px',
              height: 'clamp(360px, 56vh, 520px)',
              overflowY: 'auto',
              fontSize: 'clamp(12px, 2.6vw, 14px)',
              lineHeight: 1.6,
            }}
          >
            {/* Welcome (typewriter) */}
            <pre className="tt-out" style={preStyle}>
              {typed}
              {!typingDone && <span className="tt-cursor-inline">▋</span>}
            </pre>

            {/* Command history output */}
            {history.map((line) => (
              <OutputLine key={line.id} line={line} onChipClick={onChipClick} />
            ))}

            {/* Live prompt line */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: 6,
                gap: 0,
              }}
            >
              <Prompt />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="terminal command input"
                placeholder={typingDone ? "type a command…" : ''}
                style={{
                  flex: '1 1 120px',
                  minWidth: 80,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: GREEN,
                  fontFamily: MONO,
                  fontSize: 'inherit',
                  caretColor: GREEN,
                  padding: 0,
                }}
              />
              {!input && <span className="tt-cursor-blink" style={{ color: GREEN }}>▋</span>}
            </div>
          </div>
        </motion.div>

        {/* Suggested command chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 16,
          }}
        >
          <span style={{ color: '#8b949e', fontSize: 12, alignSelf: 'center', marginRight: 4 }}>
            try:
          </span>
          {CHIPS.map((chip) => (
            <motion.button
              key={chip}
              onClick={() => onChipClick(chip)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="tt-chip"
              style={{
                fontFamily: MONO,
                fontSize: 'clamp(11px, 2.4vw, 13px)',
                color: CYAN,
                background: 'rgba(57, 197, 255, 0.06)',
                border: `1px solid ${CYAN}44`,
                borderRadius: 6,
                padding: '5px 10px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: GREEN }}>$</span> {chip}
            </motion.button>
          ))}
        </div>

        {/* Footer status line */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            fontSize: 11,
            color: '#6e7681',
            borderTop: `1px solid ${GREEN}18`,
            paddingTop: 14,
          }}
        >
          <span style={{ color: GREEN }}>● online</span>
          <span>apps: {APPS.length}</span>
          <span>permissions: 0</span>
          <span>telemetry: none</span>
          <span style={{ marginLeft: 'auto', color: CYAN }}>made with ☕ &amp; swift</span>
        </div>
      </div>
    </div>
  )
}

function Prompt() {
  return (
    <span style={{ whiteSpace: 'nowrap', userSelect: 'none' }}>
      <span style={{ color: GREEN }}>tal@taltools</span>
      <span style={{ color: '#8b949e' }}>:</span>
      <span style={{ color: CYAN }}>~/lab</span>
      <span style={{ color: '#8b949e' }}>$&nbsp;</span>
    </span>
  )
}

function dot(color) {
  return {
    width: 11,
    height: 11,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
    flexShrink: 0,
  }
}

const preStyle = {
  margin: 0,
  fontFamily: MONO,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

function OutputLine({ line, onChipClick }) {
  const wrap = (children) => (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      style={{ marginTop: 8 }}
    >
      {children}
    </motion.div>
  )

  if (line.type === 'prompt') {
    return wrap(
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Prompt />
        <span style={{ color: '#e6edf3', wordBreak: 'break-word' }}>{line.text}</span>
      </div>
    )
  }

  if (line.type === 'text') {
    return wrap(
      <pre style={{ ...preStyle, color: line.accent || '#c9d1d9' }}>{line.text}</pre>
    )
  }

  if (line.type === 'error') {
    return wrap(<pre style={{ ...preStyle, color: '#ff7b72' }}>{line.text}</pre>)
  }

  if (line.type === 'help') {
    return wrap(
      <div>
        <div style={{ color: GREEN, marginBottom: 4 }}>available commands:</div>
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {line.rows.map(([cmd, desc]) => (
              <tr key={cmd}>
                <td
                  style={{
                    color: CYAN,
                    verticalAlign: 'top',
                    paddingRight: 18,
                    paddingBottom: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cmd}
                </td>
                <td style={{ color: '#8b949e', paddingBottom: 2 }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (line.type === 'list') {
    return wrap(
      <div>
        <div style={{ color: GREEN, marginBottom: 6 }}>
          found {line.apps.length} apps in ~/lab:
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {line.apps.map((a) => (
            <div
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{a.emoji}</span>
              <span style={{ color: a.accent, fontWeight: 700, minWidth: 76 }}>
                {a.name}
              </span>
              <span style={{ color: '#8b949e' }}>{a.tagline}</span>
              <button
                onClick={() => onChipClick(`open ${a.id}`)}
                className="tt-link"
                style={linkBtnStyle}
              >
                open {a.id} →
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (line.type === 'app') {
    const a = line.app
    return wrap(
      <div
        style={{
          borderLeft: `2px solid ${a.accent}`,
          paddingLeft: 14,
          marginTop: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 26 }}>{a.emoji}</span>
          <span
            style={{
              color: a.accent,
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 700,
              textShadow: `0 0 10px ${a.accent}55`,
            }}
          >
            {a.name}
          </span>
          <span style={{ color: '#8b949e' }}>&mdash; {a.tagline}</span>
        </div>
        <pre style={{ ...preStyle, color: '#c9d1d9', marginTop: 8 }}>{a.blurb}</pre>
        <div style={{ marginTop: 8 }}>
          {a.bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: a.accent }}>▸</span>
              <span style={{ color: '#c9d1d9', wordBreak: 'break-word' }}>{b}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => onChipClick('download')}
          className="tt-link"
          style={{ ...linkBtnStyle, color: a.accent, borderColor: `${a.accent}66`, marginTop: 10 }}
        >
          $ download {a.id}
        </button>
      </div>
    )
  }

  if (line.type === 'download') {
    return wrap(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          border: `1px dashed ${GREEN}66`,
          borderRadius: 8,
          padding: 16,
          marginTop: 4,
          background: `${GREEN}08`,
        }}
      >
        <div style={{ color: GREEN, fontWeight: 700, marginBottom: 6 }}>
          ⇩ ready to install
        </div>
        <pre style={{ ...preStyle, color: '#c9d1d9', marginBottom: 12 }}>
{`# all apps are notarized & signed.
# pick one, drop it in /Applications, look up at your menu bar.`}
        </pre>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {APPS.map((a) => (
            <motion.a
              key={a.id}
              href="#"
              whileHover={{ y: -2, boxShadow: `0 6px 20px ${a.accent}33` }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => e.preventDefault()}
              style={{
                textDecoration: 'none',
                fontFamily: MONO,
                fontSize: 13,
                color: BG,
                background: a.accent,
                borderRadius: 6,
                padding: '8px 14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {a.emoji} get {a.name}
            </motion.a>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: '#6e7681' }}>
          requires macOS 13+. no account, no card, no tracking.
        </div>
      </motion.div>
    )
  }

  return null
}

const linkBtnStyle = {
  fontFamily: MONO,
  fontSize: 12,
  background: 'transparent',
  border: '1px solid #39c5ff44',
  color: CYAN,
  borderRadius: 5,
  padding: '2px 8px',
  cursor: 'pointer',
}

function StyleBlock() {
  return (
    <style>{`
      .tt-scanlines {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 50;
        background: repeating-linear-gradient(
          to bottom,
          rgba(0,0,0,0) 0px,
          rgba(0,0,0,0) 2px,
          rgba(0,0,0,0.18) 3px,
          rgba(0,0,0,0) 4px
        );
        mix-blend-mode: multiply;
      }
      .tt-glow {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background:
          radial-gradient(ellipse at 50% 0%, rgba(0,255,156,0.10), transparent 60%),
          radial-gradient(ellipse at 80% 100%, rgba(57,197,255,0.08), transparent 55%);
      }
      .tt-flicker {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 51;
        background: rgba(0,255,156,0.012);
        animation: ttFlicker 6s infinite steps(60);
      }
      @keyframes ttFlicker {
        0%, 96%, 100% { opacity: 0; }
        97% { opacity: 0.5; }
        98% { opacity: 0; }
        99% { opacity: 0.4; }
      }
      .tt-cursor-blink, .tt-cursor-inline {
        animation: ttBlink 1s steps(1) infinite;
      }
      @keyframes ttBlink {
        50% { opacity: 0; }
      }
      .tt-chip:hover {
        background: rgba(57,197,255,0.14) !important;
        box-shadow: 0 0 14px rgba(57,197,255,0.25);
      }
      .tt-link:hover {
        background: rgba(57,197,255,0.12) !important;
      }
      .tt-out::selection, .tt-out *::selection { background: ${GREEN}55; }
      @media (prefers-reduced-motion: reduce) {
        .tt-flicker { animation: none; display: none; }
        .tt-cursor-blink, .tt-cursor-inline { animation: none; }
      }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: ${GREEN}33; border-radius: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
    `}</style>
  )
}
