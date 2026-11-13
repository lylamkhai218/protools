<?php
// Local CLI only. JSON comes from stdin, never a password on a command line.
if (PHP_SAPI!=='cli') {http_response_code(404);exit;}
require dirname(__DIR__).'/public/office/config.php';
$input=json_decode(stream_get_contents(STDIN),true);
if (!is_array($input)||empty($input['employee_code'])) {fwrite(STDERR,"Provide reviewed employee JSON through stdin. No accounts are created by default.\n");exit(2);}
$db=get_db();$db->beginTransaction();
try {
    $reviewer=isset($input['approved_by_user_id'])?(int)$input['approved_by_user_id']:0;
    $s=$db->prepare("SELECT id FROM tt_users WHERE id=? AND role='ADMIN' AND status=1");$s->execute(array($reviewer));
    if(!$s->fetchColumn()||empty($input['reason']))throw new Exception('An active approving Admin ID and reason are required');
    $code=trim((string)$input['employee_code']);
    if (!preg_match('/^[A-Za-z0-9_-]{2,50}$/D',$code)) throw new Exception('Invalid employee code');
    if (isset($input['disable'])&&$input['disable']===true) {
        $s=$db->prepare('SELECT id FROM tt_users WHERE employee_code=?');$s->execute(array($code));$id=$s->fetchColumn();
        if (!$id) throw new Exception('Employee not found');
        $s=$db->prepare('UPDATE tt_users SET status=0,session_version=session_version+1 WHERE id=?');$s->execute(array($id));
        $s=$db->prepare('SELECT id,tool_instance_id,drawing_code FROM tt_tool_movements WHERE holder_user_id=? AND returned_at IS NULL');$s->execute(array($id));
        $handover=$s->fetchAll(PDO::FETCH_ASSOC);
        $s=$db->prepare('SELECT id,advance_code,project_code FROM tt_wip_materials WHERE engineer_user_id=? AND status=?');$s->execute(array($id,'ADVANCED_TO_FLOOR'));$wip=$s->fetchAll(PDO::FETCH_ASSOC);
        $audit=$db->prepare('INSERT INTO tt_production_audit(actor_id,action,entity_id,detail_json,created_at) VALUES(?,?,?,?,?)');$audit->execute(array($reviewer,'employee_disabled',$id,json_encode(array('employee_code'=>$code,'reason'=>$input['reason'])),date('Y-m-d H:i:s')));
        $db->commit();echo json_encode(array('disabled'=>true,'tool_handover'=>$handover,'wip_handover'=>$wip));exit;
    }
    $name=isset($input['full_name'])?trim((string)$input['full_name']):'';
    $role=isset($input['workshop_role'])?$input['workshop_role']:'';
    $password=isset($input['initial_password'])?(string)$input['initial_password']:'';
    if ($name===''||strlen($name)>100||strlen($password)<12||strlen($password)>72||!in_array($role,array('CNC','ENGINEER','WAREHOUSE','INSPECTOR','SUPERVISOR'),true)) throw new Exception('Name, scoped role and 12-72 byte initial password required');
    $email=!empty($input['email'])?$input['email']:null;
    if ($email!==null&&!filter_var($email,FILTER_VALIDATE_EMAIL)) throw new Exception('Invalid optional email');
    // Office API denies all non-production actions for workshop accounts.
    $s=$db->prepare("INSERT INTO tt_users(email,password_hash,full_name,role,status,employee_code,workshop_role,must_change_password) VALUES(?,?,?,'SALES',1,?,?,1)");
    $s->execute(array($email,password_hash($password,PASSWORD_BCRYPT),$name,$code,$role));
    $id=$db->lastInsertId();$audit=$db->prepare('INSERT INTO tt_production_audit(actor_id,action,entity_id,detail_json,created_at) VALUES(?,?,?,?,?)');$audit->execute(array($reviewer,'employee_created',$id,json_encode(array('employee_code'=>$code,'workshop_role'=>$role,'reason'=>$input['reason'])),date('Y-m-d H:i:s')));
    $db->commit();echo "Employee created; initial password change required.\n";
}catch(Exception $e){if($db->inTransaction())$db->rollBack();fwrite(STDERR,$e->getMessage()."\n");exit(1);}
