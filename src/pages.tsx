import { Link } from './components/Link'
import { Meadow } from './components/Meadow'
import type { Photo } from './components/Meadow'
import { ProjectMark } from './components/ProjectMark'
import { Stalk } from './components/Stalk'
import { GitHubIcon } from './components/Icons'
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
        <Meadow />
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
      <Stalk className="section-stalk" data-reveal />
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

// The résumé in both formats, as a small dropdown (About and Contact).
function ResumeMenu() {
  const menu = useDismiss()
  return <details className="resume" ref={menu} data-reveal>
    <summary>My résumé <span className="caret" aria-hidden="true">▾</span></summary>
    <ul>
      <li><a href="/resume/Micah-VanEwyk-Resume.pdf" download>PDF <span>86 KB</span></a></li>
      <li><a href="/resume/Micah-VanEwyk-Resume.docx" download>Word <span>11 KB</span></a></li>
    </ul>
  </details>
}

// Micah and Jessie, shown one at a time when the About picture is hovered or tapped
// (public/media/personal, which is kept out of the repository).
const together: Photo[] = [
  { src: '/media/personal/doorway.jpg', width: 1204, height: 1400, faces: [[0.37, 0.43], [0.55, 0.24]], face: 0.09, alt: 'Micah and Jessie smiling in front of a wooden door in a stone wall' },
  { src: '/media/personal/selfie.jpg', width: 1050, height: 1400, faces: [[0.25, 0.66], [0.68, 0.25]], face: 0.15, alt: 'A selfie of Jessie and Micah under a grey sky, with autumn trees behind' },
  { src: '/media/personal/lift.jpg', width: 866, height: 1300, faces: [[0.37, 0.33], [0.55, 0.28]], oval: { cx: 0.5, cy: 0.5, rx: 0.8, ry: 0.56, angle: 90 }, alt: 'Micah lifting Jessie off her feet under yellow autumn leaves' },
  { src: '/media/personal/oak.jpg', width: 1400, height: 1096, faces: [[0.28, 0.55], [0.53, 0.3]], face: 0.1, alt: 'Jessie and Micah smiling in front of a big oak tree in autumn' },
  { src: '/media/personal/hug.jpg', width: 932, height: 1400, faces: [[0.62, 0.6], [0.62, 0.16]], face: 0.17, alt: 'Micah and Jessie hugging and laughing on a bright day' },
  { src: '/media/personal/look.jpg', width: 1400, height: 1166, faces: [[0.42, 0.33], [0.56, 0.6]], face: 0.12, alt: 'Micah holding Jessie’s face as she smiles up at him, by a field of tall grass' },
  { src: '/media/personal/forehead.jpg', width: 1400, height: 1166, faces: [[0.4, 0.45], [0.57, 0.52]], face: 0.15, alt: 'Micah and Jessie with their foreheads together, smiling, outside on a sunny day' },
  { src: '/media/personal/door-wide.jpg', width: 1400, height: 1380, faces: [[0.37, 0.41], [0.6, 0.2]], face: 0.09, alt: 'Jessie and Micah standing arm in arm at a wooden door' },
]

function About() {
  return <section className="split-page about">
    <div className="split-media" data-reveal>
      <Meadow still alternate={{ label: 'Show a photo of Micah and Jessie', photos: together }} />
    </div>
    <div className="prose">
      <h1 data-reveal>About</h1>
      <p className="lede" data-reveal>I’m Micah, an IT specialist and developer. I live on a farm in Southwestern Ontario.</p>
      <ResumeMenu />
      <p data-reveal>I’m the IT specialist for five dealerships and a body shop, about 210 people. Day to day that means logins, printers, VPN access and software, sorted in person, over Teams or on the phone, and working with our outside IT providers when something is bigger. I’m also building <Link href="/projects/lotflow">LotFlow</Link>, an app that tracks their vehicles from reconditioning to delivery.</p>
      <p data-reveal>I finished my Bachelor of Information Technology at Carleton in 2025, in Information Resource Management, done jointly with Algonquin College. Along the way I did a co-op in IT support at Bluewater Health, and worked as an information management assistant at Agriculture and Agri-Food Canada, where I built the <Link href="/projects/server-cleanup">server cleanup tool</Link>.</p>
      <dl className="toolkit" data-reveal>
        <div><dt>Support</dt><dd>Windows and macOS, Microsoft 365 and Teams, VPN and network printers, Cloudflare DNS, NAS setup, Cherwell</dd></div>
        <div><dt>Building</dt><dd>React and TypeScript, Python, Django, Express, SQLite, Git</dd></div>
      </dl>
      <p data-reveal>Outside of work I play a lot of Soulslikes (Elden Ring, Sekiro, Lies of P), mostly for the builds and the lore, and modded Minecraft. I like tinkering with computers, my Steam Deck and smart-home gear, and building or refinishing things around the house. Lately I’ve been customizing my Kobo e-reader with the font you’re now reading. <a href="https://github.com/nicoverbruggen/libron">Libron</a>!<a className="inline-icon" href="https://github.com/nicoverbruggen/libron" aria-label="Libron on GitHub" title="Libron on GitHub"><GitHubIcon /></a></p>
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
      <ResumeMenu />
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
