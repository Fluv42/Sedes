import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { paths, render } from '../.ssr/entry-server.js'

const root = resolve('dist')
const template = await readFile(resolve(root, 'index.html'), 'utf8')
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
for (const path of [...paths, '/404']) {
  const rendered = render(path)
  const html = template.replace('<div id="root"></div>', `<div id="root">${rendered.html}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${escape(rendered.title)}</title>`)
  const destination = path === '/' ? resolve(root, 'index.html') : path === '/404' ? resolve(root, '404.html') : resolve(root, path.slice(1), 'index.html')
  await mkdir(resolve(destination, '..'), { recursive: true })
  await writeFile(destination, html)
}
console.log(`Pre-rendered ${paths.length} routes and the 404 page.`)
