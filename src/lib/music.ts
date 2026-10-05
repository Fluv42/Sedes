import { useSyncExternalStore } from 'react'
import { daypartNow, subscribeDaypart } from './daypart'
import type { Daypart } from './daypart'

// Background sound in two layers: the song, and under it a field recording that matches the
// time of day (the same clock that picks the hero video). The Sound button steps through
// Music and field sound are switched on and off separately (toggleLayer), and the footer's heart
// switches both. The field sound plays only on the home page, under its picture; the song carries
// on from page to page. Every visit starts with both on.
//
// Browsers only allow sound once the visitor has clicked, tapped or pressed a key, so until then
// the button reads "Enable music" (and any click on the page does the same). If the browser
// already trusts the site, sound starts on load. The field sound fades in first and the song
// rises in over it; both fade rather than cut, and go quiet while the tab is hidden.
//
// The song is a plain <audio> element. The field sound is played through Web Audio instead,
// because <audio loop> leaves a short gap at the loop point and Web Audio loops seamlessly.
export type SoundMode = 'both' | 'music' | 'ambient' | 'off'

const ambience: Record<Daypart, string> = {
  morning: '/media/ambience/morning.m4a',
  day: '/media/ambience/day.m4a',
  evening: '/media/ambience/evening.m4a',
  night: '/media/ambience/night.m4a',
}
// The recordings are levelled to the same loudness (docs/asset-credits.md); evening and night
// sit a quarter lower than morning and day.
const fieldLevel: Record<Daypart, number> = { morning: 0.175, day: 0.175, evening: 0.13, night: 0.13 }
const fadeOut = 1200

interface Layer {
  name: 'song' | 'field'
  volume: number
  fadeIn: number
  delay: number
  timer: number
  playing(): boolean
  play(): Promise<unknown>
  pause(): void
  silence(): void
  fadeTo(to: number, ms: number, then?: () => void): void
  close?(): void
}

function songLayer(): Layer {
  const audio = new Audio('/media/music/for-the-time-weve-spent.m4a')
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0
  let interval = 0
  return {
    name: 'song', volume: 0.35, fadeIn: 4000, delay: 900, timer: 0,
    playing: () => !audio.paused,
    play: () => audio.play(),
    pause: () => { clearInterval(interval); audio.pause() },
    silence: () => { clearInterval(interval); audio.volume = 0 },
    // A timer rather than animation frames, which stop in background windows mid-fade.
    fadeTo(to, ms, then) {
      clearInterval(interval)
      const from = audio.volume
      const start = performance.now()
      interval = window.setInterval(() => {
        const t = Math.min((performance.now() - start) / ms, 1)
        audio.volume = from + (to - from) * t
        if (t < 1) return
        clearInterval(interval)
        then?.()
      }, 30)
    },
  }
}

function fieldLayer(src: string, volume: number): Layer {
  const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const context = new Context()
  const gain = context.createGain()
  gain.gain.value = 0
  gain.connect(context.destination)
  // Fetched and decoded straight away, so it's ready by the time sound is allowed.
  const buffer = fetch(src).then(response => response.arrayBuffer()).then(data => context.decodeAudioData(data))
  let source: AudioBufferSourceNode | null = null
  let running = false
  let done = 0
  return {
    name: 'field', volume, fadeIn: 2500, delay: 0, timer: 0,
    playing: () => running,
    play() {
      running = true
      // resume() has to be called during the click itself, so it comes before any waiting.
      const resumed = context.resume()
      return buffer.then(decoded => {
        if (!source) {
          source = context.createBufferSource()
          source.buffer = decoded
          source.loop = true
          source.connect(gain)
          source.start()
        }
        return resumed
      })
    },
    pause() { running = false; clearTimeout(done); context.suspend() },
    close() { running = false; clearTimeout(done); context.close().catch(() => {}) },
    ...(import.meta.env.DEV ? { context, gain } : {}),
    silence() { clearTimeout(done); gain.gain.cancelScheduledValues(context.currentTime); gain.gain.setValueAtTime(0, context.currentTime) },
    fadeTo(to, ms, then) {
      const now = context.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(to, now + ms / 1000)
      clearTimeout(done)
      if (then) done = window.setTimeout(then, ms)
    },
  }
}

let layers: Layer[] | null = null
let mode: SoundMode = 'both'
let onHome = false
let allowed = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(listener => listener())

function all() {
  if (!layers) {
    const daypart = daypartNow()
    layers = [fieldLayer(ambience[daypart], fieldLevel[daypart]), songLayer()]
    // When the part of the day turns over, the old recording fades out and the new one fades in.
    let playingFor = daypart
    subscribeDaypart(() => {
      const next = daypartNow()
      if (next === playingFor) return
      playingFor = next
      const old = all()[0]
      clearTimeout(old.timer)
      all()[0] = fieldLayer(ambience[next], fieldLevel[next])
      if (old.playing()) old.fadeTo(0, fadeOut * 2, () => old.close?.())
      else old.close?.()
      apply()
    })
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) all().forEach(layer => { clearTimeout(layer.timer); layer.pause() })
      else apply(true)
    })
    // Some browsers pause media on their own (an app window losing focus, a system interruption)
    // without a visibility change; pick up again when the window comes back.
    window.addEventListener('focus', () => { if (all().some(layer => wanted(layer) && !layer.playing())) apply(true) })
    if (import.meta.env.DEV) Object.assign(window, { __sedesSound: { layers, state: () => ({ mode, onHome, allowed }) } })
  }
  return layers
}

const song = () => all()[1]
const wanted = (layer: Layer) =>
  layer.name === 'song' ? mode === 'both' || mode === 'music' : onHome && (mode === 'both' || mode === 'ambient')

// Bring every layer to where the mode and page say it should be. Layers that should sound and
// aren't playing start silent and fade up (after their delay when everything starts together);
// layers that shouldn't sound fade out and pause.
function apply(together = false) {
  if (!allowed || document.hidden) return
  for (const layer of all()) {
    if (wanted(layer)) {
      if (!layer.playing() || together) {
        clearTimeout(layer.timer)
        layer.silence()
        layer.play().catch(error => { if (import.meta.env.DEV) console.warn(`[sound] ${layer.name} did not start:`, error) })
        layer.timer = window.setTimeout(() => layer.fadeTo(layer.volume, layer.fadeIn), together ? layer.delay : 0)
      } else {
        layer.fadeTo(layer.volume, 600)
      }
    } else if (layer.playing()) {
      clearTimeout(layer.timer)
      layer.fadeTo(0, fadeOut, () => { if (!wanted(layer)) layer.pause() })
    }
  }
}

// Start every layer that should sound right here, silently, in the same moment as the click or
// key press that allows it (some browsers only honour a start made during the gesture itself).
// The song's play() tells us whether the browser agreed; if nothing should sound, the song is
// started and stopped silently just to unlock sound for later.
function tryStart() {
  // Development only: ?blocksound imitates a browser that refuses sound until a click.
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('blocksound') && !navigator.userActivation?.isActive) {
    return Promise.reject(new Error('blocked for testing'))
  }
  for (const layer of all()) if (wanted(layer)) { layer.silence(); layer.play().catch(() => {}) }
  const probe = song()
  probe.silence()
  return probe.play().then(() => {
    allowed = true
    enabledAt = performance.now()
    notify()
    for (const layer of all()) if (!wanted(layer)) layer.pause()
    apply(true)
  })
}

// Browsers differ in which events count as "the visitor asked for it" (Safari wants click or
// touchend, Chrome also takes pointerdown and keydown), so listen for all of them and keep
// listening until one of them actually starts the sound.
const gestures = ['pointerdown', 'mousedown', 'click', 'keydown', 'touchend'] as const
const stopWaiting = () => gestures.forEach(name => window.removeEventListener(name, startOnGesture, true))
let starting: Promise<void> | null = null
function startOnGesture() {
  if (allowed || starting || mode === 'off') return
  starting = tryStart().then(stopWaiting, () => {}).finally(() => { starting = null })
}

// Called once when the site loads.
export function startMusic() {
  if (allowed) return
  gestures.forEach(name => window.addEventListener(name, startOnGesture, { capture: true, passive: true }))
  tryStart().then(stopWaiting, () => {})
}

// Called by the app whenever the page changes: the field sound belongs to the home page.
export function setHomePage(home: boolean) {
  if (onHome === home) return
  onHome = home
  apply()
}

// The sound controls are two switches in one pill, music and field sound, each on or off on its
// own (the four modes are just their combinations). Before sound is allowed, either one simply
// starts sound as it's set, since that press is what the browser needs.
// When a press is what enabled sound, the same press's click arrives a moment later, after the
// controls have already switched to on; it mustn't then switch them straight back off.
let enabledAt = -Infinity
const sameGesture = () => performance.now() - enabledAt < 700

export function toggleLayer(which: 'music' | 'field') {
  if (sameGesture()) return
  if (!allowed) { if (mode === 'off') mode = 'both'; notify(); startOnGesture(); return }
  const music = mode === 'both' || mode === 'music'
  const field = mode === 'both' || mode === 'ambient'
  const next = which === 'music' ? [!music, field] : [music, !field]
  mode = next[0] ? (next[1] ? 'both' : 'music') : (next[1] ? 'ambient' : 'off')
  notify()
  apply()
}

// The footer's heart: all sound off, or back to both.
export function toggleAllSound() {
  if (sameGesture()) return
  if (!allowed) { mode = 'both'; notify(); startOnGesture(); return }
  mode = mode === 'off' ? 'both' : 'off'
  notify()
  apply()
}

export const musicOn = (mode: SoundMode) => mode === 'both' || mode === 'music'
export const fieldOn = (mode: SoundMode) => mode === 'both' || mode === 'ambient'

const serverSnapshot = { mode: 'both' as SoundMode, allowed: false }
let snapshot: { mode: SoundMode; allowed: boolean } = { mode, allowed }
export function useSound() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    () => {
      if (snapshot.mode !== mode || snapshot.allowed !== allowed) snapshot = { mode, allowed }
      return snapshot
    },
    () => serverSnapshot,
  )
}

// Whether sound is already allowed (the browser trusts the site) right now, outside React.
export const soundAllowed = () => allowed

export function soundLabel({ mode, allowed }: { mode: SoundMode; allowed: boolean }) {
  if (!allowed && mode !== 'off') return 'Enable music'
  return { both: 'Sound on', music: 'Music only', ambient: 'Ambient only', off: 'Muted' }[mode]
}
