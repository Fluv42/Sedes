import { useEffect, useRef, useState } from 'react'
import { Botanical } from './components/Botanical'
import { featuredProjects, projects } from './content/projects'
import type { Project } from './content/projects'
import { principles, site } from './content/site'
import { Link } from './components/Link'
import './App.css'
const Arrow = () => <span aria-hidden="true">↗</span>

function Meadow() {
  const [playing, setPlaying] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [unavailable, setUnavailable] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stop = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false) }
    preference.addEventListener('change', stop)
    return () => preference.removeEventListener('change', stop)
  }, [])
  return <figure className="meadow"><div className="meadow-picture">
    <img src="/media/farm-poster.jpg" alt="Grass and wildflowers beneath old trees at the edge of a meadow" width="1280" height="720" fetchPriority="high" />
    {playing && !unavailable && <video ref={video} autoPlay muted loop playsInline preload="metadata" poster="/media/farm-poster.jpg" aria-hidden="true" onError={() => { setUnavailable(true); setPlaying(false) }} onLoadedData={() => { video.current?.play().catch(() => setPlaying(false)) }}><source src="/media/farm.mp4" type="video/mp4" /></video>}
    {!unavailable && <button className="motion-control" type="button" onClick={() => setPlaying(value => !value)} aria-label={playing ? 'Pause meadow video' : 'Play meadow video'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? 'Pause' : 'Play'}</button>}
  </div><figcaption><span>A little room to breathe.</span><span aria-hidden="true">01 / Sedes</span></figcaption></figure>
}
function ProjectEntry({ project, compact = false, index }: { project: Project; compact?: boolean; index?: number }) {
  return <article className={`project-entry ${compact ? 'compact' : ''}`}><div className={`project-print print-${project.motif}`}><Botanical motif={project.motif} /></div><div className="project-entry-copy">
    {!compact && <p className="eyebrow">{project.category} / {project.year}</p>}
    <h3><Link href={`/projects/${project.slug}`}>{project.title} <Arrow /></Link></h3><p className="project-summary">{project.summary}</p><p className="project-stack">{project.stack}</p>{!compact && <span className="status">{project.status}</span>}
  </div>{!compact && <span className="entry-number" aria-hidden="true">{String((index ?? 0) + 1).padStart(2, '0')}</span>}</article>
}
function Home() {
  return <><section className="home-hero" aria-labelledby="home-title"><div className="hero-media"><div className="grain-arc" aria-hidden="true" /><Meadow /></div><div className="hero-copy"><p className="eyebrow">Hello, I’m</p><h1 id="home-title">Micah<span className="name-break"> </span>VanEwyk<span className="name-period">.</span></h1><p className="alias">/ {site.alias}</p><p className="hero-description">A developer and IT professional. I build practical software, help people with technology, and make things along the way.</p><Link className="text-link hero-link" href="/projects">View my work <span aria-hidden="true">→</span></Link><p className="hero-location">Based in Southwestern Ontario</p></div></section>
  <section className="featured" aria-labelledby="featured-title"><div className="section-heading"><h2 id="featured-title">What I make</h2><Link className="quiet-link" href="/projects">All projects <span aria-hidden="true">→</span></Link></div><div className="featured-list">{featuredProjects.map(project => <ProjectEntry key={project.slug} project={project} compact />)}</div></section></>
}
function About() {
  return <><div className="page-heading"><p className="eyebrow">A little context</p><h1>About me</h1></div><section className="about-intro"><figure className="about-image"><img src="/media/farm-poster.jpg" width="1280" height="720" alt="Sunlight falling across a quiet meadow" /><figcaption>A place to slow down.</figcaption></figure><div className="prose"><h2>Hello, I’m Micah.</h2><p>I’m a developer and IT professional in Southwestern Ontario. I work on applications, systems and the everyday problems people run into when using them.</p><p>At work, I support technology across five dealerships and a body shop, helping about 210 people. Alongside that support, I’ve been building LotFlow: a way to make vehicle workflows and handoffs easier to follow.</p><p>I graduated from Carleton University’s Information Resource Management program in April 2025, through its joint program with Algonquin College. My work brings together software, information management, documentation and user support.</p><Link className="text-link" href="/projects">See the projects <span aria-hidden="true">→</span></Link></div></section>
  <section className="about-work"><h2>How I work</h2><div className="prose"><p>I start with the problem and the people doing the work. Then I turn that into something they can try, review what breaks, and keep refining it.</p><p>I use AI extensively to help implement software. My responsibility is to set the direction, understand the changes, test the result, and follow through with documentation and support.</p><p>Outside work, I live on a farm. The fields, trees and quiet here are part of the feeling I want this site to have.</p></div></section>
  <section className="about-work"><h2>A seat for the work</h2><div className="prose"><p>Sedes takes its name from <em>Sedes Sapientiae</em>, the Seat of Wisdom. For me, the site is the seat, and the work is what it holds.</p><p>A home for the things I’m making, with enough space to look at them properly.</p><Link className="text-link" href="/notes/sedes-principles">The principles behind Sedes <span aria-hidden="true">→</span></Link></div></section></>
}
function Projects() {
  return <><div className="page-heading"><p className="eyebrow">Professional, personal & university work</p><h1>Projects</h1><p>Things I’ve made, helped make, and am still working on.</p></div><div className="project-index">{projects.map((project, index) => <ProjectEntry key={project.slug} project={project} index={index} />)}</div><p className="index-note">The school projects were shared work. Each write-up makes that distinction.</p></>
}
function ProjectPage({ project }: { project: Project }) {
  const index = projects.indexOf(project)
  const next = projects[(index + 1) % projects.length]
  return <><Link className="back-link" href="/projects"><span aria-hidden="true">←</span> All projects</Link><header className="project-header"><div className={`project-cover print-${project.motif} ${project.image ? 'has-image' : ''}`}>{project.image ? <img src={project.image.src} alt={project.image.alt} loading="lazy" width="1920" height="921" /> : <Botanical motif={project.motif} />}<span className="cover-label" aria-hidden="true">Sedes / Project {String(index + 1).padStart(2, '0')}</span></div><div className="project-header-copy"><p className="eyebrow">{project.type} / {project.status}</p><h1>{project.title}</h1><p className="project-deck">{project.summary}</p><dl className="project-facts"><div><dt>When</dt><dd>{project.year}</dd></div><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Tools</dt><dd>{project.stack}</dd></div></dl>{project.repository && <a className="text-link" href={project.repository}>View source on GitHub <Arrow /></a>}</div></header><div className="project-sections">{project.sections.map(section => <section className="case-section" key={section.title}><h2>{section.title}</h2><div className="prose">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div><div className="next-project"><Link className="quiet-link" href="/projects">Back to the index</Link><Link className="text-link" href={`/projects/${next.slug}`}>Next: {next.title} <span aria-hidden="true">→</span></Link></div></>
}
function Notes() {
  return <><div className="page-heading"><p className="eyebrow">From the desk</p><h1>Notes</h1><p>A few thoughts on what I’m making and how I’m making it.</p></div><article className="note-entry"><time dateTime="2026-09-26">26 Sep 2026</time><div><h2><Link href="/notes/sedes-principles">Sedes principles <Arrow /></Link></h2><p>Three things this site should be: warm, reliable, and recognizably my own.</p></div></article></>
}
function Principles() {
  return <><Link className="back-link" href="/notes"><span aria-hidden="true">←</span> All notes</Link><article className="note-page"><header className="page-heading"><p className="eyebrow"><time dateTime="2026-09-26">26 September 2026</time> / Site notes</p><h1>Sedes principles</h1><p>Three things this site should be: warm, reliable, and recognizably my own.</p></header><div className="prose">{principles.map(principle => <section key={principle.title}><h2>{principle.title}</h2><p>{principle.body}</p></section>)}</div></article></>
}
function Contact() {
  const phone = import.meta.env.VITE_CONTACT_PHONE?.trim()
  return <section className="contact-layout"><div className="contact-print"><Botanical motif="fern" /><p>A conversation starts somewhere.</p></div><div className="contact-copy"><p className="eyebrow">Say hello</p><h1>Contact</h1><p>If something here is useful to you, or you’d like to work on something together, I’d be glad to hear from you.</p><dl className="contact-links"><div><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email} <Arrow /></a></dd></div><div><dt>GitHub</dt><dd><a href={site.github}>@{site.alias} <Arrow /></a></dd></div>{phone && <div><dt>Phone</dt><dd><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone} <Arrow /></a></dd></div>}</dl><p className="contact-location">{site.location}</p></div></section>
}
function NotFound() {
  return <section className="not-found"><Botanical motif="sun" /><p className="eyebrow">404 / A wrong turn</p><h1>Nothing here, yet.</h1><p>Head back home, or take a look at the projects.</p><Link className="text-link" href="/">Back to Sedes <span aria-hidden="true">→</span></Link></section>
}
export function PageRoute({ path }: { path: string }) {
  if (path === '/') return <Home />
  if (path === '/about') return <About />
  if (path === '/projects') return <Projects />
  if (path === '/notes') return <Notes />
  if (path === '/contact') return <Contact />
  if (path === '/notes/sedes-principles') return <Principles />
  const project = projects.find(item => path === `/projects/${item.slug}`)
  return project ? <ProjectPage project={project} /> : <NotFound />
}
