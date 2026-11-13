"""Rebuild a local allowlisted graph, including ignored Office code. No cloud calls."""
from pathlib import Path
import json
import hashlib
import sys
from graphify.extract import extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all, label_communities_by_hub
from graphify.export import to_json
from graphify.report import generate
from graphify.analyze import god_nodes, surprising_connections, suggest_questions

root=Path(__file__).resolve().parents[1]
out=root/'graphify-out'; out.mkdir(exist_ok=True)
allow=[*root.glob('src/**/*.ts'),*root.glob('src/**/*.tsx')]
allow += [root/'public/office'/n for n in ['api.php','api_production.php','auth.php','config.php','san-xuat.php','production_http.php','production_service.php','production_schema.php','production_page.php','production-client.js','production-workbench.js','tool-scanner.js']]
allow += [root/'public/kho/index.php',root/'scripts/migrate_production.php']
files=[p for p in allow if p.is_file() and 'graphify-out' not in p.parts]
for p in files:
    # Reject literal secret assignments rather than silently index them.
    import re
    if re.search(r"define\(['\"](?:DB_PASS|TELEGRAM_BOT_TOKEN|TTVINA_SECRET_KEY)['\"],\s*['\"][^'\"]+['\"]",p.read_text(encoding='utf-8-sig')):
        raise SystemExit('Refusing literal secret in allowlisted source: '+str(p.relative_to(root)))
result=extract(files,cache_root=root,root=root,parallel=False)
semantic_path=root/'scratch/production-semantic.json'
if semantic_path.exists():
    semantic=json.loads(semantic_path.read_text(encoding='utf-8'))
    # Semantic evidence must still refer to existing files inside this workspace.
    for n in semantic['nodes']:
        p=Path(n['source_file']); p=p if p.is_absolute() else root/p
        p.resolve().relative_to(root)
        if not p.is_file(): raise SystemExit('Missing semantic source')
        n['source_file']=p.relative_to(root).as_posix()
    result['nodes'].extend(semantic['nodes']);result['edges'].extend(semantic['edges'])
    result['hyperedges']=semantic.get('hyperedges',[])
graph=build_from_json(result,root=root,directed=True)
communities=cluster(graph)
labels=label_communities_by_hub(graph,communities)
if not to_json(graph,communities,str(out/'graph.json'),community_labels=labels):
    raise SystemExit('Graph shrink guard refused; inspect corpus before replacing')
(out/'.graphify_root').write_text(str(root),encoding='utf-8')
(out/'.graphify_python').write_text(sys.executable,encoding='utf-8')
(out/'.graphify_labels.json').write_text(json.dumps(labels),encoding='utf-8')
questions=suggest_questions(graph,communities,labels)
detection={'total_files':len(files),'total_words':0,'files':{'code':[str(p) for p in files]}}
report=generate(graph,communities,score_all(graph,communities),labels,god_nodes(graph),surprising_connections(graph,communities),detection,{'input':0,'output':0},str(root),suggested_questions=questions)
report+='\n\n## Scope and cost honesty\nAllowlist includes Office and Kho sources regardless of Git ignore. No secrets, dumps, inventory documents or bulk images. AST local; semantic token cost not separately measured. Zero cost counters are not a claim of free semantic processing.\n'
(out/'GRAPH_REPORT.md').write_text(report,encoding='utf-8')
(out/'scope.json').write_text(json.dumps({'root':str(root),'files':{p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}},indent=2),encoding='utf-8')
print(f'Graph: {len(graph)} nodes, {graph.number_of_edges()} edges, {len(files)} code files; no network or cloud')
