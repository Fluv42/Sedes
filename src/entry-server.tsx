import { renderToString } from 'react-dom/server'
import App from './App'
import { getPageTitle } from './lib/routes'
import { projects } from './content/projects'

export const paths = ['/', '/about', '/projects', '/notes', '/contact', '/notes/sedes-principles', ...projects.map(project => `/projects/${project.slug}`)]
export function render(path: string) {
  return { html: renderToString(<App initialPath={path} />), title: `${getPageTitle(path)} | Sedes` }
}
