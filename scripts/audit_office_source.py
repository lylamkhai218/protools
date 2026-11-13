"""Print locations, never values, for potentially embedded Office credentials."""
from pathlib import Path
import re
files=['api.php','api_production.php','auth.php','config.php','index.php','san-xuat.php','production_http.php','production_service.php','production_schema.php','production_page.php']
patterns=[r"password_hash\(\s*['\"][^'\"]+",r"(?:password|passwd|token|secret|api_key)\s*=\s*['\"][^'\"]+",r"\d{8,12}:[A-Za-z0-9_-]{30,}",r"define\(['\"](?:DB_PASS|TTVINA_SECRET_KEY|TELEGRAM_BOT_TOKEN)['\"],\s*['\"][^'\"]+"]
hits=[]
for name in files:
 p=Path('public/office')/name
 for number,line in enumerate(p.read_text(encoding='utf-8').splitlines(),1):
  if any(re.search(pattern,line,re.I) for pattern in patterns):hits.append(f'{p.as_posix()}:{number} potential embedded secret (value suppressed)')
print('\n'.join(hits) if hits else 'PASS: no literal credentials matched in reviewed Office source')
raise SystemExit(bool(hits))
