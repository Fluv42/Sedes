# Sedes handoff

Updated October 4, 2026 (Claude). Supersedes the Codex handoff from October 2.

## Where things are

- **Repo:** `/Users/micah/VSCProjects/SedesWebsite`, branch `main`, pushed to **https://github.com/Fluv42/Sedes** (public, as Micah asked).
- The Codex working copy (`~/.codex/.chatgpt-projects/.../SedesWebsite`) was fast-forwarded into this repo; it is no longer the one to edit.
- Micah's uncommitted starter `App.tsx` intro from before the foundation is kept in `git stash` ("Micah starter intro (pre-foundation)"). Nothing in it is needed; drop it when Micah agrees.
- `.env.local` (ignored) holds the phone number. Never commit it.
- Old project `/Users/micah/VSCProjects/Sedes` is reference only. Its `docs/brief.md` and `docs/decisions.md` are the best statement of what Sedes should feel like. Read them before design work.

## What changed in this pass

Goal: wireframe 1 (Home) done properly, and the "vibe-coded" feel removed.

- **Hero:** the meadow has no frame. It bleeds off the frame's left edge and dissolves into the paper through an organic, noise-displaced mask (`public/media/dissolve.svg`) plus a blurred colour spill behind it. Video fades in over the poster once playing; Pause/Play stays available; reduced motion keeps the still.
- **Arc of grain** (`GrainArc.tsx`): a round-topped window traced in single wheat grains over the picture's top-left corner, grains appearing one by one.
- **Name** is the biggest thing on the page; "Hello, I'm", "/ Fluv42", one line about the work, *View my work*, and the confirmed tagline. Everything else was cut.
- **Current page** gets a hand-drawn rust underline that draws itself (`Squiggle.tsx`).
- **Projects** use sun-print plates (`SunPrint.tsx`): pale botanical silhouettes on tea-toned paper, different tone per motif. Hover warms the plate and tilts it slightly.
- **Footer** is a low line of grass that sways in four clumps (`Grass.tsx`), then © and GitHub · Email.
- **Removed AI tells the brief bans:** uppercase mono eyebrows, numbered entries, "01 / Sedes" captions, cover labels, the colophon, the extra subtitles on every page. Plex Mono is no longer loaded.
- **Pages:** Projects index, project page (crumb, facts list, job/built/wrong/ended sections, next project), About (picture + short first-person prose), Notes, Contact (email large, GitHub, phone), 404.
- **Code:** pages and App rewritten as readable JSX (the Codex version was one-line blobs); CSS rewritten from scratch (~700 lines vs 1,100). Pre-rendered pages now hydrate instead of being thrown away and re-rendered.

## Verified

- `npm run check` passes (lint, TypeScript, build of all 14 routes + 404, 7 output tests).
- Viewed in a real browser at 1440, 1280, 768, 390 and 320 px: no horizontal scroll at 320, nav stays one row, hero stacks on narrow screens.
- Hydration: no errors with the development React build against the pre-rendered pages. (`vite preview` shows one on `/notes` without a trailing slash because it serves the home page there; Cloudflare doesn't. See `docs/hosting.md`.)
- Video autoplays muted, Pause works.

Not verified: real iPhone Safari, Firefox, screen reader pass.

## Next (for Sunday's finishing touches)

1. **Micah's own material** is the biggest remaining upgrade, per the brief's "only Micah could have made it" rule:
   - Replace the Mixkit stock meadow (`public/media/farm.mp4` + poster) with his own ground-level footage of the farm. Keep it ~720p, under 10 MB, 10–20 s loop. Re-export the poster from the first frame.
   - About uses the same stock still. A photo of Micah or his place goes there.
   - Sun prints are drawn SVG stand-ins. Real options: Anna Atkins cyanotypes from the Met's Open Access collection (public domain), Micah's own sun prints, or iPad tracings. Swap them into `SunPrint`.
2. **Copy review with Micah:** hero line ("I build practical software around the way people actually work"), About, each project write-up. Facts are sourced in `docs/content-sources.md`. The wireframe calls the AAFC project "Litigation Server Cleanup Tool"; the site uses the résumé's "File Disposition Tool". Ask which.
3. **Contact on mobile** hides the plate and is a bit bare; fine for now.
4. **Hosting:** see `docs/hosting.md`. `sedes.ca` is already on Cloudflare nameservers; Cloudflare Pages connected to `Fluv42/Sedes` is free and takes about five minutes in the dashboard. Micah needs to do the login. Nothing needs to be bought.
5. Ideas not built, all optional: grass that parts under the cursor; light in the hero shifting with time of day; the developer's day on About (deliberately deferred).
