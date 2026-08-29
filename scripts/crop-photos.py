#!/usr/bin/env python3
"""상자 사진을 상자에 맞춰 잘라내고, 사진의 배경색을 함께 알려준다.

원본은 상자가 프레임의 절반 남짓만 차지하고 나머지는 빈 스튜디오 배경이라,
화면 폭에 맞춰 늘리면 여백만 커지고 해상도는 낭비된다.

배경을 알파로 빼는 방식은 쓰지 않는다. 분홍 상자처럼 배경과 명도가 거의 같은
컷은 어떤 자동 분리도 상자를 파먹거나 배경을 못 지우거나 둘 중 하나였다.
(배경 대비가 뚜렷한 과실 사진은 scripts/cutout.py 가 알파로 분리한다.)

대신 사진은 그대로 두고 잘라내기만 한 뒤, 그 사진의 배경색을 웹 페이지의
바탕색으로 쓴다. 사진 경계가 보이지 않으면서 잘릴 위험은 0 이다.

범위는 색이 아니라 윤곽으로 찾는다. 배경은 매끄러워 기울기가 거의 없고 상자는
접힌 선·인쇄·모서리가 있어, 열/행별 윤곽 세기만 봐도 배경 대비와 무관하게
상자가 어디부터 어디까지인지 알 수 있다.

    pip install pillow numpy opencv-python-headless
    python3 scripts/crop-photos.py
"""

import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/img"
OUT = ROOT / "public/img/crop"

TARGETS = ["pkg-jeju", "pkg-nonsan", "pkg-wonju"]

EDGE_FLOOR = 6.0    # 이보다 약한 기울기는 배경의 그라데이션으로 본다
# 임계값은 '최대값의 몇 %'가 아니라 '배경 바닥값보다 얼마나 높은가'로 잡는다.
# 최대값 기준으로 하면 그늘진 덮개 가장자리처럼 윤곽이 약한 부분이 잘려 나간다.
SPAN_FRAC = 0.015
PAD_PX = 6          # 판정 오차를 흡수할 여유. 배경이 조금 남는 건 바탕색과 같아 안 보인다
MARGIN = 0.02       # 잘라낸 뒤 남길 여백(피사체 크기 대비)


def subject_box(rgb):
    """열·행별 윤곽 세기로 피사체 범위를 찾는다."""
    g = cv2.GaussianBlur(cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32), (0, 0), 1.0)
    mag = np.hypot(cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3),
                   cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3))
    mag[mag < EDGE_FLOOR] = 0

    def span(profile):
        p = cv2.GaussianBlur(profile.reshape(1, -1), (0, 0), 3).ravel()
        base = np.percentile(p, 10)               # 배경만 있는 구간의 세기
        idx = np.flatnonzero(p > base + (p.max() - base) * SPAN_FRAC)
        if not len(idx):
            return None
        return max(0, int(idx.min()) - PAD_PX), min(len(p) - 1, int(idx.max()) + PAD_PX)

    xs = span(mag.sum(axis=0))
    ys = span(mag.sum(axis=1))
    return None if xs is None or ys is None else (xs[0], xs[1], ys[0], ys[1])


def ground_colors(rgb, box):
    """상자 바로 위·아래의 배경색. 웹 페이지 바탕 그라데이션으로 쓴다."""
    x0, x1, y0, y1 = box
    h = rgb.shape[0]

    def sample(rows):
        if not len(rows):
            return None
        px = rows[:, x0:x1 + 1].reshape(-1, 3).astype(np.float32)
        bright = px[px.sum(axis=1) >= np.percentile(px.sum(axis=1), 60)]
        return np.median(bright, axis=0)

    top = sample(rgb[max(0, y0 - 14):y0])
    bot = sample(rgb[y1 + 1:min(h, y1 + 15)])
    if top is None:
        top = bot
    if bot is None:
        bot = top
    fmt = lambda c: "#{:02x}{:02x}{:02x}".format(*c.round().astype(int))
    return fmt(top), fmt(bot)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    grounds = {}
    for name in TARGETS:
        src = SRC / f"{name}.webp"
        if not src.exists():
            sys.exit(f"원본 없음: {src}")
        im = Image.open(src).convert("RGB")
        rgb = np.asarray(im)

        box = subject_box(rgb)
        if box is None:
            sys.exit(f"피사체를 찾지 못했습니다: {name}")
        x0, x1, y0, y1 = box
        top, bot = ground_colors(rgb, box)

        pad_x = int((x1 - x0) * MARGIN)
        pad_y = int((y1 - y0) * MARGIN)
        crop = im.crop((max(0, x0 - pad_x), max(0, y0 - pad_y),
                        min(im.width, x1 + 1 + pad_x), min(im.height, y1 + 1 + pad_y)))
        crop.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6)

        grounds[name] = {"top": top, "bottom": bot}
        kb = (OUT / f"{name}.webp").stat().st_size / 1024
        print(f"{name:12} {im.size} → {crop.size}  {kb:5.1f} KB  바탕 {top} → {bot}")

    (OUT / "grounds.json").write_text(json.dumps(grounds, indent=2) + "\n", encoding="utf-8")
    print(f"\n바탕색 → {OUT / 'grounds.json'}")


if __name__ == "__main__":
    main()
