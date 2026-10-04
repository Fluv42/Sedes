import { useEffect, useRef } from 'react'
import { navigation, site } from './content/site'
import { Link } from './components/Link'
import { Grass } from './components/Grass'
import { Squiggle } from './components/Squiggle'
import { usePath } from './lib/router'
import { PageRoute } from './pages'
import { getPageTitle } from './lib/routes'
import './App.css'

function isCurrent(itemPath: string, path: string) {
  if (itemPath === '/') return path === '/'
  return path === itemPath || path.startsWith(itemPath + '/')
}

export default function App({ initialPath = '/' }: { initialPath?: string }) {
  const path = usePath(initialPath)
  const title = getPageTitle(path)
  const previousPath = useRef(path)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = `${title} | Sedes`
    if (previousPath.current === path) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    main.current?.focus({ preventScroll: true })
    previousPath.current = path
  }, [path, title])

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="site-frame">
      <header className="site-header">
        <nav aria-label="Main navigation">
          {navigation.map(item => {
            const current = isCurrent(item.path, path)
            return <Link
              key={item.path}
              href={item.path}
              className={item.path === '/' ? 'wordmark' : undefined}
              aria-current={current ? 'page' : undefined}
            >
              {item.label}
              {current && <Squiggle key={path} />}
            </Link>
          })}
        </nav>
      </header>
      <main ref={main} id="main" tabIndex={-1} key={path}>
        <PageRoute path={path} />
      </main>
      <footer className="site-footer">
        <Grass />
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} {site.name} <span className="alias">/ {site.alias}</span></span>
          <span className="footer-links">
            <a href={site.github}>GitHub</a>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${site.email}`}>Email</a>
          </span>
        </div>
      </footer>
    </div>
  </>
}
