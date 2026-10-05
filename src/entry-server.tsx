import { renderToString } from 'react-dom/server'
import App from './App'
import { getPageTitle } from './lib/routes'
import { projects } from './content/projects'

export const paths = ['/', '/about', '/projects', '/contact', ...projects.map(project => `/projects/${project.slug}`)]
export function render(path: string) {
  return { html: renderToString(<App initialPath={path} />), title: `${getPageTitle(path)} | Sedes` }
}
