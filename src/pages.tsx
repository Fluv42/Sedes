import { Link } from './components/Link'
import { Meadow } from './components/Meadow'
import { ProjectMark } from './components/ProjectMark'
import { featuredProjects, projects } from './content/projects'
import type { Project } from './content/projects'
import { principles, site } from './content/site'

const projectHref = (project: Project) => `/projects/${project.slug}`
const Arrow = () => <span className="arrow" aria-hidden="true">→</span>

// An editorial list rather than cards: big titles, one line each, year and status to the side.
function WorkList({ items, heading: Heading }: { items: Project[]; heading: 'h2' | 'h3' }) {
  return <ol className="work-list">
    {items.map(project => <li key={project.slug} className="work-item" data-reveal data-cursor="View">
      <Heading className="work-title"><Link href={projectHref(project)}>{project.title}</Link></Heading>
      <p className="work-summary">{project.summary}</p>
      <p className="work-meta">{project.year}<br />{project.status}</p>
    </li>)}
  </ol>
}

function Home() {
  const others = projects.length - featuredProjects.length
  return <>
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-media" data-cursor="Scroll">
        <Meadow alt="Long grass and wildflowers under old trees at the edge of a field" />
      </div>
      <div className="hero-copy" data-speed="-0.06">
        <p className="hello">Hello, I’m</p>
        <h1 id="home-title">Micah <span className="surname">VanEwyk</span></h1>
        <p className="alias">/ {site.alias}</p>
        <p className="lede">Developer and IT professional. I build practical software around the way people actually work.</p>
        <Link className="cta" href="/projects">View my work <Arrow /></Link>
        <p className="tagline">{site.tagline}</p>
      </div>
    </section>

    <section className="featured" aria-labelledby="featured-title">
      <h2 id="featured-title" data-reveal>What I make</h2>
      <WorkList items={featuredProjects} heading="h3" />
      <p className="more" data-reveal>{others} more in the <Link href="/projects">project index</Link>, and a few I’m still writing up.</p>
    </section>
  </>
}

function About() {
  return <section className="split-page about">
    <div className="split-media">
      <Meadow still alt="Sunlight across a quiet meadow" />
    </div>
    <div className="prose">
      <h1>About</h1>
      <p className="lede">I’m Micah, a developer and IT professional in Southwestern Ontario.</p>
      <p>By day I’m the IT specialist for five dealerships and a body shop, looking after about 210 people and the systems they rely on. Alongside that I’m building LotFlow, a workflow app that keeps vehicles from getting lost between reconditioning and delivery.</p>
      <p>I finished a Bachelor of Information Technology in Information Resource Management at Carleton in 2025, through its joint program with Algonquin College. Along the way I did co-ops in IT support at Bluewater Health and in information management at Agriculture and Agri-Food Canada.</p>
      <p>I start with the people doing the work, build something they can try, and keep refining it from what breaks. I use AI heavily to write code; setting the direction, understanding the changes, testing, and supporting the result are my job.</p>
      <p>I live on a farm. The name comes from <em>Sedes Sapientiae</em>, the Seat of Wisdom: the site is the seat, and the work is what it holds.</p>
      <Link className="cta" href="/projects">See the projects <Arrow /></Link>
    </div>
  </section>
}

function Projects() {
  return <>
    <header className="page-heading">
      <h1>Projects</h1>
      <p>Things I’ve built at work, on my own, and at university.</p>
    </header>
    <WorkList items={projects} heading="h2" />
    <p className="more">University projects were team work. Each write-up says which parts were mine.</p>
  </>
}

function ProjectPage({ project }: { project: Project }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  return <article className="project-page">
    <header className="project-header">
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
    <nav className="next-project" aria-label="More projects">
      <Link href="/projects">All projects</Link>
      <Link href={projectHref(next)}>Next: {next.title} <Arrow /></Link>
    </nav>
  </article>
}

function Notes() {
  return <>
    <header className="page-heading">
      <h1>Notes</h1>
      <p>Short writing about what I’m making and how.</p>
    </header>
    <ul className="note-list">
      <li>
        <time dateTime="2026-09-26">Sep 26, 2026</time>
        <div>
          <h2><Link href="/notes/sedes-principles">Sedes principles</Link></h2>
          <p>Three things this site should be.</p>
        </div>
      </li>
    </ul>
  </>
}

function Principles() {
  return <article className="note-page">
    <header className="page-heading">
      <p className="crumb"><Link href="/notes">Notes</Link> / <time dateTime="2026-09-26">Sep 26, 2026</time></p>
      <h1>Sedes principles</h1>
      <p>Three things this site should be: warm, reliable, and recognizably my own.</p>
    </header>
    <div className="prose">
      {principles.map(principle => <section key={principle.title}>
        <h2>{principle.title}</h2>
        <p>{principle.body}</p>
      </section>)}
    </div>
  </article>
}

function Contact() {
  const phone = import.meta.env.VITE_CONTACT_PHONE?.trim()
  return <section className="contact">
    <div>
      <h1>Contact</h1>
      <p className="lede">If something here is useful to you, or you’d like to work on something together, I’d be glad to hear from you.</p>
      <p className="contact-email"><a href={`mailto:${site.email}`}>{site.email}</a></p>
      <ul className="contact-other">
        <li><a href={site.github}>GitHub</a></li>
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
  if (path === '/notes') return <Notes />
  if (path === '/contact') return <Contact />
  if (path === '/notes/sedes-principles') return <Principles />
  const project = projects.find(item => path === projectHref(item))
  return project ? <ProjectPage project={project} /> : <NotFound />
}
