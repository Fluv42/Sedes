export type Mark = 'lotflow' | 'server' | 'sedes' | 'screenshot' | 'monogram'
export type Project = {
  slug: string
  title: string
  type: string
  year: string
  status: string
  summary: string
  stack: string
  role: string
  mark: Mark
  category: 'Professional' | 'Personal' | 'University'
  repository?: string
  image?: { src: string; alt: string }
  sections: { title: string; paragraphs: string[] }[]
}

// Public summaries only. Private application data and résumé files do not belong here.
export const projects: Project[] = [
  {
    slug: 'lotflow', title: 'LotFlow', type: 'Web application', year: '2025–present',
    status: 'In development', category: 'Professional', mark: 'lotflow',
    summary: 'A vehicle workflow app that brings reconditioning and delivery handoffs into one place.',
    stack: 'React · TypeScript · Express · SQLite',
    role: 'Product design, AI-assisted development, testing and rollout preparation',
    sections: [
      { title: 'The job', paragraphs: ['A vehicle passes through several departments before it is ready for sale or delivery. I wanted a clearer way for people to see where it was, what it needed next, and who was working on it.'] },
      { title: 'What I built', paragraphs: ['LotFlow has separate Recon and Delivery boards, with vehicle details, tasks, assignments and activity history. Store and role permissions keep people in the right workspace, while feedback, notifications and reporting support the day-to-day work.', 'I design the experience, direct AI-assisted implementation, review changes and test the workflows. Documentation, a guided practice flow, and backup and recovery processes are part of the same work.'] },
      { title: 'What I’m learning', paragraphs: ['A board is only useful if it matches how staff work. Much of the development has been about making handoffs clearer, keeping the interface usable on phones, and helping people get started without a long explanation.'] },
      { title: 'Where it stands', paragraphs: ['The application is in development. Pilot preparation includes checking real roles, devices, stored data and staff workflows. A wider rollout has not been confirmed.'] },
    ],
  },
  {
    slug: 'sedes', title: 'Sedes', type: 'Personal website', year: '2026–present',
    status: 'In progress', category: 'Personal', mark: 'sedes',
    summary: 'This site: a settled place for my projects, notes and the things I’m making.',
    stack: 'React · TypeScript · Vite', role: 'Direction, content and AI-assisted development',
    sections: [
      { title: 'The idea', paragraphs: ['I wanted a home for my work that felt like somewhere I would spend time. Sedes is built around warmth, reliability and originality, with enough room for the projects to speak for themselves.'] },
      { title: 'What I’m building', paragraphs: ['A simple home page, a single project index, individual project write-ups, notes, and a way to get in touch. The content lives separately from the layout so I can keep it current without redesigning the whole site.'] },
      { title: 'How it’s made', paragraphs: ['I set the direction and review the result, using AI to help with implementation. The foundation is a small React and TypeScript application, with local typefaces and straightforward navigation.'] },
      { title: 'Where it stands', paragraphs: ['The foundation is being built now. The next step is to refine the visual details and publish it at sedes.ca.'] },
    ],
  },
  {
    slug: 'befarmwell', title: 'BeFarmWell', type: 'Landing page prototype', year: '2026',
    status: 'Prototype', category: 'Personal', mark: 'monogram',
    summary: 'A responsive landing page prototype for a farming wellbeing app.',
    stack: 'React · TypeScript · Vite', role: 'Direction, AI-assisted implementation and handoff',
    sections: [
      { title: 'The job', paragraphs: ['Create a clear landing page for an app, with supplied imagery and simple pathways to the appropriate mobile platform.'] },
      { title: 'What I built', paragraphs: ['I directed AI-assisted development of a responsive prototype with centralized content, supplied imagery, and an iOS App Store pathway. The handoff version was iOS-only; Android was left out pending availability.'] },
      { title: 'The handoff', paragraphs: ['The repository includes local handoff documentation and hosting instructions so a future maintainer can update the content without reconstructing the development session.'] },
      { title: 'Where it stands', paragraphs: ['This is a landing page prototype. It is separate from the underlying mobile application.'] },
    ],
  },
  {
    slug: 'server-cleanup', title: 'Litigation Server Cleanup Tool', type: 'Desktop application', year: '2024–2025',
    status: 'Completed', category: 'Professional', mark: 'server',
    summary: 'A guided file-review workflow that supported the approved removal of about 2.2 TB of server data.',
    stack: 'Python · PyQt5 · Excel audit logs', role: 'Proposal, design, implementation, documentation and demonstrations',
    sections: [
      { title: 'The job', paragraphs: ['During my information management co-op, I worked on a large server backlog. Reviewing it file by file was slow, and any disposition needed to follow an approved process with a record of what happened.'] },
      { title: 'What I built', paragraphs: ['I started with a PowerShell script and rebuilt it as a Python desktop application. It scanned folders, classified files into Delete or Verify groups, and asked for reviewer initials where a person needed to check the file.', 'An Excel audit log recorded the file, location, type, size, date and reviewer. I packaged the application for Windows, wrote operating and training material, and demonstrated it to supervisors and key employees.'] },
      { title: 'What went wrong', paragraphs: ['The server did not behave like my local machine: a Recycle Bin approach did not carry over, and coworkers had different drive mappings. I had to account for the real deployment environment rather than assume everyone’s setup matched mine.'] },
      { title: 'How it ended', paragraphs: ['The approved production disposition removed about 1.7 TB initially and roughly 2.2 TB in total after further review. I left documentation for operation, training and eventual retirement of the application.'] },
    ],
  },
  {
    slug: 'tagme', title: 'TagMe (capstone)', type: 'University team project', year: '2024–2025',
    status: 'Course project', category: 'University', mark: 'monogram',
    summary: 'A Django project for tagging, saving and discussing items from the Library of Congress catalogue.',
    stack: 'Python · Django · SQLite · HTML · CSS', role: 'Team contributor · interface and database work',
    repository: 'https://github.com/jessicadpo/capstone',
    sections: [
      { title: 'The project', paragraphs: ['My university capstone was a team-built Django application. Its data model connects Library of Congress items with user contributions, making room for public and private tags, pinned items and comments.'] },
      { title: 'What the application includes', paragraphs: ['The repository includes catalogue item records, user profiles, points and reward titles, and a reporting workflow for tags. A relational model connects items, tags and user contributions.'] },
      { title: 'Working as a team', paragraphs: ['This was shared work, rather than a solo application. The repository documents task branches, pull requests, peer review, and checks before merging.'] },
      { title: 'The record', paragraphs: ['The source repository is linked here as the record of the project. My coursework included interface work and debugging database and profile behaviour. The repository keeps the broader team contribution visible.'] },
    ],
  },
  {
    slug: 'litereview', title: 'LiteReview', type: 'University team project', year: '2024',
    status: 'Course project', category: 'University', mark: 'screenshot',
    summary: 'A shared place to track, rate and review books, films, television and music.',
    stack: 'Python · Django · HTML · CSS · JavaScript', role: 'Team contributor · review interface and database work',
    repository: 'https://github.com/jessicadpo/LiteReview',
    image: { src: '/media/litereview-home.png', alt: 'The original LiteReview home page, with film, television, book and music icons' },
    sections: [
      { title: 'The idea', paragraphs: ['Built with a team for IRM 3004, LiteReview brought different kinds of entertainment into one review application, rather than limiting the site to books or films.'] },
      { title: 'What we built', paragraphs: ['The repository documents account creation and login, user profiles, review creation, and a feed of recent reviews. The interface combines Django templates with JavaScript for account and review forms.'] },
      { title: 'The process', paragraphs: ['This was a Git and Scrum class project, with sprint goals, a definition of done, and recorded progress. The source README also distinguishes completed features from work that was still planned.'] },
      { title: 'The record', paragraphs: ['The source and sprint screenshots are available in the team repository. My work included the review-modal interface and working through database setup. The complete application was a team effort.'] },
    ],
  },
  {
    slug: 'bookmarks', title: 'BookMarks', type: 'University project', year: '2024',
    status: 'Course project', category: 'University', mark: 'monogram',
    summary: 'A Django library website prototype that encourages reading through points and age-based rewards.',
    stack: 'Python · Django · HTML · CSS', role: 'University coursework · IRM 3007',
    sections: [
      { title: 'The project', paragraphs: ['BookMarks was a website project for IRM 3007. The local project includes a library catalogue, account access, settings and contact pages.'] },
      { title: 'What’s in the prototype', paragraphs: ['The concept was designed around encouraging Ottawa Public Library book rentals through points and rewards. The rewards section groups prizes by age, with pages for children, adults and seniors. The templates also include French versions of several rewards pages.'] },
      { title: 'My work', paragraphs: ['The project documentation describes the rewards section as a way for users to exchange participation and book-rental activity for items or experiences. I’m reviewing the original coursework before adding a more detailed account of my role.'] },
      { title: 'The record', paragraphs: ['The source is preserved locally. This page describes the coursework prototype; it is not presented as a live library service.'] },
    ],
  },
  {
    slug: 'pmrtool', title: 'PMRTool', type: 'Internal application', year: 'Before LotFlow',
    status: 'Retired', category: 'Professional', mark: 'monogram',
    summary: 'An earlier vehicle appraisal project that preceded my work on LotFlow.',
    stack: 'React · TypeScript', role: 'Internal application development',
    sections: [
      { title: 'The project', paragraphs: ['PMRTool was an earlier internal vehicle appraisal project. It is part of the history of my dealership application work.'] },
      { title: 'What came next', paragraphs: ['The appraisal product was retired. My current work is focused on LotFlow and the reconditioning and delivery workflows.'] },
      { title: 'The record', paragraphs: ['I’m keeping this entry in the index so the earlier work has a place, without presenting it as an active product.'] },
    ],
  },
]

export const featuredProjects = ['lotflow', 'server-cleanup', 'sedes'].map(
  slug => projects.find(project => project.slug === slug)!,
)
