import { useSyncExternalStore } from 'react'
import { daypartNow } from './daypart'
import type { Daypart } from './daypart'

// Background sound in two layers: the song, and under it a field recording that matches the
// time of day (the same clock that picks the hero video). The Sound button steps through
// both → music only → ambient only → muted. The field sound plays only on the home page, under
// its picture; the song carries on from page to page.
//
// Sound starts as soon as the browser allows it: straight away if it already does, otherwise on
// the visitor's first click, tap or key press (no site can start sound before that). The field
// sound fades in first and the song rises in over it. Both loop, fade rather than cut, and go
// quiet while the tab is hidden. The chosen mode is remembered in this browser.
export type SoundMode = 'both' | 'music' | 'ambient' | 'off'
const order: SoundMode[] = ['both', 'music', 'ambient', 'off']
const key = 'sedes:sound'

const song = { src: '/media/music/for-the-time-weve-spent.m4a', volume: 0.35, fadeIn: 4000, delay: 900 }
// Field recordings levelled to the same loudness (docs/asset-credits.md), played well under the song.
const ambience: Record<Daypart, string> = {
  morning: '/media/ambience/morning.m4a',
  day: '/media/ambience/day.m4a',
  evening: '/media/ambience/evening.m4a',
  night: '/media/ambience/night.m4a',
}
const field = { volume: 0.175, fadeIn: 2500, delay: 0 }
const fadeOut = 1200

type Layer = {
  name: 'song' | 'field'
  audio: HTMLAudioElement
  volume: number
  fadeIn: number
  delay: number
  frame: number
  timer: number
}

let layers: Layer[] | null = null
let mode: SoundMode = 'both'
let onHome = false
let allowed = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(listener => listener())

function savedMode(): SoundMode {
  try {
    const saved = localStorage.getItem(key) as SoundMode | null
    if (saved && order.includes(saved)) return saved
  } catch { /* no storage: start with both */ }
  return 'both'
}

function makeLayer(name: Layer['name'], src: string, settings: { volume: number; fadeIn: number; delay: number }): Layer {
  const audio = new Audio(src)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0
  return { name, audio, ...settings, frame: 0, timer: 0 }
}

function all() {
  if (!layers) {
    layers = [makeLayer('field', ambience[daypartNow()], field), makeLayer('song', song.src, song)]
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) all().forEach(layer => { clearTimeout(layer.timer); layer.audio.pause() })
      else apply(true)
    })
    // Some browsers pause media on their own (an app window losing focus, a system interruption)
    // without a visibility change; pick up again when the window comes back.
    window.addEventListener('focus', () => { if (all().some(layer => wanted(layer) && layer.audio.paused)) apply(true) })
    if (import.meta.env.DEV) Object.assign(window, { __sedesSound: { layers, state: () => ({ mode, onHome, allowed }) } })
  }
  return layers
}

const wanted = (layer: Layer) =>
  layer.name === 'song' ? mode === 'both' || mode === 'music' : onHome && (mode === 'both' || mode === 'ambient')

// Volume fades run on a timer rather than animation frames, which stop in background windows
// and would leave a fade stuck halfway.
function ramp(layer: Layer, to: number, ms: number, then?: () => void) {
  clearInterval(layer.frame)
  const from = layer.audio.volume
  const start = performance.now()
  layer.frame = window.setInterval(() => {
    const t = Math.min((performance.now() - start) / ms, 1)
    layer.audio.volume = from + (to - from) * t
    if (t < 1) return
    clearInterval(layer.frame)
    then?.()
  }, 30)
}

const play = (layer: Layer) => layer.audio.play().catch(error => {
  if (import.meta.env.DEV) console.warn(`[sound] ${layer.name} did not start:`, error)
  throw error
})

// Bring every layer to where the mode and page say it should be. Layers that should sound and
// aren't playing start silent and fade up (after their delay when everything starts together);
// layers that shouldn't sound fade out and pause.
function apply(together = false) {
  if (!allowed || document.hidden) return
  for (const layer of all()) {
    if (wanted(layer)) {
      if (layer.audio.paused || together) {
        clearTimeout(layer.timer)
        layer.audio.volume = 0
        play(layer).catch(() => {})
        layer.timer = window.setTimeout(() => ramp(layer, layer.volume, layer.fadeIn), together ? layer.delay : 0)
      } else {
        ramp(layer, layer.volume, 600)
      }
    } else if (!layer.audio.paused) {
      clearTimeout(layer.timer)
      ramp(layer, 0, fadeOut, () => { if (!wanted(layer)) layer.audio.pause() })
    }
  }
}

// Ask the browser whether sound may start: a silent play() of the song succeeds if the visitor
// has already interacted (or the browser trusts this site), and fails otherwise.
// Every layer that should sound is started right here, silently, in the same moment as the click
// or key press that allowed it (some browsers only honour play() called during the gesture
// itself); the fades follow. If nothing should sound yet, the song is started and stopped
// silently just to unlock sound for later.
function tryStart() {
  const starting = all().filter(wanted)
  const unlock = starting.length ? starting : [all()[1]]
  return Promise.all(unlock.map(layer => { layer.audio.volume = 0; return play(layer) })).then(() => {
    allowed = true
    for (const layer of all()) if (!wanted(layer)) layer.audio.pause()
    apply(true)
  })
}

const gestures = ['pointerdown', 'keydown', 'touchend'] as const
const stopWaiting = () => gestures.forEach(name => window.removeEventListener(name, startOnGesture, true))
function startOnGesture() { stopWaiting(); tryStart().catch(() => {}) }

// Called once when the site loads.
export function startMusic() {
  if (allowed) return
  mode = savedMode()
  notify()
  if (mode === 'off') {
    // Nothing to play yet, but unlock on the first interaction so changing the mode is instant.
    gestures.forEach(name => window.addEventListener(name, startOnGesture, { capture: true, passive: true }))
    return
  }
  tryStart().catch(() => {
    gestures.forEach(name => window.addEventListener(name, startOnGesture, { capture: true, passive: true }))
  })
}

// Called by the app whenever the page changes: the field sound belongs to the home page.
export function setHomePage(home: boolean) {
  if (onHome === home) return
  onHome = home
  apply()
}

export function nextSoundMode() {
  setSoundMode(order[(order.indexOf(mode) + 1) % order.length])
}

export function setSoundMode(next: SoundMode) {
  mode = next
  try { localStorage.setItem(key, mode) } catch { /* just this visit */ }
  notify()
  if (allowed) apply()
  else if (mode !== 'off') tryStart().catch(() => {})
}

export function useSoundMode() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    () => mode,
    () => 'both' as SoundMode,
  )
}

export const soundLabels: Record<SoundMode, string> = {
  both: 'Sound on',
  music: 'Music only',
  ambient: 'Ambient only',
  off: 'Muted',
}
