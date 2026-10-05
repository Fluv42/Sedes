import { useEffect } from 'react'
import { stopSmoothScroll, resumeSmoothScroll } from '../lib/motion'

// The home page opens on the meadow, full screen, while "Sedes" is written across it.
// When the writing finishes, or the visitor scrolls, clicks or presses a key, the picture
// pulls back into its window in the hero (like stepping back from a window) and the page appears.
// Whether it plays is decided before paint by the inline script in index.html (html.intro).
const draw = 2200
const hold = 900
const zoom = 1500
const ease = 'cubic-bezier(.65, 0, .2, 1)'

export function Intro() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('intro')) return
    root.classList.add('intro-owned')
    const stage = document.querySelector<HTMLElement>('.hero .meadow-stage')
    const frame = stage?.parentElement
    if (!stage || !frame) { root.classList.remove('intro'); return }
    if (root.classList.contains('intro-out')) return
    stopSmoothScroll()

    let started = false
    let finished = false
    let cancelled = false
    const timers: number[] = []
    const animations: Animation[] = []

    const finish = () => {
      if (finished) return
      finished = true
      root.classList.remove('intro', 'intro-out', 'intro-owned', 'intro-writing')
      for (const animation of animations) animation.cancel()
      resumeSmoothScroll()
    }

    const pullBack = () => {
      if (started) return
      started = true
      root.classList.add('intro-out')
      const to = frame.getBoundingClientRect()
      const from = { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      const timing = { duration: zoom, easing: ease, fill: 'forwards' as const }
      animations.push(stage.animate([
        { top: `${from.top}px`, left: `${from.left}px`, width: `${from.width}px`, height: `${from.height}px` },
        { top: `${to.top}px`, left: `${to.left}px`, width: `${to.width}px`, height: `${to.height}px` },
      ], timing))
      // The soft edge closes in from beyond the screen as the window takes shape.
      // It leads the zoom slightly, so the edges are already soft as the picture starts to move.
      animations.push(stage.animate([
        { maskSize: '220% 220%', webkitMaskSize: '220% 220%' } as Keyframe,
        { maskSize: '100% 100%', webkitMaskSize: '100% 100%' } as Keyframe,
      ], { ...timing, easing: 'cubic-bezier(.3, .2, .2, 1)' }))
      // Blur, tint and grain rise from nothing to their usual strength (the implicit end keyframe).
      for (const layer of stage.querySelectorAll<HTMLElement>('.frost, .tint, .grain')) {
        animations.push(layer.animate([{ opacity: 0, offset: 0 }], { ...timing, easing: 'ease-in' }))
      }
      animations[0].finished.then(finish).catch(() => {})
    }

    const begin = () => { if (!cancelled) timers.push(window.setTimeout(pullBack, draw + hold)) }
    // Start writing once the typeface is in, so the letters are drawn in IM Fell, not a fallback.
    const fonts = document.fonts?.load('400 120px "IM Fell English"') ?? Promise.resolve()
    Promise.race([fonts, new Promise(resolve => setTimeout(resolve, 700))]).then(() => {
      root.classList.add('intro-writing')
      begin()
    })

    const nudge = (event: Event) => {
      if (event instanceof KeyboardEvent && ['Tab', 'Shift', 'Alt', 'Meta', 'Control'].includes(event.key)) return
      pullBack()
    }
    const events = ['wheel', 'touchmove', 'keydown', 'pointerdown'] as const
    for (const name of events) window.addEventListener(name, nudge, { passive: true })
    // Cleanup stops this run only; the intro classes stay, so a re-run (React StrictMode) carries on.
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      for (const name of events) window.removeEventListener(name, nudge)
      if (started && !finished) finish()
    }
  }, [])

  return <div className="intro-title" aria-hidden="true">
    <svg viewBox="0 0 640 220">
      <defs>
        <linearGradient id="intro-wipe" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".85" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="intro-hand"><rect className="intro-hand" x="-120" y="0" width="760" height="220" fill="url(#intro-wipe)" /></mask>
      </defs>
      <text x="320" y="160" textAnchor="middle" mask="url(#intro-hand)">Sedes</text>
    </svg>
  </div>
}
