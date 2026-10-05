import type { Project } from '../content/projects'
import { Stalk } from './Stalk'

// Each project shows its own mark: the real app icon where one exists, otherwise a plain tile.
export function ProjectMark({ project, size = 'small' }: { project: Project; size?: 'small' | 'large' }) {
  const className = `project-mark mark-${project.mark} mark-${size}`
  // LotFlow's own app icon, from the official logo pack (public/media/lotflow).
  if (project.mark === 'lotflow') {
    return <div className={className} aria-hidden="true"><img src="/media/lotflow/lotflow-app-icon.svg" alt="" /></div>
  }
  // This site's own logo: the word, and the walnut line ending in an ear of wheat, which grows in.
  if (project.mark === 'sedes' && size === 'large') {
    return <div className={`${className} sedes-logo`} aria-hidden="true"><span><span>Sedes</span><Stalk data-reveal /></span></div>
  }
  if (project.mark === 'screenshot' && project.image) {
    return <div className={className} aria-hidden="true"><img src={project.image.src} alt="" loading="lazy" /></div>
  }
  return <div className={className} aria-hidden="true">
    {project.mark === 'server' && <svg viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 6h.01M6 18h.01" /></svg>}
    {project.mark === 'sedes' && <svg viewBox="0 0 64 64"><path d="M32 54V14" /><path d="M32 22c-6-1-9-5-8-9 5 1 8 4 8 9zM32 22c6-1 9-5 8-9-5 1-8 4-8 9zM32 32c-6-1-9-5-8-9 5 1 8 4 8 9zM32 32c6-1 9-5 8-9-5 1-8 4-8 9zM32 42c-6-1-9-5-8-9 5 1 8 4 8 9zM32 42c6-1 9-5 8-9-5 1-8 4-8 9z" /></svg>}
    {project.mark === 'monogram' && <span>{(project.title.match(/[A-Z]/g) ?? []).slice(0, 2).join('')}</span>}
  </div>
}
