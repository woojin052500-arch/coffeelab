#!/usr/bin/env python3
"""제품·과실 사진의 배경을 지우고 피사체에 맞춰 잘라낸다.

원본은 피사체가 프레임의 절반 남짓만 차지하고 나머지는 빈 스튜디오 배경이라,
화면 폭에 맞춰 늘리면 여백만 커지고 해상도는 낭비된다. GrabCut 으로 배경을
알파로 빼고 피사체 바운딩 박스에 맞춰 잘라 저장한다.

    pip install pillow numpy scipy opencv-python-headless
    python3 scripts/cutout.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/img"
OUT = ROOT / "public/img/cutout"

# (이름, 초기 사각형 여백 비율, 잘라낸 뒤 남길 여백 비율)
TARGETS = [
    ("fruit-strawberry", 0.06, 0.03),
    ("fruit-grape", 0.06, 0.03),
    ("fruit-apple", 0.06, 0.03),
    ("pkg-jeju", 0.05, 0.04),
    ("pkg-nonsan", 0.05, 0.04),
    ("pkg-wonju", 0.02, 0.04),  # 분홍 상자가 배경과 대비가 약해 넓게 잡는다
    ("package-all", 0.04, 0.04),
]


def cutout(bgr, inset):
    """GrabCut 으로 전경 확률 마스크를 만든다."""
    h, w = bgr.shape[:2]
    mx, my = int(w * inset), int(h * inset)
    rect = (mx, my, w - 2 * mx, h - 2 * my)

    mask = np.zeros((h, w), np.uint8)
    cv2.grabCut(bgr, mask, rect, np.zeros((1, 65), np.float64),
                np.zeros((1, 65), np.float64), 6, cv2.GC_INIT_WITH_RECT)
    fg = np.isin(mask, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)

    # 티끌 제거 → 구멍 메우기 → 가장 큰 덩어리만
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8), iterations=2)
    fg = ndimage.binary_fill_holes(fg).astype(np.uint8)
    # 피사체가 여러 조각일 수 있다(상자 뚜껑과 본체, 세트 3개). 가장 큰 조각만
    # 남기면 반쪽이 날아가므로, 일정 크기 이상인 조각은 모두 살린다.
    lab, n = ndimage.label(fg)
    if not n:
        return None
    sizes = ndimage.sum(fg, lab, range(1, n + 1))
    keep = [i + 1 for i, sz in enumerate(sizes) if sz >= sizes.max() * 0.12]
    fg = np.isin(lab, keep).astype(np.uint8)
    fg = ndimage.binary_fill_holes(fg).astype(np.uint8)

    # 2차 패스: 1차 결과를 삼분 지도로 바꿔 경계만 다시 판정한다.
    # 뚜껑 모서리처럼 배경과 대비가 약한 부분이 깎여 나가는 걸 되살린다.
    trimap = np.full(fg.shape, cv2.GC_PR_BGD, np.uint8)
    trimap[cv2.dilate(fg, np.ones((3, 3), np.uint8), iterations=5) == 0] = cv2.GC_BGD
    trimap[cv2.erode(fg, np.ones((3, 3), np.uint8), iterations=5) == 1] = cv2.GC_FGD
    cv2.grabCut(bgr, trimap, None, np.zeros((1, 65), np.float64),
                np.zeros((1, 65), np.float64), 4, cv2.GC_INIT_WITH_MASK)
    fg2 = np.isin(trimap, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)
    fg2 = ndimage.binary_fill_holes(fg2).astype(np.uint8)
    lab, n = ndimage.label(fg2)
    if n:
        sizes = ndimage.sum(fg2, lab, range(1, n + 1))
        keep = [i + 1 for i, sz in enumerate(sizes) if sz >= sizes.max() * 0.12]
        fg = ndimage.binary_fill_holes(np.isin(lab, keep)).astype(np.uint8)

    # 경계를 1px 안쪽으로 당기고 부드럽게 — 배경색 테두리가 남지 않게
    fg = cv2.erode(fg, np.ones((3, 3), np.uint8), iterations=1)
    return np.clip(cv2.GaussianBlur(fg.astype(np.float32), (0, 0), 0.8), 0, 1)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, inset, margin in TARGETS:
        src = SRC / f"{name}.webp"
        if not src.exists():
            sys.exit(f"원본 없음: {src}")
        im = Image.open(src).convert("RGB")
        alpha = cutout(cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR), inset)
        if alpha is None:
            sys.exit(f"피사체를 찾지 못했습니다: {name}")

        ys, xs = np.where(alpha > 0.4)
        pad_y = int((ys.max() - ys.min()) * margin)
        pad_x = int((xs.max() - xs.min()) * margin)
        box = (max(0, xs.min() - pad_x), max(0, ys.min() - pad_y),
               min(im.width, xs.max() + 1 + pad_x), min(im.height, ys.max() + 1 + pad_y))

        rgba = np.dstack([np.asarray(im).astype(np.float32), alpha * 255]).astype(np.uint8)
        img = Image.fromarray(rgba, "RGBA").crop(box)
        img.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6, exact=True)
        kb = (OUT / f"{name}.webp").stat().st_size / 1024
        print(f"{name:18} {im.size} → {img.size}  {kb:5.1f} KB")


if __name__ == "__main__":
    main()
