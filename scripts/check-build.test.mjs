import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import test from 'node:test'
import { paths } from '../.ssr/entry-server.js'

const root = resolve('dist')
const pageFile = path => resolve(root, path === '/' ? 'index.html' : `${path.slice(1)}/index.html`)
const pages = await Promise.all(paths.map(async path => ({ path, html: await readFile(pageFile(path), 'utf8') })))

test('every canonical route has usable static content before JavaScript runs', () => {
  assert.equal(pages.length, 12)
  for (const { path, html } of pages) {
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one page heading`)
    assert.match(html, /<main\b[^>]*id="main"/, `${path}: main landmark`)
    assert.match(html, /aria-label="Main navigation"/, `${path}: labelled navigation`)
    assert.match(html, /Skip to content/, `${path}: skip link`)
    assert.match(html, /<title>[^<]+\| Sedes<\/title>/, `${path}: document title`)
  }
})

test('all internal links and referenced media exist in the deployable output', async () => {
  for (const { path, html } of pages) {
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
      const target = match[1]
      const destination = target.includes('.') ? resolve(root, target.slice(1)) : pageFile(target)
      await assert.doesNotReject(access(destination), `${path}: ${target}`)
    }
  }
  for (const file of ['fonts/Libron-Regular.woff2', 'fonts/Libron-Bold.woff2', 'fonts/Libron-Italic.woff2', 'media/farm.mp4']) await assert.doesNotReject(access(resolve(root, file)))
})

test('noindex is present on every page and in Cloudflare response headers', async () => {
  for (const { path, html } of pages) assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive"/, path)
  const notFound = await readFile(resolve(root, '404.html'), 'utf8')
  assert.match(notFound, /noindex, nofollow, noarchive/)
  assert.match(await readFile(resolve(root, '_headers'), 'utf8'), /X-Robots-Tag: noindex, nofollow, noarchive/)
})

test('Home contains exactly three featured projects and a path to the full index', () => {
  const home = pages.find(page => page.path === '/').html
  assert.equal((home.match(/class="work-item"/g) ?? []).length, 3)
  assert.match(home, /href="\/projects"[^>]*>See what I’ve made/)
  for (const slug of ['lotflow', 'server-cleanup', 'sedes']) assert.match(home, new RegExp(`href="/projects/${slug}"`))
})

test('each project detail has its own title, a return link and next-project navigation', () => {
  const details = pages.filter(page => page.path.startsWith('/projects/'))
  assert.equal(details.length, 8)
  const titles = new Set()
  for (const { html } of details) {
    titles.add(html.match(/<title>(.*?)<\/title>/)[1])
    assert.match(html, /class="crumb"><a href="\/projects"/)
    assert.match(html, /class="next-project"/)
    assert.match(html, /class="case-section"/)
  }
  assert.equal(titles.size, details.length)
})

test('the custom not-found page gives visitors a working recovery route', async () => {
  const html = await readFile(resolve(root, '404.html'), 'utf8')
  assert.match(html, /Nothing here, yet/)
  assert.match(html, /Back to Sedes/)
  assert.match(html, /href="\/"/)
})

test('contact links work without a form service and private phone data is not hardcoded', async () => {
  const html = pages.find(page => page.path === '/contact').html
  assert.match(html, /href="mailto:micahvanewyk42@gmail.com"/)
  assert.match(html, /href="https:\/\/github.com\/Fluv42"/)
  for (const file of ['src/content/site.ts', 'src/pages.tsx', '.env.example']) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /\b\d{3}-\d{3}-\d{4}\b/, file)
  }
})
