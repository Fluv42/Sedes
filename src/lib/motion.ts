import Lenis from 'lenis'

// Page motion, after TaylorHare: weighted smooth scrolling, sections that settle in as they
// arrive, and a little parallax. Everything is skipped when reduced motion is requested.
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (reduced() || lenis) return () => {}
  // A lerp follows the wheel as it moves rather than gliding for a fixed time, so it answers sooner.
  lenis = new Lenis({ lerp: 0.13, anchors: true })
  // The home intro holds the page still until it has pulled back.
  if (document.documentElement.classList.contains('intro')) lenis.stop()
  let frame = requestAnimationFrame(function raf(time) { lenis?.raf(time); frame = requestAnimationFrame(raf) })
  return () => { cancelAnimationFrame(frame); lenis?.destroy(); lenis = null }
}

export function stopSmoothScroll() { lenis?.stop() }
export function resumeSmoothScroll() { lenis?.start() }

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
      // Settled: drop the will-change layer so long pages don't keep dozens of them alive.
      item.addEventListener('transitionend', () => item.classList.add('is-done'), { once: true })
      observer.unobserve(item)
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
  items.forEach(item => observer.observe(item))
  return () => observer.disconnect()
}

// Elements marked data-speed drift against the scroll by that fraction (0.1 = a tenth).
export function watchParallax(root: ParentNode) {
  if (reduced()) return () => {}
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
  if (lenis) {
    const off = lenis.on('scroll', () => { frame = 0; update() })
    return () => { off(); cancelAnimationFrame(frame) }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
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
