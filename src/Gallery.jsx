import { useEffect, useState, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'

const Original = lazy(() => import('./App.jsx'))
const V1 = lazy(() => import('./variants/Variant1.jsx'))
const V2 = lazy(() => import('./variants/Variant2.jsx'))
const V3 = lazy(() => import('./variants/Variant3.jsx'))
const V4 = lazy(() => import('./variants/Variant4.jsx'))
const V5 = lazy(() => import('./variants/Variant5.jsx'))
const V6 = lazy(() => import('./variants/Variant6.jsx'))
const V7 = lazy(() => import('./variants/Variant7.jsx'))
const V8 = lazy(() => import('./variants/Variant8.jsx'))
const V9 = lazy(() => import('./variants/Variant9.jsx'))
const V10 = lazy(() => import('./variants/Variant10.jsx'))
const V11 = lazy(() => import('./variants/Variant11.jsx'))
const V12 = lazy(() => import('./variants/Variant12.jsx'))
const V13 = lazy(() => import('./variants/Variant13.jsx'))
const V14 = lazy(() => import('./variants/Variant14.jsx'))
const V15 = lazy(() => import('./variants/Variant15.jsx'))
const V16 = lazy(() => import('./variants/Variant16.jsx'))
const V17 = lazy(() => import('./variants/Variant17.jsx'))
const V18 = lazy(() => import('./variants/Variant18.jsx'))
const V19 = lazy(() => import('./variants/Variant19.jsx'))
const V20 = lazy(() => import('./variants/Variant20.jsx'))
const V21 = lazy(() => import('./variants/Variant21.jsx'))
const V22 = lazy(() => import('./variants/Variant22.jsx'))
const V23 = lazy(() => import('./variants/Variant23.jsx'))
const V24 = lazy(() => import('./variants/Variant24.jsx'))
const V25 = lazy(() => import('./variants/Variant25.jsx'))
const V26 = lazy(() => import('./variants/Variant26.jsx'))

const DESIGNS = [
  { hash: 'v1', name: 'Aurora Glass', desc: 'Dreamy frosted glass · soft aurora light · elegant', sw: ['#c4b5fd', '#a5f3fc', '#fbcfe8'], C: V1 },
  { hash: 'v2', name: 'Neo-Brutalist', desc: 'Loud Swiss poster · huge type · raw borders', sw: ['#ffde00', '#ff4040', '#1b1233'], C: V2 },
  { hash: 'v3', name: 'Terminal', desc: 'Dark interactive command-line · type to explore', sw: ['#0d1117', '#00ff9c', '#39c5ff'], C: V3 },
  { hash: 'v4', name: 'Arcade', desc: '8-bit pixel game · apps as playable levels', sw: ['#2d1b69', '#ff2e88', '#ffd23f'], C: V4 },
  { hash: 'v5', name: 'TalOS 🤯', desc: 'A fake, draggable macOS desktop — the wild one', sw: ['#1d6feff', '#ff7ad9', '#2ec4b6'].map((c) => c.slice(0, 7)), C: V5 },
  { hash: 'v6', name: 'Claymorphism', desc: 'Puffy 3D pastel clay · squishy toy UI', sw: ['#ffd6e8', '#c5e8ff', '#d4f5d4'], C: V6 },
  { hash: 'v7', name: 'Synthwave', desc: '80s neon grid · chrome text · retro sunset', sw: ['#ff2a6d', '#05d9e8', '#1a0033'], C: V7 },
  { hash: 'v8', name: 'Liquid Goo', desc: 'SVG metaballs · organic blobs chase your cursor', sw: ['#ff006e', '#8338ec', '#3a86ff'], C: V8 },
  { hash: 'v9', name: 'Sketchbook', desc: 'Hand-drawn notebook · doodles · sticky notes', sw: ['#fef9e7', '#1b1233', '#ff5d5d'], C: V9 },
  { hash: 'v10', name: 'Cinematic Scroll', desc: 'Scroll through depth · apps emerge from the distance', sw: ['#0b1026', '#ff9e64', '#7c5cff'], C: V10 },
  { hash: 'v11', name: 'Blueprint', desc: 'Engineering schematic · cyan draft lines · annotations', sw: ['#0a2540', '#4fc3f7', '#e3f2fd'], C: V11 },
  { hash: 'v12', name: 'Newspaper', desc: 'Old broadsheet press · masthead · halftone columns', sw: ['#f4f1ea', '#1a1a1a', '#8b0000'], C: V12 },
  { hash: 'v13', name: 'Isometric', desc: 'A tiny 3D diorama world · apps as little buildings', sw: ['#a5d8ff', '#ffd43b', '#b197fc'], C: V13 },
  { hash: 'v14', name: 'Kinetic Type', desc: 'Type IS the design · giant words morph & react', sw: ['#0a0a0a', '#ffffff', '#ff3b3b'], C: V14 },
  { hash: 'v15', name: 'Boarding Pass', desc: 'Thermal receipt / ticket · perforations · barcodes', sw: ['#ffffff', '#1a1a1a', '#00a86b'], C: V15 },
  { hash: 'v16', name: 'Frutiger Aero', desc: 'Glossy Y2K aqua · droplets · Bliss-era shine', sw: ['#7ec8e3', '#ffffff', '#a8e063'], C: V16 },
  { hash: 'v17', name: 'Comic Book', desc: 'Halftone dots · speech bubbles · BAM/POW ink', sw: ['#ffe600', '#ff2b2b', '#0a0a0a'], C: V17 },
  { hash: 'v18', name: 'Botanical', desc: 'Riso botanical · plants grow as you scroll', sw: ['#2f5d3a', '#e8e0cf', '#e08e45'], C: V18 },
  { hash: 'v19', name: 'Mission Control', desc: 'Live ops dashboard · gauges · telemetry readouts', sw: ['#05101f', '#00e5ff', '#ff6b35'], C: V19 },
  { hash: 'v20', name: 'Origami', desc: 'Folded paper-craft · facets · fold-open animations', sw: ['#ff6f91', '#f7b267', '#5e60ce'], C: V20 },
  { hash: 'v21', name: 'Raycast Dark Pro', desc: 'Sleek dark dev-tool · violet glow · glassy cards', sw: ['#08080c', '#7c5cff', '#4cc9f0'], C: V21 },
  { hash: 'v22', name: 'Cupertino Light', desc: 'Apple-style product page · airy · elegant', sw: ['#ffffff', '#0071e3', '#f5f5f7'], C: V22 },
  { hash: 'v23', name: 'Bento Mosaic', desc: 'Modern bento grid · feature tiles · live demos', sw: ['#111827', '#6366f1', '#f3f4f6'], C: V23 },
  { hash: 'v24', name: 'Warm Studio', desc: 'Boutique editorial · warm serif · refined', sw: ['#efe7d8', '#1c1917', '#c2683f'], C: V24 },
  { hash: 'v25', name: 'Spotlight ⌘K', desc: 'macOS Spotlight palette · type to explore', sw: ['#0b0b12', '#a78bfa', '#22d3ee'], C: V25 },
  { hash: 'v26', name: 'Daylight Glide', desc: 'Cinematic scroll journey · bright Cupertino-light palette', sw: ['#eaf3ff', '#0071e3', '#ffffff'], C: V26 },
  { hash: 'og', name: 'Confetti Lab', desc: 'The first playful build (bonus)', sw: ['#ffb703', '#ff5d5d', '#2ec4b6'], C: Original },
]

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash.replace('#', ''))
  useEffect(() => {
    const on = () => setHash(window.location.hash.replace('#', ''))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

function Picker() {
  return (
    <div style={{ fontFamily: 'Nunito, system-ui, sans-serif' }} className="min-h-screen bg-[#0f0a1e] px-5 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-fuchsia-400">TalTools · design gallery</p>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif' }} className="mt-2 text-4xl font-bold sm:text-6xl">
            Pick the one you love.
          </h1>
          <p className="mt-3 max-w-xl text-white/60">
            Five very different takes on the same site (plus a bonus). Open each, click around — they're all live — then tell me your favorite.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGNS.map((d, i) => (
            <motion.a
              key={d.hash}
              href={`#${d.hash}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-fuchsia-400/50"
            >
              <div className="flex gap-2">
                {d.sw.map((c) => (
                  <span key={c} className="h-8 w-8 rounded-full ring-2 ring-white/10" style={{ background: c }} />
                ))}
              </div>
              <h2 style={{ fontFamily: 'Fredoka, sans-serif' }} className="mt-5 text-2xl font-semibold">
                {d.name}
              </h2>
              <p className="mt-1 text-sm text-white/55">{d.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 font-semibold text-fuchsia-300 transition-transform group-hover:translate-x-1">
                Open design →
              </span>
            </motion.a>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-white/30">
          Tip: each design fills the screen. Use the “← all designs” button (top-left) to come back here.
        </p>
      </div>
    </div>
  )
}

function BackBar() {
  return (
    <a
      href="#gallery"
      onClick={() => window.scrollTo(0, 0)}
      className="fixed left-3 top-3 z-[9999] rounded-full border border-white/30 bg-black/70 px-4 py-2 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-black"
      style={{ fontFamily: 'Nunito, system-ui, sans-serif' }}
    >
      ← all designs
    </a>
  )
}

const fallback = (label) => (
  <div className="grid min-h-screen place-items-center bg-[#0f0a1e] text-white">loading {label}…</div>
)

export default function Gallery() {
  const hash = useHash()

  // The live site: root shows the chosen design (Daylight Glide).
  if (hash === '') {
    return <Suspense fallback={fallback('TalTools')}><V26 /></Suspense>
  }

  // The design gallery is kept available for browsing/picking.
  if (hash === 'gallery') return <Picker />

  const current = DESIGNS.find((d) => d.hash === hash)
  if (!current) return <Suspense fallback={fallback('TalTools')}><V26 /></Suspense>

  const C = current.C
  return (
    <Suspense fallback={fallback(current.name)}>
      <BackBar />
      <C />
    </Suspense>
  )
}
