import { useEffect, useRef, useState } from 'react'

const poster = '/media/farm-poster.jpg'
const motionQuery = '(prefers-reduced-motion: reduce)'

// The centre of the picture is sharp; towards the edges blur, tint and grain build until it
// becomes the page (like Monocle or Arc). Strengths come from --blur, --tint and --grain
// in index.css.
export function Meadow({ still = false, alt }: { still?: boolean; alt: string }) {
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
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
    if (playing) element.play().catch((error: DOMException) => { if (error.name !== 'AbortError') setPlaying(false) })
    else element.pause()
  }, [playing])

  // Ambient light, like YouTube's ambient mode: a tiny copy of each frame, blown up and blurred
  // behind the picture, so its colours spill across the top of the page as if it were larger.
  useEffect(() => {
    const canvas = ambient.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    let handle = 0
    let stopped = false
    const paint = (source: CanvasImageSource) => { try { context.drawImage(source, 0, 0, canvas.width, canvas.height) } catch { /* not ready yet */ } }
    const element = video.current
    const loop = () => {
      if (stopped) return
      if (element && element.readyState >= 2 && !element.paused) paint(element)
      if (element && 'requestVideoFrameCallback' in element) handle = element.requestVideoFrameCallback(loop)
      else handle = window.setTimeout(loop, 66)
    }
    const image = still_.current
    if (image) { if (image.complete) paint(image); else image.addEventListener('load', () => paint(image), { once: true }) }
    if (element) loop()
    return () => {
      stopped = true
      if (element && 'cancelVideoFrameCallback' in element) element.cancelVideoFrameCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [])

  const showVideo = !still && !unavailable
  return <figure className="meadow">
    <canvas ref={ambient} className="meadow-ambient" width="48" height="27" aria-hidden="true" />
    <div className="meadow-stage">
      <img ref={still_} className="meadow-source" src={poster} alt={alt} width="1280" height="720" fetchPriority="high" />
      {showVideo && <video
        ref={video} className={`meadow-source${playing ? ' is-playing' : ''}`}
        muted loop playsInline preload="metadata" poster={poster} aria-hidden="true"
        onError={() => { setUnavailable(true); setPlaying(false) }}
      >
        <source src="/media/farm.mp4" type="video/mp4" />
      </video>}
      <div className="frost frost-outer" aria-hidden="true" />
      <div className="frost frost-edge" aria-hidden="true" />
      <div className="tint" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </div>
    {showVideo && <button className="motion-control" type="button" onClick={() => setPlaying(value => !value)}>
      {playing ? 'Pause' : 'Play'}<span className="visually-hidden"> the meadow video</span>
    </button>}
  </figure>
}
