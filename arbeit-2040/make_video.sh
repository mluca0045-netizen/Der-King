#!/usr/bin/env bash
# Baut das Video komplett neu: Assets → Stimme → Prüfung → Zeitleiste → Bilder → Ton → MP4.
# Voraussetzungen: Node 18+, Playwright mit Chromium, ffmpeg, Python 3.10+ mit
#   qwen-tts (Stimme), faster-whisper (Prüfung), numpy, scipy, soundfile (Ton).
# Python-Interpreter lassen sich getrennt setzen: PY_TTS, PY_ASR, PY (Standard: python3).
set -euo pipefail
cd "$(dirname "$0")"

PY=${PY:-python3}
PY_TTS=${PY_TTS:-$PY}
PY_ASR=${PY_ASR:-$PY}
WORKERS=${WORKERS:-3}
NAME=${NAME:-Arbeit-4.0_Nachricht-aus-2040}
mkdir -p build output

npm install --no-audit --no-fund
node anim/build-assets.js
"$PY_TTS" tts/gen_lines.py                 # erzeugt nur fehlende Zeilen
"$PY_ASR" tools/check_lines.py            # Wort-Zeitstempel + Versprecher-Check
"$PY" tools/build_timeline.py
node render/render.js --workers "$WORKERS" --fps 30 --quality 93
"$PY" audio/build_audio.py
"$PY" tools/make_srt.py

# Lautheit: lineare Anhebung auf -16 LUFS, Spitzen begrenzt auf -1,5 dBFS
I=$(ffmpeg -hide_banner -nostats -i build/audio/mix.wav -af ebur128 -f null - 2>&1 | awk '/Summary/{s=1} s&&/ I:/{print $2; exit}')
GAIN=$(python3 -c "print(round(-16 - ($I), 2))")
ffmpeg -hide_banner -nostats -y -i build/audio/mix.wav \
  -af "volume=${GAIN}dB,alimiter=limit=0.84:attack=3:release=60:level=false" \
  -ar 48000 -c:a pcm_s16le build/audio/mix_norm.wav

# Hauptversion (Untertitel zuschaltbar); JPEG-Bilder → BT.709, begrenzter Wertebereich
VF="scale=out_color_matrix=bt709:out_range=tv,format=yuv420p"
ENC="-c:v libx264 -preset slow -crf 20 -tune animation -g 60 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv"
ffmpeg -hide_banner -nostats -y -framerate 30 -i build/frames/f_%06d.jpg -i build/audio/mix_norm.wav \
  -i build/untertitel.srt -map 0:v -map 1:a -map 2:s -vf "$VF" $ENC \
  -c:a aac -b:a 192k -c:s mov_text -metadata:s:s:0 language=ger -metadata:s:a:0 language=ger \
  -metadata title="Arbeit 4.0 – Eine Nachricht aus dem Jahr 2040" -movflags +faststart \
  "output/${NAME}.mp4"

# Version mit eingebrannten Untertiteln: Bild auf 87,5 % verkleinert über weichgezeichnetem Rand,
# Untertitel im frei werdenden unteren Streifen – so verdecken sie keine Bildinhalte
SUBS="subtitles=build/untertitel.srt:force_style='FontName=Inter,FontSize=10.5,PrimaryColour=&H00FFFFFF,BorderStyle=1,Outline=1.3,OutlineColour=&H90000000,Shadow=0,MarginV=6'"
ffmpeg -hide_banner -nostats -y -framerate 30 -i build/frames/f_%06d.jpg -i build/audio/mix_norm.wav \
  -filter_complex "[0:v]split[a][b];[a]boxblur=28:2,eq=brightness=-0.06[bg];[b]scale=1680:945:flags=lanczos[fg];[bg][fg]overlay=120:8,${SUBS},${VF}[v]" \
  -map "[v]" -map 1:a $ENC \
  -c:a aac -b:a 192k -metadata:s:a:0 language=ger \
  -metadata title="Arbeit 4.0 – Eine Nachricht aus dem Jahr 2040 (mit Untertiteln)" -movflags +faststart \
  "output/${NAME}_mit-Untertiteln.mp4"
cp build/untertitel.srt "output/${NAME}.srt"
echo "fertig: output/${NAME}.mp4"
