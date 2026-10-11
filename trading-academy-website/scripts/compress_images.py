from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from PIL import Image, ImageFile, ImageOps

ImageFile.LOAD_TRUNCATED_IMAGES = True

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}


def compress_image(input_path: Path, output_path: Path, target_kb: int = 200, quality_start: int = 88, max_width: int = 1800, max_height: int = 1800) -> tuple[bool, int, int]:
    try:
        with Image.open(input_path) as img:
            img = ImageOps.exif_transpose(img)

            if img.mode in {"RGBA", "LA", "P"}:
                img = img.convert("RGB")
            elif img.mode not in {"RGB", "L"}:
                img = img.convert("RGB")

            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

            quality = quality_start
            last_saved_size = 0

            while quality >= 40:
                output_path.parent.mkdir(parents=True, exist_ok=True)
                temp_path = output_path.with_suffix(output_path.suffix + ".tmp")

                img.save(
                    temp_path,
                    format="JPEG",
                    quality=quality,
                    optimize=True,
                    progressive=True,
                    subsampling=0,
                )

                size_kb = temp_path.stat().st_size / 1024
                last_saved_size = int(size_kb)

                if size_kb <= target_kb:
                    temp_path.replace(output_path)
                    return True, quality, last_saved_size

                temp_path.unlink(missing_ok=True)
                quality -= 6

            # Fallback: if still too large, keep the smallest quality and save anyway.
            img.save(
                output_path,
                format="JPEG",
                quality=40,
                optimize=True,
                progressive=True,
                subsampling=0,
            )
            return False, 40, int(output_path.stat().st_size / 1024)

    except Exception as exc:
        print(f"Error processing {input_path}: {exc}", file=sys.stderr)
        return False, 0, 0


def collect_images(folder: Path):
    files = []
    for path in sorted(folder.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(path)
    return files


def main():
    parser = argparse.ArgumentParser(description="Compress all images in a folder to a target file size while preserving quality.")
    parser.add_argument("input_dir", type=str, help="Folder with source images")
    parser.add_argument("output_dir", type=str, help="Folder for compressed images")
    parser.add_argument("--target-kb", type=int, default=220, help="Target maximum output size in KB (default: 220)")
    parser.add_argument("--quality-start", type=int, default=88, help="Starting JPEG quality (default: 88)")
    parser.add_argument("--max-width", type=int, default=1800, help="Maximum width in pixels (default: 1800)")
    parser.add_argument("--max-height", type=int, default=1800, help="Maximum height in pixels (default: 1800)")
    args = parser.parse_args()

    input_dir = Path(args.input_dir).resolve()
    output_dir = Path(args.output_dir).resolve()

    if not input_dir.exists():
        raise SystemExit(f"Input folder does not exist: {input_dir}")

    images = collect_images(input_dir)
    if not images:
        print(f"No images found in: {input_dir}")
        return

    total_original = 0
    total_compressed = 0

    for index, image_path in enumerate(images, start=1):
        relative_name = image_path.relative_to(input_dir)
        output_path = output_dir / relative_name

        original_size = image_path.stat().st_size
        total_original += original_size

        print(f"[{index}/{len(images)}] Compressing: {relative_name}")
        ok, quality, final_size = compress_image(
            image_path,
            output_path,
            target_kb=args.target_kb,
            quality_start=args.quality_start,
            max_width=args.max_width,
            max_height=args.max_height,
        )
        total_compressed += output_path.stat().st_size if output_path.exists() else 0

        if ok:
            print(f"  -> Saved at {quality}% quality, final size: {final_size} KB")
        else:
            print(f"  -> Reduced to minimum quality, final size: {final_size} KB")

    print("\nSummary:")
    print(f"Original total: {total_original / 1024:.1f} KB")
    print(f"Compressed total: {total_compressed / 1024:.1f} KB")
    print(f"Saved: {(total_original - total_compressed) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
