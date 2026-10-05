import { useEffect, useRef, useState } from 'react'

const poster = '/media/farm-poster.jpg'
const motionQuery = '(prefers-reduced-motion: reduce)'

// Frosted like Monocle or Arc: the whole picture is blurred, a central oval only half as much,
// and towards the edges blur, tint and grain build until it becomes the page.
// Strengths come from --blur, --tint and --grain (see index.css and the dev-only Tuner).
export function Meadow({ still = false, alt }: { still?: boolean; alt: string }) {
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

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

  const showVideo = !still && !unavailable
  return <figure className="meadow">
    <div className="meadow-stage">
      <img className="meadow-source" src={poster} alt={alt} width="1280" height="720" fetchPriority="high" />
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
