export type Mark = 'lotflow' | 'server' | 'sedes' | 'screenshot' | 'monogram'
export type Category = 'Work' | 'Personal' | 'University'
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
  category: Category
  repository?: string
  image?: { src: string; alt: string }
  sections: { title: string; paragraphs: string[] }[]
}

// Public summaries only. Private application data and résumé files do not belong here.
// Written plainly, the way I'd explain it out loud. Facts are checked in docs/content-sources.md.
export const projects: Project[] = [
  {
    slug: 'lotflow', title: 'LotFlow', type: 'Web app', year: '2025–present',
    status: 'In development', category: 'Work', mark: 'lotflow',
    summary: 'A shared board that shows where every vehicle is between reconditioning and delivery, and who has it.',
    stack: 'React · TypeScript · Express · SQLite',
    role: 'I plan it, design it, test it and write the guides',
    sections: [
      { title: 'The job', paragraphs: ['Before a car can be sold or handed over, it goes through a few departments. Somewhere along the way it gets hard to tell where it is, what it still needs, and who has it. I wanted one place anyone could look and know.'] },
      { title: 'What I built', paragraphs: ['There’s a Recon board and a Delivery board. Each vehicle has its details, its tasks, who it’s assigned to, and a history of what’s happened to it. People only see the stores and tools their job needs, and there are notifications, a way to send feedback, and some reporting.', 'I work out how it should work and look, read through every change and test it. I also write the guides, built a practice mode for new people, and set up backups.'] },
      { title: 'What I’m learning', paragraphs: ['A board only helps if it matches how people already work. Most of my time goes into making handoffs obvious, keeping it usable on a phone, and making it simple enough that nobody needs a training session to get started.'] },
      { title: 'Where it stands', paragraphs: ['Still in development. Before a pilot I’m checking it against real roles, real devices and real data. A wider rollout hasn’t been decided.'] },
    ],
  },
  {
    slug: 'sedes', title: 'Sedes', type: 'Website', year: '2026–present',
    status: 'In progress', category: 'Personal', mark: 'sedes',
    summary: 'This site. Somewhere to keep what I make, named after Sedes Sapientiae, the Seat of Wisdom.',
    stack: 'React · TypeScript · Vite', role: 'Design, writing and building it',
    sections: [
      { title: 'The idea', paragraphs: ['I wanted somewhere for my work that felt like a place rather than a template: warm and quiet, a bit like home.', 'The name comes from Sedes Sapientiae, the Seat of Wisdom. The site is the seat, and the work is what it holds.'] },
      { title: 'What’s on it', paragraphs: ['A home page, a list of projects with a write-up for each, a bit about me, and a way to reach me. The words live apart from the layout, so I can add things without rebuilding the site.'] },
      { title: 'How it works', paragraphs: [
        'The field at the top follows your clock: a foggy sunrise in the morning, sun through the trees in the afternoon, wheat at sunset in the evening and stars at night, with the site in dark mode overnight. A tiny copy of each video frame is blurred behind the picture so its colour spills onto the page, and a quiet field recording plays under the music, matched to the time of day.',
        'Under that it’s a small React and TypeScript site, pre-rendered to plain HTML so it loads fast and works without JavaScript, then hosted on Cloudflare. It respects reduced-motion settings, works from the keyboard, and pauses video and sound when you can’t see or hear them.',
      ] },
      { title: 'Where it stands', paragraphs: ['Live at sedes.ca. Next comes my own footage from the farm, and more write-ups.'] },
    ],
  },
  {
    slug: 'befarmwell', title: 'BeFarmWell', type: 'Landing page', year: '2026',
    status: 'Prototype', category: 'Personal', mark: 'monogram',
    summary: 'A landing page prototype for a farm wellbeing app.',
    stack: 'React · TypeScript · Vite', role: 'Design, building it, and handing it over',
    sections: [
      { title: 'The job', paragraphs: ['The app needed a simple page that says what it is and sends people to download it, using the photos they already had.'] },
      { title: 'What I built', paragraphs: ['A page that works on phones and computers, with all the words kept in one file so they’re easy to change, and a button through to the App Store. The version I handed over was iPhone only; Android wasn’t ready yet.'] },
      { title: 'The handoff', paragraphs: ['I left notes and hosting instructions in the project, so whoever picks it up next can make changes without needing me.'] },
      { title: 'Where it stands', paragraphs: ['It’s a prototype of the landing page only. The app itself is a separate thing.'] },
    ],
  },
  {
    slug: 'server-cleanup', title: 'Litigation Server Cleanup Tool', type: 'Desktop app', year: '2024–2025',
    status: 'Done', category: 'Work', mark: 'server',
    summary: 'A desktop tool that helped clear about 2.2 TB of old files off a server, with a record of everything removed.',
    stack: 'Python · PyQt5 · Excel', role: 'My idea; I designed it, built it, wrote the guides and showed people how to use it',
    sections: [
      { title: 'The job', paragraphs: ['In my information management job at Agriculture and Agri-Food Canada there was an old server full of files nobody needed. Going through them one at a time would have taken forever, and anything deleted had to follow an approved process and be written down.'] },
      { title: 'What I built', paragraphs: ['It started as a PowerShell script. I rebuilt it in Python as a proper desktop app: point it at a folder, it sorts the files into Delete or Verify, and anything marked Verify needs a person’s initials before it goes.', 'Every removal is logged to an Excel sheet with the file’s name, location, type, size, date and who checked it. I packaged it as a normal Windows program, wrote a guide and training material, and demoed it to supervisors and the people who’d be using it.'] },
      { title: 'What went wrong', paragraphs: ['It worked on my machine and then didn’t on the server. There was no Recycle Bin to fall back on, and everyone had the shared drive mapped to a different letter. I had to build for how other people’s computers were set up, not how mine was.'] },
      { title: 'How I fixed it', paragraphs: ['Instead of deleting files outright, the tool moves them to a separate folder that works as its own recycle bin. If something was removed by mistake, it can be put back.'] },
      { title: 'How it ended', paragraphs: ['The approved cleanup took off about 1.7 TB in the first pass and roughly 2.2 TB in total after more review. I left behind guides for using it, teaching it, and eventually retiring it.'] },
    ],
  },
  {
    slug: 'tagme', title: 'TagMe (capstone)', type: 'Team website', year: '2024–2025',
    status: 'Class project', category: 'University', mark: 'monogram',
    summary: 'My capstone: a team-built site for tagging, saving and talking about items from the Library of Congress catalogue.',
    stack: 'Python · Django · SQLite · HTML · CSS', role: 'One of the team; I worked on the interface and the database',
    repository: 'https://github.com/jessicadpo/capstone',
    sections: [
      { title: 'The project', paragraphs: ['My university capstone, built in Django with a team. People could tag items from the Library of Congress catalogue, publicly or privately, pin the ones they liked and comment on them.'] },
      { title: 'What’s in it', paragraphs: ['Item records, user profiles, points and reward titles for taking part, and a way to report bad tags.'] },
      { title: 'Working as a team', paragraphs: ['This was shared work. We used task branches, pull requests and reviews before anything was merged.'] },
      { title: 'My part', paragraphs: ['I worked on the interface and on fixing problems with the database and profile pages. The repository shows everyone’s contributions.'] },
    ],
  },
  {
    slug: 'litereview', title: 'LiteReview', type: 'Team website', year: '2024',
    status: 'Class project', category: 'University', mark: 'screenshot',
    summary: 'A team project for tracking, rating and reviewing books, films, TV and music in one place.',
    stack: 'Python · Django · HTML · CSS · JavaScript', role: 'One of the team; I built the review pop-up and worked on the database',
    repository: 'https://github.com/jessicadpo/LiteReview',
    image: { src: '/media/litereview-home.png', alt: 'The original LiteReview home page, with film, television, book and music icons' },
    sections: [
      { title: 'The idea', paragraphs: ['Built with a team for IRM 3004. Instead of one site for books and another for films, LiteReview kept everything you read, watch or listen to in one place.'] },
      { title: 'What we built', paragraphs: ['Sign-up and login, profiles, writing reviews, and a feed of recent ones, using Django templates with a little JavaScript for the forms.'] },
      { title: 'How we worked', paragraphs: ['It was a Git and Scrum class, so we worked in sprints with goals and a definition of done. We kept the backlog in Jira, broke the work into user stories, and estimated each one in story points when we planned a sprint. The README is honest about what got finished and what didn’t.'] },
      { title: 'My part', paragraphs: ['I built the review pop-up and worked through getting the database set up. The rest was the whole team.'] },
    ],
  },
  {
    slug: 'bookmarks', title: 'BookMarks', type: 'Website', year: '2024',
    status: 'Class project', category: 'University', mark: 'monogram',
    summary: 'A library website prototype that rewards reading with points and prizes.',
    stack: 'Python · Django · HTML · CSS', role: 'Coursework for IRM 3007',
    sections: [
      { title: 'The project', paragraphs: ['A website made for IRM 3007 in Django: a library catalogue, accounts, settings and a contact page.'] },
      { title: 'The idea', paragraphs: ['Get people borrowing more from the Ottawa Public Library by letting them earn points for it. Rewards were grouped by age, for kids, adults and seniors, and several rewards pages had French versions too.'] },
      { title: 'Where it stands', paragraphs: ['It was a class prototype, never a real library service. The code is saved on my computer.'] },
    ],
  },
  {
    slug: 'pmrtool', title: 'PMRTool', type: 'Internal tool', year: 'Before LotFlow',
    status: 'Retired', category: 'Work', mark: 'monogram',
    summary: 'An earlier vehicle appraisal tool I worked on before LotFlow.',
    stack: 'React · TypeScript', role: 'Built for use inside the company',
    sections: [
      { title: 'The project', paragraphs: ['Before LotFlow, I worked on PMRTool, a tool for appraising vehicles at work.'] },
      { title: 'What came next', paragraphs: ['It was retired. These days that time goes into LotFlow.'] },
      { title: 'Why it’s here', paragraphs: ['It’s part of how I got here, so it keeps a spot on the list, even though it isn’t in use.'] },
    ],
  },
]

export const categories: Category[] = ['Work', 'Personal', 'University']

export const featuredProjects = ['lotflow', 'server-cleanup', 'sedes'].map(
  slug => projects.find(project => project.slug === slug)!,
)
