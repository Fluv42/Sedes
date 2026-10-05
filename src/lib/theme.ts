import { useSyncExternalStore } from 'react'

// Light or dark. Set before paint by the script in index.html from the time of day (dark at
// night, light otherwise) on every load; the Light/Dark button switches it until the next load.
export type Theme = 'light' | 'dark'
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

let fading = 0

export function toggleTheme() {
  const root = document.documentElement
  const next: Theme = current() === 'dark' ? 'light' : 'dark'
  // Colours ease across over about a second and a half (see html.theme-fading in index.css)
  // instead of switching at once; skipped when the visitor prefers less motion.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-fading')
    clearTimeout(fading)
    fading = window.setTimeout(() => root.classList.remove('theme-fading'), 1700)
  }
  root.setAttribute('data-theme', next)
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
