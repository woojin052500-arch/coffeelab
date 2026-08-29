#!/usr/bin/env python3
"""상자 사진을 피사체에 맞춰 잘라내고, 사진의 배경색을 함께 알려준다.

원본은 피사체가 프레임의 절반 남짓만 차지하고 나머지는 빈 스튜디오 배경이라,
화면 폭에 맞춰 늘리면 여백만 커지고 해상도는 낭비된다.

배경을 알파로 빼는 방식은 쓰지 않는다. 분홍 상자처럼 배경과 명도가 거의 같은
컷은 어떤 자동 분리도 상자를 파먹거나 배경을 못 지우거나 둘 중 하나였다.
(배경 대비가 뚜렷한 과실 사진은 scripts/cutout.py 가 알파로 분리한다.)
대신 사진은 그대로 두고 잘라내기만 한 뒤, 그 사진의 배경색을 웹 페이지의
바탕색으로 쓴다. 이러면 사진 경계가 보이지 않으면서 잘릴 위험은 0 이다.

    pip install pillow numpy scipy opencv-python-headless
    python3 scripts/crop-photos.py
"""

import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/img"
OUT = ROOT / "public/img/crop"

TARGETS = ["pkg-jeju", "pkg-nonsan", "pkg-wonju"]

TOLS = (2, 3, 4, 5, 6, 7, 8, 10)
MARGIN = 0.03      # 잘라낸 뒤 남길 여백(피사체 크기 대비)


def _flood_background(bgr, tol):
    """테두리에서 배경만 번지게 한다. 뚜렷한 색 경계는 넘지 못한다."""
    h, w = bgr.shape[:2]
    filled = np.zeros((h, w), bool)
    # 좌우 가장자리는 피사체가 닿아 있을 수 있어 위아래에서만 씨를 뿌린다
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    seeds += [(int(w * f), 0) for f in (0.2, 0.4, 0.6, 0.8)]
    seeds += [(int(w * f), h - 1) for f in (0.2, 0.4, 0.6, 0.8)]
    for sx, sy in seeds:
        if filled[sy, sx]:
            continue
        m = np.zeros((h + 2, w + 2), np.uint8)
        m[1:-1, 1:-1] = filled.astype(np.uint8)
        cv2.floodFill(bgr.copy(), m, (sx, sy), 0, (tol,) * 3, (tol,) * 3,
                      4 | cv2.FLOODFILL_MASK_ONLY | (255 << 8))
        filled |= m[1:-1, 1:-1] > 0
    fg = ndimage.binary_fill_holes(~filled).astype(np.uint8)
    lab, n = ndimage.label(fg)
    if not n:
        return None
    sizes = ndimage.sum(fg, lab, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * 0.05]
    return ndimage.binary_fill_holes(np.isin(lab, keep)).astype(np.uint8)


def subject_box(bgr):
    """자를 범위를 정한다.

    허용치를 키우면 배경이 더 지워지다가, 경계를 넘는 순간 피사체까지 삼켜
    면적이 급락한다. 급락 직전 값을 쓰면 피사체를 자르지 않는다.
    """
    prev_area, chosen = None, None
    for tol in TOLS:
        fg = _flood_background(cv2.GaussianBlur(bgr, (0, 0), 0.8), tol)
        if fg is None:
            break
        area = int(fg.sum())
        if prev_area is not None and area < prev_area * 0.7:
            break                      # 경계를 넘었다 — 직전 것을 쓴다
        prev_area, chosen = area, fg
    if chosen is None:
        return None
    ys, xs = np.where(chosen)
    return xs.min(), xs.max(), ys.min(), ys.max()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    grounds = {}
    for name in TARGETS:
        src = SRC / f"{name}.webp"
        if not src.exists():
            sys.exit(f"원본 없음: {src}")
        im = Image.open(src).convert("RGB")
        bgr = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)

        box = subject_box(bgr)
        if box is None:
            sys.exit(f"피사체를 찾지 못했습니다: {name}")
        x0, x1, y0, y1 = box
        pad_x = int((x1 - x0) * MARGIN)
        pad_y = int((y1 - y0) * MARGIN)
        crop = im.crop((max(0, x0 - pad_x), max(0, y0 - pad_y),
                        min(im.width, x1 + 1 + pad_x), min(im.height, y1 + 1 + pad_y)))
        crop.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6)

        # 잘라낸 사진의 배경색 — 웹 페이지 바탕색으로 쓴다.
        # 배경이 위아래로 옅은 그라데이션이라 단색으로 깔면 사진 경계가 드러난다.
        # 위쪽 가장자리와 아래쪽 가장자리 색을 따로 뽑아 같은 방향 그라데이션을 만든다.
        a = np.asarray(crop).astype(np.float32)
        band = max(2, int(a.shape[0] * 0.04))
        side = max(2, int(a.shape[1] * 0.06))

        def edge_color(rows):
            """가장자리 픽셀 중 밝은 쪽(=배경) 색. 그림자·색 띠에 끌려가지 않게."""
            px = np.concatenate([rows[:, :side].reshape(-1, 3),
                                 rows[:, -side:].reshape(-1, 3)])
            bright = px[px.sum(axis=1) >= np.percentile(px.sum(axis=1), 70)]
            return np.median(bright, axis=0).round().astype(int)

        def hexed(c):
            return "#{:02x}{:02x}{:02x}".format(*c)

        top = edge_color(a[:band * 3])
        bot = edge_color(a[-band * 3:])
        grounds[name] = {"top": hexed(top), "bottom": hexed(bot)}
        kb = (OUT / f"{name}.webp").stat().st_size / 1024
        print(f"{name:18} {im.size} → {crop.size}  {kb:5.1f} KB  바탕 {grounds[name]['top']} → {grounds[name]['bottom']}")

    (OUT / "grounds.json").write_text(
        json.dumps(grounds, indent=2) + "\n", encoding="utf-8")
    print(f"\n바탕색 → {OUT / 'grounds.json'}")


if __name__ == "__main__":
    main()
