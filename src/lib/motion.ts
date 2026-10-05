import Lenis from 'lenis'

// Page motion, after TaylorHare: weighted smooth scrolling, sections that settle in as they
// arrive, and a little parallax. Everything is skipped when reduced motion is requested, and
// smooth scrolling and parallax are skipped in Performance mode (App.tsx).
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (reduced() || lenis) return () => {}
  // A lerp follows the wheel as it moves rather than gliding for a fixed time, so it answers sooner.
  const instance = new Lenis({ lerp: 0.13, anchors: true })
  lenis = instance
  // The home intro holds the page still until it has pulled back.
  if (document.documentElement.classList.contains('intro')) instance.stop()
  // The frame loop runs only while something is moving: input wakes it, and it goes back to sleep
  // a moment after the page comes to rest, so an idle page costs nothing.
  let frame = 0
  let busy = 0
  const loop = (time: number) => {
    instance.raf(time)
    if (instance.isScrolling) busy = time
    frame = time - busy > 400 ? 0 : requestAnimationFrame(loop)
  }
  const wake = () => {
    busy = performance.now()
    if (frame) return
    // Lenis measures each step from the last frame it saw; start it fresh so the first step after
    // a rest isn't one enormous jump.
    instance.time = 0
    frame = requestAnimationFrame(loop)
  }
  const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
  inputs.forEach(name => window.addEventListener(name, wake, { passive: true, capture: true }))
  waking = wake
  wake()
  return () => {
    cancelAnimationFrame(frame)
    inputs.forEach(name => window.removeEventListener(name, wake, { capture: true }))
    instance.destroy()
    if (lenis === instance) { lenis = null; waking = () => {} }
  }
}

let waking = () => {}

export function stopSmoothScroll() { lenis?.stop() }
export function resumeSmoothScroll() { lenis?.start(); waking() }

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

// Elements marked data-reveal fade up once when they first come into view.
export function watchReveals(root: ParentNode) {
  const items = [...root.querySelectorAll<HTMLElement>('[data-reveal]')]
  if (reduced() || !('IntersectionObserver' in window)) { items.forEach(item => item.classList.add('is-in')); return () => {} }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      const item = entry.target
      item.classList.add('is-in')
      observer.unobserve(item)
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
  items.forEach(item => observer.observe(item))
  return () => observer.disconnect()
}

// Elements marked data-speed drift against the scroll by that fraction (0.1 = a tenth). Not on
// touch screens: there the page scrolls natively, a frame ahead of anything script can move, so
// the drift reads as a stutter rather than depth.
export function watchParallax(root: ParentNode) {
  if (reduced() || window.matchMedia('(pointer: coarse)').matches) return () => {}
  const items = [...root.querySelectorAll<HTMLElement>('[data-speed]')]
  if (!items.length) return () => {}
  let frame = 0
  const update = () => {
    frame = 0
    const y = window.scrollY
    for (const item of items) item.style.translate = `0 ${(y * Number(item.dataset.speed)).toFixed(1)}px`
  }
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
  update()
  // With Lenis running, update in the same frame it moves the page, not a frame later.
  const reset = () => { cancelAnimationFrame(frame); items.forEach(item => { item.style.translate = '' }) }
  if (lenis) {
    const off = lenis.on('scroll', () => { frame = 0; update() })
    return () => { off(); reset() }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => { window.removeEventListener('scroll', onScroll); reset() }
}

// The current page fades out before the next one is shown.
export function leaveThen(go: () => void) {
  if (reduced()) { document.documentElement.classList.remove('intro-played'); return go() }
  const root = document.documentElement
  // After the home intro, the first page skipped its arrival animation; later pages should have it.
  root.classList.remove('intro-played')
  root.classList.add('is-leaving')
  window.setTimeout(() => { go(); root.classList.remove('is-leaving') }, 200)
}
