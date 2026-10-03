# Sedes foundation handoff

## Start here

The user asked for the essentials to be built tonight, then finishing touches with Claude on Sunday, October 4, followed by Cloudflare hosting. The target is layout 1 (Home) of the supplied Sedes wireframes. Do not reintroduce the developer’s day.

**Working checkout:** `/Users/micah/.codex/.chatgpt-projects/g-p-6a5984c8f32481919be84c547bcb148e/SedesWebsite`.

This is a copy of `/Users/micah/VSCProjects/SedesWebsite`, preserving its initial commit and Micah's uncommitted starter introduction. The original VSCProjects folder is unchanged because this Codex session cannot write there. The old `/Users/micah/VSCProjects/Sedes` was read only for references and existing licensed assets. Do not accidentally polish either old folder instead of this checkout.

The final changes are committed locally. There is no remote or public GitHub repository yet. Browser access to GitHub was denied, and the available connector did not expose repository creation. Do not claim the site is deployed.

## What is implemented

- Warm paper/sage palette; locally hosted IM Fell English, Source Serif 4 and IBM Plex Mono.
- Framed header/navigation, meadow hero and large name, grain arc, three selected project entries, grass footer.
- Home, About, Projects, eight project details, Notes, one principles note, Contact and 404 recovery.
- Canonical records: LotFlow, Sedes, BeFarmWell, File Disposition Tool, TagMe capstone, LiteReview, BookMarks and retired PMRTool.
- Explicit shared-work attribution for school projects and honest AI-assisted implementation descriptions.
- Original LiteReview screenshot on its case study. Other project artwork is decorative, not simulated application screenshots.
- Desktop/mobile layout rules, keyboard focus styling, skip link, route focus/title updates, browser-history subscriptions, normal modified-link behaviour.
- Muted inline meadow video with pause/play, poster fallback and initial reduced-motion handling. A changed reduced-motion preference stops playback.
- Real email/GitHub contact actions; optional phone value through an ignored environment file.
- Static HTML for all 14 canonical routes, plus custom 404, generated at build time. Content remains available before JavaScript.
- Noindex meta tags and a Cloudflare `_headers` file; no analytics or remote fonts.

## Verification completed

- TypeScript and production build passed.
- ESLint passed after separating route helpers from component exports.
- Seven production-output checks passed: routes and semantic landmarks, all internal links/assets, noindex meta/headers, exactly three featured projects, all eight case studies, 404 recovery and contact/source privacy.
- A local DOM simulation passed for navigation across all eight projects, title and focus, Notes, Contact, About, modified clicks, 404 recovery, play/pause and reduced-motion preferences. It used the already-installed jsdom from PMRtool in an ignored scratch test; it is not part of the dependency graph and did not launch a browser.
- Main text on paper contrast ratios were checked: ink 10.57:1, muted text 5.27:1, rust links 5.59:1. This is not a full accessibility audit.

**Visual QA is still required.** The sandbox denied binding a localhost server (`listen EPERM`), Safari computer control was not approved, and the browser did not allow a file URL. No successful browser render, screenshot, Safari test, mobile viewport measurement or hosted check occurred. Do not confuse the inspected reference/school screenshot with a new screenshot of this foundation.

## Finishing touches

1. Open this checkout in an environment that allows a local preview. Run `npm ci`, then `npm run dev`.
2. Compare Home against the wireframe at desktop and 320/390/640/768 px widths. Check name wrapping, the five-item nav, caption, compact project rows and footer.
3. Check About, Contact, the index, long titles and LiteReview's actual screenshot. Improve visual execution within the existing direction; do not replace it with a different concept.
4. Check iPhone Safari playback and reduced motion, keyboard tab order, route history, direct project links and 404 recovery.
5. Review copy with Micah. Content is sourced in `docs/content-sources.md`; do not invent school responsibilities, released products or workplace numbers. LotFlow rollout is on hold, so retain development status.
6. If feasible, replace stock meadow footage and decorative marks with Micah's own material later. Stock is not his own farm.
7. Run `npm run check` after edits. Then create/push the public repository and follow `docs/hosting.md` when hosting is authorized.

## Phone and publishing

Micah agreed to display his phone only while the site is not indexed. The local `.env.local` is configured in this checkout and ignored by Git. Archives of public source omit it. Never copy the résumé or phone value into the public repository. The website's generated output does contain the number when that variable is set.

The source sets noindex on all routes. Verify the response header on the actual deployment before attaching sedes.ca; noindex does not make the site private. No DNS edits, deployment or purchases were performed.

## Moving back to VSCProjects

Before replacing or merging files, preserve anything Micah changed in the original after this copy was made. The initial base is commit `c7226a8`. This foundation can be merged from the local checkout into the original Git repository, or the source archive can be extracted into a new folder. Avoid overwriting a newly modified original folder without reviewing its diff first.
