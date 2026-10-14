"""Product cutouts for two catalogue images (Noi, la qualità, Catalogo 2026 pp. 13 and 23).
Uses only original pixels: rembg isnet mask + white-background colour matte (cheese) /
reflection removal (honey) + colour decontamination against white."""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
S = sys.argv[1]  # working dir with bg/<name>-orig.jpeg and bg/out/<name>-isnet-general-use.png
WHITE = 254.0

def load(name):
    rgb = np.asarray(Image.open(f'{S}/bg/{name}-orig.jpeg').convert('RGB')).astype(np.float32)
    isnet = np.asarray(Image.open(f'{S}/bg/out/{name}-isnet-general-use.png'))[..., 3].astype(np.float32) / 255
    return rgb, isnet

def decontaminate(rgb, a):
    """Remove the white background's contribution from semi-transparent edge pixels:
    I = a*F + (1-a)*W  ->  F = (I - (1-a)*W) / a"""
    a3 = np.clip(a, 1e-3, 1)[..., None]
    f = (rgb - (1 - a3) * WHITE) / a3
    f = np.where(a3 > 0.98, rgb, f)  # leave opaque pixels untouched
    return np.clip(f, 0, 255)

def drop_specks(a, min_px):
    lab, n = ndi.label(a > 0.08)
    sizes = ndi.sum(np.ones_like(a), lab, index=np.arange(1, n + 1))
    small = np.isin(lab, np.where(sizes < min_px)[0] + 1)
    a = a.copy(); a[small] = 0
    return a

def save(rgb, a, name, min_px=0):
    a = np.clip(a, 0, 1)
    if min_px: a = drop_specks(a, min_px)
    # 1 px choke on near-white pixels of the OUTER edge only (prevents a light fringe on dark
    # backgrounds; interior white labels are untouched).
    outer = ndi.binary_dilation(a <= 0.03, iterations=2)
    fringe = outer & (a > 0.03) & (a < 0.8) & (rgb.min(axis=2) > 225)
    a = np.where(fringe, a * 0.35, a)
    out = np.dstack([decontaminate(rgb, a), a * 255]).astype(np.uint8)
    out[..., 3][out[..., 3] <= 8] = 0               # clear invisible residue so the crop is tight
    im = Image.fromarray(out)
    bbox = im.getbbox()
    pad = 6
    bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(im.width, bbox[2] + pad), min(im.height, bbox[3] + pad))
    im = im.crop(bbox)
    im.save(f'{S}/bg/final-{name}.png', optimize=True)
    print(name, 'final size', im.size)
    return im

# ---------------------------------------------------------------- caciocavallo
rgb, isnet = load('vinaccia')
lum = rgb.mean(axis=2)
dark = WHITE - rgb.min(axis=2)                       # distance from white (darkest channel)
sat = rgb.max(axis=2) - rgb.min(axis=2)
mn = rgb.min(axis=2)
neutral = sat < 16
# Edge opacity by unmixing against the nearest foreground colour: I = a*F + (1-a)*W,
# with F estimated as the darkest value within 4 px (the crumb / rind the pixel belongs to).
lf = ndi.grey_erosion(mn, size=(9, 9))
a_un = np.clip((WHITE - mn) / np.maximum(WHITE - lf, 40), 0, 1)
a_un[neutral & (lf > 150)] = 0                        # grey with no dark object nearby = shadow, handled below
a_un[a_un < 0.08] = 0
# Coloured cheese (cream rind, yellow paste): saturation-based ramp.
t = np.clip((sat - 14) / (40 - 14), 0, 1)
col_obj = t * t * (3 - 2 * t)
col_obj[neutral] = 0
body = ndi.binary_fill_holes(isnet > 0.5) & ~(neutral & (lum > 185))   # exclude the grey reflective surface
body = ndi.binary_opening(body, iterations=2)
obj = np.maximum.reduce([a_un, ndi.gaussian_filter(col_obj, 0.6), ndi.gaussian_filter(body.astype(np.float32), 0.8)])
obj[obj < 0.05] = 0
obj = drop_specks(obj, 6)
# Contact shadow: the photo's soft grey shadow, re-expressed as black at the opacity of its
# darkening, so it darkens any background instead of showing as a pale patch on dark ones.
shade = np.clip((WHITE - lum) / WHITE, 0, 1) * 1.15
near = ndi.binary_dilation(obj > 0.5, iterations=40)  # only around the product
sh = np.where(neutral & near & (obj < 0.5), shade, 0)
sh = ndi.gaussian_filter(sh, 1.5)
sh[sh < 0.015] = 0
# composite object over shadow layer
fg = decontaminate(rgb, np.clip(obj, 0, 1))
# where the unmixing drove the estimate, use the local foreground colour directly (no white carried over)
use_lf = (a_un > 0) & (a_un < 0.98) & (obj == a_un)
fg = np.where(use_lf[..., None], np.minimum(fg, np.dstack([ndi.grey_erosion(rgb[..., c], size=(9, 9)) for c in range(3)]) + 25), fg)
a = obj + sh * (1 - obj)
col = (fg * obj[..., None]) / np.clip(a, 1e-3, 1)[..., None]   # shadow colour is black
out = np.dstack([np.clip(col, 0, 255), np.clip(a, 0, 1) * 255]).astype(np.uint8)
out[..., 3][out[..., 3] <= 8] = 0
im = Image.fromarray(out)
bb = im.getbbox(); im = im.crop((max(0, bb[0] - 6), max(0, bb[1] - 6), min(im.width, bb[2] + 6), min(im.height, bb[3] + 6)))
im.save(f'{S}/bg/final-vinaccia.png', optimize=True)
print('vinaccia final size', im.size)

# ---------------------------------------------------------------------- honey
rgb, isnet = load('miele')
h, w = isnet.shape
hsv = np.asarray(Image.fromarray(rgb.astype(np.uint8)).convert('HSV')).astype(np.float32) / 255
s, v = hsv[..., 1], hsv[..., 2]
jarlike = ((s > 0.45) & (v < 0.92)) | (v < 0.35)     # saturated honey/gold or dark honey; the reflection has none
obj = isnet > 0.5
cols = np.where(obj.any(axis=0))[0]
# split into stacks by gaps in the column projection
groups, start = [], cols[0]
for a_, b_ in zip(cols[:-1], cols[1:]):
    if b_ - a_ > 15:
        groups.append((start, a_)); start = b_
groups.append((start, cols[-1]))
alpha = isnet.copy()
for x0, x1 in groups:
    if x1 - x0 < 60: continue
    g = jarlike[:, x0:x1 + 1] & obj[:, x0:x1 + 1]
    prof = g.mean(axis=1)
    ys = np.where(obj[:, x0:x1 + 1].any(axis=1))[0]
    top = ys[0]
    # base: last row of real honey colour (the faded reflection below contains none)
    rows = np.where(prof > 0.12)[0]
    base = int(rows[-1]) + 1
    # per-column refinement: last jar-like pixel within [base-90, base+25]
    cut = np.full(x1 - x0 + 1, base, dtype=np.float32)
    for i, x in enumerate(range(x0, x1 + 1)):
        win = jarlike[base - 90:base + 25, x] & obj[base - 90:base + 25, x]
        idx = np.where(win)[0]
        if len(idx): cut[i] = base - 90 + idx[-1] + 1
    cut = ndi.median_filter(cut, size=25, mode='nearest')
    cut = ndi.gaussian_filter1d(cut, 4)
    yy = np.arange(h)[:, None]
    keep = np.clip((cut[None, :] - yy + 1.5) / 3.0, 0, 1)   # ~3 px soft edge at the base
    alpha[:, x0:x1 + 1] *= keep
    # Remove thin slivers (glass edge / reflection, < ~18 px wide) left at the jar's lower
    # corners: morphological opening, applied only in a band around the base.
    y0, y1 = int(cut.min()) - 90, int(cut.max()) + 30
    band = alpha[y0:y1, x0:x1 + 1]
    yy_, xx_ = np.mgrid[-9:10, -9:10]
    disk = (xx_ ** 2 + yy_ ** 2) <= 81
    opened = ndi.binary_opening(band > 0.5, structure=disk)
    opened = ndi.gaussian_filter(opened.astype(np.float32), 1.0)
    alpha[y0:y1, x0:x1 + 1] = np.minimum(band, opened)
    print('stack', (x0, x1), 'base row', base, 'cut range', int(cut.min()), int(cut.max()))
alpha = ndi.gaussian_filter(alpha, 0.5)
save(rgb, alpha, 'miele', min_px=1500)
