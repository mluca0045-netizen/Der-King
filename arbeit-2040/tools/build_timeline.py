"""Baut aus script/script.json + build/lines/*.wav die Zeitleiste für Animation und Tonmischung.

- schneidet Stille am Anfang/Ende jeder Zeile ab (build/lines_trim/<id>.wav)
- legt alle Zeilen hintereinander (leadIn, Pausen, tail pro Szene)
- übernimmt Wort-Zeitstempel aus build/lines/<id>.words.json (Whisper), falls vorhanden
- berechnet eine Lautstärke-Hüllkurve (30 fps) für Wellenform/Orb in der Animation
- fehlt eine Zeile noch, wird ihre Dauer aus der Textlänge geschätzt (Vorschau-Modus)

Ausgabe: build/timeline.json und build/timeline.js (window.TL = ...)
"""
import json
import os
import sys

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
GAP = 0.42          # Pause zwischen zwei Zeilen derselben Szene (s)
CHARS_PER_S = 15.0  # Schätzung, solange eine Zeile noch nicht synthetisiert ist


def trim(y, sr, thresh_db=-42.0, pad=0.05):
    win = int(0.01 * sr)
    n = len(y) // win
    if n == 0:
        return y, 0.0
    frames = y[: n * win].reshape(n, win)
    db = 20 * np.log10(np.sqrt((frames ** 2).mean(1)) + 1e-9)
    ref = np.percentile(db, 95)
    on = np.where(db > ref + thresh_db)[0]
    if len(on) == 0:
        return y, 0.0
    a = max(0, on[0] * win - int(pad * sr))
    b = min(len(y), (on[-1] + 1) * win + int(pad * sr))
    return y[a:b], a / sr


def envelope(y, sr):
    hop = sr // FPS
    n = int(np.ceil(len(y) / hop))
    out = []
    for i in range(n):
        seg = y[i * hop:(i + 1) * hop]
        rms = np.sqrt((seg ** 2).mean()) if len(seg) else 0.0
        out.append(rms)
    out = np.array(out)
    db = 20 * np.log10(out + 1e-6)
    v = np.clip((db + 50) / 38, 0, 1)  # -50 dB .. -12 dB -> 0..1
    return [round(float(x), 3) for x in v]


def main():
    script = json.load(open(os.path.join(ROOT, "script/script.json"), encoding="utf-8"))
    lines_dir = os.path.join(ROOT, "build/lines")
    trim_dir = os.path.join(ROOT, "build/lines_trim")
    os.makedirs(trim_dir, exist_ok=True)

    t = 0.0
    out_scenes = []
    missing = []
    for sc in script["scenes"]:
        s = {k: sc[k] for k in ("id", "chapter", "mode")}
        s["start"] = round(t, 3)
        t += sc.get("leadIn", 0.5)
        lines = []
        for i, ln in enumerate(sc["lines"]):
            if i:
                t += ln.get("gapBefore", GAP)
            wav = os.path.join(lines_dir, ln["id"] + ".wav")
            item = {"id": ln["id"], "speaker": ln["speaker"], "sub": ln["sub"], "tts": ln["tts"]}
            if os.path.exists(wav):
                y, sr = sf.read(wav)
                if y.ndim > 1:
                    y = y.mean(1)
                y, off = trim(y, sr)
                sf.write(os.path.join(trim_dir, ln["id"] + ".wav"), y, sr)
                dur = len(y) / sr
                item["env"] = envelope(y, sr)
                wj = wav + ".words.json"
                if os.path.exists(wj):
                    words = json.load(open(wj, encoding="utf-8"))
                    item["words"] = [{"w": w["w"].strip(), "s": round(max(0.0, w["s"] - off), 3),
                                      "e": round(max(0.0, w["e"] - off), 3)} for w in words]
            else:
                dur = len(ln["tts"]) / CHARS_PER_S
                missing.append(ln["id"])
            item["start"] = round(t, 3)
            item["dur"] = round(dur, 3)
            t += dur
            item["end"] = round(t, 3)
            lines.append(item)
        t += sc.get("tail", 0.7)
        s["end"] = round(t, 3)
        s["lines"] = lines
        out_scenes.append(s)

    tl = {"fps": FPS, "duration": round(t, 3), "scenes": out_scenes, "missing": missing}
    os.makedirs(os.path.join(ROOT, "build"), exist_ok=True)
    json.dump(tl, open(os.path.join(ROOT, "build/timeline.json"), "w", encoding="utf-8"), ensure_ascii=False)
    with open(os.path.join(ROOT, "build/timeline.js"), "w", encoding="utf-8") as f:
        f.write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
    m, s_ = divmod(t, 60)
    print(f"Dauer {int(m)}:{s_:04.1f} min, {sum(len(s['lines']) for s in out_scenes)} Zeilen, geschätzt: {len(missing)}")
    if missing:
        print("noch nicht synthetisiert:", ",".join(missing), file=sys.stderr)


if __name__ == "__main__":
    main()
