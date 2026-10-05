import { projects } from '../content/projects'
import { site } from '../content/site'

const titles: Record<string, string> = {
  '/': `${site.name}, ${site.title}`,
  '/about': 'About',
  '/projects': 'Projects',
  '/contact': 'Contact',
}
// What each page is about, for search results and link previews (LinkedIn, Slack, messages).
const descriptions: Record<string, string> = {
  '/': 'Micah VanEwyk is an IT specialist and developer in Southwestern Ontario. Projects, a bit about him, and how to get in touch.',
  '/about': 'Micah VanEwyk: IT specialist for a group of car dealerships, building LotFlow, with a B.I.T. from Carleton University. Résumé in PDF and Word.',
  '/projects': 'Things Micah VanEwyk has built at work, on his own, and at university.',
  '/contact': 'How to reach Micah VanEwyk: email, LinkedIn and GitHub.',
}
export function getPageDescription(path: string) {
  return descriptions[path] ?? projects.find(project => path === `/projects/${project.slug}`)?.summary ?? descriptions['/']
}

export function getPageTitle(path: string) {
  return titles[path] ?? projects.find(project => path === `/projects/${project.slug}`)?.title ?? 'Page not found'
}
