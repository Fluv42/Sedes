import { useEffect, useRef } from 'react'
import { navigation, site } from './content/site'
import { Link } from './components/Link'
import { usePath } from './lib/router'
import { PageRoute } from './pages'
import { getPageTitle } from './lib/routes'
import './App.css'

export default function App({ initialPath = '/' }: { initialPath?: string }) {
  const path = usePath(initialPath)
  const current = { title: getPageTitle(path), page: <PageRoute path={path} /> }
  const previousPath = useRef(path)
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    document.title = `${current.title} | Sedes`
    if (previousPath.current !== path) { window.scrollTo({ top: 0, behavior: 'instant' }); main.current?.focus({ preventScroll: true }); previousPath.current = path }
  }, [path, current.title])
  return <><a className="skip-link" href="#main">Skip to content</a><div className="site-frame"><header className="site-header"><nav aria-label="Main navigation">{navigation.map(item => <Link key={item.path} href={item.path} className={item.path === '/' ? 'wordmark' : ''} aria-current={(item.path === '/' ? path === '/' : path === item.path || path.startsWith(item.path + '/')) ? 'page' : undefined}>{item.label}</Link>)}</nav></header><main ref={main} id="main" tabIndex={-1} key={path}>{current.page}</main><footer className="site-footer"><div className="grass-line" aria-hidden="true" /><div className="footer-meta"><Link href="/">© {new Date().getFullYear()} {site.name} <span className="footer-alias">/ {site.alias}</span></Link><div><a href={site.github}>GitHub</a><span aria-hidden="true">·</span><a href={`mailto:${site.email}`}>Email</a><a href="#main" className="back-top" aria-label="Back to top">↑</a></div></div></footer></div><p className="colophon">A home for the things I make.</p></>
}
