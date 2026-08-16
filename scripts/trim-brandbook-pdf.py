#!/usr/bin/env python3
"""Drop trailing empty PDF pages and crop leftover background at the bottom."""

from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image
from pypdf import PdfReader, PdfWriter


def render_page(pdf_path: Path, page_number: int, dpi: int, dest: Path) -> Path:
    prefix = dest / f"p{page_number}"
    subprocess.run(
        [
            "pdftoppm",
            "-f",
            str(page_number),
            "-l",
            str(page_number),
            "-r",
            str(dpi),
            "-png",
            str(pdf_path),
            str(prefix),
        ],
        check=True,
        capture_output=True,
    )
    matches = sorted(dest.glob(f"p{page_number}*.png"))
    if not matches:
        raise FileNotFoundError(f"pdftoppm produced no image for page {page_number}")
    return matches[0]


def row_empty_mask(image_path: Path) -> np.ndarray:
    arr = np.asarray(Image.open(image_path).convert("RGB")).astype(np.float32)
    row_std = arr.reshape(arr.shape[0], -1).std(axis=1)
    row_range = arr.max(axis=(1, 2)) - arr.min(axis=(1, 2))
    return (row_std < 7.5) & (row_range < 18)


def trailing_empty_ratio(mask: np.ndarray) -> float:
    if mask.size == 0:
        return 1.0
    last_content = np.where(~mask)[0]
    if last_content.size == 0:
        return 1.0
    trailing = mask.size - int(last_content[-1]) - 1
    return trailing / mask.size


def trim_pdf(pdf_path: Path) -> None:
    reader = PdfReader(str(pdf_path))
    writer = PdfWriter()
    kept = 0

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        for index, page in enumerate(reader.pages, start=1):
            png = render_page(pdf_path, index, 10, tmp_path)
            empty = row_empty_mask(png)
            empty_ratio = float(empty.mean())
            trailing = trailing_empty_ratio(empty)

            if empty_ratio >= 0.92 or trailing >= 0.9:
                print(f"drop page {index}: empty={empty_ratio:.1%} trailing={trailing:.1%}")
                continue

            if trailing >= 0.03:
                height = float(page.mediabox.height)
                keep_ratio = min(1.0, 1.0 - trailing + 0.008)
                new_bottom = float(page.mediabox.top) - height * keep_ratio
                page.mediabox.lower_left = (float(page.mediabox.left), new_bottom)
                page.cropbox.lower_left = (float(page.cropbox.left), new_bottom)
                print(
                    f"crop page {index}: keep {keep_ratio:.1%} "
                    f"(trailing empty {trailing:.1%})"
                )
            else:
                print(f"keep page {index}: empty={empty_ratio:.1%}")

            writer.add_page(page)
            kept += 1

    if kept == 0:
        raise SystemExit("trim aborted: every page looked empty")

    writer.write(str(pdf_path))
    print(f"wrote {kept} page(s) -> {pdf_path}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: trim-brandbook-pdf.py <pdf>")
    trim_pdf(Path(sys.argv[1]))
