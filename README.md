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
2. **Text banner**: a giant line loops sideways on its own like a ticker. Letters are solid on the left and fade out to the right (`src/components/TextBand.tsx`).
3. **Events journey**: the section stays pinned and shows one event at a time in space. Scrolling to the next event fires a hyperspace jump: the stars streak past, the current event flies by and the next one arrives. Scrolling up jumps backwards (`src/components/EventsJourney.tsx`, stars in `src/lib/starfield.ts`).
4. **Warp**: clicking an event plays the fast burst from the space video, then opens the event page (`src/components/Warp.tsx`).

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

This rebuilds the hero loop and the warp clip. Requires `ffmpeg`. The script header explains which frame ranges are used.
