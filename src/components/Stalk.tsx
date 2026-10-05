import type { CSSProperties, HTMLAttributes } from 'react'

// The Sedes line: a walnut underline that ends in an ear of wheat (the logo's line). Add the class
// `is-grown` (or let `data-reveal` add `is-in`) and it grows: the line runs out from the left, the
// stem pushes into the ear, and the grains open pair by pair from the base to the tip. Remove it
// and the stalk draws back. Its thickness comes from --stalk; the ear scales with it.
const pairs = [0, 11, 22]

export function Stalk({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`stalk ${className}`} aria-hidden="true" {...props}>
    <span className="stalk-line" />
    <svg className="stalk-ear" viewBox="0 0 44 16">
      <path className="stalk-stem" d="M0 8h31" />
      {pairs.map((x, index) => <g key={x}>
        <g className="stalk-grain" style={{ '--g': index * 2 } as CSSProperties}>
          <ellipse cx={x + 5} cy="4.35" rx="6.2" ry="2.5" transform={`rotate(-28 ${x + 5} 4.35)`} />
        </g>
        <g className="stalk-grain" style={{ '--g': index * 2 + 1 } as CSSProperties}>
          <ellipse cx={x + 5} cy="11.65" rx="6.2" ry="2.5" transform={`rotate(28 ${x + 5} 11.65)`} />
        </g>
      </g>)}
      <g className="stalk-grain" style={{ '--g': 6 } as CSSProperties}>
        <ellipse cx="37" cy="8" rx="5" ry="2.3" />
      </g>
    </svg>
  </span>
}
