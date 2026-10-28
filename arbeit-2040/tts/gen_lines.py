"""Erzeugt alle Sprecherzeilen aus script/script.json mit Qwen3-TTS (Voice Clone, CPU).

Aufruf (aus arbeit-2040/):
    python tts/gen_lines.py                 # alle fehlenden Zeilen
    python tts/gen_lines.py --only j1,m2    # bestimmte Zeilen (neu) erzeugen
    python tts/gen_lines.py --seed 7        # anderer Zufallsseed

Die Referenzstimmen in tts/voices/ wurden mit Qwen3-TTS-12Hz-1.7B-VoiceDesign entworfen
(siehe tts/voices/README.md). Ausgabe: build/lines/<id>.wav (24 kHz, mono).
"""
import argparse
import glob
import json
import os
import time

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = {
    "luca": {
        "wav": os.path.join(ROOT, "tts/voices/luca_ref.wav"),
        "text": "Hallo! Ich bin Luca und erzähle euch heute, wie sich unsere Arbeitswelt verändert hat. "
                "Manches davon klingt verrückt – aber vieles hat schon bei euch angefangen.",
    },
    # Schreibweise „Samir“: so spricht die deutsche Stimme den Namen Zamir mit weichem S statt „Tsamir“
    "zamir": {
        "wav": os.path.join(ROOT, "tts/voices/zamir_ref.wav"),
        "text": "Hallo! Ich bin Samir. Ich habe einen eigenen Meisterbetrieb und zeige euch, "
                "wie Arbeit im Jahr zweitausendvierzig aussieht – direkt von der Baustelle.",
    },
    # Der Referenztext muss exakt zur Referenzaufnahme passen (sie entstand mit dem früheren Namen).
    "nova": {
        "wav": os.path.join(ROOT, "tts/voices/nova_ref.wav"),
        "text": "Guten Morgen, Lea. Deine Agenten haben über Nacht einundvierzig Aufgaben erledigt. "
                "Zwei Entscheidungen warten auf dich.",
    },
}


def find_model(name):
    hub = os.environ.get("HF_HOME", os.path.expanduser("~/.cache/huggingface"))
    hits = glob.glob(os.path.join(hub, "hub", f"models--Qwen--{name}", "snapshots", "*"))
    return hits[0] if hits else f"Qwen/{name}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--seed", type=int, default=2040)
    ap.add_argument("--temperature", type=float, default=0.8)
    ap.add_argument("--out", default=os.path.join(ROOT, "build/lines"))
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    script = json.load(open(os.path.join(ROOT, "script/script.json"), encoding="utf-8"))
    only = set(filter(None, args.only.split(",")))
    lines = [ln for sc in script["scenes"] for ln in sc["lines"]]
    todo = [ln for ln in lines if (ln["id"] in only) or (not only and not os.path.exists(os.path.join(args.out, ln["id"] + ".wav")))]
    if not todo:
        print("nichts zu tun")
        return

    torch.set_num_threads(os.cpu_count() or 4)
    model = Qwen3TTSModel.from_pretrained(find_model("Qwen3-TTS-12Hz-1.7B-Base"), device_map="cpu", dtype=torch.float32)
    prompts = {}
    for spk in sorted({ln["speaker"] for ln in todo}):
        v = VOICES[spk]
        prompts[spk] = model.create_voice_clone_prompt(ref_audio=v["wav"], ref_text=v["text"], x_vector_only_mode=False)

    for ln in todo:
        torch.manual_seed(args.seed)
        t0 = time.time()
        wavs, sr = model.generate_voice_clone(
            text=ln["tts"], language="German", voice_clone_prompt=prompts[ln["speaker"]],
            temperature=args.temperature, subtalker_temperature=args.temperature,
        )
        path = os.path.join(args.out, ln["id"] + ".wav")
        sf.write(path, wavs[0], sr)
        print(f"{ln['id']}: {len(wavs[0]) / sr:.2f}s Audio in {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    main()
