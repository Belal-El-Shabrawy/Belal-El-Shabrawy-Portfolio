"""Builds public/intro/belal-particles.bin, the particle portrait in the home intro.

The photo itself never ships: this reduces it to a grid of brightness values,
one byte per particle, and components/ParticlePortrait.jsx draws each non-zero
cell as a dot. Re-run it after changing the source photo or the mask:

    pip install opencv-python numpy
    python scripts/make-intro-particles.py

File layout: byte 0 = columns, byte 1 = rows, then rows*columns brightness
bytes, row by row (0 = no particle).
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/images/belal-portrait.jpeg"
OUTPUT = ROOT / "public/intro/belal-particles.bin"
ROWS = 120

image = cv2.imread(str(SOURCE), cv2.IMREAD_GRAYSCALE)
height, width = image.shape

# Head and shoulders only. Drawn by hand for this photo: the chair's silver
# frame and the marble wall are brighter than the face and would otherwise
# turn into the brightest particles on screen.
mask = np.zeros((height, width), np.uint8)
cv2.ellipse(mask, (622, 785), (220, 285), 0, 0, 360, 255, -1)  # head and hair
cv2.ellipse(mask, (612, 1010), (125, 120), 0, 0, 360, 255, -1)  # neck
torso = np.array([[430, 1010], [790, 1010], [960, 1110], [1040, 1250], [1060, 1600],
                  [130, 1600], [160, 1250], [250, 1100]], np.int32)
cv2.fillPoly(mask, [torso], 255)
mask = cv2.GaussianBlur(mask, (0, 0), 20).astype(np.float32) / 255

# Local contrast and a little sharpening so the eyes and collar survive being
# reduced to one dot per cell, then a curve that keeps the black shirt as faint
# dots and lets the face carry the brightness.
contrast = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(image)
contrast = cv2.addWeighted(contrast, 1.6, cv2.GaussianBlur(contrast, (0, 0), 6), -0.6, 0)
value = mask * (0.05 + 0.95 * (contrast.astype(np.float32) / 255) ** 1.15)

crop = value[470:1600, 110:1110]
# Dissolve the torso from just above where the name sits, so the portrait has
# no hard bottom edge on screen.
fade = np.clip((1.0 - np.linspace(0, 1, crop.shape[0])) / 0.3, 0, 1) ** 1.5
crop = crop * fade[:, None]
cols = round(ROWS * crop.shape[1] / crop.shape[0])
grid = cv2.resize(crop, (cols, ROWS), interpolation=cv2.INTER_AREA)
cells = np.clip(grid * 255, 0, 255).astype(np.uint8)
cells[cells < 12] = 0

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_bytes(bytes([cols, ROWS]) + cells.tobytes())
print(f"{OUTPUT.relative_to(ROOT)}: {cols}x{ROWS} grid, {(cells > 0).sum()} particles")
