import { useSyncExternalStore } from 'react'

// Background music: off until someone asks for it, then it keeps playing from page to page.
// It fades in and out rather than starting or stopping abruptly, and goes quiet while the tab
// is hidden. Browsers only allow sound after a click, so it never starts on its own.
const src = '/media/music/for-the-time-weve-spent.m4a'
const volume = 0.35
const fadeMs = 1200

let audio: HTMLAudioElement | null = null
let on = false
let fade = 0
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(listener => listener())

function element() {
  if (!audio) {
    audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    document.addEventListener('visibilitychange', () => {
      if (!on || !audio) return
      if (document.hidden) audio.pause()
      else { audio.volume = 0; audio.play().then(() => ramp(volume)).catch(() => {}) }
    })
  }
  return audio
}

function ramp(to: number, then?: () => void) {
  const player = element()
  cancelAnimationFrame(fade)
  const from = player.volume
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min((now - start) / fadeMs, 1)
    player.volume = from + (to - from) * t
    if (t < 1) fade = requestAnimationFrame(step)
    else then?.()
  }
  fade = requestAnimationFrame(step)
}

export function toggleMusic() {
  const player = element()
  on = !on
  notify()
  if (on) player.play().then(() => ramp(volume)).catch(() => { on = false; notify() })
  else ramp(0, () => player.pause())
}

export function useMusic() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    () => on,
    () => false,
  )
}
