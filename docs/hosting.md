# Publishing later

**Status, Oct 4 2026:** source is public at https://github.com/Fluv42/Sedes. `sedes.ca` already uses Cloudflare nameservers (`ray`/`sharon.ns.cloudflare.com`, registrar CentralNic/Hexonet, expires 2027-07-17) and has no A record yet, so the zone just needs a Pages project attached. Cloudflare Pages is free for this; nothing needs to be bought.

Quick path (Cloudflare dashboard, logged in as Micah): Workers & Pages → Create → Pages → Connect to Git → `Fluv42/Sedes` → framework preset None, build command `npm run build`, output `dist`, env var `NODE_VERSION=22` (and `VITE_CONTACT_PHONE` if the phone should show) → Deploy. Then Custom domains → add `sedes.ca` (and `www.sedes.ca`). Pushing to `main` redeploys.

The foundation generates static files. It does not need a VPS, database, PM2 process, or application server in production.

Cloudflare Pages can build this existing Vite project without changing frameworks:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | Node 22; `.nvmrc` is included |
| Root directory | Repository root |
| Optional build variable | `VITE_CONTACT_PHONE` |

The build produces HTML for Home, About, Projects, eight project pages, Notes, its principles note, Contact, and a custom `404.html`. It also creates private build intermediates under `.ssr`; publish only `dist`.

## Before attaching sedes.ca

1. Complete Claude's visual QA on desktop, a narrow phone and Safari. Re-run `npm run check` after changes.
2. ~~Create the public GitHub repository~~ Done. Never commit `.env.local`, `dist`, `.ssr`, the résumé, or an offline preview containing the phone number.
3. Connect the repository to Cloudflare Pages, use the build settings above, and check a preview deployment.
4. If showing the phone number, set the build variable in the chosen deployment environment. A `VITE_` variable is included in the public output; it is not secret.
5. Check a direct project URL, reload it, navigate back/forward, and test the 404 URL on the hosted site. Known pages should respond successfully and unknown pages should return HTTP 404.
6. Confirm `X-Robots-Tag: noindex, nofollow, noarchive` is actually present on Home, Contact and a project URL. Check the matching meta tag as well. `_headers` is configured for all paths, including the production domain.
7. Attach `sedes.ca` through the hosting dashboard and verify HTTPS and whichever apex/www behaviour Micah chooses.

Do not add a blanket rewrite of every path to `index.html`: the build already produces individual pages and a custom 404. Do not add a `robots.txt` that blocks all crawling, since compliant crawlers must be able to read the noindex instruction.

Noindex asks compliant search engines not to list the site. It does not provide authentication or hide the phone number from visitors. Before later enabling indexing, remove the phone row or get Micah's approval to make it indexable.

No deployment, DNS change, paid service, or account creation has been performed.

`npm run preview` (Vite) falls back to the home page for paths without a trailing slash, which shows a React hydration warning locally on `/notes` etc. Cloudflare serves `notes/index.html` for `/notes`, so this is a local-preview quirk only; `/notes/` previews correctly.

## Official references checked

- [React on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Build image and Node versions](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Serving Pages and headers](https://developers.cloudflare.com/pages/configuration/serving-pages/)
