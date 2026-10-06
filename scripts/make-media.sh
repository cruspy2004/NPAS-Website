#!/usr/bin/env bash
# Regenerates every video asset in public/ from one source space video.
# Usage: scripts/make-media.sh path/to/video.mp4
#
# Timing is tuned to the current 10s / 24fps video:
#   frames 0-100   slow drift     -> hero loop (played forward then reversed)
#   frames 96-156  fast burst     -> warp transition when an event is clicked
#   all frames                    -> scroll-scrubbed rocket sequence
# If you swap in a different video, update these ranges and FRAME_COUNT in
# src/components/RocketScroll.tsx.
set -euo pipefail

SRC="${1:?pass the source video}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public"
mkdir -p "$OUT/sequence" "$OUT/video"
rm -f "$OUT"/sequence/f_*.webp

# Scroll sequence: one webp per frame
ffmpeg -v error -i "$SRC" -vf "scale=1280:-2" -vsync 0 -c:v libwebp -quality 55 \
  -start_number 0 "$OUT/sequence/f_%03d.webp" -y

HERO="[0:v]trim=start_frame=0:end_frame=100,setpts=PTS-STARTPTS,scale=1920:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]"
WARP="trim=start_frame=96:end_frame=156,setpts=PTS-STARTPTS,scale=1920:-2,format=yuv420p"

ffmpeg -v error -i "$SRC" -filter_complex "$HERO" -map "[v]" -an -c:v libx264 -crf 25 -preset slow -movflags +faststart "$OUT/video/hero.mp4" -y
ffmpeg -v error -i "$SRC" -filter_complex "$HERO" -map "[v]" -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 "$OUT/video/hero.webm" -y
ffmpeg -v error -i "$SRC" -vf "$WARP" -an -c:v libx264 -crf 24 -preset slow -movflags +faststart "$OUT/video/warp.mp4" -y
ffmpeg -v error -i "$SRC" -vf "$WARP" -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 "$OUT/video/warp.webm" -y
ffmpeg -v error -i "$SRC" -vf "select=eq(n\,0),scale=1920:-2" -frames:v 1 -q:v 4 "$OUT/video/hero-poster.jpg" -y

echo "Done. $(ls "$OUT/sequence" | wc -l) frames written."
