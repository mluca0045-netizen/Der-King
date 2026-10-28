# Referenzstimmen

Alle Stimmen sind synthetisch: Sie wurden mit **Qwen3-TTS-12Hz-1.7B-VoiceDesign** (Apache-2.0) allein aus einer Textbeschreibung entworfen – es wurde keine reale Person geklont. `tts/gen_lines.py` nutzt sie als Vorlage für **Qwen3-TTS-12Hz-1.7B-Base** (Voice Clone), damit alle Sätze einer Figur gleich klingen. Neu erzeugen: `python tts/design_voices.py` (Prompts und Seeds stehen dort).

| Datei | Figur | Charakter | Mittlere Tonhöhe |
|---|---|---|---|
| `luca_ref.wav` | Luca, 32 – Projektleitung Energiespeicher | lebhaft, warm, Erklärstil | ≈ 153 Hz |
| `zamir_ref.wav` | Zamir, 32 – Elektro-Meisterbetrieb | tief, ruhig, bodenständig | ≈ 121 Hz |
| `nova_ref.wav` | NOVA – KI-Assistenz | ruhig, präzise, leicht synthetisch | ≈ 174 Hz |

Aussprache: Im Sprechtext steht „Samir“, damit die deutsche Stimme den Namen Zamir mit weichem S spricht statt „Tsamir“. Untertitel und Bild zeigen „Zamir“.
