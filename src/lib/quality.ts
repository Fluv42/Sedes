import { useSyncExternalStore } from 'react'

// Pretty or Performance. Pretty is everything: the glow spilling up the page, the softened edges
// and grain on the picture, the paper grain over the page, weighted scrolling, parallax and the
// trailing cursor dot. Performance keeps the video, colours, layout and the simple fades, and
// drops the rest, for older phones and laptops. Unlike the theme, the choice is remembered on this
// device, since a slow phone stays slow. The script in index.html applies it before paint as
// html[data-quality='fast'].
//
// If Pretty is clearly too much for the computer (the video dropping frames, see Meadow.tsx), it
// steps down to Performance by itself for this visit, unless the visitor picked Pretty themselves.
export type Quality = 'pretty' | 'fast'
const key = 'sedes-quality'
const listeners = new Set<() => void>()

const current = (): Quality => document.documentElement.getAttribute('data-quality') === 'fast' ? 'fast' : 'pretty'

// Picked on this device before (and remembered), or during this visit.
let chosen = (() => { try { return typeof localStorage !== 'undefined' && localStorage.getItem(key) === 'pretty' } catch { return false } })()

function set(next: Quality) {
  const root = document.documentElement
  if (next === 'fast') root.setAttribute('data-quality', 'fast')
  else root.removeAttribute('data-quality')
  listeners.forEach(listener => listener())
}

export function toggleQuality() {
  const next: Quality = current() === 'fast' ? 'pretty' : 'fast'
  chosen = true
  set(next)
  try { localStorage.setItem(key, next) } catch { /* private window: it lasts for this visit */ }
}

export function stepDownQuality() {
  if (chosen || current() === 'fast') return
  if (import.meta.env.DEV) console.info('[quality] dropping frames: switching to Performance for this visit')
  set('fast')
}

export function useQuality() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    current,
    () => 'pretty' as Quality,
  )
}

export const qualityLabel = (quality: Quality) => quality === 'fast' ? 'Performance' : 'Pretty'
