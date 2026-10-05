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
