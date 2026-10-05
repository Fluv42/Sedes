import type { Project } from '../content/projects'

// Each project shows its own mark: the real app icon where one exists, otherwise a plain tile.
export function ProjectMark({ project, size = 'small' }: { project: Project; size?: 'small' | 'large' }) {
  const className = `project-mark mark-${project.mark} mark-${size}`
  if (project.mark === 'screenshot' && project.image) {
    return <div className={className} aria-hidden="true"><img src={project.image.src} alt="" loading="lazy" /></div>
  }
  return <div className={className} aria-hidden="true">
    {project.mark === 'lotflow' && <svg viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>}
    {project.mark === 'server' && <svg viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 6h.01M6 18h.01" /></svg>}
    {project.mark === 'sedes' && <svg viewBox="0 0 64 64"><path d="M32 54V14" /><path d="M32 22c-6-1-9-5-8-9 5 1 8 4 8 9zM32 22c6-1 9-5 8-9-5 1-8 4-8 9zM32 32c-6-1-9-5-8-9 5 1 8 4 8 9zM32 32c6-1 9-5 8-9-5 1-8 4-8 9zM32 42c-6-1-9-5-8-9 5 1 8 4 8 9zM32 42c6-1 9-5 8-9-5 1-8 4-8 9z" /></svg>}
    {project.mark === 'monogram' && <span>{(project.title.match(/[A-Z]/g) ?? []).slice(0, 2).join('')}</span>}
  </div>
}
