import { useEffect } from 'react'
import { stopSmoothScroll, resumeSmoothScroll } from '../lib/motion'

// The home page opens on the meadow, filling the screen, while "Sedes" is written across it.
// The whole page starts zoomed in on the hero picture; when the writing finishes, or the visitor
// scrolls, clicks or presses a key, the edges of the picture soften and the page zooms back out
// around it, like stepping back from a window into the room. Only a transform is animated, so
// the browser can do it on the GPU without re-laying out the video every frame.
// Whether it plays is decided before paint by the inline script in index.html (html.intro).
const draw = 2200
const hold = 900
const zoom = 1800
const ease = 'cubic-bezier(.6, 0, .2, 1)'
// How far past "just covering the screen" the picture starts, so its soft edges have formed
// before they come into view.
const overscan = 1.28
// The stage reaches past its frame by this much on every side (.meadow-stage inset in App.css).
const bleed = 0.08

export function Intro() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('intro')) return
    const page = document.querySelector<HTMLElement>('.site-frame')
    const frame = document.querySelector<HTMLElement>('.hero .meadow')
    const stage = frame?.querySelector<HTMLElement>('.meadow-stage')
    if (!page || !frame || !stage) { root.classList.remove('intro'); return }
    if (root.classList.contains('intro-out')) return
    stopSmoothScroll()
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    // Zoom the page in on the picture's centre until the picture covers the screen.
    // Measure unzoomed: in development React runs this twice, and the first run has zoomed it.
    page.style.transform = ''
    const box = frame.getBoundingClientRect()
    const width = box.width * (1 + 2 * bleed)
    const height = box.height * (1 + 2 * bleed)
    const scale = overscan * Math.max(window.innerWidth / width, window.innerHeight / height)
    const cx = box.left + box.width / 2
    const cy = box.top + box.height / 2
    const zoomedIn = `translate(${window.innerWidth / 2 - cx}px, ${window.innerHeight / 2 - cy}px) scale(${scale})`
    page.style.transformOrigin = `${cx}px ${cy}px`
    page.style.transform = zoomedIn
    root.classList.add('intro-owned')

    let started = false
    let finished = false
    let cancelled = false
    const timers: number[] = []
    const animations: Animation[] = []

    const finish = () => {
      if (finished) return
      finished = true
      root.classList.remove('intro', 'intro-out', 'intro-owned', 'intro-writing')
      root.classList.add('intro-played')
      for (const animation of animations) animation.cancel()
      page.style.transform = ''
      page.style.transformOrigin = ''
      resumeSmoothScroll()
    }

    const pullBack = () => {
      if (started) return
      started = true
      root.classList.add('intro-out')
      const timing = { duration: zoom, easing: ease, fill: 'forwards' as const }
      animations.push(page.animate([{ transform: zoomedIn }, { transform: 'translate(0px, 0px) scale(1)' }], timing))
      // The soft edge closes in from beyond the screen first, so by the time the picture's edges
      // come into view they are already feathered.
      animations.push(stage.animate([
        { maskSize: '260% 260%', webkitMaskSize: '260% 260%' } as Keyframe,
        { maskSize: '100% 100%', webkitMaskSize: '100% 100%' } as Keyframe,
      ], { duration: zoom * 0.62, easing: 'cubic-bezier(.25, .6, .3, 1)', fill: 'forwards' }))
      // Blur, tint and grain rise from nothing to their usual strength (the implicit end keyframe).
      for (const layer of stage.querySelectorAll<HTMLElement>('.frost, .tint, .grain')) {
        animations.push(layer.animate([{ opacity: 0, offset: 0 }], { ...timing, easing: 'ease-in' }))
      }
      animations[0].finished.then(finish).catch(() => {})
    }

    const begin = () => { if (!cancelled) timers.push(window.setTimeout(pullBack, draw + hold)) }
    // Start writing once the typeface is in, so the letters are drawn in Libron, not a fallback.
    const fonts = document.fonts?.load('400 120px "Libron"') ?? Promise.resolve()
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
