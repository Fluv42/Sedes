// A pencil underline for the current page, redrawn each time the page changes.
export function Squiggle() {
  return <svg className="squiggle" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
    <path d="M2 6C10 3 15 8 23 5S36 3 44 6 58 8 66 5 80 3 88 6 95 7 98 5" pathLength="1" />
  </svg>
}
