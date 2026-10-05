import { useSyncExternalStore } from 'react'

// Pretty or Performance. Pretty is the full picture: the glow spilling up the page, frosted
// edges and grain. Performance drops those (they're the parts that cost graphics memory and
// battery, which older phones feel) and keeps the video, colours and layout. Unlike the theme,
// the choice is remembered on this device, since a slow phone stays slow. The script in
// index.html applies it before paint as html[data-quality='fast'].
export type Quality = 'pretty' | 'fast'
const key = 'sedes-quality'
const listeners = new Set<() => void>()

const current = (): Quality => document.documentElement.getAttribute('data-quality') === 'fast' ? 'fast' : 'pretty'

export function toggleQuality() {
  const next: Quality = current() === 'fast' ? 'pretty' : 'fast'
  const root = document.documentElement
  if (next === 'fast') root.setAttribute('data-quality', 'fast')
  else root.removeAttribute('data-quality')
  try { localStorage.setItem(key, next) } catch { /* private window: it lasts for this visit */ }
  listeners.forEach(listener => listener())
}

export function useQuality() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    current,
    () => 'pretty' as Quality,
  )
}

export const qualityLabel = (quality: Quality) => quality === 'fast' ? 'Performance' : 'Pretty'
