import { useEffect, useRef } from 'react'

// A small dot in place of the pointer, after TaylorHare: it trails the mouse slightly,
// swells over links, and can carry a word ("View", "Scroll") from data-cursor attributes.
// Only on devices with a precise pointer; touch screens keep their normal behaviour.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const element = dot.current!
    const text = label.current!
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
    const move = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) { position.x = target.x; position.y = target.y; visible = true; element.classList.add('is-visible') }
      const over = (event.target as Element | null)?.closest?.('a, button, [data-cursor]')
      const word = over?.getAttribute('data-cursor') ?? ''
      element.classList.toggle('is-link', Boolean(over) && !word)
      element.classList.toggle('has-label', Boolean(word))
      if (text.textContent !== word) text.textContent = word
    }
    const leave = () => { visible = false; element.classList.remove('is-visible') }
    const press = () => element.classList.add('is-pressed')
    const release = () => element.classList.remove('is-pressed')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
    }
  }, [])

  return <div ref={dot} className="cursor-dot" aria-hidden="true"><span ref={label} /></div>
}
