# Asset credits

- Hero videos and posters, both under the Pexels License (free to use, no credit required), 720p, trimmed (morning to 62 s, evening to its full 50 s, day 54 s) and re-encoded so the last 2 s crossfade into the start (ffmpeg `xfade`), giving seamless loops of about a minute; posters taken at 1 s. Untrimmed originals are on Pexels. Chosen by the visitor's clock: 5:00–11:00 morning, 11:00–17:00 day, 17:00–23:00 evening, otherwise night. Stock footage, not Micah's own farm; replace with his own footage when available and don't describe it as a personal photograph.
  - Morning: `field-morning.mp4`, [A sunrise over a field with fog, Pexels #27247582](https://www.pexels.com/video/a-sunrise-over-a-field-with-fog-27247582/)
  - Day: `field-day.mp4`, [Landscape nature sunset summer, Pexels #28291393](https://www.pexels.com/video/landscape-nature-sunset-summer-28291393/), 540p (lots of moving leaves), 52 s loop
  - Night: `field-night.mp4`, [The night sky with stars and trees in the distance, Pexels #25649447](https://www.pexels.com/video/the-night-sky-with-stars-and-trees-in-the-distance-25649447/), a timelapse slowed to 1.6× its length (frame blending) for a 57 s loop
  - Evening: `field-sunset.mp4`, [Vibrant sunset over lush wheat field landscape, Pexels #32548262](https://www.pexels.com/video/vibrant-sunset-over-lush-wheat-field-landscape-32548262/)
- More hero clips, three for each part of the day, one a day in turn (the cycle repeats every three days; days turn over at 5:00). Same licence and treatment (720p, a 2 s crossfade loop; 3 s for the drifting clouds), October 2026:
  - Morning 2: `field-morning-2.mp4`, [Pexels #18089236](https://www.pexels.com/video/18089236/), the first 51 s, a 49 s loop
  - Morning 3: `field-morning-3.mp4`, [Pexels #28972729](https://www.pexels.com/video/28972729/), the first 47.5 s, a 45.5 s loop
  - Day 2: `field-day-2.mp4`, [Pexels #33743576](https://www.pexels.com/video/33743576/), the first 60.5 s, a 58.5 s loop
  - Day 3: `field-day-3.mp4`, [Pexels #36718371](https://www.pexels.com/video/36718371/), the first 62 s, a 60 s loop (replaced a sped-up cloud shot)
  - Evening 2: `field-sunset-2.mp4`, [Pexels #17422808](https://www.pexels.com/video/17422808/), the first 60 s, a 58 s loop
  - Evening 3: `field-sunset-3.mp4`, [Pexels #27496045](https://www.pexels.com/video/27496045/), the first 44 s slowed to 1.3× (frame blending), a 54 s loop
  - Night 2: `field-night-2.mp4`, [Pexels #20603938](https://www.pexels.com/video/20603938/), a timelapse slowed to 1.45× (frame blending), a 57 s loop
  - Night 3: `field-night-3.mp4`, [Pexels #25650512](https://www.pexels.com/video/25650512/), a 15 fps timelapse blended up to 30 fps, a 58 s loop
- LiteReview screenshot: original `screenshots/homepage-logged-out.png`, preserved locally and published in the team repository README. Used to document the team course project, with team attribution in the case study.
- Botanical marks and favicon: small decorative SVGs written for this foundation. They are illustrations, not screenshots of the projects or Micah's own hand-drawn artwork.
- Libron v0.25 by Nico Verbruggen (github.com/nicoverbruggen/libron), derived from Readerly and Newsreader. SIL Open Font License 1.1; the licence is kept at `public/fonts/libron-LICENSE.txt`. Web (WOFF2) files from the official release.

No remote font service, analytics, external image runtime, generated social card or paid asset service is required.

- Not-found page one-liners (`src/content/quips.ts`): a selection from [funnies by Ryan Gaus](https://github.com/1egoman/funnies), MIT License.
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

One more for each of the extra hero clips (October 2026), chosen to sound like the picture, same
licence and treatment; the short ones loop sooner (25–35 s):

- Morning 2 (mist and sunbeams through trees), `morning-2.m4a`: [Avon dawn chorus](https://pixabay.com/sound-effects/avon-dawn-chorus-26592/)
- Morning 3 (sunrise over a misty field), `morning-3.m4a`: [Morning breeze and birds](https://pixabay.com/sound-effects/morning-breeze-and-birds-35105/)
- Day 2 (a sunny lawn and trees), `day-2.m4a`: [Birds, insects, breeze by DBSound](https://pixabay.com/sound-effects/birds-insects-breeze-596116/), from 0:20
- Day 3 (trees along a field), `day-3.m4a`: [Wind rustling grass by Dragon Studio](https://pixabay.com/sound-effects/wind-rustling-grass-339094/)
- Evening 2 (grasses against the setting sun), `evening-2.m4a`: [Evening crickets and birds with cuckoo, part 1, by Eryliaa](https://pixabay.com/sound-effects/evening-crickets-and-birds-with-cuckoo-part-1-445151/), from 0:30
- Evening 3 (clouds over farm fields), `evening-3.m4a`: [Blackbird evening](https://pixabay.com/sound-effects/blackbird-evening-64822/)
- Night 2 (moonlit trees), `night-2.m4a`: [Countryside night ambience by Alex Jauk](https://pixabay.com/sound-effects/countryside-night-ambience-234022/)
- Night 3 (the Milky Way), `night-3.m4a`: [Night atmosphere with crickets by Schorsch1964](https://pixabay.com/sound-effects/night-atmosphere-with-crickets-374652/), from 0:10

Unlike the song, these are committed: their licence allows redistribution.
