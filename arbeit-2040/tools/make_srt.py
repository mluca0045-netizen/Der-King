"""Erzeugt Untertitel (SRT) aus build/timeline.json.

Jede Sprecherzeile wird in Sätze zerlegt; deren Zeiten werden anteilig nach der Länge des
gesprochenen Textes (tts) verteilt. Lange Sätze werden an Komma/Gedankenstrich geteilt.
Ausgabe: build/untertitel.srt
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAXC = 84  # max. Zeichen pro Untertitel (2 Zeilen à 42)


def sentences(s):
    parts = re.split(r'(?<=[.!?])\s+', s.strip())
    return [p for p in parts if p]


def keep_together(s):
    """geschützte Leerzeichen: Zahl und Einheit nie über zwei Zeilen trennen"""
    s = re.sub(r'(\d) (%|€|Mio\.|Mrd\.|Jahre|Jahren)', '\\1\u00a0\\2', s)
    return s.replace('22- bis 25-Jährigen', '22-\u00a0bis 25-Jährigen')


def wrap(s, width=42):
    s = keep_together(s)
    if len(s) <= width:
        return s
    spaces = [i for i, ch in enumerate(s) if ch == ' ']
    cut = min(spaces, key=lambda i: abs(i - len(s) / 2))
    return s[:cut].strip() + '\n' + s[cut:].strip()


def snap(t, words, offset, tol=0.6):
    """verschiebt eine geschätzte Satzgrenze auf die nächstgelegene Sprechpause (Whisper-Wörter)"""
    best, bd = t, tol
    for a, b in zip(words, words[1:]):
        gap_mid = offset + (a['e'] + b['s']) / 2
        gap = b['s'] - a['e']
        d = abs(gap_mid - t) - min(gap, 0.4) * 0.5
        if d < bd:
            best, bd = gap_mid, d
    return best


def split_long(s):
    if len(s) <= MAXC:
        return [s]
    best = None
    for m in re.finditer(r'(,|–|:)\s', s):
        k = m.end()
        score = abs(k - len(s) / 2)
        if best is None or score < best[0]:
            best = (score, k)
    if best is None:
        cut = s.rfind(' ', 0, len(s) // 2 + 10)
        return [s[:cut].strip(), s[cut:].strip()]
    a, b = s[:best[1]].strip(), s[best[1]:].strip()
    return split_long(a) + split_long(b)


def ts(t):
    h, r = divmod(max(0.0, t), 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}".replace(',1000', ',999')


def main():
    tl = json.load(open(os.path.join(ROOT, 'build/timeline.json'), encoding='utf-8'))
    cues = []
    for sc in tl['scenes']:
        for ln in sc['lines']:
            subs, ttss = sentences(ln['sub']), sentences(ln['tts'])
            if len(subs) != len(ttss):
                subs, ttss = [ln['sub']], [ln['tts']]
            total = sum(len(x) for x in ttss)
            words = ln.get('words') or []
            # Satzgrenzen: anteilig geschätzt, dann auf echte Pausen eingerastet
            bounds = [ln['start']]
            acc = 0
            for tts in ttss[:-1]:
                acc += len(tts)
                tb = ln['start'] + ln['dur'] * acc / total
                bounds.append(snap(tb, words, ln['start']) if words else tb)
            bounds.append(ln['start'] + ln['dur'])
            for k, sub in enumerate(subs):
                a, b = bounds[k], bounds[k + 1]
                pieces = split_long(sub)
                ptotal = sum(len(p) for p in pieces)
                tp = a
                for p in pieces:
                    d = (b - a) * len(p) / ptotal
                    cues.append([tp, tp + d, p])
                    tp += d
    # Mindestdauer, ohne Überlappung
    for i, c in enumerate(cues):
        nxt = cues[i + 1][0] if i + 1 < len(cues) else c[1] + 5
        c[1] = min(max(c[1], c[0] + 1.0), nxt - 0.04)
    out = [f"{i}\n{ts(a)} --> {ts(b)}\n{wrap(s)}\n" for i, (a, b, s) in enumerate(cues, 1)]
    p = os.path.join(ROOT, 'build/untertitel.srt')
    open(p, 'w', encoding='utf-8').write('\n'.join(out))
    print(f"{len(cues)} Untertitel → {p}")


if __name__ == '__main__':
    main()
