import { Link } from './components/Link'
import { Meadow } from './components/Meadow'
import { ProjectMark } from './components/ProjectMark'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { categories, featuredProjects, projects } from './content/projects'
import type { Category, Project } from './content/projects'
import { site } from './content/site'

const projectHref = (project: Project) => `/projects/${project.slug}`
const Arrow = () => <span className="arrow" aria-hidden="true">→</span>

// An editorial list rather than cards: big titles, one line each, year and status to the side.
// On Home rows rise in as they scroll into view; on Projects they rise in as filters bring them back.
function WorkList({ items, heading: Heading, live = false }: { items: Project[]; heading: 'h2' | 'h3'; live?: boolean }) {
  return <ol className="work-list">
    {items.map((project, index) => <li
      key={project.slug}
      className={live ? 'work-item rises' : 'work-item'}
      data-reveal={live ? undefined : ''}
      style={live ? { '--i': index } as CSSProperties : undefined}
      data-cursor="view"
    >
      <Heading className="work-title"><Link href={projectHref(project)}>{project.title}</Link></Heading>
      <p className="work-summary">{project.summary}</p>
      <p className="work-meta"><span>{project.year}</span> <span>{project.status}</span></p>
    </li>)}
  </ol>
}

function Home() {
  const others = projects.length - featuredProjects.length
  return <>
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-media" data-cursor="scroll">
        <Meadow alt="Open farmland under a wide evening sky" />
      </div>
      <div className="hero-copy" data-speed="-0.06">
        <p className="hello">Hello, I’m</p>
        <h1 id="home-title">Micah <span className="surname">VanEwyk</span></h1>
        <p className="alias">/ {site.alias}</p>
        <p className="lede">IT specialist and developer in Southwestern Ontario. I keep things running for the people I work with, and build software to make their work easier.</p>
        <Link className="cta" href="/projects">See what I’ve made <Arrow /></Link>
      </div>
    </section>

    <section className="featured" aria-labelledby="featured-title">
      <h2 id="featured-title" data-reveal>What I make</h2>
      <WorkList items={featuredProjects} heading="h3" />
      <p className="more" data-reveal>{others} more in the <Link href="/projects">full list</Link>, and a few I haven’t written up yet.</p>
    </section>

    <section className="about-teaser" aria-labelledby="about-teaser-title">
      <h2 id="about-teaser-title" data-reveal>A little about me</h2>
      <div>
        <p className="statement" data-reveal>I’m the IT specialist for a group of car dealerships. Right now I’m building LotFlow, an app that tracks their vehicles from reconditioning to delivery. I live on a farm in Southwestern Ontario.</p>
        <Link className="cta" href="/about" data-reveal>More about me <Arrow /></Link>
      </div>
    </section>
  </>
}

// Closes the résumé menu on a click elsewhere or Escape, like any other dropdown.
function useDismiss() {
  const menu = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const close = (event: Event) => {
      const element = menu.current
      if (!element?.open) return
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !element.contains(event.target as Node)) element.open = false
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close) }
  }, [])
  return menu
}

function About() {
  const resume = useDismiss()
  return <section className="split-page about">
    <div className="split-media" data-reveal>
      <Meadow still alt="Evening sun over a wheat field" />
    </div>
    <div className="prose">
      <h1 data-reveal>About</h1>
      <p className="lede" data-reveal>I’m Micah, an IT specialist and developer. I live on a farm in Southwestern Ontario.</p>
      <details className="resume" ref={resume} data-reveal>
        <summary>My résumé <span className="caret" aria-hidden="true">▾</span></summary>
        <ul>
          <li><a href="/resume/Micah-VanEwyk-Resume.pdf" download>PDF <span>86 KB</span></a></li>
          <li><a href="/resume/Micah-VanEwyk-Resume.docx" download>Word <span>11 KB</span></a></li>
        </ul>
      </details>
      <p data-reveal>I’m the IT specialist for five dealerships and a body shop, looking after logins, printers and software for about 210 people. I’m also building LotFlow, an app that tracks their vehicles from reconditioning to delivery.</p>
      <p data-reveal>I finished my Bachelor of Information Technology at Carleton in 2025, in Information Resource Management, done jointly with Algonquin College. Along the way I did co-ops in IT support at Bluewater Health and in information management at Agriculture and Agri-Food Canada.</p>
      <p data-reveal>How I work: talk to the people who’ll use the thing, build something they can try, then fix what breaks. AI writes a lot of my code. My job is knowing what to build, checking what it wrote, testing it, and sticking around to support it.</p>
      <p data-reveal>The site’s name comes from <em>Sedes Sapientiae</em>, the Seat of Wisdom. The site is the seat, and the work is what it holds.</p>
      <Link className="cta" href="/projects" data-reveal>See the projects <Arrow /></Link>
    </div>
  </section>
}

const searchable = (project: Project) =>
  [project.title, project.summary, project.type, project.stack, project.role, project.year, project.status].join(' ').toLowerCase()

function Projects() {
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [query, setQuery] = useState('')
  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    return projects.filter(project =>
      (category === 'All' || project.category === category) && words.every(word => searchable(project).includes(word)))
  }, [category, query])

  return <>
    <header className="page-heading" data-reveal>
      <h1>Projects</h1>
      <p>Things I’ve built at work, on my own, and at university.</p>
    </header>
    <div className="project-tools" data-reveal>
      <div className="filters" role="group" aria-label="Show projects from">
        {(['All', ...categories] as const).map(name => <button
          key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}
        >
          {name} <span className="count">{name === 'All' ? projects.length : projects.filter(p => p.category === name).length}</span>
        </button>)}
      </div>
      <label className="search">
        <span className="visually-hidden">Search projects</span>
        <input type="search" placeholder="Search" value={query} onChange={event => setQuery(event.target.value)} />
      </label>
    </div>
    <p className="visually-hidden" aria-live="polite">{shown.length} of {projects.length} projects shown</p>
    {shown.length
      ? <WorkList items={shown} heading="h2" live />
      : <p className="no-results">Nothing matches that. Try another word, or <button type="button" onClick={() => { setQuery(''); setCategory('All') }}>show everything</button>.</p>}
    <p className="more" data-reveal>University projects were team work. Each write-up says which parts were mine.</p>
  </>
}

function ProjectPage({ project }: { project: Project }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  return <article className="project-page">
    <header className="project-header" data-reveal>
      <div className="project-cover">
        {project.image
          ? <img src={project.image.src} alt={project.image.alt} width="1920" height="921" />
          : <ProjectMark project={project} size="large" />}
      </div>
      <div>
        <p className="crumb"><Link href="/projects">Projects</Link> / {project.status}</p>
        <h1>{project.title}</h1>
        <p className="summary">{project.summary}</p>
        <dl className="facts">
          <div><dt>Kind</dt><dd>{project.type}</dd></div>
          <div><dt>When</dt><dd>{project.year}</dd></div>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Stack</dt><dd>{project.stack}</dd></div>
        </dl>
        {project.repository && <a className="cta" href={project.repository}>Source on GitHub <Arrow /></a>}
      </div>
    </header>
    {project.sections.map(section => <section className="case-section" key={section.title} data-reveal>
      <h2>{section.title}</h2>
      <div className="prose">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>)}
    <nav className="next-project" aria-label="More projects" data-reveal>
      <Link href="/projects">All projects</Link>
      <Link href={projectHref(next)}>Next: {next.title} <Arrow /></Link>
    </nav>
  </article>
}

function Contact() {
  const phone = import.meta.env.VITE_CONTACT_PHONE?.trim()
  return <section className="contact">
    <div>
      <h1 data-reveal>Contact</h1>
      <p className="lede" data-reveal>Want to work together, or have a question about something here? Send me an email.</p>
      <p className="contact-email" data-reveal><a href={`mailto:${site.email}`}>{site.email}</a></p>
      <ul className="contact-other" data-reveal>
        <li><a href={site.linkedin}>LinkedIn</a></li>
        <li><a href={site.github}>GitHub</a></li>
        <li><a href={site.instagram}>Instagram</a></li>
        {phone && <li><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></li>}
      </ul>
    </div>
  </section>
}

function NotFound() {
  return <section className="not-found">
    <h1>Nothing here, yet.</h1>
    <p>That page doesn’t exist. <Link href="/">Back to Sedes</Link>, or look through the <Link href="/projects">projects</Link>.</p>
  </section>
}

export function PageRoute({ path }: { path: string }) {
  if (path === '/') return <Home />
  if (path === '/about') return <About />
  if (path === '/projects') return <Projects />
  if (path === '/contact') return <Contact />
  const project = projects.find(item => path === projectHref(item))
  return project ? <ProjectPage project={project} /> : <NotFound />
}
