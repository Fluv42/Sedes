import { projects } from '../content/projects'
import { site } from '../content/site'

const titles: Record<string, string> = {
  '/': `${site.name} — ${site.title}`,
  '/about': 'About',
  '/projects': 'Projects',
  '/notes': 'Notes',
  '/contact': 'Contact',
  '/notes/sedes-principles': 'Sedes principles',
}
export function getPageTitle(path: string) {
  return titles[path] ?? projects.find(project => path === `/projects/${project.slug}`)?.title ?? 'Page not found'
}
