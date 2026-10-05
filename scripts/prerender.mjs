import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { paths, render } from '../.ssr/entry-server.js'

const root = resolve('dist')
const template = await readFile(resolve(root, 'index.html'), 'utf8')
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
for (const path of [...paths, '/404']) {
  const rendered = render(path)
  const url = `https://sedes.ca${path === '/' || path === '/404' ? '/' : path}`
  const title = escape(rendered.title)
  const description = escape(rendered.description)
  const html = template.replace('<div id="root"></div>', `<div id="root">${rendered.html}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    // Each page's own preview card (npm run og draws them); the 404 page uses the home page's.
    .replace(/(<meta property="og:image" content=")[^"]*/, `$1https://sedes.ca/og/${rendered.card.file === '404' ? 'home' : rendered.card.file}.jpg`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*/, `$1${escape(`${rendered.card.title}, on Sedes: the Sedes logo beside a wheat field at sunset`)}`)
  const destination = path === '/' ? resolve(root, 'index.html') : path === '/404' ? resolve(root, '404.html') : resolve(root, path.slice(1), 'index.html')
  await mkdir(resolve(destination, '..'), { recursive: true })
  await writeFile(destination, html)
}
// The Content-Security-Policy in _headers allows exactly the inline scripts in the page template.
const hashes = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`)
const headersFile = resolve(root, '_headers')
const headers = await readFile(headersFile, 'utf8')
if (!headers.includes('INLINE_SCRIPT_HASHES')) throw new Error('_headers is missing the INLINE_SCRIPT_HASHES placeholder')
await writeFile(headersFile, headers.replace('INLINE_SCRIPT_HASHES', hashes.join(' ')))

console.log(`Pre-rendered ${paths.length} routes and the 404 page.`)
