import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { APPS } from '../apps.js'
import { NatchoDemo, FlicKeyDemo, TallyDemo } from '../demos.jsx'

/* =========================================================================
 *  Variant 24 - "Warm Studio"
 *  A boutique-studio / editorial aesthetic. Warm cream + sand palette, an
 *  elegant Fraunces serif for headings paired with a clean humanist sans
 *  (Newsreader fallback display + Inter body), hairline rules, small-caps
 *  labels, generous line-height, magazine composition. Calm, premium, human.
 * ========================================================================= */

const DEMO_FOR = { natcho: NatchoDemo, flickey: FlicKeyDemo, tally: TallyDemo }

/* ---------- palette ---------- */
const CREAM = '#f4ece0'
const CREAM_DEEP = '#ece1d0'
const SAND = '#e3d6c0'
const INK = '#2c2620'
const INK_SOFT = '#5f564a'
const HAIRLINE = 'rgba(44, 38, 32, 0.16)'
const ESPRESSO = '#6b4f2e'

/* App-specific editorial framing (issue numbers, latin-ish chapter labels). */
const META = {
  natcho: { no: '01', chapter: 'On Quiet Screens', kicker: 'The Vanishing Notch' },
  flickey: { no: '02', chapter: 'On Fluent Hands', kicker: 'The Right Language' },
  tally: { no: '03', chapter: 'On Measured Days', kicker: 'A Glance at Limits' },
}

/* ---------- small primitives ---------- */
function Label({ children, color = INK_SOFT, className = '' }) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: '0.66rem',
        fontWeight: 600,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color,
      }}
    >
      {children}
    </span>
  )
}

function Rule({ style }) {
  return <div style={{ height: 1, background: HAIRLINE, ...style }} />
}

/* Arrow that nudges on hover (parent .ws-link group). */
function ArrowLink({ href, external, accent, children }) {
  const ext = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <a
      href={href}
      {...ext}
      className="ws-link group inline-flex items-center gap-2 cursor-pointer"
      style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: '0.82rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: INK,
      }}
    >
      <span
        className="ws-underline"
        style={{ boxShadow: `inset 0 -1px 0 ${accent}` }}
      >
        {children}
      </span>
      <svg
        className="ws-arrow"
        width="20"
        height="12"
        viewBox="0 0 20 12"
        aria-hidden="true"
        style={{ color: accent }}
      >
        <path
          d="M1 6h16M13 1.5 18.5 6 13 10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

/* Decorative serif ampersand / star ornament drawn in SVG. */
function Asterism({ size = 28, color = ESPRESSO }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ color }}>
      <g fill="currentColor">
        <circle cx="12" cy="6.5" r="2.1" />
        <circle cx="6.8" cy="15.5" r="2.1" />
        <circle cx="17.2" cy="15.5" r="2.1" />
      </g>
    </svg>
  )
}

/* ---------- app tile ---------- */
function AppSection({ app, index, reduce }) {
  const meta = META[app.id]
  const Demo = DEMO_FOR[app.id]
  const flip = index % 2 === 1

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      }

  return (
    <section
      aria-labelledby={`app-${app.id}`}
      className="ws-section"
      style={{ scrollMarginTop: 80 }}
    >
      <Rule style={{ marginBottom: '2.75rem' }} />

      {/* chapter header row */}
      <div className="ws-chapter-row">
        <div className="flex items-baseline gap-4">
          <span
            aria-hidden="true"
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(2.6rem, 7vw, 4.2rem)',
              fontWeight: 300,
              lineHeight: 1,
              color: SAND,
              fontStyle: 'italic',
            }}
          >
            {meta.no}
          </span>
          <Label>{meta.chapter}</Label>
        </div>
        <span
          aria-hidden="true"
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: '0.66rem',
            fontWeight: 600,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: app.accent,
          }}
        >
          {app.external ? 'New tab' : 'In studio'}
        </span>
      </div>

      <motion.div {...reveal} className={`ws-grid ${flip ? 'ws-flip' : ''}`}>
        {/* editorial column */}
        <div className="ws-copy">
          <div className="flex items-center gap-4">
            <img
              src={app.icon}
              alt={app.name + ' icon'}
              width={62}
              height={62}
              style={{
                borderRadius: '22%',
                boxShadow: '0 10px 26px rgba(44,38,32,0.18)',
                display: 'block',
              }}
            />
            <div>
              <Label color={app.accent}>{meta.kicker}</Label>
              <h3
                id={`app-${app.id}`}
                style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 'clamp(2.1rem, 5vw, 3rem)',
                  fontWeight: 500,
                  lineHeight: 1.02,
                  color: INK,
                  marginTop: '0.2rem',
                }}
              >
                {app.name}
              </h3>
            </div>
          </div>

          <p
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
              fontWeight: 400,
              lineHeight: 1.4,
              color: ESPRESSO,
              marginTop: '1.5rem',
            }}
          >
            {app.tagline}
          </p>

          <p
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '1.02rem',
              lineHeight: 1.75,
              color: INK_SOFT,
              marginTop: '1rem',
              maxWidth: '34ch',
            }}
          >
            {app.blurb}
          </p>

          {/* bullets as an editorial spec list */}
          <ul className="ws-bullets">
            {app.bullets.map((b, i) => (
              <li key={i} className="ws-bullet">
                <span
                  className="ws-bullet-dot"
                  style={{ background: app.accent }}
                  aria-hidden="true"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '1.9rem' }}>
            <ArrowLink href={app.site} external={app.external} accent={app.accent}>
              See the full demo
            </ArrowLink>
          </div>
        </div>

        {/* demo column: framed like a plate in a journal */}
        <figure className="ws-plate" style={{ ['--accent']: app.accent }}>
          <div className="ws-plate-inner">
            <Demo tone="light" />
          </div>
          <figcaption className="ws-platecap">
            <span
              className="ws-platecap-line"
              style={{ background: app.accent }}
              aria-hidden="true"
            />
            <Label>
              Plate {meta.no} · live & interactive
            </Label>
          </figcaption>
        </figure>
      </motion.div>
    </section>
  )
}

export default function Variant24() {
  const reduce = useReducedMotion()
  const [year, setYear] = useState('2026')

  /* self-load Google Fonts: Fraunces (display serif) + Inter (humanist sans) */
  useEffect(() => {
    const links = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@400;500;600;700&display=swap',
      },
    ]
    const els = links.map((attrs) => {
      const l = document.createElement('link')
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'crossOrigin') l.crossOrigin = v
        else l.setAttribute(k, v)
      })
      document.head.appendChild(l)
      return l
    })
    setYear(String(new Date().getFullYear()))
    return () => els.forEach((l) => l.remove())
  }, [])

  const heroReveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      }

  return (
    <div
      style={{
        background: CREAM,
        color: INK,
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      {/* ---------- masthead ---------- */}
      <header className="ws-wrap" style={{ paddingTop: '5.5rem' }}>
        <div className="ws-masthead">
          <Label className="ws-masthead-left">The TalTools Quarterly</Label>
          <span className="ws-masthead-mid" aria-hidden="true">
            <Asterism size={22} />
          </span>
          <Label className="ws-masthead-right">Issue №24 · Cream</Label>
        </div>
        <Rule style={{ marginTop: '1.1rem' }} />
        <div style={{ height: 3 }} />
        <Rule />
      </header>

      {/* ---------- hero ---------- */}
      <section className="ws-wrap" style={{ paddingTop: '3.5rem', paddingBottom: '2rem' }}>
        <motion.div {...heroReveal}>
          <Label color={ESPRESSO}>A small studio of menu-bar tools for macOS</Label>
          <h1
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(3rem, 11vw, 8rem)',
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.015em',
              color: INK,
              marginTop: '1.2rem',
            }}
          >
            Tools made
            <br />
            with
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: ESPRESSO,
              }}
            >
              {' '}
              care
            </span>
            <span style={{ color: SAND }}>.</span>
          </h1>

          <div className="ws-hero-foot">
            <p
              style={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: '1.08rem',
                lineHeight: 1.7,
                color: INK_SOFT,
                maxWidth: '42ch',
              }}
            >
              Three quiet companions that live in your menu bar. They do one
              thing each, do it beautifully, and ask for minimal permissions.
              Hide the notch, type in every language, keep an eye on your
              Claude usage.
            </p>

            <div className="ws-hero-apps" aria-hidden="true">
              {APPS.map((a) => (
                <div key={a.id} className="ws-hero-app">
                  <img
                    src={a.icon}
                    alt=""
                    width={40}
                    height={40}
                    style={{ borderRadius: '22%', display: 'block' }}
                  />
                  <span
                    style={{
                      fontFamily: '"Fraunces", Georgia, serif',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: INK,
                    }}
                  >
                    {a.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------- contents strip ---------- */}
      <section className="ws-wrap" style={{ paddingBottom: '4rem' }}>
        <Rule style={{ marginBottom: '1.4rem' }} />
        <div className="ws-contents">
          <Label>In this issue</Label>
          <ul className="ws-contents-list">
            {APPS.map((a) => (
              <li key={a.id}>
                <a
                  href={`#app-${a.id}`}
                  className="ws-toc-link cursor-pointer"
                  style={{ color: INK }}
                >
                  <span
                    style={{
                      fontFamily: '"Fraunces", Georgia, serif',
                      fontStyle: 'italic',
                      color: SAND,
                      marginRight: '0.55rem',
                    }}
                  >
                    {META[a.id].no}
                  </span>
                  <span
                    className="ws-toc-name"
                    style={{
                      fontFamily: '"Fraunces", Georgia, serif',
                      fontSize: '1.05rem',
                      fontWeight: 500,
                      boxShadow: `inset 0 -1px 0 ${a.accent}`,
                    }}
                  >
                    {a.name}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontSize: '0.84rem',
                      color: INK_SOFT,
                      marginLeft: '0.55rem',
                    }}
                  >
                    {a.tagline}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Rule style={{ marginTop: '1.4rem' }} />
      </section>

      {/* ---------- app sections ---------- */}
      <main className="ws-wrap ws-sections">
        {APPS.map((app, i) => (
          <AppSection key={app.id} app={app} index={i} reduce={reduce} />
        ))}
      </main>

      {/* ---------- colophon / footer ---------- */}
      <footer className="ws-wrap" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <Rule style={{ marginBottom: '2.5rem' }} />
        <div className="ws-colophon">
          <div>
            <h2
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: INK,
              }}
            >
              Small tools,
              <br />
              <span style={{ fontStyle: 'italic', color: ESPRESSO }}>
                made to disappear.
              </span>
            </h2>
            <p
              style={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: '0.96rem',
                lineHeight: 1.7,
                color: INK_SOFT,
                marginTop: '1.1rem',
                maxWidth: '38ch',
              }}
            >
              Native, notarized, and quietly built. Each one runs locally with
              minimal permissions, so it can stay out of your way.
            </p>
          </div>

          <div className="ws-colophon-meta">
            <div className="flex items-center gap-3">
              <Asterism size={20} color={SAND} />
              <Label>Colophon</Label>
            </div>
            <dl className="ws-deflist">
              <div className="ws-defrow">
                <dt>Type</dt>
                <dd>Fraunces &amp; Inter</dd>
              </div>
              <div className="ws-defrow">
                <dt>Platform</dt>
                <dd>macOS menu bar</dd>
              </div>
              <div className="ws-defrow">
                <dt>Edition</dt>
                <dd>{year}</dd>
              </div>
            </dl>
          </div>
        </div>

        <Rule style={{ marginTop: '2.5rem', marginBottom: '1.2rem' }} />
        <div className="ws-imprint">
          <Label>© {year} TalTools</Label>
          <Label>Set in the cream</Label>
        </div>
      </footer>

      {/* ---------- scoped styles ---------- */}
      <style>{`
        .ws-wrap {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding-left: clamp(1.25rem, 5vw, 4rem);
          padding-right: clamp(1.25rem, 5vw, 4rem);
          box-sizing: border-box;
        }

        /* masthead */
        .ws-masthead {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }
        .ws-masthead-left { text-align: left; }
        .ws-masthead-mid { display: grid; place-items: center; }
        .ws-masthead-right { text-align: right; }

        /* hero */
        .ws-hero-foot {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: clamp(1.5rem, 5vw, 3.5rem);
          align-items: end;
          margin-top: 2.5rem;
        }
        .ws-hero-apps {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          border-left: 1px solid ${HAIRLINE};
          padding-left: clamp(1.2rem, 4vw, 2.2rem);
        }
        .ws-hero-app {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        /* contents */
        .ws-contents {
          display: grid;
          grid-template-columns: minmax(120px, 0.7fr) 3fr;
          gap: clamp(1rem, 4vw, 2.5rem);
          align-items: start;
        }
        .ws-contents-list { display: flex; flex-direction: column; gap: 0.7rem; }
        .ws-toc-link {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: baseline;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .ws-toc-link:hover { opacity: 0.72; }
        .ws-toc-name { transition: box-shadow 0.2s ease; }

        /* sections */
        .ws-sections > .ws-section { margin-top: 4.5rem; }
        .ws-sections > .ws-section:first-child { margin-top: 1.5rem; }

        .ws-chapter-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2.2rem;
          flex-wrap: wrap;
        }

        .ws-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 6vw, 5rem);
          align-items: center;
        }
        .ws-flip .ws-copy { order: 2; }
        .ws-flip .ws-plate { order: 1; }

        .ws-bullets {
          list-style: none;
          padding: 0;
          margin: 2rem 0 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem 1.5rem;
          border-top: 1px solid ${HAIRLINE};
          padding-top: 1.6rem;
        }
        .ws-bullet {
          display: flex;
          align-items: baseline;
          gap: 0.65rem;
          font-family: "Inter", system-ui, sans-serif;
          font-size: 0.9rem;
          line-height: 1.45;
          color: ${INK};
        }
        .ws-bullet-dot {
          flex: none;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          transform: translateY(-1px);
        }

        /* plate (demo frame) */
        .ws-plate {
          margin: 0;
          background: ${CREAM_DEEP};
          border: 1px solid ${HAIRLINE};
          border-radius: 4px;
          padding: clamp(1.1rem, 3vw, 1.9rem);
          box-shadow: 0 24px 60px -36px rgba(44,38,32,0.5);
          position: relative;
        }
        .ws-plate::before {
          content: "";
          position: absolute;
          inset: 7px;
          border: 1px solid ${HAIRLINE};
          border-radius: 2px;
          pointer-events: none;
        }
        .ws-plate-inner {
          position: relative;
          background: ${CREAM};
          border-radius: 3px;
          padding: clamp(0.9rem, 2.5vw, 1.4rem);
          box-shadow: inset 0 0 0 1px rgba(44,38,32,0.05);
        }
        .ws-platecap {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-top: 1.1rem;
        }
        .ws-platecap-line { width: 28px; height: 2px; flex: none; }

        /* link */
        .ws-underline { transition: box-shadow 0.2s ease, color 0.2s ease; }
        .ws-arrow {
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1);
          transform: translateX(0);
        }
        .ws-link:hover .ws-arrow { transform: translateX(5px); }
        .ws-link:hover .ws-underline { box-shadow: inset 0 -2px 0 currentColor; }

        /* colophon */
        .ws-colophon {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: clamp(2rem, 6vw, 4rem);
          align-items: start;
        }
        .ws-colophon-meta { display: grid; gap: 1.1rem; }
        .ws-deflist { margin: 0; display: grid; gap: 0; }
        .ws-defrow {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.7rem 0;
          border-top: 1px solid ${HAIRLINE};
          font-family: "Inter", system-ui, sans-serif;
          font-size: 0.9rem;
        }
        .ws-defrow dt { color: ${INK_SOFT}; }
        .ws-defrow dd { margin: 0; color: ${INK}; font-weight: 600; }
        .ws-imprint { display: flex; justify-content: space-between; gap: 1rem; }

        /* focus states */
        .ws-link:focus-visible,
        .ws-toc-link:focus-visible {
          outline: 2px solid ${ESPRESSO};
          outline-offset: 4px;
          border-radius: 2px;
        }

        /* responsive */
        @media (max-width: 860px) {
          .ws-hero-foot { grid-template-columns: 1fr; align-items: start; }
          .ws-hero-apps {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 1.2rem 2rem;
            border-left: none;
            border-top: 1px solid ${HAIRLINE};
            padding-left: 0;
            padding-top: 1.4rem;
          }
          .ws-contents { grid-template-columns: 1fr; }
          .ws-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .ws-flip .ws-copy,
          .ws-flip .ws-plate { order: initial; }
          .ws-copy { order: 1; }
          .ws-plate { order: 2; }
          .ws-colophon { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .ws-bullets { grid-template-columns: 1fr; }
          .ws-toc-link { gap: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ws-arrow { transition: none; }
        }
      `}</style>
    </div>
  )
}
