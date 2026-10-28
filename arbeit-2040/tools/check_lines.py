"""Prüft alle synthetisierten Zeilen per Spracherkennung (faster-whisper) gegen den Skripttext.

- schreibt Wort-Zeitstempel nach build/lines/<id>.wav.words.json (für die Animation)
- meldet Zeilen, deren Erkennung deutlich vom Skript abweicht (Verdacht auf Versprecher)
Aufruf: python tools/check_lines.py [--model medium] [--only id1,id2]
"""
import argparse
import difflib
import json
import os
import re
import subprocess

import numpy as np
from faster_whisper import WhisperModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def norm_words(s):
    s = s.lower().replace('%', ' prozent ').replace('ß', 'ss')
    s = re.sub(r'(\d)\.(\d)', r'\1\2', s)
    return re.findall(r'[a-zäöü0-9]+', s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='medium')
    ap.add_argument('--only', default='')
    ap.add_argument('--cache', default=os.environ.get('WHISPER_CACHE', 'whisper_models'))
    args = ap.parse_args()
    only = set(filter(None, args.only.split(',')))
    script = json.load(open(os.path.join(ROOT, 'script/script.json'), encoding='utf-8'))
    model = WhisperModel(args.model, device='cpu', compute_type='int8', download_root=args.cache)
    report = []
    for sc in script['scenes']:
        for ln in sc['lines']:
            if only and ln['id'] not in only:
                continue
            wav = os.path.join(ROOT, 'build/lines', ln['id'] + '.wav')
            if not os.path.exists(wav):
                continue
            segs, _ = model.transcribe(load(wav), language='de', beam_size=5, word_timestamps=True,
                                       initial_prompt='Arbeit 4.0, KI, Homeoffice, ifo Institut, Nvidia, Zoom, OECD, Stanford.')
            segs = list(segs)
            words = [{'w': w.word, 's': w.start, 'e': w.end, 'p': w.probability} for s in segs for w in s.words]
            json.dump(words, open(wav + '.words.json', 'w', encoding='utf-8'), ensure_ascii=False)
            hyp = ' '.join(s.text.strip() for s in segs)
            a, b = norm_words(ln['sub']), norm_words(hyp)
            ratio = difflib.SequenceMatcher(None, a, b).ratio()
            low = [w['w'].strip() for w in words if w['p'] < 0.35]
            flag = 'OK ' if ratio >= 0.86 else 'PRÜFEN'
            report.append((ln['id'], ratio, flag))
            print(f"{flag} {ln['id']:7s} {ratio:.2f} | {hyp}" + (f"  [unsicher: {', '.join(low)}]" if low else ''), flush=True)
    bad = [r for r in report if r[2] != 'OK ']
    print(f"\n{len(report)} Zeilen geprüft, {len(bad)} auffällig: {', '.join(r[0] for r in bad)}")


if __name__ == '__main__':
    main()
