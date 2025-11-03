import json
import sys
from pathlib import Path


def json_to_jsonl(input_path: str, output_path: str):
    input_file = Path(input_path)
    output_file = Path(output_path)

    if not input_file.exists():
        print(f"❌ 输入文件不存在: {input_file}")
        return

    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 如果文件不是列表类型，直接包一层
    if not isinstance(data, list):
        data = [data]

    with open(output_file, "w", encoding="utf-8") as f:
        for item in data:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"✅ 已转换完成: {output_file} （共 {len(data)} 行）")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法: python json_to_jsonl.py 输入文件.json 输出文件.jsonl")
        sys.exit(1)

    json_to_jsonl(sys.argv[1], sys.argv[2])
