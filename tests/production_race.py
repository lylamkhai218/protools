"""Two independent PHP processes and PDO connections contend for one local fixture tool."""
from pathlib import Path
import subprocess
import json
import time
root=Path(__file__).resolve().parents[1]
php=root/'scratch/php/php.exe'
script=root/'tests/production_mariadb.php'
subprocess.run([str(php),str(script)],cwd=root,check=True)
start=time.time()+1
processes=[subprocess.Popen([str(php),str(script),'race',str(actor),str(start)],cwd=root,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True) for actor in (1,4)]
statuses=[]
for process in processes:
    stdout,stderr=process.communicate(timeout=20)
    assert process.returncode==0,(stdout,stderr)
    statuses.append(json.loads(stdout)['status'])
assert sorted(statuses)==[200,409],statuses
subprocess.run([str(php),str(script),'verify-race'],cwd=root,check=True)
print('PASS independent actors/connections: one success, one state conflict')
start=time.time()+1
processes=[subprocess.Popen([str(php),str(script),'race',str(actor),str(start),'wip'],cwd=root,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True) for actor in (1,4)]
statuses=[]
for process in processes:
    stdout,stderr=process.communicate(timeout=20)
    assert process.returncode==0,(stdout,stderr)
    statuses.append(json.loads(stdout)['status'])
assert sorted(statuses)==[200,409],statuses
subprocess.run([str(php),str(script),'verify-wip-race'],cwd=root,check=True)
print('PASS concurrent WIP issue: insufficient shared source is rejected atomically')
