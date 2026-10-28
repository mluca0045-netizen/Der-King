# Arbeit 4.0 – Technik

Das Video entsteht vollständig aus Code: Die Animation ist eine HTML-Seite (GSAP), die Bild für Bild mit Chromium aufgenommen wird; Stimme, Musik und Effekte werden lokal erzeugt.

| Ordner | Inhalt |
|---|---|
| `script/script.json` | Sprechertext je Szene (`tts` = Aussprache, `sub` = Untertitel) |
| `tts/` | Stimmerzeugung mit Qwen3-TTS (Voice Clone der entworfenen Stimmen in `tts/voices/`) |
| `tools/` | Prüfung per Spracherkennung, Zeitleiste, Untertitel |
| `anim/` | Animation: `index.html`, `lib.js`, `bg.js`, eine Datei pro Szene in `anim/scenes/` |
| `render/` | `render.js` (alle Bilder), `preview.js` (einzelne Zeitpunkte) |
| `audio/build_audio.py` | Sprecherspur, synthetisierte Musik, Soundeffekte, Mischung mit Ducking |
| `output/` | fertige Videos und Untertitel |

## Neu bauen

```bash
./make_video.sh
```

Voraussetzungen: Node 18+, Playwright mit Chromium, ffmpeg, Python 3.10+ mit `qwen-tts`, `faster-whisper`, `numpy`, `scipy`, `soundfile`. Getrennte Python-Umgebungen lassen sich über `PY_TTS`, `PY_ASR` und `PY` angeben.

## Text ändern

1. Satz in `script/script.json` anpassen (`tts` mit ausgeschriebenen Zahlen, `sub` mit Ziffern).
2. Die betroffene Zeile neu sprechen lassen: `python tts/gen_lines.py --only <id>`.
3. `./make_video.sh` – die Animation richtet sich automatisch nach den neuen Satzlängen.

Eigene Stimme statt KI-Stimme: Jede Zeile als `build/lines/<id>.wav` ablegen (Dateiname = Zeilen-ID aus `script.json`) und `./make_video.sh` laufen lassen – Schritt 2 überspringt vorhandene Dateien.

## Lizenzen der Bausteine

- Stimme: Qwen3-TTS (Apache-2.0); die Stimmen wurden per Beschreibung entworfen, keine reale Person geklont.
- Musik und Klänge: in `audio/build_audio.py` synthetisiert.
- GSAP (kostenlose Standardlizenz), Lucide-Icons (ISC), Weltkarte: Natural Earth (gemeinfrei) über `world-atlas` (ISC).
