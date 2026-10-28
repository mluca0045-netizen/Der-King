"""Entwirft die beiden Referenzstimmen per Textbeschreibung (Qwen3-TTS VoiceDesign, CPU).

Aufruf (aus arbeit-2040/): python tts/design_voices.py
Ausgabe: tts/voices/lea_ref.wav, tts/voices/nova_ref.wav
"""
import os
import time

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

from gen_lines import VOICES, find_model

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROMPTS = {
    "lea": "Female narrator, about 30 years old, native German speaker, warm mid-pitched voice with a smile, "
           "engaging and enthusiastic but not exaggerated, documentary explainer style, clear pronunciation, "
           "studio recording quality.",
    "nova": "A calm, friendly AI assistant voice, soft and precise, even pace, gentle female timbre, very clear "
            "native German pronunciation, slightly synthetic and futuristic, studio quality.",
}


def main():
    torch.set_num_threads(os.cpu_count() or 4)
    model = Qwen3TTSModel.from_pretrained(find_model("Qwen3-TTS-12Hz-1.7B-VoiceDesign"), device_map="cpu", dtype=torch.float32)
    for name, prompt in PROMPTS.items():
        torch.manual_seed(1234)
        t0 = time.time()
        wavs, sr = model.generate_voice_design(text=VOICES[name]["text"], language="German", instruct=prompt)
        sf.write(VOICES[name]["wav"], wavs[0], sr)
        print(f"{name}: {len(wavs[0]) / sr:.1f}s in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
