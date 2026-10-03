# Sedes

Micah VanEwyk’s personal portfolio, built on his existing React, TypeScript and Vite project.

The home page follows the supplied desktop/mobile wireframe: a framed page, meadow on the left and introduction on the right, followed by three selected projects. About, the complete project index, eight case studies, Notes and Contact share the same frame. The developer’s day is intentionally deferred.

## Start locally

Use Node 22.12 or newer (Node 22 is recorded in `.nvmrc`).

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run check
```

This runs lint, TypeScript and production builds, then seven built-output checks for canonical routes, internal links, assets, headings, project navigation, contact links and noindex instructions.

`npm run build` generates static HTML for every route in `dist`, including a custom 404. `.ssr` holds build-time intermediates and is not deployed. The site is a client application with pre-rendered HTML; no production application server is needed. `npm run preview` serves the production output locally when the environment allows a listening socket.

## Edit the content

- `src/content/site.ts`: identity, navigation and the principles note.
- `src/content/projects.ts`: canonical project records, summaries, roles and case-study sections. Home selects three records from this list.
- `src/pages.tsx`: the page components and route selection.
- `src/components/`: internal links and decorative SVGs.
- `src/lib/`: location subscription and page titles.
- `src/App.tsx`: shared frame, navigation, footer, title and focus updates.
- `src/index.css`: local fonts and shared tokens.
- `src/App.css`: layouts, component styles and responsive rules.

## Contact and indexing

The number is optional. Copy `.env.example` to `.env.local` and set `VITE_CONTACT_PHONE` to show a phone row. Keep the value out of the public Git repository. The build embeds it in the public website; it is not secret.

The user authorized the number only while the website is excluded from search indexing. The HTML contains noindex meta tags, and `public/_headers` adds an equivalent response header for Cloudflare. Preserve those instructions until the user changes that decision. Noindex is not access control.

## More context

- `CLAUDE_HANDOFF.md`: what is done, what is blocked, and the remaining visual review.
- `docs/content-sources.md`: evidence and limits for project descriptions.
- `docs/asset-credits.md`: stock footage, course screenshot and local font licenses.
- `docs/hosting.md`: later Cloudflare build and verification settings.

No accounts, tracking scripts, paid services or form backend are required by the foundation.
