import json
from pathlib import Path

detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-16'))
docs = detect.get('files', {}).get('document', [])
print('Document files:')
print('Total: {} files'.format(len(docs)))
print('Sample files:')
for f in docs[:5]:
    print('  {}'.format(f))