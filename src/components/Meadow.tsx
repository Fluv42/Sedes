import { useEffect, useRef, useState } from 'react'
import { toggleMusic, useMusic } from '../lib/music'

// Three fields, chosen by the visitor's own clock: a foggy sunrise in the morning, green farmland
// under a big sky through the day, and wheat at sunset in the evening and overnight. Each file's last 2 s crossfade into its
// first frame, so the plain loop has no visible jump.
const clips = {
  morning: { video: '/media/field-morning.mp4', poster: '/media/field-morning.jpg' },
  day: { video: '/media/field-barn.mp4', poster: '/media/field-barn.jpg' },
  evening: { video: '/media/field-sunset.mp4', poster: '/media/field-sunset.jpg' },
}
type Clip = keyof typeof clips
const clipForNow = (): Clip => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) return 'morning'
  if (hour >= 10 && hour < 17) return 'day'
  return 'evening'
}
const motionQuery = '(prefers-reduced-motion: reduce)'

// The centre of the picture is sharp; towards the edges blur, tint and grain build until it
// becomes the page (like Monocle or Arc). Strengths come from --blur, --tint and --grain
// in index.css.
export function Meadow({ still = false, alt }: { still?: boolean; alt: string }) {
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const music = useMusic()
  // The server can't know the visitor's time, so the page is built with the evening clip and
  // switches after hydration if it's daytime where they are.
  const [clip, setClip] = useState<Clip>('evening')
  const { video: source, poster } = clips[clip]
  const video = useRef<HTMLVideoElement>(null)
  const still_ = useRef<HTMLImageElement>(null)
  const ambient = useRef<HTMLCanvasElement>(null)

  useEffect(() => { setClip(clipForNow()) }, [])

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
    if (playing) element.play().catch((error: DOMException) => { if (error.name !== 'AbortError') setPlaying(false) })
    else element.pause()
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
    let painted = 0
    const paint = (source: CanvasImageSource) => { try { context.drawImage(source, 0, 0, canvas.width, canvas.height) } catch { /* not ready yet */ } }
    const element = video.current
    // The glow is heavily blurred, so ten updates a second look the same as thirty and cost a
    // third as much; while the hero is scrolled away it isn't repainted at all.
    const watcher = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting })
      : null
    watcher?.observe(canvas)
    const loop = () => {
      if (stopped) return
      const now = performance.now()
      if (onScreen && now - painted > 100 && element && element.readyState >= 2 && !element.paused) { paint(element); painted = now }
      if (element && 'requestVideoFrameCallback' in element) handle = element.requestVideoFrameCallback(loop)
      else handle = window.setTimeout(loop, 66)
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
      <img ref={still_} className="meadow-source" src={poster} alt={alt} width="1280" height="720" fetchPriority="high" />
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
      <button type="button" aria-pressed={music} onClick={toggleMusic}>
        {music ? 'Sound off' : 'Sound on'}<span className="visually-hidden"> (background music)</span>
      </button>
    </div>}
  </figure>
}
