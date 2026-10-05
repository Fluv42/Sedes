import { useEffect, useRef } from 'react'
import { navigation, site } from './content/site'
import { Link } from './components/Link'
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon } from './components/Icons'
import { Cursor } from './components/Cursor'
import { Intro } from './components/Intro'
import { usePath } from './lib/router'
import { scrollToTop, startSmoothScroll, watchParallax, watchReveals } from './lib/motion'
import { PageRoute } from './pages'
import { toggleMusic, useMusic } from './lib/music'
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
  const music = useMusic()

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
          <span className="footer-credits">
            <span>© {new Date().getFullYear()} {site.name} <span className="alias">/ {site.alias}</span></span>
            <span className="music-credit">
              <button className="music-toggle" type="button" aria-pressed={music} onClick={toggleMusic} title={music ? 'Turn the music off' : 'Turn the music on'}>
                <span aria-hidden="true">{music ? '❚❚' : '♪'}</span><span className="visually-hidden">{music ? 'Turn the music off' : 'Turn the music on'}</span>
              </button>
              Music by <a href={site.musicBy.href}>{site.musicBy.name}</a>
              <a className="credit-note" href={site.musicBy.songHref} title={site.musicBy.original}>♪ {site.musicBy.song}</a>
            </span>
          </span>
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
