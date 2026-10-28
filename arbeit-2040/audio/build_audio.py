"""Erzeugt die komplette Tonspur: Sprecherspur, synthetisierte Musik, Soundeffekte, Mischung.

Eingaben:  build/timeline.json, build/lines_trim/*.wav, build/sfx.json (aus der Animation exportiert)
Ausgaben:  build/audio/{voice,music,sfx,mix}.wav  (48 kHz, Stereo)

Die Musik wird vollständig hier erzeugt (keine Samples, keine Fremdrechte):
Akkordflächen, Arpeggio, Bass und dezentes Schlagzeug, je Kapitel anders dosiert,
automatisch abgesenkt, sobald jemand spricht.
"""
import json
import os

import numpy as np
import soundfile as sf
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
BPM = 96.0
BEAT = 60.0 / BPM
BAR = 4 * BEAT
OUT = os.path.join(ROOT, "build/audio")
RNG = np.random.default_rng(2040)


def db(x):
    return 10 ** (x / 20)


def movavg(x, w):
    """gleitender Mittelwert (zentriert) über w Samples, O(n)"""
    c = np.cumsum(np.concatenate([np.zeros(1), x]))
    y = (c[w:] - c[:-w]) / w
    pad_l = (len(x) - len(y)) // 2
    return np.concatenate([np.full(pad_l, y[0]), y, np.full(len(x) - len(y) - pad_l, y[-1])])


def smooth_steps(x, seconds):
    k = np.hanning(max(3, int(seconds * SR)))
    return signal.fftconvolve(x, k / k.sum(), mode="same")


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ---------------------------------------------------------------- Sprache
def build_voice(tl, n):
    out = np.zeros((n, 2))
    sos_hp = signal.butter(2, 75, "highpass", fs=SR, output="sos")
    for sc in tl["scenes"]:
        for ln in sc["lines"]:
            path = os.path.join(ROOT, "build/lines_trim", ln["id"] + ".wav")
            if not os.path.exists(path):
                continue
            y, sr = sf.read(path)
            if y.ndim > 1:
                y = y.mean(1)
            y = signal.resample_poly(y, SR, sr) if sr != SR else y
            y = signal.sosfilt(sos_hp, y)
            # gleiche Sprechlautstärke für alle Zeilen (aktive Sprache auf -20 dBFS RMS)
            win = int(0.03 * SR)
            fr = y[: len(y) // win * win].reshape(-1, win)
            rms = np.sqrt((fr ** 2).mean(1))
            act = rms[rms > rms.max() * db(-30)]
            gain = db(-20) / (np.sqrt((act ** 2).mean()) + 1e-9)
            y = y * gain
            if ln["speaker"] == "nova":
                y = nova_fx(y)
            # weicher Begrenzer
            y = np.tanh(y * 1.25) / 1.25
            fade = int(0.01 * SR)
            y[:fade] *= np.linspace(0, 1, fade)
            y[-fade:] *= np.linspace(1, 0, fade)
            i0 = int(round(ln["start"] * SR))
            seg = y[: max(0, min(len(y), n - i0))]
            if ln["speaker"] == "nova":
                out[i0:i0 + len(seg), 0] += seg * 0.97
                out[i0:i0 + len(seg), 1] += np.roll(seg, int(0.006 * SR)) * 0.97
            else:
                out[i0:i0 + len(seg), 0] += seg
                out[i0:i0 + len(seg), 1] += seg
    return out


def nova_fx(y):
    """KI-Stimme: leichter Chorus und Präsenz – bleibt gut verständlich."""
    t = np.arange(len(y)) / SR
    d = (0.011 + 0.002 * np.sin(2 * np.pi * 0.7 * t)) * SR
    idx = np.clip(np.arange(len(y)) - d, 0, len(y) - 1)
    ch = np.interp(idx, np.arange(len(y)), y)
    sos = signal.butter(2, [300, 6000], "bandpass", fs=SR, output="sos")
    return 0.82 * y + 0.28 * signal.sosfilt(sos, ch)


# ---------------------------------------------------------------- Musik
LOOP_A = [  # Am9 – Fmaj9 – C6/9 – G
    (45, [57, 60, 64, 67, 71]),
    (41, [53, 57, 60, 64, 67]),
    (48, [55, 59, 62, 64, 67]),
    (43, [55, 59, 62, 67, 71]),
]
LOOP_B = [  # F – G – Em7 – Am (Aufbruch)
    (41, [53, 57, 60, 65, 69]),
    (43, [55, 59, 62, 67, 71]),
    (40, [55, 59, 62, 64, 67]),
    (45, [57, 60, 64, 69, 72]),
]


def saw(freq, n, phase=0.0, harmonics=None):
    t = np.arange(n) / SR
    out = np.zeros(n)
    kmax = harmonics or max(1, int(min(6000, SR / 2 - 1000) / freq))
    for k in range(1, kmax + 1):
        out += np.sin(2 * np.pi * k * freq * t + phase * k) / k
    return out * (2 / np.pi)


def adsr(n, a, r):
    env = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    env[:na] = np.linspace(0, 1, na) ** 1.5
    env[n - nr:] *= np.linspace(1, 0, nr) ** 1.2
    return env


def render_loop(prog):
    """Ein 4-Takt-Zyklus (Pad, Bass, Arpeggio getrennt), nahtlos wiederholbar."""
    L = int(round(4 * BAR * SR))
    pad = np.zeros((L, 2))
    bass = np.zeros(L)
    arp = np.zeros((L, 2))
    over = int(1.2 * SR)  # Überlappung für weiche Akkordwechsel
    for b, (root, notes) in enumerate(prog):
        s0 = int(round(b * BAR * SR))
        nseg = int(round(BAR * SR)) + over
        env = adsr(nseg, 0.7, 1.2)
        for j, m in enumerate(notes):
            f = midi(m)
            for det, pan in ((-7, 0.15), (0, 0.5), (7, 0.85)):
                ff = f * 2 ** (det / 1200)
                v = saw(ff, nseg, phase=RNG.random() * 6.28) * env * 0.055
                idx = (np.arange(nseg) + s0) % L
                np.add.at(pad[:, 0], idx, v * (1 - pan))
                np.add.at(pad[:, 1], idx, v * pan)
        # Bass: Grundton, sanft, mit leichter Sättigung
        nb = int(round(BAR * SR))
        t = np.arange(nb) / SR
        fb = midi(root)
        bv = (np.sin(2 * np.pi * fb * t) + 0.25 * np.sin(2 * np.pi * 2 * fb * t)) * adsr(nb, 0.05, 0.25)
        bass[s0:s0 + nb] += np.tanh(bv * 1.4) * 0.15
        # Arpeggio: Achtel, Akkordtöne auf und ab
        pattern = [0, 1, 2, 3, 4, 3, 2, 1]
        for k in range(8):
            m = notes[pattern[k]] + 12
            st = s0 + int(round(k * BEAT / 2 * SR))
            na = int(0.6 * SR)
            ta = np.arange(na) / SR
            f = midi(m)
            v = (np.sin(2 * np.pi * f * ta) + 0.35 * np.sin(2 * np.pi * 2 * f * ta) + 0.12 * np.sin(2 * np.pi * 3 * f * ta))
            v *= np.exp(-ta / 0.16) * 0.12
            v[: int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
            idx = (np.arange(na) + st) % L
            pan = 0.3 if k % 2 else 0.7
            np.add.at(arp[:, 0], idx, v * (1 - pan))
            np.add.at(arp[:, 1], idx, v * pan)
    sos = signal.butter(2, 5200, "lowpass", fs=SR, output="sos")
    pad = signal.sosfiltfilt(sos, pad, axis=0)
    return pad, bass, arp


def drums_loop():
    L = int(round(4 * BAR * SR))
    kick = np.zeros(L)
    hat = np.zeros((L, 2))
    snare = np.zeros((L, 2))
    for beat in range(16):
        st = int(round(beat * BEAT * SR))
        if beat % 2 == 0:
            nk = int(0.45 * SR)
            t = np.arange(nk) / SR
            f = 46 + 70 * np.exp(-t / 0.035)
            ph = 2 * np.pi * np.cumsum(f) / SR
            k = np.sin(ph) * np.exp(-t / 0.22)
            kick[st:st + nk] += k[: max(0, min(nk, L - st))] * 0.30
        if beat % 4 in (1, 3):
            ns = int(0.25 * SR)
            t = np.arange(ns) / SR
            nz = RNG.standard_normal(ns)
            sos = signal.butter(2, [1200, 4500], "bandpass", fs=SR, output="sos")
            sn = signal.sosfilt(sos, nz) * np.exp(-t / 0.07) * 0.22 + np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) * 0.08
            e = min(ns, L - st)
            snare[st:st + e, 0] += sn[:e] * 0.9
            snare[st:st + e, 1] += sn[:e]
        for half in (0.5,):
            sth = st + int(round(half * BEAT * SR))
            nh = int(0.06 * SR)
            t = np.arange(nh) / SR
            nz = RNG.standard_normal(nh)
            sos = signal.butter(2, 7500, "highpass", fs=SR, output="sos")
            h = signal.sosfilt(sos, nz) * np.exp(-t / 0.018) * 0.12
            e = min(nh, L - sth)
            if e > 0:
                hat[sth:sth + e, 0] += h[:e] * (0.8 if beat % 2 else 1.0)
                hat[sth:sth + e, 1] += h[:e] * (1.0 if beat % 2 else 0.8)
    return kick, hat, snare


SECTIONS = {  # Pegel je Kapitel: pad, arp, bass, kick, hat, snare, Helligkeit, Loop
    "intro": (0.85, 0.0, 0.0, 0.0, 0.0, 0.0, 0.55, "A"),
    "scene2040": (0.70, 0.70, 0.70, 0.55, 0.45, 0.0, 0.75, "A"),
    "history": (0.70, 0.60, 0.60, 0.0, 0.30, 0.0, 0.7, "A"),
    "jobs": (0.60, 0.70, 0.80, 0.80, 0.55, 0.35, 0.85, "A"),
    "place": (0.60, 0.70, 0.80, 0.80, 0.55, 0.35, 0.85, "A"),
    "market": (0.60, 0.80, 0.85, 0.85, 0.60, 0.40, 1.0, "A"),
    "private": (0.80, 0.50, 0.50, 0.0, 0.30, 0.0, 0.7, "A"),
    "career": (0.60, 0.70, 0.80, 0.80, 0.55, 0.35, 0.85, "A"),
    "wealth": (0.80, 0.30, 0.70, 0.55, 0.20, 0.0, 0.5, "A"),
    "rich": (0.60, 0.80, 0.85, 0.85, 0.60, 0.45, 1.0, "B"),
    "outro": (0.90, 0.50, 0.60, 0.25, 0.15, 0.0, 0.8, "B"),
    "credits": (0.80, 0.25, 0.30, 0.0, 0.0, 0.0, 0.6, "B"),
}


def automation(tl, n, idx, xfade=1.6):
    """Zeitverlauf eines Pegels (Index in SECTIONS) mit weichen Übergängen."""
    env = np.zeros(n)
    for sc in tl["scenes"]:
        a, b = int(sc["start"] * SR), int(sc["end"] * SR)
        env[a:b] = SECTIONS[sc["id"]][idx]
    return smooth_steps(env, xfade)


def build_music(tl, n):
    loops = {"A": render_loop(LOOP_A), "B": render_loop(LOOP_B)}
    kick_l, hat_l, snare_l = drums_loop()
    L = len(kick_l)
    reps = int(np.ceil(n / L)) + 1

    def tile(x):
        return np.tile(x, (reps, 1) if x.ndim == 2 else reps)[:n]

    # Loop-Auswahl je Kapitel (an Taktgrenzen umgeschaltet, mit Überblendung)
    selB = np.zeros(n)
    for sc in tl["scenes"]:
        if SECTIONS[sc["id"]][7] == "B":
            a = int(np.floor(sc["start"] / (4 * BAR)) * 4 * BAR * SR)
            selB[a:int(sc["end"] * SR)] = 1
    selB = smooth_steps(selB, 2.0)[:, None]

    padA, bassA, arpA = (tile(x) for x in loops["A"])
    padB, bassB, arpB = (tile(x) for x in loops["B"])
    pad = padA * (1 - selB) + padB * selB
    bass = bassA * (1 - selB[:, 0]) + bassB * selB[:, 0]
    arp = arpA * (1 - selB) + arpB * selB
    kick, hat, snare = tile(kick_l), tile(hat_l), tile(snare_l)

    g = [automation(tl, n, i) for i in range(7)]
    # Helligkeit: Tiefpass für Pad und Arpeggio blockweise nachführen
    bright = g[6]
    blk = int(0.05 * SR)

    def dyn_lp(x, lo, hi):
        y = np.zeros_like(x)
        zi = None
        for s in range(0, n, blk):
            fc = lo + (hi - lo) * float(bright[min(n - 1, s)])
            sos = signal.butter(2, fc, "lowpass", fs=SR, output="sos")
            if zi is None:
                zi = np.zeros((sos.shape[0], 2, x.shape[1]))
            y[s:s + blk], zi = signal.sosfilt(sos, x[s:s + blk], axis=0, zi=zi)
        return y

    pad = dyn_lp(pad, 1300, 5500)
    arp = dyn_lp(arp, 2200, 8000)

    # Pumpen der Flächen/Bass durch die Bassdrum (Sidechain), nur wo Kick aktiv
    sm = movavg(np.abs(kick), int(0.12 * SR))
    pump = 1 - 0.35 * np.clip(sm / (sm.max() + 1e-9) * 3, 0, 1) * np.clip(g[3] * 1.5, 0, 1)

    mix = (pad * g[0][:, None] * pump[:, None]
           + arp * g[1][:, None] * 0.9
           + (bass * g[2] * pump)[:, None] * np.array([1.0, 1.0])
           + (kick * g[3])[:, None]
           + hat * g[4][:, None]
           + snare * g[5][:, None])

    # Raum: kurzer Hall per Faltung mit synthetischer Impulsantwort
    ir_len = int(2.4 * SR)
    t = np.arange(ir_len) / SR
    ir = RNG.standard_normal((ir_len, 2)) * np.exp(-t / 0.55)[:, None]
    ir[: int(0.02 * SR)] = 0
    ir /= np.sqrt((ir ** 2).sum(0))
    wet = np.stack([signal.fftconvolve(mix[:, c], ir[:, c])[:n] for c in range(2)], 1)
    mix = 0.8 * mix + 0.32 * wet

    # Anfang/Ende
    fi, fo = int(2.5 * SR), int(6 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
    mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    mix = signal.sosfilt(signal.butter(2, 38, "highpass", fs=SR, output="sos"), mix, axis=0)
    rms = np.sqrt((mix ** 2).mean())
    return mix * db(-26) / (rms + 1e-9)


# ---------------------------------------------------------------- Soundeffekte
def noise(n):
    return RNG.standard_normal(n)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def sweep_noise(n, f0, f1, q=1.5):
    y = np.zeros(n)
    x = noise(n)
    blk = int(0.01 * SR)
    zi = None
    for s in range(0, n, blk):
        k = s / n
        fc = f0 * (f1 / f0) ** k
        bw = fc / q
        sos = signal.butter(2, [max(40, fc - bw / 2), min(SR / 2 - 100, fc + bw / 2)], "bandpass", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        y[s:s + blk], zi = signal.sosfilt(sos, x[s:s + blk], zi=zi)
    return y


def tone(n, f, tau, harm=(1.0,)):
    t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(harm))
    return y * np.exp(-t / tau)


def chirp(n, f0, f1, tau=None):
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / t[-1])
    y = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return y * (np.exp(-t / tau) if tau else np.sin(np.pi * t / t[-1]))


def make_sfx(kind):
    """Gibt (Stereo-Signal, Spitzenpegel in dBFS) zurück."""
    if kind == "whoosh":
        n = int(0.75 * SR)
        y = sweep_noise(n, 250, 3200, 1.2) * np.sin(np.linspace(0, np.pi, n)) ** 2
        pan = np.linspace(0.2, 0.8, n)
        return np.stack([y * (1 - pan), y * pan], 1), -20
    if kind == "swell":
        n = int(1.6 * SR)
        t = np.arange(n) / SR
        y = sweep_noise(n, 400, 5000, 2.0) * (t / t[-1]) ** 3
        y += 0.5 * sum(np.sin(2 * np.pi * midi(m) * t) for m in (57, 64, 69)) * (t / t[-1]) ** 2 * 0.2
        y[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
        return np.stack([y, y], 1), -22
    if kind == "blip":
        n = int(0.16 * SR)
        y = tone(n, 1318.5, 0.035, (1.0, 0.25))
        return np.stack([y, y], 1), -27
    if kind == "tick":
        n = int(0.03 * SR)
        y = signal.sosfilt(signal.butter(2, 3000, "highpass", fs=SR, output="sos"), noise(n)) * env_exp(n, 0.004)
        return np.stack([y, y], 1), -30
    if kind == "pop":
        n = int(0.14 * SR)
        y = chirp(n, 900, 260, 0.04)
        return np.stack([y, y], 1), -25
    if kind == "impact":
        n = int(1.6 * SR)
        t = np.arange(n) / SR
        f = 38 + 50 * np.exp(-t / 0.08)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.5)
        y += signal.sosfilt(signal.butter(2, 900, "lowpass", fs=SR, output="sos"), noise(n)) * np.exp(-t / 0.18) * 0.6
        return np.stack([y, y], 1), -15
    if kind == "count":
        n = int(0.9 * SR)
        y = np.zeros(n)
        for k in range(12):
            st = int((k / 12) ** 1.4 * 0.8 * SR)
            m = int(0.02 * SR)
            y[st:st + m] += tone(m, 2200 + k * 60, 0.006)
        return np.stack([y, y], 1), -28
    if kind == "rise":
        n = int(0.7 * SR)
        y = chirp(n, 330, 990) * 0.8
        return np.stack([y, y], 1), -27
    if kind == "down":
        n = int(0.7 * SR)
        y = chirp(n, 700, 180) * 0.8
        return np.stack([y, y], 1), -26
    if kind == "scan":
        n = int(1.8 * SR)
        t = np.arange(n) / SR
        y = sweep_noise(n, 2500, 6000, 6) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)) * np.sin(np.pi * t / t[-1])
        return np.stack([y, y], 1), -29
    if kind == "swipe":
        n = int(0.3 * SR)
        y = sweep_noise(n, 1500, 7000, 1.5) * np.sin(np.linspace(0, np.pi, n))
        return np.stack([y * 0.7, y], 1), -26
    if kind == "notify":
        n1 = int(0.12 * SR)
        a = tone(n1, midi(88), 0.05, (1.0, 0.2))
        b = tone(int(0.3 * SR), midi(93), 0.09, (1.0, 0.2))
        y = np.concatenate([a, b])
        return np.stack([y, y], 1), -27
    if kind == "click":
        n = int(0.05 * SR)
        y = signal.sosfilt(signal.butter(2, [1500, 3500], "bandpass", fs=SR, output="sos"), noise(n)) * env_exp(n, 0.006)
        return np.stack([y, y], 1), -22
    if kind == "break":
        n = int(1.0 * SR)
        t = np.arange(n) / SR
        y = signal.sosfilt(signal.butter(2, 2500, "lowpass", fs=SR, output="sos"), noise(n)) * np.exp(-t / 0.09)
        y += np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.15) * 0.8
        for k in range(5):
            st = int((0.15 + 0.12 * k + RNG.random() * 0.05) * SR)
            m = int(0.02 * SR)
            y[st:st + m] += tone(m, 1800 + 400 * RNG.random(), 0.005) * 0.5
        return np.stack([y, y], 1), -20
    return None, 0


def build_sfx(events, n):
    out = np.zeros((n, 2))
    cache = {}
    for ev in events:
        k = ev["type"]
        if k not in cache:
            y, peak = make_sfx(k)
            if y is None:
                continue
            y = y / (np.abs(y).max() + 1e-9) * db(peak)
            cache[k] = y
        y = cache[k] * ev.get("gain", 1.0)
        i0 = int(ev["t"] * SR)
        if k in ("swell",):
            i0 -= int(len(y) * 0.85)  # Anschwellen endet kurz nach dem Ereignis
        i0 = max(0, i0)
        e = min(len(y), n - i0)
        if e > 0:
            out[i0:i0 + e] += y[:e]
    return out


# ---------------------------------------------------------------- Mischung
def duck_curve(voice, attack=0.05, release=0.5, depth_db=-10.0):
    lvl = np.abs(voice).max(1)
    win = int(0.03 * SR)
    lvl = movavg(lvl, win)
    act = (lvl > db(-40)).astype(float)
    out = np.zeros_like(act)
    a, r = np.exp(-1 / (attack * SR)), np.exp(-1 / (release * SR))
    # Vorlauf: Musik senkt sich etwas vor dem ersten Wort ab
    act = np.maximum(act, np.roll(act, -int(0.12 * SR)))
    prev = 0.0
    for i in range(0, len(act), 64):  # blockweise für Tempo
        x = act[i:i + 64].max()
        c = a if x > prev else r
        prev = x + (prev - x) * (c ** 64)
        out[i:i + 64] = prev
    return db(depth_db * out)


def main():
    tl = json.load(open(os.path.join(ROOT, "build/timeline.json"), encoding="utf-8"))
    n = int(np.ceil(tl["duration"] * SR))
    os.makedirs(OUT, exist_ok=True)
    events = []
    sp = os.path.join(ROOT, "build/sfx.json")
    if os.path.exists(sp):
        events = json.load(open(sp))

    voice = build_voice(tl, n)
    music = build_music(tl, n)
    sfx = build_sfx(events, n)
    duck = duck_curve(voice)
    mix = voice + music * duck[:, None] + sfx * 0.9
    peak = np.abs(mix).max()
    if peak > 0.98:
        mix *= 0.98 / peak
    for name, x in (("voice", voice), ("music", music), ("sfx", sfx), ("mix", mix)):
        sf.write(os.path.join(OUT, name + ".wav"), x.astype(np.float32), SR, subtype="FLOAT")
    print(f"Tonspur fertig: {n / SR:.1f}s, Effekte: {len(events)}, Spitze vor Normalisierung {20 * np.log10(peak + 1e-9):.1f} dBFS")


if __name__ == "__main__":
    main()
