# Hosting

Sedes is served by Cloudflare (Workers static assets, the successor to Pages) at
https://sedes.ca and https://www.sedes.ca. Configuration lives in `wrangler.jsonc`.

## Deploying

```
npm run deploy
```

That builds the site and uploads `dist/` with Wrangler. Deploys go from this Mac, not from
GitHub, because two things are deliberately kept out of the public repo but must ship with the
site:

- `public/resume/` (the résumé has a home address and phone number)
- `public/media/music/` (the song is credited on the site but not re-posted publicly)

Wrangler must be signed in (`npx wrangler login`, once). `npx wrangler whoami` checks.

## Notes

- `public/_headers` sends `X-Robots-Tag: noindex` on every page, so search engines don't list
  the site. Remove that line when it should become searchable.
- `html_handling: drop-trailing-slash` serves `/about` from `about/index.html` without a redirect.
- Missing pages get `404.html`.
- The free plan covers this site: static files are served without per-request charges.

## Making the site searchable later

It's hidden from search engines on purpose while the phone number is on the Contact page.
When that should change:

1. Remove `VITE_CONTACT_PHONE` from `.env.local` (the phone row disappears).
2. Delete the `X-Robots-Tag` line in `public/_headers`, and the `robots` and `googlebot` meta
   tags in `index.html`.
3. Update the "noindex" test in `scripts/check-build.test.mjs`, then `npm run check` and
   `npm run deploy`.
4. Optionally add the site to Google Search Console (the domain is already on Cloudflare, so
   verification is a DNS record).
