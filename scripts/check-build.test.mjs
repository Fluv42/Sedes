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
  for (const file of ['fonts/Libron-Regular.woff2', 'fonts/Libron-Bold.woff2', 'fonts/Libron-Italic.woff2', 'media/field-morning.mp4', 'media/field-day.mp4', 'media/field-sunset.mp4', 'media/field-night.mp4']) await assert.doesNotReject(access(resolve(root, file)))
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
  assert.match(home, /href="\/projects"[^>]*>full list/)
  assert.match(home, /href="\/about"[^>]*>About me/)
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

test('every page has its own link-preview title, description, address and image', async () => {
  const descriptions = new Set()
  const images = new Set()
  for (const { path, html } of pages) {
    const url = `https://sedes.ca${path === '/' ? '/' : path}`
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}"`), `${path}: canonical`)
    assert.match(html, new RegExp(`<meta property="og:url" content="${url}"`), `${path}: og:url`)
    assert.match(html, /<meta property="og:title" content="[^"]+\| Sedes"/, `${path}: og:title`)
    const image = html.match(/<meta property="og:image" content="https:\/\/sedes\.ca\/(og\/[a-z-]+\.jpg)"/)
    assert.ok(image, `${path}: og:image`)
    await assert.doesNotReject(access(resolve(root, image[1])), `${path}: ${image[1]} exists`)
    images.add(image[1])
    descriptions.add(html.match(/<meta name="description" content="([^"]+)"/)[1])
  }
  assert.equal(descriptions.size, pages.length, 'each page describes itself')
  assert.equal(images.size, pages.length, 'each page has its own preview card')
  for (const file of ['og-image.jpg', 'apple-touch-icon.png']) await assert.doesNotReject(access(resolve(root, file)))
})

test('the theme and time of day are set before the page paints', async () => {
  const html = pages.find(page => page.path === '/').html
  const head = html.slice(0, html.indexOf('</head>'))
  assert.match(head, /data-daypart/)
  assert.match(head, /data-theme', daypart === 'night' \? 'dark' : 'light'/)
})

test('the résumé is offered on About and Contact in both formats', () => {
  for (const path of ['/about', '/contact']) {
    const html = pages.find(page => page.path === path).html
    assert.match(html, /href="\/resume\/Micah-VanEwyk-Resume\.pdf"/, `${path}: PDF`)
    assert.match(html, /href="\/resume\/Micah-VanEwyk-Resume\.docx"/, `${path}: Word`)
  }
})

test('the security policy allows the inline head script by its fingerprint', async () => {
  const headers = await readFile(resolve(root, '_headers'), 'utf8')
  assert.doesNotMatch(headers, /INLINE_SCRIPT_HASHES/)
  assert.match(headers, /Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-[A-Za-z0-9+/=]+'/)
  assert.match(headers, /Strict-Transport-Security: max-age=\d+/)
  await assert.doesNotReject(access(resolve(root, '.well-known/security.txt')))
})
