import { useSyncExternalStore } from 'react'

// Background music: on by default, and it keeps playing from page to page. Browsers only allow
// sound after the visitor has clicked or pressed a key, so it starts on the first one (or right
// away if the browser already allows it). It fades in and out, restarts from the beginning when
// the song ends, and goes quiet while the tab is hidden.
const src = '/media/music/for-the-time-weve-spent.m4a'
const volume = 0.35
const fadeMs = 1200

let audio: HTMLAudioElement | null = null
let on = true
let started = false
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
      if (!started) return
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

const gestures = ['pointerdown', 'keydown', 'touchend'] as const
const startOnGesture = () => { stopWaiting(); if (on) play() }
const stopWaiting = () => gestures.forEach(name => window.removeEventListener(name, startOnGesture, true))

function play() {
  const player = element()
  player.play().then(() => { started = true; ramp(volume) }).catch(() => {})
}

// Called once when the site loads: start now if allowed, otherwise on the first click or key.
export function startMusic() {
  if (!on || started) return
  const player = element()
  player.play()
    .then(() => { started = true; ramp(volume) })
    .catch(() => gestures.forEach(name => window.addEventListener(name, startOnGesture, { capture: true, passive: true })))
}

export function toggleMusic() {
  const player = element()
  on = !on
  notify()
  if (on) play()
  else { stopWaiting(); ramp(0, () => player.pause()) }
}

export function useMusic() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    () => on,
    () => false,
  )
}
