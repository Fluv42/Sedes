import { useEffect, useRef, useState } from 'react'
import { stopSmoothScroll, resumeSmoothScroll } from '../lib/motion'
import { nextSoundMode, soundAllowed, soundLabel, useSound } from '../lib/music'

// The home page opens on the meadow, filling the screen, while "Sedes" is written across it.
// Then it waits: near the bottom is a down arrow, and in browsers that hold sound back until a
// click, an "Enable music" button sits under the name. Scrolling down, ↓ / Page Down / Space, or the arrow starts the
// pull-back: the edges of the picture soften and the whole page zooms back out around it, like
// stepping back from a window into the room, while the sound button glides down to its place
// beside Pause under the picture. Only transforms are animated, so the browser can do it on the
// GPU without re-laying out the video every frame.
// Whether it plays is decided before paint by the inline script in index.html (html.intro).
const zoom = 1800
const ease = 'cubic-bezier(.6, 0, .2, 1)'
// How far past "just covering the screen" the picture starts, so its soft edges have formed
// before they come into view.
const overscan = 1.28
// The stage reaches past its frame by this much on every side (.meadow-stage inset in App.css).
const bleed = 0.08

export function Intro() {
  const sound = useSound()
  // Offered only if sound still hasn't been allowed a moment after load (browsers that trust the
  // site start it on their own). Once offered it stays, as "Sound on" after it's pressed.
  const [offer, setOffer] = useState(false)
  const soundButton = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)

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
    // Where the hero's own sound button sits once the page is back at full size: the intro's
    // sound button travels there during the pull-back and hands over to it.
    const landing = document.querySelector('.hero .sound-control')?.getBoundingClientRect()
    const width = box.width * (1 + 2 * bleed)
    const height = box.height * (1 + 2 * bleed)
    const scale = overscan * Math.max(window.innerWidth / width, window.innerHeight / height)
    const cx = box.left + box.width / 2
    const cy = box.top + box.height / 2
    const zoomedIn = `translate(${window.innerWidth / 2 - cx}px, ${window.innerHeight / 2 - cy}px) scale(${scale})`
    page.style.transformOrigin = `${cx}px ${cy}px`
    page.style.transform = zoomedIn
    // The page underneath can't be reached with Tab until it's shown.
    page.inert = true
    root.classList.add('intro-owned')
    const check = window.setTimeout(() => {
      if (soundAllowed() || cancelled) return
      setOffer(true)
      root.classList.add('intro-offer')
    }, 500)

    let started = false
    let finished = false
    let cancelled = false
    const animations: Animation[] = []

    const finish = () => {
      if (finished) return
      finished = true
      root.classList.remove('intro', 'intro-out', 'intro-owned', 'intro-writing', 'intro-offer')
      root.classList.add('intro-played')
      for (const animation of animations) animation.cancel()
      page.style.transform = ''
      page.style.transformOrigin = ''
      page.inert = false
      resumeSmoothScroll()
    }

    const pullBack = () => {
      if (started) return
      started = true
      root.classList.add('intro-out')
      page.inert = false
      const timing = { duration: zoom, easing: ease, fill: 'forwards' as const }
      const button = soundButton.current
      if (button && landing) {
        const from = button.getBoundingClientRect()
        const dx = landing.left + landing.width / 2 - (from.left + from.width / 2)
        const dy = landing.top + landing.height / 2 - (from.top + from.height / 2)
        animations.push(button.animate([{ translate: '0 0' }, { translate: `${dx}px ${dy}px` }], timing))
      }
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

    // Write the name once the typeface is in, so it's drawn in Libron rather than a fallback; then wait.
    const fonts = document.fonts?.load('400 120px "Libron"') ?? Promise.resolve()
    Promise.race([fonts, new Promise(resolve => setTimeout(resolve, 700))]).then(() => {
      if (!cancelled) root.classList.add('intro-writing')
    })

    // Moving on is the visitor's choice: scrolling or swiping down, a "down" key, or the arrow.
    const wheel = (event: WheelEvent) => { if (event.deltaY > 0) pullBack() }
    let touchY = 0
    const touchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0 }
    const touchMove = (event: TouchEvent) => { if (touchY - (event.touches[0]?.clientY ?? touchY) > 24) pullBack() }
    const key = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'End'].includes(event.key)) pullBack()
      // Space scrolls a page, unless it's pressing one of the intro's buttons.
      else if (event.key === ' ' && !(event.target instanceof HTMLButtonElement)) pullBack()
    }
    const arrow = next.current
    window.addEventListener('wheel', wheel, { passive: true })
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchmove', touchMove, { passive: true })
    window.addEventListener('keydown', key)
    arrow?.addEventListener('click', pullBack)
    // Cleanup stops this run only; the intro classes stay, so a re-run (React StrictMode) carries on.
    return () => {
      cancelled = true
      clearTimeout(check)
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('keydown', key)
      arrow?.removeEventListener('click', pullBack)
      if (started && !finished) finish()
    }
  }, [])

  return <div className="intro-title">
    <svg viewBox="0 0 640 220" aria-hidden="true">
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
    {offer && <div className="intro-actions">
      <button ref={soundButton} type="button" className="intro-sound" onClick={nextSoundMode}>
        <span className="visually-hidden">Sound: </span>{soundLabel(sound)}
      </button>
    </div>}
    <button ref={next} type="button" className="intro-next" aria-label="Enter the site">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v13M6 12l6 6 6-6" /></svg>
    </button>
  </div>
}
