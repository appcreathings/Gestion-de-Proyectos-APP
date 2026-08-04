import json
from pathlib import Path
from collections import Counter

data = json.loads(Path('graphify-out/graph.json').read_text(encoding='utf-8'))
nodes = data['nodes']
edges = data.get('links', [])

# Find most connected nodes (high degree)
degree = Counter()
for edge in edges:
    source = edge['source']
    target = edge['target']
    degree[source] += 1
    degree[target] += 1

print('Most connected nodes (top 15):')
for node_id, count in degree.most_common(15):
    node = next((n for n in nodes if n['id'] == node_id), None)
    if node:
        print(f'  {node["label"]} ({count} connections) - {node.get("source_file", "unknown")}')

# Find files with most nodes
file_nodes = Counter()
for node in nodes:
    source_file = node.get('source_file', 'unknown')
    file_nodes[source_file] += 1

print('\nFiles with most nodes (top 10):')
for file_path, count in file_nodes.most_common(10):
    print(f'  {file_path}: {count} nodes')

# Analyze edge types
edge_types = Counter()
for edge in edges:
    edge_type = edge.get('relation', 'unknown')
    edge_types[edge_type] += 1

print('\nEdge types:')
for edge_type, count in edge_types.most_common():
    print(f'  {edge_type}: {count}')