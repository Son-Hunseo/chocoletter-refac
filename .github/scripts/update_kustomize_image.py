import argparse
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("file")
parser.add_argument("--image", required=True)
parser.add_argument("--new-name", required=True)
parser.add_argument("--new-tag", required=True)
args = parser.parse_args()

path = Path(args.file)
lines = path.read_text().splitlines()
in_target = False
changed_name = False
changed_tag = False

for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == f"- name: {args.image}":
        in_target = True
        continue
    if in_target and stripped.startswith("- name: "):
        break
    if in_target and stripped.startswith("newName:"):
        indent = line[: len(line) - len(line.lstrip())]
        lines[i] = f"{indent}newName: {args.new_name}"
        changed_name = True
    if in_target and stripped.startswith("newTag:"):
        indent = line[: len(line) - len(line.lstrip())]
        lines[i] = f'{indent}newTag: "{args.new_tag}"'
        changed_tag = True

if not changed_name or not changed_tag:
    raise SystemExit(f"newName/newTag for {args.image} not found in {path}")

path.write_text("\n".join(lines) + "\n")
