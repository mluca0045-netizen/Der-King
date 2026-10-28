"""Entwirft die Referenzstimmen per Textbeschreibung (Qwen3-TTS VoiceDesign, CPU).

Aufruf (aus arbeit-2040/): python tts/design_voices.py
Ausgabe: tts/voices/luca_ref.wav, tts/voices/zamir_ref.wav, tts/voices/nova_ref.wav
Die Ergebnisse hängen vom Zufallsseed ab; die eingecheckten Dateien sind die ausgewählten Varianten.
"""
import os
import time

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

from gen_lines import VOICES, find_model

PROMPTS = {
    "luca": (77, "Young German man in his early thirties, native speaker of standard High German, warm and lively "
                 "voice with a smile, engaging documentary explainer style, clear articulation, studio quality."),
    "zamir": (99, "A man in his thirties with a very deep, low-pitched, resonant male voice, calm and steady, native "
                  "German speaker, warm and trustworthy, clear articulation, studio quality."),
    "nova": (1234, "A calm, friendly AI assistant voice, soft and precise, even pace, gentle female timbre, very clear "
                   "native German pronunciation, slightly synthetic and futuristic, studio quality."),
}


def main():
    torch.set_num_threads(os.cpu_count() or 4)
    model = Qwen3TTSModel.from_pretrained(find_model("Qwen3-TTS-12Hz-1.7B-VoiceDesign"), device_map="cpu", dtype=torch.float32)
    for name, (seed, prompt) in PROMPTS.items():
        torch.manual_seed(seed)
        t0 = time.time()
        wavs, sr = model.generate_voice_design(text=VOICES[name]["text"], language="German", instruct=prompt)
        sf.write(VOICES[name]["wav"], wavs[0], sr)
        print(f"{name}: {len(wavs[0]) / sr:.1f}s in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
