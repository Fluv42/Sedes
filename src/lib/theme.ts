import { useSyncExternalStore } from 'react'

// Light or dark. Set before paint by the script in index.html from the time of day (dark at
// night, light otherwise); the Light/Dark button switches it for the rest of this visit only.
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
  try { sessionStorage.setItem(key, next) } catch { /* no storage: this page only */ }
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
