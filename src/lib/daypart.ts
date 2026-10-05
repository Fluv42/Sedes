// The time of day on the visitor's own clock, which picks both the hero video and the
// ambient sound under the music.
export type Daypart = 'morning' | 'day' | 'evening' | 'night'

const dayparts: Daypart[] = ['morning', 'day', 'evening', 'night']

export function daypartNow(): Daypart {
  // ?time=morning (or day, evening, night) previews another time of day.
  const asked = new URLSearchParams(window.location.search).get('time') as Daypart | null
  if (asked && dayparts.includes(asked)) return asked
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'day'
  if (hour >= 17 && hour < 23) return 'evening'
  return 'night'
}
