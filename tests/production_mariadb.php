<?php
// Strictly disposable local MariaDB fixture. Never consumes Office configuration.
require dirname(__DIR__).'/public/office/production_service.php';
require dirname(__DIR__).'/public/office/production_schema.php';
function testDb($withDatabase=true) {
    $dsn='mysql:host=127.0.0.1;port=33316'.($withDatabase?';dbname=protools_test_20261105':'').';charset=utf8mb4';
    $pdo=new PDO($dsn,'root','LocalFixtureOnly2026',array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false));
    return $pdo;
}
if(isset($argv[1])&&$argv[1]==='race'){
    $actor=(int)$argv[2];$start=(float)$argv[3];while(microtime(true)<$start)usleep(1000);
    $service=new ProductionService(testDb(),array('id'=>$actor,'name'=>'Local test actor','role'=>$actor===1?'ADMIN':'WAREHOUSE','session_version'=>1));
    $wip=isset($argv[4])&&$argv[4]==='wip';
    try{$result=$service->write($wip?'production_wip_advance':'production_tool_checkout',$wip?array('stock_item_id'=>1,'project_code'=>'WIP-RACE','engineer_user_id'=>2,'advance_length_meters'=>'60'):array('tool_instance_id'=>1,'drawing_code'=>'RACE','holder_user_id'=>2,'manual_reason'=>'Isolated concurrency test'),'mariadb-race-'.($wip?'wip-':'tool-').$actor);echo json_encode(array('status'=>200));}
    catch(ProductionError $e){echo json_encode(array('status'=>$e->status));}
    exit;
}
if(isset($argv[1])&&$argv[1]==='verify-race'){
    $db=testDb();$n=$db->query('SELECT COUNT(*) FROM tt_tool_movements WHERE tool_instance_id=1 AND returned_at IS NULL')->fetchColumn();
    if((int)$n!==1)throw new Exception('Race produced duplicate or missing loan');echo "PASS MariaDB race: exactly one open movement\n";exit;
}
if(isset($argv[1])&&$argv[1]==='verify-wip-race'){
    $db=testDb();$n=$db->query("SELECT COUNT(*) FROM tt_wip_materials WHERE project_code='WIP-RACE'")->fetchColumn();
    if((int)$n!==1||$db->query('SELECT qty_on_hand FROM tt_stock_items WHERE id=1')->fetchColumn()<0)throw new Exception('WIP race overissued');echo "PASS MariaDB WIP race: one issue, no negative stock\n";exit;
}
$server=testDb(false);
$server->exec('CREATE DATABASE IF NOT EXISTS protools_test_20261105 CHARACTER SET utf8mb4');
$db=testDb();
// Fixture reset is bounded to the literal disposable database above, never production.
$db->exec('SET FOREIGN_KEY_CHECKS=0');
foreach($db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN)as$table){if(!preg_match('/^tt_[a-z_]+$/D',$table))throw new Exception('Unexpected table');$db->exec('DROP TABLE `'.$table.'`');}
$db->exec('SET FOREIGN_KEY_CHECKS=1');
$root=dirname(__DIR__);
$db->exec(file_get_contents($root.'/public/office/001_initial_schema.sql'));
$ddl=explode('-- 4. SEED',file_get_contents($root.'/public/office/007_production_tool_and_wip.sql'))[0];
$db->exec($ddl);$db->exec('SET FOREIGN_KEY_CHECKS=1');
production_migrate($db);production_migrate($db);
$users=$db->prepare('INSERT INTO tt_users(id,email,password_hash,full_name,role,status,workshop_role) VALUES(?,?,?,?,?,1,?)');
foreach(array(array(1,'a@example.invalid','Admin','ADMIN',null),array(2,'b@example.invalid','Worker','SALES','CNC'),array(3,'c@example.invalid','Inspector','SALES','INSPECTOR'),array(4,'d@example.invalid','Warehouse','WAREHOUSE',null))as$u)$users->execute(array($u[0],$u[1],password_hash('LocalTestOnly-2026',PASSWORD_BCRYPT),$u[2],$u[3],$u[4]));
$db->exec("INSERT INTO tt_tool_instances(id,tool_code,tool_name,category_prefix,current_status,current_location,self_checkout_enabled) VALUES(1,'RACE-001','Local fixture','NN','NEW','WAREHOUSE',1)");
$db->exec("INSERT INTO tt_products(id,sku,name_vn,unit) VALUES(1,'TEST-METER','Local fixture','m'); INSERT INTO tt_stock_items(id,product_id,qty_on_hand,qty_reserved,location_code) VALUES(1,1,100,0,'Local test rack')");
$admin=new ProductionService($db,array('id'=>1,'name'=>'Admin','role'=>'ADMIN','session_version'=>1));
$seq=0;$checks=0;
foreach(array('0','1.99','2','2.01')as$ret){
    $issue=$admin->write('production_wip_advance',array('stock_item_id'=>1,'project_code'=>'LOCAL','engineer_user_id'=>2,'advance_length_meters'=>'5'),'mariadb-wip-issue-'.++$seq);
    $r=$admin->write('production_wip_return',array('wip_id'=>$issue['wip_id'],'returned_length_meters'=>$ret,'measurement_method'=>'MANUAL_TAPE'),'mariadb-wip-return-'.++$seq);
    if(ProductionService::meters($r['consumed_length_meters'])+ProductionService::meters($r['returned_length_meters'])+ProductionService::meters($r['scrap_length_meters'])!==500)throw new Exception('MariaDB conservation failed');$checks++;
}
echo 'PASS MariaDB additive migration twice, '.$checks." WIP boundary assertions; race fixture ready\n";
