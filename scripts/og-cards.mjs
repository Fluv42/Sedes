// Writes the list of pages for scripts/og-cards.swift, then runs it to draw each page's
// link-preview card into public/og/. Needs the server build (npm run build) first; macOS only.
import { writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { paths, render } from '../.ssr/entry-server.js'

const pages = paths.map(path => { const { card, description } = render(path); return { description, ...card } })
await writeFile('.ssr/og-pages.json', JSON.stringify(pages))
execFileSync('swift', ['scripts/og-cards.swift', process.cwd()], { stdio: 'inherit' })
