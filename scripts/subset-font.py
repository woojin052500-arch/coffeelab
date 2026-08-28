#!/usr/bin/env python3
"""app/fonts/WantedSansVariable.woff2 → 웹용 서브셋을 다시 만든다.

원본은 현대 한글 11,172자를 모두 담고 있어 1.26MB다. 본문에 실제로 쓰이는
글자는 KS X 1001 상용 2,350자 안에 모두 들어가므로, 그 범위 + 라틴 + 문장부호만
남겨 320KB로 줄인다. 이 범위 밖의 희귀 음절은 CSS의 시스템 폰트로 대체된다.

    pip install fonttools brotli
    python3 scripts/subset-font.py
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "app/fonts/WantedSansVariable.woff2"
OUT = ROOT / "app/fonts/WantedSansVariable.subset.woff2"

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


def main():
    if not SRC.exists():
        sys.exit(f"원본 폰트를 찾을 수 없습니다: {SRC}")

    chars = LATIN + PUNCT + JAMO + ks_x_1001()
    text = ROOT / "scripts/.subset-chars.txt"
    text.write_text(chars, encoding="utf-8")
    try:
        subprocess.run(
            [
                "pyftsubset", str(SRC),
                f"--text-file={text}",
                f"--output-file={OUT}",
                "--flavor=woff2",
                "--layout-features=*",
                "--no-hinting",
                "--desubroutinize",
                "--drop-tables+=DSIG",
            ],
            check=True,
        )
    finally:
        text.unlink(missing_ok=True)

    print(f"{SRC.stat().st_size / 1024:.0f} KB → {OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
