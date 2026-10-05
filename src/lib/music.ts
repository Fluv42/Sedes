import { useSyncExternalStore } from 'react'
import { daypartNow } from './daypart'
import type { Daypart } from './daypart'

// Background sound: the song, with a quiet field recording under it that matches the time of
// day (the same clock that picks the hero video). Both are on by default and keep playing from
// page to page. They start as soon as the browser allows sound: straight away if it already
// does, otherwise on the visitor's first click, tap or key press (no site can start sound
// before that). The field sound fades in first, and the song rises in over it. Both restart
// from the beginning when they end, share one on/off switch, and go quiet while the tab is
// hidden.
const song = { src: '/media/music/for-the-time-weve-spent.m4a', volume: 0.35, fadeIn: 4000, delay: 900 }
// Field recordings from Niagara-on-the-Lake and similar, all levelled to the same loudness and
// sitting about 9 dB under the song (docs/asset-credits.md).
const ambience: Record<Daypart, string> = {
  morning: '/media/ambience/morning.m4a',
  day: '/media/ambience/day.m4a',
  evening: '/media/ambience/evening.m4a',
  night: '/media/ambience/night.m4a',
}
const field = { volume: 0.35, fadeIn: 2500, delay: 0 }
const fadeOut = 1200

type Layer = { audio: HTMLAudioElement; volume: number; fadeIn: number; delay: number; frame: number; timer: number }

let layers: Layer[] | null = null
let on = true
let started = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(listener => listener())

function makeLayer(src: string, settings: { volume: number; fadeIn: number; delay: number }): Layer {
  const audio = new Audio(src)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0
  return { audio, ...settings, frame: 0, timer: 0 }
}

function all() {
  if (!layers) {
    layers = [makeLayer(ambience[daypartNow()], field), makeLayer(song.src, song)]
    document.addEventListener('visibilitychange', () => {
      if (!on || !started) return
      if (document.hidden) all().forEach(layer => layer.audio.pause())
      else fadeIn().catch(() => {})
    })
  }
  return layers
}

function ramp(layer: Layer, to: number, ms: number, then?: () => void) {
  cancelAnimationFrame(layer.frame)
  const from = layer.audio.volume
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min((now - start) / ms, 1)
    layer.audio.volume = from + (to - from) * t
    if (t < 1) layer.frame = requestAnimationFrame(step)
    else then?.()
  }
  layer.frame = requestAnimationFrame(step)
}

// Each layer starts silent and rises to its level, the song a little after the field sound.
// Resolves once the browser has agreed to play; rejects if it still wants a click first.
function fadeIn() {
  return Promise.all(all().map(layer => {
    clearTimeout(layer.timer)
    layer.audio.volume = 0
    return layer.audio.play().then(() => {
      layer.timer = window.setTimeout(() => ramp(layer, layer.volume, layer.fadeIn), layer.delay)
    })
  })).then(() => { started = true })
}

function fadeOutAll() {
  for (const layer of all()) {
    clearTimeout(layer.timer)
    ramp(layer, 0, fadeOut, () => layer.audio.pause())
  }
}

const gestures = ['pointerdown', 'keydown', 'touchend'] as const
const stopWaiting = () => gestures.forEach(name => window.removeEventListener(name, startOnGesture, true))
function startOnGesture() { stopWaiting(); if (on && !started) fadeIn().catch(() => {}) }

// Called once when the site loads.
export function startMusic() {
  if (!on || started) return
  fadeIn().catch(() => {
    all().forEach(layer => layer.audio.pause())
    gestures.forEach(name => window.addEventListener(name, startOnGesture, { capture: true, passive: true }))
  })
}

export function toggleMusic() {
  on = !on
  notify()
  if (on) fadeIn().catch(() => {})
  else { stopWaiting(); fadeOutAll() }
}

export function useMusic() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    () => on,
    () => false,
  )
}
