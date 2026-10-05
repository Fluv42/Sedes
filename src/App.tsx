import { useEffect, useRef } from 'react'
import { navigation, site } from './content/site'
import { Link } from './components/Link'
import { Cursor } from './components/Cursor'
import { Intro } from './components/Intro'
import { usePath } from './lib/router'
import { scrollToTop, startSmoothScroll, watchParallax, watchReveals } from './lib/motion'
import { PageRoute } from './pages'
import { getPageTitle } from './lib/routes'
import './App.css'

function isCurrent(itemPath: string, path: string) {
  if (itemPath === '/') return path === '/'
  return path === itemPath || path.startsWith(itemPath + '/')
}

const GitHubIcon = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
const LinkedInIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-2.06 3.8-2.06 4.06 0 4.82 2.67 4.82 6.15V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-3.93V9.75Z" /></svg>
const InstagramIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>
const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>

export default function App({ initialPath = '/' }: { initialPath?: string }) {
  const path = usePath(initialPath)
  const title = getPageTitle(path)
  const previousPath = useRef(path)
  const main = useRef<HTMLElement>(null)

  useEffect(() => startSmoothScroll(), [])

  useEffect(() => {
    document.title = `${title} | Sedes`
    if (previousPath.current !== path) {
      // Back/forward skips Link's fade-out, so release the intro's hold here as well.
      document.documentElement.classList.remove('intro-played')
      scrollToTop()
      main.current?.focus({ preventScroll: true })
      previousPath.current = path
    }
    const page = main.current
    if (!page) return
    const stopReveals = watchReveals(page)
    const stopParallax = watchParallax(page)
    return () => { stopReveals(); stopParallax() }
  }, [path, title])

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Intro />
    <div className="site-frame">
      <header className="site-header">
        <nav aria-label="Main navigation">
          {navigation.map(item => {
            const current = isCurrent(item.path, path)
            return <Link key={item.path} href={item.path} aria-current={current ? 'page' : undefined}>
              {item.label}
            </Link>
          })}
        </nav>
        <Link className="wordmark" href="/about">{site.name}</Link>
      </header>
      <main ref={main} id="main" tabIndex={-1} key={path}>
        <PageRoute path={path} />
      </main>
      <footer className="site-footer">
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} {site.name} <span className="alias">/ {site.alias}</span></span>
          <span className="footer-links">
            <a href={site.linkedin} aria-label="LinkedIn"><LinkedInIcon /></a>
            <a href={site.github} aria-label="GitHub"><GitHubIcon /></a>
            <a href={site.instagram} aria-label="Instagram"><InstagramIcon /></a>
            <a href={`mailto:${site.email}`} aria-label="Email"><MailIcon /></a>
          </span>
        </div>
      </footer>
    </div>
    <Cursor />
  </>
}
