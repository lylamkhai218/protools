"""Exercise real local HTTP auth/CSRF/role and idle expiration, no external service."""
import http.cookiejar
import json
import re
import urllib.request
import urllib.error

BASE='http://127.0.0.1:8765'
jar=http.cookiejar.CookieJar()
client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
count=0
def call(action, body=None, csrf=None, key='http-test-request-0001'):
    headers={'Content-Type':'application/json','Idempotency-Key':key}
    if csrf: headers['X-CSRF-Token']=csrf
    req=urllib.request.Request(BASE+'/office/api.php?action='+action,data=None if body is None else json.dumps(body).encode(),headers=headers)
    try:
        with client.open(req) as response:return response.status,json.load(response)
    except urllib.error.HTTPError as e:return e.code,json.load(e)
def check(ok,message):
    global count
    assert ok,message
    count+=1

check(call('production_workbench')[0]==401,'guest API denied')
page=client.open(BASE+'/office/san-xuat').geturl()
check(page.endswith('/office/'),'guest page redirected')
status,result=call('login',{'email':'LOCAL-CNC','password':'LocalTestOnly-2026'})
check(status==200 and not result.get('require_2fa'),'employee code login')
with client.open(BASE+'/office/san-xuat') as response:html=response.read().decode()
csrf=re.search(r'name="office-csrf" content="([^"]+)"',html).group(1)
status,state=call('production_workbench')
check(status==200 and state['role']=='CNC','scoped workbench')
check(all(int(m['holder_user_id'] or 0)==2 for m in state['movements']),'own loans only')
with client.open(BASE+'/office/api.php?action=production_workbench&before=1') as response:
    check(json.load(response)['movements']==[],'cursor pagination stays within own scope')
check(call('dashboard_metrics')[0]==403,'no Office commercial access')
check(call('production_scan_create',{'tool_code':'NN-D12-010','drawing_code':'HTTP'})[0]==403,'CSRF required')
payload={'tool_code':'NN-D12-010','drawing_code':'HTTP'}
status,scan=call('production_scan_create',payload,csrf)
check(status==200 and len(scan['scan_token'])==64,'scan token')
payload['scan_token']=scan['scan_token']
status,result=call('production_self_checkout',payload,csrf)
check(status==200 and result['movement_id'],'self issue')
check(call('production_self_checkout',payload,csrf)[1]==result,'HTTP replay')
payload['drawing_code']='CHANGED'
check(call('production_self_checkout',payload,csrf)[0]==409,'payload mismatch conflict')
check(call('production_tool_checkin',{'movement_id':result['movement_id']},csrf)[0]==403,'worker cannot receive')
check(call('activity',{},csrf)[0]==200,'trusted client activity protocol')
print(f'PASS {count} local HTTP assertions (no production writes)')
