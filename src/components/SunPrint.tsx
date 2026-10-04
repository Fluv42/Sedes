import type { Motif } from '../content/projects'
import { Botanical } from './Botanical'

// A plant laid on toned paper and left in the sun: pale silhouette, soft edges, uneven plate.
export function SunPrint({ motif, size = 'small' }: { motif: Motif; size?: 'small' | 'large' }) {
  return <div className={`sun-print sun-print-${size} tone-${motif}`} aria-hidden="true">
    <Botanical motif={motif} />
  </div>
}
