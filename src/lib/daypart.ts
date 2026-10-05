import { useSyncExternalStore } from 'react'

// The time of day on the visitor's own clock, which picks the hero video, the ambient sound under
// the music, and (on load) light or dark. A page left open moves on with the clock: the time is
// checked every minute, whenever the tab or window comes back into view, and on every page change.
export type Daypart = 'morning' | 'day' | 'evening' | 'night'

const dayparts: Daypart[] = ['morning', 'day', 'evening', 'night']

// ?time=morning (or day, evening, night) previews another time of day. Read once, so it stays put
// as you move between pages (links drop the query).
let asked: Daypart | null | undefined

export function daypartNow(): Daypart {
  if (asked === undefined) {
    const value = new URLSearchParams(window.location.search).get('time') as Daypart | null
    asked = value && dayparts.includes(value) ? value : null
  }
  if (asked) return asked
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'day'
  if (hour >= 17 && hour < 23) return 'evening'
  return 'night'
}

let current: Daypart | null = null
const listeners = new Set<() => void>()
let watching = false

// Look at the clock again; if the part of the day has changed, everything listening moves on.
export function checkDaypart() {
  const next = daypartNow()
  if (next === current) return
  const changed = current !== null
  current = next
  document.documentElement.setAttribute('data-daypart', next)
  if (changed) listeners.forEach(listener => listener())
}

export function subscribeDaypart(listener: () => void) {
  listeners.add(listener)
  if (!watching) {
    watching = true
    window.setInterval(checkDaypart, 60_000)
    document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDaypart() })
    window.addEventListener('focus', checkDaypart)
    window.addEventListener('pageshow', checkDaypart)
  }
  return () => { listeners.delete(listener) }
}

function snapshot() {
  if (current === null) checkDaypart()
  return current!
}

export function useDaypart() {
  // The server can't know the visitor's time, so pages are built with evening and switch during
  // hydration to the visitor's own.
  return useSyncExternalStore(subscribeDaypart, snapshot, () => 'evening' as Daypart)
}
