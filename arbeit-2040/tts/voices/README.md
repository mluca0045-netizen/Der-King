# Referenzstimmen

Beide Stimmen sind synthetisch: Sie wurden mit **Qwen3-TTS-12Hz-1.7B-VoiceDesign** (Apache-2.0) allein aus einer Textbeschreibung entworfen – es wurde keine reale Person geklont. `tts/gen_lines.py` nutzt sie anschließend als Vorlage für **Qwen3-TTS-12Hz-1.7B-Base** (Voice Clone), damit alle Sätze gleich klingen. Neu erzeugen: `python tts/design_voices.py`.

| Datei | Rolle | Beschreibung (Prompt) | Referenzsatz |
|---|---|---|---|
| `lea_ref.wav` | Erzählerin Lea | Female narrator, about 30 years old, native German speaker, warm mid-pitched voice with a smile, engaging and enthusiastic but not exaggerated, documentary explainer style, clear pronunciation, studio recording quality. | „Hallo! Ich bin Lea und erzähle euch heute, wie sich unsere Arbeitswelt verändert hat. Manches davon klingt verrückt – aber vieles hat schon bei euch angefangen.“ |
| `nova_ref.wav` | KI-Assistentin NOVA | A calm, friendly AI assistant voice, soft and precise, even pace, gentle female timbre, very clear native German pronunciation, slightly synthetic and futuristic, studio quality. | „Guten Morgen, Lea. Deine Agenten haben über Nacht einundvierzig Aufgaben erledigt. Zwei Entscheidungen warten auf dich.“ |

Die NOVA-Referenz ist zugleich die Zeile `nova1` im Video.
