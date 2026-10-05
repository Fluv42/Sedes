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

// The switch is one crossfade of the whole page (a view transition: the browser pictures the page
// before and after and dissolves one into the other), so text, buttons and backgrounds all change
// together. Element-by-element colour transitions drifted apart: anything that sets its own colour
// only started its fade once the page's had finished. Browsers without view transitions fall back
// to those (html.theme-fading in index.css); with reduced motion it simply switches.
export function toggleTheme() {
  const root = document.documentElement
  const next: Theme = current() === 'dark' ? 'light' : 'dark'
  const apply = () => {
    root.setAttribute('data-theme', next)
    paintThemeColor()
    listeners.forEach(listener => listener())
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return apply()
  if ('startViewTransition' in document) {
    // Wait a moment after switching so React has relabelled the Light/Dark button in the "after"
    // picture. (A timer, not an animation frame: frames are held until this promise settles.)
    document.startViewTransition(() => { apply(); return new Promise<void>(resolve => setTimeout(resolve, 0)) })
    return
  }
  root.classList.add('theme-fading')
  clearTimeout(fading)
  fading = window.setTimeout(() => root.classList.remove('theme-fading'), 1700)
  apply()
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
