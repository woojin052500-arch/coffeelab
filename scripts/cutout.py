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
# 잘라낸 뒤 남길 여백(피사체 크기 대비)
MARGIN = 0.035

# GrabCut 초기 사각형의 여백 후보. 이 사각형 바깥은 '확실한 배경'으로 못박히므로
# 값에 따라 뚜껑이 통째로 잘리기도 한다. 대비가 약한 분홍 상자는 특히 민감해서,
# 하나로 정하지 않고 후보를 모두 돌려 가장 많이 살아남는 마스크를 고른다.
INSETS = (0.008, 0.012, 0.02, 0.03, 0.05, 0.06)

TARGETS = [
    "fruit-strawberry",
    "fruit-grape",
    "fruit-apple",
    "pkg-jeju",
    "pkg-nonsan",
    "pkg-wonju",
    "package-all",
]


def _mask(bgr, inset):
    """주어진 초기 사각형으로 GrabCut 을 돌려 전경 마스크를 만든다."""
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

    # 경계를 1px 안쪽으로 당긴다 — 배경색 테두리가 남지 않게
    return cv2.erode(fg, np.ones((3, 3), np.uint8), iterations=1)


def _clean(fg):
    """티끌 제거 → 구멍 메우기 → 의미 있는 조각만 남기기."""
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8), iterations=2)
    fg = ndimage.binary_fill_holes(fg).astype(np.uint8)
    lab, n = ndimage.label(fg)
    if not n:
        return None
    sizes = ndimage.sum(fg, lab, range(1, n + 1))
    keep = [i + 1 for i, sz in enumerate(sizes) if sz >= sizes.max() * 0.12]
    return ndimage.binary_fill_holes(np.isin(lab, keep)).astype(np.uint8)


def _color_mask(bgr):
    """테두리에서 잰 배경색과의 거리로 자른다.

    분홍 상자를 크림 배경 위에 놓은 컷처럼 명도가 비슷하면 GrabCut 이 흔들린다.
    색 자체는 다르므로 거리 기준이 더 안정적일 때가 있어 후보로 함께 넣는다.
    """
    h, w = bgr.shape[:2]
    ring = max(3, int(min(h, w) * 0.02))
    rgb = bgr.astype(np.float32)
    border = np.concatenate([
        rgb[:ring].reshape(-1, 3), rgb[-ring:].reshape(-1, 3),
        rgb[:, :ring].reshape(-1, 3), rgb[:, -ring:].reshape(-1, 3),
    ])
    bg = np.median(border, axis=0)
    spread = np.percentile(np.abs(border - bg).sum(axis=1), 97)
    dist = np.abs(rgb - bg).sum(axis=2)
    fg = _clean((dist > max(spread * 1.6, 40)).astype(np.uint8))
    return None if fg is None else cv2.erode(fg, np.ones((3, 3), np.uint8), iterations=1)


def _drop_background_leak(bgr, fg):
    """마스크에 딸려 들어온 배경 조각을 걷어낸다.

    가장 넓은 마스크를 고르다 보면 상자 옆 배경이 사각형으로 묻어오기도 한다.
    배경색과 사실상 같은 색인 픽셀만 아주 좁은 기준으로 빼고, 구멍은 다시
    메운다(상자 안쪽은 색이 달라 영향받지 않는다).
    """
    h, w = bgr.shape[:2]
    ring = max(3, int(min(h, w) * 0.02))
    rgb = bgr.astype(np.float32)
    border = np.concatenate([
        rgb[:ring].reshape(-1, 3), rgb[-ring:].reshape(-1, 3),
        rgb[:, :ring].reshape(-1, 3), rgb[:, -ring:].reshape(-1, 3),
    ])
    bg = np.median(border, axis=0)
    # 피사체가 프레임 끝에 닿는 컷은 테두리 표본에 피사체가 섞여 편차가 커진다.
    # 그대로 쓰면 기준이 헐거워져 상자까지 깎이므로 상한을 둔다.
    tol = min(max(np.percentile(np.abs(border - bg).sum(axis=1), 50), 18.0), 70.0)
    same_as_bg = np.abs(rgb - bg).sum(axis=2) < tol

    trimmed = _clean((fg & ~same_as_bg).astype(np.uint8))
    if trimmed is None or trimmed.sum() < fg.sum() * 0.94:
        return fg          # 조금이라도 크게 깎이면 원래 마스크를 쓴다
    return trimmed


def cutout(bgr):
    """여러 초기 사각형을 시도해 피사체가 가장 온전히 남는 마스크를 고른다.

    잘려 나가면 면적이 줄어드니 면적은 클수록 좋다. 다만 배경까지 삼킨 마스크도
    면적이 크므로 프레임의 3/4 을 넘는 것은 버린다. 피사체가 프레임 끝에 닿는
    컷(원주 상자)도 있어서 '테두리에 닿으면 실격' 같은 기준은 쓸 수 없다.
    """
    h, w = bgr.shape[:2]
    cap = h * w * 0.75
    best, best_area = None, 0
    for fg in [_mask(bgr, i) for i in INSETS] + [_color_mask(bgr)]:
        if fg is None:
            continue
        area = int(fg.sum())
        if best_area < area <= cap:
            best, best_area = fg, area
    if best is None:
        return None
    best = _drop_background_leak(bgr, best)
    return np.clip(cv2.GaussianBlur(best.astype(np.float32), (0, 0), 0.8), 0, 1)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name in TARGETS:
        src = SRC / f"{name}.webp"
        if not src.exists():
            sys.exit(f"원본 없음: {src}")
        im = Image.open(src).convert("RGB")
        alpha = cutout(cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR))
        if alpha is None:
            sys.exit(f"피사체를 찾지 못했습니다: {name}")

        ys, xs = np.where(alpha > 0.4)
        pad_y = int((ys.max() - ys.min()) * MARGIN)
        pad_x = int((xs.max() - xs.min()) * MARGIN)
        box = (max(0, xs.min() - pad_x), max(0, ys.min() - pad_y),
               min(im.width, xs.max() + 1 + pad_x), min(im.height, ys.max() + 1 + pad_y))

        rgba = np.dstack([np.asarray(im).astype(np.float32), alpha * 255]).astype(np.uint8)
        img = Image.fromarray(rgba, "RGBA").crop(box)
        img.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6, exact=True)
        kb = (OUT / f"{name}.webp").stat().st_size / 1024
        print(f"{name:18} {im.size} → {img.size}  {kb:5.1f} KB")


if __name__ == "__main__":
    main()
