#!/usr/bin/env python3
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
participants_dir = root / "participants"
manifest_path = participants_dir / "manifest.json"

valid_entries = []
invalid_entries = []

for json_file in sorted(participants_dir.glob("*.json")):
    if json_file.name == manifest_path.name:
        continue

    try:
        data = json.loads(json_file.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            raise ValueError("JSON root is not an object")

        required = ["name", "city", "fundact"]
        missing = [field for field in required if field not in data]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")

        for field in required:
            if not isinstance(data[field], str):
                raise ValueError(f"Field '{field}' must be a string")

        valid_entries.append(
            {
                "file": json_file.name,
                "name": data["name"],
                "city": data["city"],
                "fundact": data["fundact"],
            }
        )
    except Exception as exc:  # noqa: BLE001 - CI must report invalid JSON clearly.
        invalid_entries.append({"file": json_file.name, "error": str(exc)})

manifest = {
    "participants": valid_entries,
    "invalid": invalid_entries,
}
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Manifest updated with {len(valid_entries)} valid participants and {len(invalid_entries)} invalid entries.")
if invalid_entries:
    for entry in invalid_entries:
        print(f"Invalid participant file {entry['file']}: {entry['error']}", file=sys.stderr)
    sys.exit(1)
