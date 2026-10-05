# Asset credits

- Hero videos and posters, both under the Pexels License (free to use, no credit required), 720p, trimmed (morning to 62 s, evening to its full 50 s, day 54 s) and re-encoded so the last 2 s crossfade into the start (ffmpeg `xfade`), giving seamless loops of about a minute; posters taken at 1 s. Untrimmed originals are on Pexels. Chosen by the visitor's clock: 5:00–11:00 morning, 11:00–17:00 day, 17:00–23:00 evening, otherwise night. Stock footage, not Micah's own farm; replace with his own footage when available and don't describe it as a personal photograph.
  - Morning: `field-morning.mp4`, [A sunrise over a field with fog, Pexels #27247582](https://www.pexels.com/video/a-sunrise-over-a-field-with-fog-27247582/)
  - Day: `field-day.mp4`, [Landscape nature sunset summer, Pexels #28291393](https://www.pexels.com/video/landscape-nature-sunset-summer-28291393/), 540p (lots of moving leaves), 52 s loop
  - Night: `field-night.mp4`, [The night sky with stars and trees in the distance, Pexels #25649447](https://www.pexels.com/video/the-night-sky-with-stars-and-trees-in-the-distance-25649447/), a timelapse slowed to 1.6× its length (frame blending) for a 57 s loop
  - Evening: `field-sunset.mp4`, [Vibrant sunset over lush wheat field landscape, Pexels #32548262](https://www.pexels.com/video/vibrant-sunset-over-lush-wheat-field-landscape-32548262/)
- LiteReview screenshot: original `screenshots/homepage-logged-out.png`, preserved locally and published in the team repository README. Used to document the team course project, with team attribution in the case study.
- Botanical marks and favicon: small decorative SVGs written for this foundation. They are illustrations, not screenshots of the projects or Micah's own hand-drawn artwork.
- Libron v0.25 by Nico Verbruggen (github.com/nicoverbruggen/libron), derived from Readerly and Newsreader. SIL Open Font License 1.1; the licence is kept at `public/fonts/libron-LICENSE.txt`. Web (WOFF2) files from the official release.

No remote font service, analytics, external image runtime, generated social card or paid asset service is required.

- LotFlow app icon and logo: Micah's own LotFlow logo pack (October 2026), `public/media/lotflow/`.

## Ambient sound

Field recordings under the music, chosen by the same clock as the hero video (`src/lib/daypart.ts`).
All from Pixabay under the Pixabay Content License (free to use, no credit required). Each is a
75 s piece levelled to about −26 LUFS, with its last 2 s crossfaded into its start (ffmpeg
`acrossfade`) so it loops without a seam. AAC 96 kbps stereo, about 0.9 MB each.

- Morning, `public/media/ambience/morning.m4a`: [Summer mid morning birds dove robin goldfinch NOTL 190705](https://pixabay.com/sound-effects/nature-summer-mid-morning-birds-dove-robin-goldfinch-notl-190705-25866/) (Niagara-on-the-Lake, Ontario), from 0:20
- Day, `day.m4a`: [Meadow field summer insects birds NOTL 190716](https://pixabay.com/sound-effects/nature-meadow-field-summer-insects-birds-notl-190716-57929/) (Niagara-on-the-Lake), from 0:10
- Evening, `evening.m4a`: [Evening Crickets with Birds, Soft Wind and Insects by Eryliaa](https://pixabay.com/sound-effects/nature-evening-crickets-with-birds-soft-wind-and-insects-445149/), from 0:30
- Night, `night.m4a`: [Night, insects, not too thick, distant cars, NOTL 01](https://pixabay.com/sound-effects/nature-night-insects-not-too-thick-distant-cars-notl-01-17134/) (Niagara-on-the-Lake), from 0:30

Unlike the song, these are committed: their licence allows redistribution.
