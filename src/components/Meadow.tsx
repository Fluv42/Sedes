import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { nextSoundMode, soundLabel, useSound } from '../lib/music'
import { toggleTheme, useTheme } from '../lib/theme'
import { daypartNow } from '../lib/daypart'
import type { Daypart } from '../lib/daypart'

// Four fields, chosen by the visitor's own clock (lib/daypart.ts): a foggy sunrise, sun through
// the trees onto green grass, wheat at sunset, and stars over a field at night. Each file's last
// 2 s crossfade into its first frame, so the plain loop has no visible jump.
const clips: Record<Daypart, { video: string; poster: string; alt: string }> = {
  morning: { video: '/media/field-morning.mp4', poster: '/media/field-morning.jpg', alt: 'The sun rising over a green field, with low fog and a line of trees' },
  day: { video: '/media/field-day.mp4', poster: '/media/field-day.jpg', alt: 'Low sun shining through birch trees onto long green grass' },
  evening: { video: '/media/field-sunset.mp4', poster: '/media/field-sunset.jpg', alt: 'Rows of green wheat under a soft sunset' },
  night: { video: '/media/field-night.mp4', poster: '/media/field-night.jpg', alt: 'Stars and drifting cloud over a field with fence posts and birch trees at night' },
}
type Clip = Daypart
const noSubscription = () => () => {}
const motionQuery = '(prefers-reduced-motion: reduce)'

// The centre of the picture is sharp; towards the edges blur, tint and grain build until it
// becomes the page (like Monocle or Arc). Strengths come from --blur, --tint and --grain
// in index.css.
// The hero describes whichever field is showing; a still (About) can pass its own description.
export function Meadow({ still = false, alt }: { still?: boolean; alt?: string }) {
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const sound = useSound()
  const theme = useTheme()
  // The server can't know the visitor's time, so the page is built with the evening clip and
  // switches during hydration to the one for their clock.
  const clip = useSyncExternalStore(noSubscription, daypartNow, () => 'evening' as Clip)
  const { video: source, poster } = clips[clip]
  const video = useRef<HTMLVideoElement>(null)
  const still_ = useRef<HTMLImageElement>(null)
  const ambient = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (still) return
    const preference = window.matchMedia(motionQuery)
    // Motion starts only after hydration, so the server markup and first client render agree.
    const start = window.setTimeout(() => setPlaying(!preference.matches), 0)
    const stop = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false) }
    preference.addEventListener('change', stop)
    return () => { window.clearTimeout(start); preference.removeEventListener('change', stop) }
  }, [still])

  useEffect(() => {
    const element = video.current
    if (!element) return
    // An interrupted play() (a quick pause, or React re-running effects) is not a failure.
    const resume = () => element.play().catch((error: DOMException) => { if (error.name !== 'AbortError') setPlaying(false) })
    if (!playing) { element.pause(); return }
    resume()
    // Scrolled out of view or in a background tab, the video stops decoding (saving battery and
    // graphics memory, which Safari is strict about); it carries on when it's seen again.
    let inView = true
    const update = () => { if (inView && !document.hidden) resume(); else element.pause() }
    document.addEventListener('visibilitychange', update)
    const figure = element.closest('figure')
    const watcher = figure && 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update() })
      : null
    if (figure) watcher?.observe(figure)
    return () => { watcher?.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [playing, clip])

  // Ambient light, like YouTube's ambient mode: a tiny copy of each frame, blown up and blurred
  // behind the picture, so its colours spill across the top of the page as if it were larger.
  useEffect(() => {
    const canvas = ambient.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    let handle = 0
    let stopped = false
    let onScreen = true
    let first = true
    // Each new frame is laid over the last at partial strength, so the glow drifts from one frame
    // to the next instead of stepping (trees passing through the picture used to flicker in it).
    const paint = (source: CanvasImageSource) => {
      try {
        context.globalAlpha = first ? 1 : 0.35
        context.drawImage(source, 0, 0, canvas.width, canvas.height)
        first = false
      } catch { /* not ready yet */ }
    }
    const element = video.current
    // Repainted on every video frame (the canvas is only 48 × 27, so this is cheap); while the
    // hero is scrolled away it isn't repainted at all.
    const watcher = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting })
      : null
    watcher?.observe(canvas)
    const loop = () => {
      if (stopped) return
      if (onScreen && element && element.readyState >= 2 && !element.paused) paint(element)
      if (element && 'requestVideoFrameCallback' in element) handle = element.requestVideoFrameCallback(loop)
      else handle = window.setTimeout(loop, 33)
    }
    const image = still_.current
    if (image) { if (image.complete) paint(image); else image.addEventListener('load', () => paint(image), { once: true }) }
    if (element) loop()
    return () => {
      stopped = true
      watcher?.disconnect()
      if (element && 'cancelVideoFrameCallback' in element) element.cancelVideoFrameCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [clip])

  const showVideo = !still && !unavailable
  return <figure className="meadow">
    <canvas ref={ambient} className="meadow-ambient" width="48" height="27" aria-hidden="true" />
    <div className="meadow-stage">
      <img ref={still_} className="meadow-source" src={poster} alt={alt ?? clips[clip].alt} width="1280" height="720" fetchPriority="high" />
      {showVideo && <video
        key={clip} ref={video} className={`meadow-source${playing ? ' is-playing' : ''}`}
        muted loop playsInline preload="metadata" poster={poster} aria-hidden="true"
        onError={() => { setUnavailable(true); setPlaying(false) }}
      >
        <source src={source} type="video/mp4" />
      </video>}
      <div className="frost frost-outer" aria-hidden="true" />
      <div className="frost frost-edge" aria-hidden="true" />
      <div className="tint" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </div>
    {!still && <div className="motion-control">
      {showVideo && <button type="button" onClick={() => setPlaying(value => !value)}>
        {playing ? 'Pause' : 'Play'}<span className="visually-hidden"> the meadow video</span>
      </button>}
      <button
        type="button" onClick={nextSoundMode} title="Sound on, music only, ambient only, or muted"
        className={`sound-control ${sound.allowed ? `sound-${sound.mode}` : 'sound-waiting'}`}
      >
        <span className="visually-hidden">Sound: </span>{soundLabel(sound)}
      </button>
      <button type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </div>}
  </figure>
}
