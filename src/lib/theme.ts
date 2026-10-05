import { useSyncExternalStore } from 'react'
import { daypartNow } from './daypart'

// Light or dark. Set before paint by the script in index.html from the time of day (dark at
// night, light otherwise) on every load, and it moves with the clock if the page stays open
// (followClock). The Light/Dark button switches it until the next load.
export type Theme = 'light' | 'dark'
const query = '(prefers-color-scheme: dark)'
const listeners = new Set<() => void>()

function current(): Theme {
  const chosen = document.documentElement.getAttribute('data-theme')
  if (chosen === 'light' || chosen === 'dark') return chosen
  return window.matchMedia(query).matches ? 'dark' : 'light'
}

// The browser's own colour around the page (Safari's bars). While the intro fills the screen it's
// the picture's top edge (set by Intro.tsx as --edge-top); otherwise it's the paper.
function paintThemeColor() {
  const root = document.documentElement
  const edge = root.classList.contains('intro') ? root.style.getPropertyValue('--edge-top') : ''
  const paper = getComputedStyle(root).getPropertyValue('--paper').trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', edge || paper)
}

let fading = 0

// The switch is one crossfade of the whole page (a view transition: the browser pictures the page
// before and after and dissolves one into the other), so text, buttons and backgrounds all change
// together. Element-by-element colour transitions drifted apart: anything that sets its own colour
// only started its fade once the page's had finished. Browsers without view transitions fall back
// to those (html.theme-fading in index.css); with reduced motion it simply switches.
// Switched by hand during this visit: the clock no longer changes it.
let chosen = false

export function toggleTheme() {
  chosen = true
  switchTheme(current() === 'dark' ? 'light' : 'dark')
}

// Called when the part of the day changes while the page is open.
export function followClock() {
  const wanted: Theme = daypartNow() === 'night' ? 'dark' : 'light'
  if (!chosen && wanted !== current()) switchTheme(wanted)
}

function switchTheme(next: Theme) {
  const root = document.documentElement
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
