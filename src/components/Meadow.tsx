import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { nextSoundMode, soundLabel, useSound } from '../lib/music'
import { toggleTheme, useTheme } from '../lib/theme'
import { qualityLabel, stepDownQuality, toggleQuality, useQuality } from '../lib/quality'
import { useDaypart } from '../lib/daypart'
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
const motionQuery = '(prefers-reduced-motion: reduce)'

// The glow is worked out at 32 × 18 pixels and the soft edge at 256 pixels across; the browser
// stretches both smoothly to size. Small sizes are the point: the effects used to be live CSS
// blurs (a 90 px blur across a quarter of the page, and two frosted layers over the video), which
// the graphics card had to redo for every frame of video.
const glowWidth = 32
const glowHeight = 18
const softWidth = 256
// How much of each new frame goes into the glow, so it drifts rather than flickers.
const glowBlend = 0.35
const glowSaturation = 1.35

// The video is cropped like CSS object-fit: cover, at the same focus point as the <img> and <video>.
function cover(source: CanvasImageSource, width: number, height: number) {
  const sourceWidth = source instanceof HTMLVideoElement ? source.videoWidth : (source as HTMLImageElement).naturalWidth
  const sourceHeight = source instanceof HTMLVideoElement ? source.videoHeight : (source as HTMLImageElement).naturalHeight
  if (!sourceWidth || !sourceHeight) return null
  const scale = Math.max(width / sourceWidth, height / sourceHeight)
  const w = width / scale
  const h = height / scale
  return [(sourceWidth - w) * 0.45, (sourceHeight - h) * 0.6, w, h] as const
}

// Pretty mode: the soft edge (a small copy of the frame, stretched, shown only towards the edges)
// and the glow (an even smaller copy, saturated, smoothed and blended with the frames before it).
// Both are redrawn once per video frame, and not at all while the picture is off screen or still.
function startEffects(video: HTMLVideoElement | null, still: HTMLImageElement, soft: HTMLCanvasElement, glow: HTMLCanvasElement) {
  const none = { stop: () => {}, paint: () => {} }
  const softContext = soft.getContext('2d', { alpha: false })
  const glowContext = glow.getContext('2d', { alpha: false })
  const sample = document.createElement('canvas')
  sample.width = glowWidth
  sample.height = glowHeight
  const sampleContext = sample.getContext('2d', { willReadFrequently: true })
  if (!softContext || !glowContext || !sampleContext) return none
  const output = glowContext.createImageData(glowWidth, glowHeight)
  const mixed = new Float32Array(glowWidth * glowHeight * 3)
  const smoothed = new Float32Array(mixed.length)
  let first = true

  // The soft canvas keeps the shape of its box, so the crop matches the picture on any screen.
  // Resizing a canvas clears it, so the last picture is drawn again (About's frame grows).
  let last: HTMLVideoElement | HTMLImageElement | null = null
  const fit = () => {
    const box = soft.getBoundingClientRect()
    if (!box.width || !box.height) return
    const height = Math.max(1, Math.round(softWidth * box.height / box.width))
    if (soft.width === softWidth && soft.height === height) return
    soft.width = softWidth
    soft.height = height
    // Only the soft edge is redrawn; the glow keeps its colours until it's asked to change.
    if (last) paint(last, false)
  }
  fit()
  const resize = 'ResizeObserver' in window ? new ResizeObserver(fit) : null
  resize?.observe(soft)

  const paint = (source: HTMLVideoElement | HTMLImageElement, withGlow = true, blend = glowBlend) => {
    last = source
    const crop = cover(source, soft.width, soft.height)
    if (!crop) return
    try {
      softContext.drawImage(source, ...crop, 0, 0, soft.width, soft.height)
      if (!withGlow) return
      sampleContext.drawImage(soft, 0, 0, glowWidth, glowHeight)
      const pixels = sampleContext.getImageData(0, 0, glowWidth, glowHeight).data
      for (let i = 0, j = 0; i < pixels.length; i += 4, j += 3) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
        const light = 0.2126 * r + 0.7152 * g + 0.0722 * b
        const rgb = [light + (r - light) * glowSaturation, light + (g - light) * glowSaturation, light + (b - light) * glowSaturation]
        for (let c = 0; c < 3; c++) mixed[j + c] = first ? rgb[c] : mixed[j + c] + (rgb[c] - mixed[j + c]) * blend
      }
      first = false
      // A small box blur, so the stretched glow has no visible pixel structure.
      for (let y = 0; y < glowHeight; y++) for (let x = 0; x < glowWidth; x++) {
        let r = 0, g = 0, b = 0, n = 0
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const sx = x + dx, sy = y + dy
          if (sx < 0 || sy < 0 || sx >= glowWidth || sy >= glowHeight) continue
          const k = (sy * glowWidth + sx) * 3
          r += mixed[k]; g += mixed[k + 1]; b += mixed[k + 2]; n++
        }
        const k = (y * glowWidth + x) * 3
        smoothed[k] = r / n; smoothed[k + 1] = g / n; smoothed[k + 2] = b / n
      }
      for (let i = 0, j = 0; i < output.data.length; i += 4, j += 3) {
        output.data[i] = smoothed[j]
        output.data[i + 1] = smoothed[j + 1]
        output.data[i + 2] = smoothed[j + 2]
        output.data[i + 3] = 255
      }
      glowContext.putImageData(output, 0, 0)
    } catch { /* a frame that isn't ready yet; the next one will do */ }
  }

  let onScreen = true
  let stopped = false
  let handle = 0
  const watcher = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting })
    : null
  watcher?.observe(soft)
  const showing = () => video && video.classList.contains('is-playing') && video.readyState >= 2
  const loop = () => {
    if (stopped) return
    if (onScreen && video && showing() && !video.paused) paint(video)
    if (video && 'requestVideoFrameCallback' in video) handle = video.requestVideoFrameCallback(loop)
    else handle = window.setTimeout(loop, 1000 / 30)
  }
  // Until the video is showing, the effects are drawn from the still.
  if (still.complete) paint(still)
  else still.addEventListener('load', () => { if (!showing()) paint(still) }, { once: true })
  if (video) loop()
  return {
    stop() {
      stopped = true
      watcher?.disconnect()
      resize?.disconnect()
      if (video && 'cancelVideoFrameCallback' in video) video.cancelVideoFrameCallback(handle)
      else window.clearTimeout(handle)
    },
    // For a picture laid over the still (About's photo): the glow drifts over to its colours.
    paint: (source: HTMLImageElement, blend?: number) => { if (!stopped && source.complete) paint(source, true, blend) },
  }
}

// Photos that open out of the middle of the still on hover or tap (About), one after another:
// each is shown through a hole that grows from the centre while the frame grows to the photo's
// own shape (up to most of the screen's height), with a softened copy at its edges.
// `faces` are where the two faces are (fractions of the photo's width and height), and `face` how
// big a face is (a fraction of its width): the photo's oval is fitted around them. A photo can
// instead give its `oval` directly (centre as fractions; radii as fractions of the width).
export interface Photo {
  src: string; alt: string; width: number; height: number
  faces: [[number, number], [number, number]]; face?: number
  oval?: { cx: number; cy: number; rx: number; ry: number; angle: number }
}

// A soft oval tilted along the line between the two faces, large enough that both sit in its clear
// middle. It's drawn as a plain CSS gradient on a rotated box (nothing to load, so it can never
// flash unmasked), with the photo inside turned back the other way so it stays upright.
// Everything is in percentages of the frame, which has the photo's proportions.
function ovalFor(photo: Photo) {
  const ratio = photo.height / photo.width
  const H = 100 * ratio
  let cx: number, cy: number, rx: number, ry: number, angle: number
  if (photo.oval) {
    ({ cx, cy, rx, ry, angle } = photo.oval)
    cx *= 100; cy *= H; rx *= 100; ry *= 100
  } else {
    const [[x1, y1], [x2, y2]] = photo.faces.map(([x, y]) => [x * 100, y * H])
    const face = (photo.face ?? 0.11) * 100
    cx = (x1 + x2) / 2
    // A little below the middle of the faces, to take in shoulders and arms.
    cy = (y1 + y2) / 2 + face * 0.6
    const half = Math.hypot(x2 - x1, y2 - y1) / 2
    // The middle 60% of the oval is fully clear: both faces, with room around them.
    rx = Math.min((half + face * 1.5) / 0.6, 72)
    ry = Math.max((face * 2.4) / 0.6, rx * 0.8)
    angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
  }
  const pct = (value: number) => `${value.toFixed(2)}%`
  return {
    layer: { '--hole-x': pct(cx), '--hole-y': pct(cy / H * 100) } as React.CSSProperties,
    oval: { left: pct(cx - rx), top: pct((cy - ry) / H * 100), width: pct(2 * rx), height: pct(2 * ry / H * 100), rotate: `${angle.toFixed(1)}deg` },
    image: {
      left: pct(-(cx - rx) / (2 * rx) * 100), top: pct(-(cy - ry) / (2 * ry) * 100),
      width: pct(100 / (2 * rx) * 100), height: pct(H / (2 * ry) * 100),
      transformOrigin: `${pct(cx)} ${pct(cy / H * 100)}`, rotate: `${(-angle).toFixed(1)}deg`,
    },
  }
}

export interface Alternate { label: string; photos: Photo[] }

// The centre of the picture is sharp; towards the edges it softens and takes on a wash of paper
// until it becomes the page (like Monocle or Arc), and its colours glow out around it (like
// YouTube's ambient mode). Strengths come from --tint, --grain and --ambient in index.css.
// The hero describes whichever field is showing; a still (About) can pass its own description.
export function Meadow({ still = false, alt, alternate }: { still?: boolean; alt?: string; alternate?: Alternate }) {
  const [playing, setPlaying] = useState(false)
  // The clip whose video couldn't be loaded (the still shows instead), and how many times the
  // still itself has been retried.
  const [failed, setFailed] = useState<Clip | null>(null)
  const [stillTries, setStillTries] = useState(0)
  const stillTimer = useRef(0)
  const sound = useSound()
  const theme = useTheme()
  const quality = useQuality()
  // The visitor's own time of day (evening on the server), kept up to date while the page is open.
  const clip = useDaypart()
  const { video: source, poster } = clips[clip]
  const video = useRef<HTMLVideoElement>(null)
  const image = useRef<HTMLImageElement>(null)
  const soft = useRef<HTMLCanvasElement>(null)
  const glow = useRef<HTMLCanvasElement>(null)
  const second = useRef<HTMLImageElement>(null)
  const repaint = useRef<(source: HTMLImageElement, blend?: number) => void>(() => {})
  const [opened, setOpened] = useState(false)
  const [shown, setShown] = useState(0)
  const advance = useRef(0)
  const photo = alternate?.photos[shown % alternate.photos.length]
  const shape = photo && ovalFor(photo)
  // A random photo each time, never the same one twice in a row. Only the chosen one is fetched
  // (ahead of time, so it's ready when the picture is next opened).
  const pickNext = () => {
    if (!alternate) return
    const count = alternate.photos.length
    setShown(index => {
      const next = (index + 1 + Math.floor(Math.random() * (count - 1))) % count
      // Fetched and decoded now, so it's ready to draw the moment it's opened.
      const ahead = new Image()
      ahead.src = alternate.photos[next].src
      ahead.decode().catch(() => {})
      return next
    })
  }
  // Closing moves on to another photo for next time, once the hole has closed.
  const open = (value: boolean) => {
    window.clearTimeout(advance.current)
    setOpened(value)
    if (!value) advance.current = window.setTimeout(pickNext, 1200)
  }
  // The first one is picked once the page is running (the server can't pick at random).
  useEffect(() => {
    advance.current = window.setTimeout(pickNext, 0)
    return () => window.clearTimeout(advance.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Hover opens it with a mouse; a tap or the (keyboard-reachable) button toggles it.
  const lastPointer = useRef('mouse')
  const showVideo = !still && failed !== clip

  useEffect(() => {
    if (still) return
    const preference = window.matchMedia(motionQuery)
    // Motion starts only after hydration, so the server markup and first client render agree.
    const start = window.setTimeout(() => setPlaying(!preference.matches), 0)
    const stop = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false) }
    preference.addEventListener('change', stop)
    return () => { window.clearTimeout(start); preference.removeEventListener('change', stop) }
  }, [still])

  // Playback, with a watchdog. While the video should be playing (it's wanted, on screen and the
  // tab is open) it is checked every two seconds: paused by the browser → play again; stuck on one
  // frame → ask for the data again, then reload it where it was; failing to load → try again a
  // little later, or as soon as the connection is back (a computer waking from sleep asks before
  // its network is up); after three failures keep the still until the connection or tab returns. If the computer is dropping a lot of frames, Pretty steps down to Performance.
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (!playing) { element.pause(); return }
    let inView = true
    let retries = 0
    let stuck = 0
    let lastTime = -1
    let lastQuality: VideoPlaybackQuality | undefined = element.getVideoPlaybackQuality?.()
    let struggling = 0
    let waiting = 0
    const give = () => { setFailed(clip); setPlaying(false) }
    // An interrupted play() (a quick pause, or React re-running effects) is not a failure. A
    // refusal (iOS Low Power Mode won't autoplay) leaves the still and a Play button.
    const resume = () => element.play().catch((error: DOMException) => { if (error.name !== 'AbortError') setPlaying(false) })
    const wanted = () => inView && !document.hidden
    const reload = () => {
      if (waiting) return
      if (!navigator.onLine) { window.addEventListener('online', reload, { once: true }); return }
      if (retries++ >= 3) return give()
      // Spaced out, so a short outage doesn't use up every try at once.
      waiting = window.setTimeout(() => {
        waiting = 0
        const at = element.currentTime
        element.load()
        element.addEventListener('loadedmetadata', () => { element.currentTime = at }, { once: true })
        resume()
      }, 1500 * retries)
    }
    const update = () => { if (wanted()) { if (element.paused) resume() } else element.pause() }
    const check = () => {
      if (!wanted()) { lastTime = -1; lastQuality = undefined; return }
      if (element.paused) { resume(); return }
      if (element.currentTime === lastTime && !element.seeking) {
        stuck += 1
        // A seek to where it already is makes the browser fetch and decode from there again.
        if (stuck === 1) element.currentTime = lastTime
        else { stuck = 0; reload() }
      } else stuck = 0
      lastTime = element.currentTime
      const now = element.getVideoPlaybackQuality?.()
      if (now && lastQuality) {
        const shown = now.totalVideoFrames - lastQuality.totalVideoFrames
        const dropped = now.droppedVideoFrames - lastQuality.droppedVideoFrames
        struggling = shown >= 20 && dropped / shown > 0.2 ? struggling + 1 : 0
        if (struggling >= 2) { struggling = 0; stepDownQuality() }
      }
      lastQuality = now
    }
    resume()
    const timer = window.setInterval(check, 2000)
    const sourceElement = element.querySelector('source')
    element.addEventListener('error', reload)
    sourceElement?.addEventListener('error', reload)
    // Scrolled out of view or in a background tab, the video stops decoding (saving battery and
    // graphics memory, which Safari is strict about); it carries on when it's seen again.
    document.addEventListener('visibilitychange', update)
    const figure = element.closest('figure')
    const watcher = figure && 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update() })
      : null
    if (figure) watcher?.observe(figure)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(waiting)
      window.removeEventListener('online', reload)
      watcher?.disconnect()
      element.removeEventListener('error', reload)
      sourceElement?.removeEventListener('error', reload)
      document.removeEventListener('visibilitychange', update)
    }
  }, [playing, clip])

  // After the video has given up, try it again once the connection or the tab comes back.
  useEffect(() => {
    if (failed !== clip) return
    const retry = () => {
      if (!navigator.onLine || document.hidden) return
      setFailed(null)
      setPlaying(!window.matchMedia(motionQuery).matches)
    }
    window.addEventListener('online', retry)
    document.addEventListener('visibilitychange', retry)
    return () => { window.removeEventListener('online', retry); document.removeEventListener('visibilitychange', retry) }
  }, [failed, clip])

  // The still retries too: a few seconds later, or when the connection is back.
  const retryStill = () => {
    window.clearTimeout(stillTimer.current)
    const again = () => setStillTries(tries => tries + 1)
    if (!navigator.onLine) window.addEventListener('online', again, { once: true })
    else if (stillTries < 5) stillTimer.current = window.setTimeout(again, 3000)
  }
  useEffect(() => () => window.clearTimeout(stillTimer.current), [])

  useEffect(() => {
    if (quality === 'fast' || !image.current || !soft.current || !glow.current) return
    const effects = startEffects(video.current, image.current, soft.current, glow.current)
    repaint.current = effects.paint
    return () => { effects.stop(); repaint.current = () => {} }
  }, [clip, quality, showVideo, still, stillTries])

  // As the photo opens (or closes), the glow drifts over to its colours alongside it: small steps
  // from the start, so it neither jumps at once nor arrives after the photo has settled.
  useEffect(() => {
    if (!alternate) return
    const source = opened ? second.current : image.current
    if (!source) return
    // Each step blends in just enough that the total follows an ease-in-out curve over the same
    // time as the opening, rather than rushing at first.
    const duration = 1300
    const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
    let frame = 0
    let last = 0
    let start = 0
    let done = 0
    const step = (time: number) => {
      start ||= time
      const progress = Math.min((time - start) / duration, 1)
      if (time - last >= 50 || progress === 1) {
        last = time
        const target = ease(progress)
        if (target > done) repaint.current(source, done >= 1 ? 1 : (target - done) / (1 - done))
        done = target
      }
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [opened, alternate, shown])

  const hover = alternate ? {
    onPointerDown: (event: React.PointerEvent) => { lastPointer.current = event.pointerType },
    onPointerEnter: (event: React.PointerEvent) => { if (event.pointerType === 'mouse') open(true) },
    onPointerLeave: (event: React.PointerEvent) => { if (event.pointerType === 'mouse') open(false) },
    // A tap does what hovering does: the first opens the photo, the next closes it.
    onClick: () => { if (lastPointer.current !== 'mouse') open(!opened) },
  } : {}
  return <figure
    className={`meadow${alternate ? ' has-alternate' : ''}${opened ? ' is-opened' : ''}`}
    style={photo ? { '--open-ratio': photo.height / photo.width } as React.CSSProperties : undefined}
    {...hover}
  >
    <canvas ref={glow} className="meadow-ambient" width={glowWidth} height={glowHeight} aria-hidden="true" />
    <div className="meadow-stage">
      <img ref={image} className="meadow-source" src={stillTries ? `${poster}?try=${stillTries}` : poster} onError={retryStill} alt={alt ?? clips[clip].alt} width="1280" height="720" fetchPriority="high" />
      {showVideo && <video
        key={clip} ref={video} className={`meadow-source${playing ? ' is-playing' : ''}`}
        muted loop playsInline preload="metadata" poster={poster} aria-hidden="true"
      >
        <source src={source} type="video/mp4" />
      </video>}
      <canvas ref={soft} className="meadow-soft" aria-hidden="true" />
      <div className="tint" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </div>
    {photo && shape && <div className="meadow-alternate" style={shape.layer}>
      <div className="meadow-oval" style={shape.oval}>
        {/* A new element per photo, so the last one can't linger while the next is drawn. */}
        <img key={photo.src} ref={second} src={photo.src} alt={opened ? photo.alt : ''} aria-hidden={!opened} width={photo.width} height={photo.height} style={shape.image} decoding="async" />
      </div>
    </div>}
    {alternate && <button type="button" className="alternate-toggle" aria-pressed={opened} onClick={event => { event.stopPropagation(); open(!opened) }}>
      {alternate.label}
    </button>}
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
      <button
        type="button" onClick={toggleQuality} title="Pretty: every effect. Performance: lighter on older phones and laptops."
        className={`quality-control quality-${quality}`}
      >
        <span className="visually-hidden">Effects: </span>{qualityLabel(quality)}
      </button>
    </div>}
  </figure>
}
