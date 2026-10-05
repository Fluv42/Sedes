import { useSyncExternalStore } from 'react'

// Light or dark. Follows the device until the visitor picks one; the pick is remembered in
// this browser and applied before paint by the script in index.html.
export type Theme = 'light' | 'dark'
const key = 'sedes:theme'
const query = '(prefers-color-scheme: dark)'
const listeners = new Set<() => void>()

function current(): Theme {
  const chosen = document.documentElement.getAttribute('data-theme')
  if (chosen === 'light' || chosen === 'dark') return chosen
  return window.matchMedia(query).matches ? 'dark' : 'light'
}

function paintThemeColor() {
  const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', paper)
}

export function toggleTheme() {
  const next: Theme = current() === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  try { localStorage.setItem(key, next) } catch { /* private window: just this visit */ }
  paintThemeColor()
  listeners.forEach(listener => listener())
}

export function useTheme() {
  return useSyncExternalStore(
    listener => {
      listeners.add(listener)
      const media = window.matchMedia(query)
      const onChange = () => { paintThemeColor(); listener() }
      media.addEventListener('change', onChange)
      paintThemeColor()
      return () => { listeners.delete(listener); media.removeEventListener('change', onChange) }
    },
    current,
    () => 'light' as Theme,
  )
}
