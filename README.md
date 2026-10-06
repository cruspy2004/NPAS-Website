# NPAS Website

Website for the NUST Physics and Astronomy Society. Built with Next.js (App Router), Tailwind CSS and Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Deploys to Vercel with no extra settings.

## How the home page works

1. **Hero**: a looping space video (`public/video/hero.*`).
2. **Text band**: a giant line slides left as you scroll and lights up character by character (`src/components/TextBand.tsx`).
3. **Rocket scroll**: the section stays pinned while scrolling scrubs through the space video, frame by frame (`public/sequence/`). The event list sits on the left and the card on the right follows the active event (`src/components/RocketScroll.tsx`).
4. **Warp**: clicking an event plays the fast burst from the video, then opens the event page (`src/components/Warp.tsx`).

## Editing content

| What | Where |
| --- | --- |
| Events (title, date, venue, text, registration link, photos) | `src/data/events.ts` |
| Register link, email, socials, stats | `src/lib/site.ts` |
| Logo | `Logo` in `src/components/Nav.tsx` |

Search the code for `TODO` to find every placeholder that needs real content before launch.

Event photos go in `public/events/<slug>/` and are listed in that event's `photos` array. The first photo becomes the cover; the rest form the gallery.

## Replacing the video

```bash
scripts/make-media.sh path/to/new-video.mp4
```

This rebuilds the hero loop, the warp clip and the scroll frames. Requires `ffmpeg`. The script header explains which frame ranges are used.
