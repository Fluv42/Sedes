# Sedes

My home for everything that I make. Built with React, TypeScript and Vite, pre-rendered to static HTML, and headed for [sedes.ca](https://sedes.ca).

The name comes from *Sedes Sapientiae*, the Seat of Wisdom: the site is the seat, and the work is what it holds.

## Run it

Node 22.12 or newer (`.nvmrc` says 22).

```sh
npm ci
npm run dev
```

`npm run check` lints, builds every route to `dist/`, and runs the built-output tests (routes, links, assets, noindex, contact). Only `dist/` is deployed; `.ssr/` is a build intermediate.

## Where things live

- `src/content/site.ts`: name, tagline, contact, navigation, the principles note.
- `src/content/projects.ts`: every project and its write-up. Home features three of them.
- `src/pages.tsx`: the pages.
- `src/App.tsx`: the frame, navigation and footer shared by every page.
- `src/components/`: the meadow picture, grain arc, sun-print plates, grass, nav underline.
- `src/index.css`: fonts and colour tokens. `src/App.css`: layout.
- `public/media/`: the meadow footage and poster, the dissolve mask, project images.

## Contact and indexing

A phone row appears only when `VITE_CONTACT_PHONE` is set (in `.env.local` or the host's build settings). It is never committed. While the phone is shown, the site stays out of search engines: every page has a noindex meta tag and `public/_headers` sends the matching header on Cloudflare.

## More

- `CLAUDE_HANDOFF.md`: current state and next steps.
- `docs/content-sources.md`: what each project description is based on.
- `docs/asset-credits.md`: footage, screenshot and font licences.
- `docs/hosting.md`: Cloudflare Pages settings and launch checklist.
