---
title: diff脚本(hash对比文件夹)
icon: fab fa-markdown
order: 8
category:
  - hash
tag:
  - hash
---

```python
import os
import sys
import hashlib


def is_text_file(file_path, sample_size=4096):
    try:
        with open(file_path, "rb") as f:
            chunk = f.read(sample_size)
        chunk.decode("utf-8")
        return True
    except UnicodeDecodeError:
        return False


def normalize_text_bytes(raw: bytes) -> bytes:
    if raw.startswith(b"\xef\xbb\xbf"):
        raw = raw[3:]
    raw = raw.replace(b"\r\n", b"\n")
    raw = raw.replace(b"\r", b"\n")
    return raw


def calc_hash(file_path, algo="sha256", chunk_size=8192):
    h = hashlib.new(algo)

    if is_text_file(file_path):
        with open(file_path, "rb") as f:
            raw = f.read()
        h.update(normalize_text_bytes(raw))
    else:
        with open(file_path, "rb") as f:
            while chunk := f.read(chunk_size):
                h.update(chunk)

    return h.hexdigest()


def get_all_files(base_dir):
    file_map = {}
    for root, _, files in os.walk(base_dir):
        for name in files:
            abs_path = os.path.join(root, name)
            rel_path = os.path.relpath(abs_path, base_dir)
            file_map[rel_path] = abs_path
    return file_map


def compare_dirs(dir1, dir2, algo="sha256"):
    files1 = get_all_files(dir1)
    files2 = get_all_files(dir2)

    same = []
    diff = []
    only_in_dir1 = []
    only_in_dir2 = []

    for rel_path, file1 in files1.items():
        if rel_path not in files2:
            only_in_dir1.append(rel_path)
            continue

        file2 = files2[rel_path]
        hash1 = calc_hash(file1, algo)
        hash2 = calc_hash(file2, algo)

        if hash1 == hash2:
            same.append(rel_path)
        else:
            diff.append((rel_path, hash1, hash2))

    for rel_path in files2:
        if rel_path not in files1:
            only_in_dir2.append(rel_path)

    return same, diff, only_in_dir1, only_in_dir2


def main():
    if len(sys.argv) != 3:
        print("用法:")
        print("  python compare_dir_hash.py <目录1> <目录2>")
        sys.exit(1)

    dir1 = os.path.abspath(sys.argv[1])
    dir2 = os.path.abspath(sys.argv[2])

    if not os.path.isdir(dir1) or not os.path.isdir(dir2):
        print("错误：目录不存在")
        sys.exit(1)

    same, diff, only1, only2 = compare_dirs(dir1, dir2)

    print(f"\n✅ Hash 相同文件（{len(same)}）")
    for f in same:
        print(f"  {f}")

    print(f"\n❌ Hash 不同文件（{len(diff)}）")
    for f, h1, h2 in diff:
        print(f"  {f}")
        print(f"    dir1: {h1}")
        print(f"    dir2: {h2}")

    print(f"\n📁 只在 dir1 中存在（{len(only1)}）")
    for f in only1:
        print(f"  {f}")

    print(f"\n📁 只在 dir2 中存在（{len(only2)}）")
    for f in only2:
        print(f"  {f}")


if __name__ == "__main__":
    main()
```