# Sedes handoff

Updated October 5, 2026 (Claude). Replaces the October 4 notes.

## Where things are

- **Repo:** `/Users/micah/VSCProjects/SedesWebsite`, branch `main`, pushed to https://github.com/Fluv42/Sedes (public).
- **Live:** https://sedes.ca and https://www.sedes.ca, served by Cloudflare (Workers static assets; `wrangler.jsonc`). Deploy with `npm run deploy` from this Mac, never from GitHub, because the résumé (`public/resume/`) and the song (`public/media/music/`) are gitignored but must ship. See `docs/hosting.md`.
- `.env.local` (ignored) holds the phone number shown on Contact. While it's shown, every page sends `noindex`.
- `git stash` still holds "Micah starter intro (pre-foundation)"; nothing in it is used.

## How the site works now

- **Time of day** (`src/lib/daypart.ts`, mirrored in the inline script in `index.html`): 5–11 morning, 11–17 day, 17–23 evening, else night. It picks the hero video, the poster, the alt text, the ambient sound, and the theme (dark at night, light otherwise; the toggle lasts until the next load). `?time=` overrides it.
- **Hero** (`Meadow.tsx`): video with a soft radial mask, frosted edges, tint and grain; a 48 × 27 canvas samples each frame for the ambient glow. Videos are crossfade loops built with ffmpeg (sources in `docs/asset-credits.md`).
- **Intro** (`Intro.tsx`): the page starts zoomed in on the video while "Sedes" is drawn; it waits for scroll / ↓ / the arrow, then animates only a transform back to 1. If the browser blocks sound, an "Enable music" button appears and glides onto the hero's Sound button during the pull-back.
- **Sound** (`music.ts`): song via `<audio>`, field recording via Web Audio (gapless loop). Modes: on → muted → music → ambient. Field sound only on the home page. Starts as soon as the browser allows (first click/key otherwise). Dev-only `?blocksound` imitates a blocking browser.
- **Theme** (`theme.ts`): tokens in `index.css`; switching fades colours over 1.5 s.
- Link previews: `public/og-image.jpg` (1200 × 630) and per-page titles/descriptions filled in by `scripts/prerender.mjs`.

## Verified

`npm run check` passes. Checked in the in-app browser (Chromium) at desktop and phone widths, light and dark, all four times of day. Sound start, gesture unlock and the intro hand-off were checked with instrumentation; animations were not watched in real time because the preview pane was often in the background.

Not verified: real iPhone Safari, Firefox, a screen reader pass, how the sound levels actually sound.

## Ideas not built

- Micah's own farm footage in place of the stock clips.
- A photo of Micah on About.
- Notes (a writing section) when there's something to put in it.
