<?php
// Uses only the explicit local HTTP fixture, never default database settings.
putenv('TTVINA_TEST_SQLITE='.dirname(__DIR__).'/scratch/production-test.sqlite');
require dirname(__DIR__).'/public/office/config.php';
init_session();
$_SESSION['tt_user_id']=2;$_SESSION['tt_user_role']='SALES';$_SESSION['tt_session_version']=1;
$_SESSION['tt_last_activity']=time()-3500;
$before=$_SESSION['tt_last_activity'];
if(!get_auth_user())throw new Exception('Active fixture user rejected');
get_auth_user();
if($_SESSION['tt_last_activity']!==$before)throw new Exception('Polling extended inactivity');
$_SESSION['tt_last_activity']=time()-3600;
if(get_auth_user()!==null)throw new Exception('One-hour session did not expire');
init_session();$_SESSION['tt_user_id']=2;$_SESSION['tt_user_role']='SALES';$_SESSION['tt_session_version']=1;$_SESSION['tt_last_activity']=time();
get_db()->exec('UPDATE tt_users SET session_version=2 WHERE id=2');
if(get_auth_user()!==null)throw new Exception('Revoked session remained active');
get_db()->exec('UPDATE tt_users SET session_version=1 WHERE id=2');
echo "PASS 3 session assertions: polling, exact hour expiry, revocation\n";
