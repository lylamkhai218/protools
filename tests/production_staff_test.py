"""CLI employee administration against the disposable SQLite fixture only."""
from pathlib import Path
import subprocess,json,os,sqlite3
root=Path(__file__).resolve().parents[1]
fixture=root/'scratch/production-test.sqlite'
assert fixture.is_file()
env=dict(os.environ,TTVINA_TEST_SQLITE=str(fixture))
base={'employee_code':'LOCAL-NEW','full_name':'Fixture employee','workshop_role':'CNC','initial_password':'FixtureOnlyPassword-2026','approved_by_user_id':1,'reason':'Local fixture test'}
def run(payload):
 return subprocess.run([str(root/'scratch/php/php.exe'),str(root/'scripts/production_staff.php')],input=json.dumps(payload),text=True,capture_output=True,env=env,cwd=root)
assert run(dict(base,approved_by_user_id=2)).returncode==1
assert run(dict(base,workshop_role='ADMIN')).returncode==1
assert run(base).returncode==0
with sqlite3.connect(fixture)as db:
 row=db.execute('SELECT status,must_change_password,session_version FROM tt_users WHERE employee_code=?',('LOCAL-NEW',)).fetchone()
 assert row==(1,1,1)
result=run({'employee_code':'LOCAL-NEW','disable':True,'approved_by_user_id':1,'reason':'End local test'})
assert result.returncode==0,result.stderr
with sqlite3.connect(fixture)as db:
 assert db.execute('SELECT status,session_version FROM tt_users WHERE employee_code=?',('LOCAL-NEW',)).fetchone()==(0,2)
 assert db.execute("SELECT COUNT(*) FROM tt_production_audit WHERE action IN ('employee_created','employee_disabled')").fetchone()[0]==2
print('PASS 6 local staff administration assertions: scope, first change, disable, audit')
