import struct
import zlib
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "public" / "icons"
root.mkdir(parents=True, exist_ok=True)

colors = {
    "bg": (11, 11, 26, 255),
    "blue": (59, 130, 246, 255),
    "gold": (245, 158, 11, 255),
    "white": (255, 255, 255, 255),
}


def png_chunk(chunk_type, data):
    chunk = chunk_type + data
    return struct.pack(">I", len(data)) + chunk + struct.pack(">I", zlib.crc32(chunk) & 0xFFFFFFFF)


def write_png(path, pixels, width, height):
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(png_chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)))
        raw = b""
        for row in pixels:
            raw += b"\x00" + b"".join(bytes(px) for px in row)
        f.write(png_chunk(b"IDAT", zlib.compress(raw, 9)))
        f.write(png_chunk(b"IEND", b""))


def make_icon(size, padding=0):
    bg = colors["bg"]
    blue = colors["blue"]
    gold = colors["gold"]
    white = colors["white"]
    pixels = [[bg for _ in range(size)] for _ in range(size)]
    cx = cy = size // 2
    radius_sq = (size * 0.34) ** 2

    for y in range(size):
        for x in range(size):
            if padding and (x < padding or x >= size - padding or y < padding or y >= size - padding):
                continue
            dx = x - cx
            dy = y - cy
            if dx * dx + dy * dy < radius_sq:
                pixels[y][x] = blue
            elif ((x + y) % 20) < 6:
                pixels[y][x] = gold

    for i in range(size // 4, 3 * size // 4):
        x = i - size // 10
        y = i
        if 0 <= x < size:
            for dx in range(-2, 3):
                if 0 <= x + dx < size:
                    pixels[y][x + dx] = white

    return pixels


icon_specs = [
    ("icon-192x192.png", 192, 0),
    ("icon-512x512.png", 512, 0),
    ("icon-maskable-192x192.png", 192, 38),
    ("icon-maskable-512x512.png", 512, 102),
    ("apple-touch-icon.png", 180, 0),
]

for filename, size, padding in icon_specs:
    path = root / filename
    write_png(path, make_icon(size, padding), size, size)
    print(f"Created {path}")
