import json
from pathlib import Path
from collections import Counter

data = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-16'))
all_files = []
for cat in ('code', 'document', 'paper', 'image', 'video'):
    all_files.extend(data['files'].get(cat, []))

scan_root = data.get('scan_root', '')
subdirs = []
for f in all_files:
    if not f.startswith(scan_root):
        continue
    rel_path = f[len(scan_root):].lstrip('\\/')
    parts = rel_path.split('\\') if '\\' in rel_path else rel_path.split('/')
    first_part = parts[0] if parts else '(root)'
    subdirs.append(first_part)

dir_counts = Counter(subdirs)
top_5 = dir_counts.most_common(5)
print('Top 5 subdirectories by file count:')
for dir_name, count in top_5:
    print('  {}: {} files'.format(dir_name, count))