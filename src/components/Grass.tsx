import { seeded } from '../lib/random'

// The footer's low line of grass. Four loose clumps sway at different speeds.
const width = 2400
const height = 64

function blades() {
  const random = seeded(42)
  const clumps: string[][] = [[], [], [], []]
  for (let x = 4; x < width; x += 3 + random() * 7) {
    const tall = random() < 0.08
    const h = tall ? 30 + random() * 30 : 8 + random() * 18
    const lean = (random() - 0.5) * (tall ? 26 : 12)
    const base = 1.1 + random() * 1.3
    const tipX = x + lean
    const tipY = height - h
    clumps[Math.floor(random() * clumps.length)].push(
      `M${(x - base).toFixed(1)} ${height}Q${(x + lean * 0.3).toFixed(1)} ${(height - h * 0.55).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}Q${(x + lean * 0.3 + 0.6).toFixed(1)} ${(height - h * 0.5).toFixed(1)} ${(x + base).toFixed(1)} ${height}Z`,
    )
  }
  return clumps.map(clump => clump.join(''))
}

const clumps = blades()

export function Grass() {
  return <svg className="grass" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    {clumps.map((d, index) => <path key={index} className={`clump clump-${index}`} d={d} />)}
  </svg>
}
