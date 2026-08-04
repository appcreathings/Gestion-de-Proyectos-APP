import json
from pathlib import Path

data = json.loads(Path('graphify-out/graph.json').read_text(encoding='utf-8'))
nodes = data['nodes']
communities = {}

for node in nodes:
    comm = node.get('community', 'unknown')
    communities[comm] = communities.get(comm, 0) + 1

sorted_comms = sorted(communities.items(), key=lambda x: x[1], reverse=True)
print('Top 10 communities by size:')
for comm_id, count in sorted_comms[:10]:
    print(f'Community {comm_id}: {count} nodes')

print(f'\nTotal communities: {len(communities)}')
print(f'Total nodes: {len(nodes)}')
print(f'Total edges: {len(data["edges"])}')

# Sample nodes from top communities
print('\nSample nodes from top 3 communities:')
for comm_id, _ in sorted_comms[:3]:
    print(f'\nCommunity {comm_id} samples:')
    comm_nodes = [n for n in nodes if n.get('community') == comm_id][:5]
    for node in comm_nodes:
        print(f'  - {node["label"]} ({node.get("source_file", "unknown")})')