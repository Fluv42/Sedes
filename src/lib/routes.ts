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

// The link-preview card for each page (public/og/<file>.jpg, drawn by `npm run og`).
export function getPageCard(path: string) {
  const file = path === '/' ? 'home' : path.slice(1).replace(/\//g, '-')
  if (path === '/') return { file, title: site.name, kicker: 'IT specialist and developer', description: 'In Southwestern Ontario. What I’ve made, a bit about me, and how to get in touch.' }
  const project = projects.find(item => path === `/projects/${item.slug}`)
  if (project) return { file, title: project.title, kicker: `${project.type} by ${site.name}` }
  return { file, title: getPageTitle(path), kicker: site.name }
}
