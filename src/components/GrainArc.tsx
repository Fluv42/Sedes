import { seeded } from '../lib/random'

// A round-topped window traced in single grains, laid over the corner of the meadow.
const centre = { x: 150, y: 150 }
const radius = 128
const sideDepth = 150

function points() {
  const random = seeded(7)
  const grains: { x: number; y: number; angle: number }[] = []
  const left = { x: centre.x - radius, y: centre.y }
  for (let y = left.y + sideDepth; y > left.y; y -= 13) grains.push({ x: left.x, y, angle: -90 })
  const arcLength = Math.PI * radius
  const steps = Math.round(arcLength / 13)
  for (let step = 0; step <= steps; step++) {
    const theta = Math.PI - (step / steps) * Math.PI
    grains.push({ x: centre.x + radius * Math.cos(theta), y: centre.y - radius * Math.sin(theta), angle: (-theta * 180) / Math.PI })
  }
  for (let y = left.y + 13; y <= left.y + sideDepth * 0.55; y += 13) grains.push({ x: centre.x + radius, y, angle: 90 })
  return grains.map((grain, index) => ({ ...grain, tilt: (index % 2 ? 24 : -24) + (random() - 0.5) * 14, scale: 0.8 + random() * 0.4 }))
}

const grains = points()

export function GrainArc() {
  return <svg className="grain-arc" viewBox="0 0 300 310" aria-hidden="true">
    {grains.map((grain, index) => <ellipse
      key={index}
      cx="0" cy="0" rx="2.4" ry="5.6"
      transform={`translate(${grain.x.toFixed(1)} ${grain.y.toFixed(1)}) rotate(${(grain.angle + 90 + grain.tilt).toFixed(1)}) scale(${grain.scale.toFixed(2)})`}
      style={{ animationDelay: `${600 + index * 22}ms` }}
    />)}
  </svg>
}
