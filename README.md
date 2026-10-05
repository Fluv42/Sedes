# Sedes

The personal site of Micah VanEwyk, IT specialist and developer in Southwestern Ontario.
Live at **[sedes.ca](https://sedes.ca)**.

The name comes from *Sedes Sapientiae*, the Seat of Wisdom: the site is the seat, and the work is what it holds.

## What's in it

- **A hero that follows the visitor's clock.** One of four field videos plays depending on the local time (a foggy sunrise, sun through trees, wheat at sunset, stars at night), and the site starts in light or dark mode to match. Each video loops seamlessly with a baked-in crossfade.
- **Ambient colour.** A 48 × 27 canvas samples every video frame, blends it into the last, and is blown up and blurred behind the picture, so its colours spill onto the page (like YouTube's ambient mode).
- **An intro that waits.** The page opens zoomed in on the video while "Sedes" is written across it, then pulls back like stepping away from a window when the visitor scrolls or presses the arrow. Only transforms are animated, so it stays smooth.
- **Layered sound.** A song, plus a field recording that matches the time of day (mostly from Niagara-on-the-Lake), played through Web Audio so it loops without a gap. One button steps through on, muted, music only and ambient only.
- **Projects** with a category filter and search, and a write-up for each.
- **Pre-rendered** to static HTML for every route, then hydrated by React, so pages load as plain HTML and work without JavaScript.

## Accessibility and performance

- Respects *reduced motion*: no intro, no smooth scrolling, no autoplaying video, no colour fades.
- Keyboard: skip link, visible focus rings, the hidden page is `inert` during the intro, and every control is a real button with a label.
- Screen readers get a description of whichever video is showing; decorative layers are hidden.
- High-contrast (forced colours) mode gets the system pointer back.
- The hero video pauses when scrolled out of view; the colour glow stops repainting; sound pauses in background tabs.
- Fonts are self-hosted WOFF2 and preloaded; media and fonts are cached at the edge.

## Built with

React 19, TypeScript and Vite, with [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling. No CSS framework: hand-written CSS with colour tokens for light and dark. Set in [Libron](https://github.com/nicoverbruggen/libron) (SIL Open Font License). Hosted on Cloudflare.

## Run it

Node 22.12 or newer (`.nvmrc`).

```sh
npm ci
npm run dev        # http://localhost:5173
npm run check      # lint, type-check, build every route, run the output tests
npm run deploy     # build and upload to Cloudflare (needs `npx wrangler login`)
```

Add `?time=morning`, `day`, `evening` or `night` to any URL to preview another time of day.

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | Words: site details (`site.ts`) and every project write-up (`projects.ts`) |
| `src/pages.tsx` | The pages |
| `src/App.tsx` | Header, footer and page transitions shared by every page |
| `src/components/Meadow.tsx` | The hero video, its soft edges and the ambient colour |
| `src/components/Intro.tsx` | The opening animation |
| `src/lib/music.ts` | The two-layer sound player |
| `src/lib/daypart.ts`, `theme.ts` | Time of day, light and dark |
| `src/index.css`, `src/App.css` | Colour tokens and fonts; layout |
| `scripts/` | Pre-rendering and the build-output tests |
| `docs/` | Hosting, asset credits and licences, and the sources behind each write-up |

## Notes

- The site sends `noindex` while a phone number is on the Contact page (`public/_headers`). The number comes from `VITE_CONTACT_PHONE` in `.env.local` and is never committed.
- The résumé files and the song are deployed with the site but kept out of this repository (`.gitignore`); see `docs/hosting.md`.
- Footage, sound and font credits: `docs/asset-credits.md`.
