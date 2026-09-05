#!/usr/bin/env python3
"""app/fonts/WantedSansVariable.woff2 → 웹용 서브셋 두 개를 만든다.

원본은 현대 한글 11,172자를 모두 담고 있어 1.26MB다. 이걸 두 단으로 나눈다.

  core  — 지금 이 사이트 본문에 실제로 나오는 글자만. 평소 방문자가 받는 파일.
  full  — KS X 1001 상용 2,350자. core 밖의 글자가 화면에 나올 때만 받는다.

CSS 에서 full 을 먼저, core 를 나중에 선언한다. 같은 글자를 두 면이 모두 담고
있으면 나중에 선언한 쪽이 이기므로, 평소에는 core 만 내려받는다. 문구를 고쳐
새 글자가 들어와도 full 이 받쳐 주기 때문에 글자가 깨지지 않는다.

    pip install fonttools brotli
    python3 scripts/subset-font.py
"""

import glob
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "app/fonts/WantedSansVariable.woff2"
CORE = ROOT / "app/fonts/WantedSansVariable.core.woff2"
FULL = ROOT / "app/fonts/WantedSansVariable.subset.woff2"
RANGE = ROOT / "app/fonts/core-unicode-range.txt"

LATIN = "".join(chr(c) for c in range(0x20, 0x7F))
PUNCT = "…—–·’‘“”→←↑↓°％±×÷≈≤≥•※©®™ "
JAMO = "".join(chr(c) for c in range(0x3131, 0x3164))


def ks_x_1001():
    """KS X 1001 완성형 한글 2,350자 (EUC-KR 선두 바이트 0xB0–0xC8)."""
    out = []
    for c in range(0xAC00, 0xD7A4):
        b = chr(c).encode("euc_kr")
        if len(b) == 2 and 0xB0 <= b[0] <= 0xC8:
            out.append(chr(c))
    return "".join(out)


def site_hangul():
    """소스에 실제로 등장하는 한글 음절."""
    txt = ""
    for pat in ("app/**/*.jsx", "components/**/*.jsx", "lib/**/*.js"):
        for p in glob.glob(str(ROOT / pat), recursive=True):
            txt += Path(p).read_text(encoding="utf-8")
    return "".join(sorted({c for c in txt if 0xAC00 <= ord(c) <= 0xD7A3}))


def subset(chars, out):
    text = ROOT / "scripts/.subset-chars.txt"
    text.write_text(chars, encoding="utf-8")
    try:
        subprocess.run(
            ["pyftsubset", str(SRC), f"--text-file={text}", f"--output-file={out}",
             "--flavor=woff2", "--layout-features=*", "--no-hinting",
             "--desubroutinize", "--drop-tables+=DSIG"],
            check=True,
        )
    finally:
        text.unlink(missing_ok=True)


def unicode_range(chars):
    """연속 구간으로 압축한 CSS unicode-range 문자열."""
    pts = sorted(ord(c) for c in chars)
    spans, start, prev = [], pts[0], pts[0]
    for c in pts[1:]:
        if c == prev + 1:
            prev = c
            continue
        spans.append((start, prev))
        start = prev = c
    spans.append((start, prev))
    return ",".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in spans)


def main():
    if not SRC.exists():
        sys.exit(f"원본 폰트를 찾을 수 없습니다: {SRC}")

    base = LATIN + PUNCT + JAMO
    core_chars = base + site_hangul()
    subset(core_chars, CORE)
    subset(base + ks_x_1001(), FULL)
    RANGE.write_text(unicode_range(core_chars) + "\n", encoding="utf-8")

    kb = lambda p: p.stat().st_size / 1024
    print(f"원본 {kb(SRC):7.0f} KB")
    print(f"core {kb(CORE):7.0f} KB  ({len(set(core_chars))}자) — 평소 이것만 받는다")
    print(f"full {kb(FULL):7.0f} KB  — core 밖의 글자가 나올 때만")
    print(f"\ncore 의 unicode-range → {RANGE}")
    print("app/globals.css 의 @font-face 에 붙여 넣는다 (full 을 먼저, core 를 나중에).")


if __name__ == "__main__":
    main()
