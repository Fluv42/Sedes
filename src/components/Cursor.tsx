import { useEffect, useRef } from 'react'

// A small dot in place of the pointer, after TaylorHare. It trails the mouse slightly and never
// grows (so it never covers text); instead the mark inside it changes: a ring over links,
// an arrow over projects (data-cursor="view"), a down-arrow over the hero (data-cursor="scroll").
// Only on devices with a precise pointer; touch screens keep their normal behaviour.
const marks = ['view', 'scroll'] as const

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const element = dot.current!
    const root = document.documentElement
    root.classList.add('has-cursor')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: -100, y: -100 }
    const position = { x: -100, y: -100 }
    let frame = 0
    let visible = false

    const tick = () => {
      const ease = still ? 1 : 0.22
      position.x += (target.x - position.x) * ease
      position.y += (target.y - position.y) * ease
      element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }
    const show = () => { if (!visible) { position.x = target.x; position.y = target.y; visible = true; element.classList.add('is-visible') } }
    const hide = () => { visible = false; element.classList.remove('is-visible') }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return hide()
      target.x = event.clientX
      target.y = event.clientY
      show()
      const under = event.target as Element | null
      // A marked area (a project row, the hero) wins over the plain link inside it.
      const mark = under?.closest?.('[data-cursor]')?.getAttribute('data-cursor') ?? ''
      const link = under?.closest?.('a, button')
      for (const name of marks) element.classList.toggle(`mark-${name}`, mark === name)
      element.classList.toggle('is-link', Boolean(link) && !mark)
    }
    // Leaving the window: mouseout with nothing to go to. Also hide when the window loses focus.
    const out = (event: MouseEvent) => { if (!event.relatedTarget) hide() }
    const press = () => element.classList.add('is-pressed')
    const release = () => element.classList.remove('is-pressed')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseout', out)
    window.addEventListener('blur', hide)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseout', out)
      window.removeEventListener('blur', hide)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
    }
  }, [])

  return <div ref={dot} className="cursor-dot" aria-hidden="true">
    <svg className="cursor-view" viewBox="0 0 10 10"><path d="M3 7 7 3M3.6 3H7v3.4" /></svg>
    <svg className="cursor-scroll" viewBox="0 0 10 10"><path d="M5 2.6v4.8M2.9 5.4 5 7.5l2.1-2.1" /></svg>
  </div>
}
