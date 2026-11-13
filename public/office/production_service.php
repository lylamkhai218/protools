<?php
// Domain layer: no HTTP globals, no credentials, testable against isolated PDO fixtures.
class ProductionError extends RuntimeException {
    public $status;
    function __construct($message, $status) { parent::__construct($message); $this->status = $status; }
}
class ProductionService {
    private $db;
    private $user;
    private $lock;
    function __construct($pdo, $user) {
        $this->db = $pdo; $this->user = $user;
        $this->lock = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite' ? '' : ' FOR UPDATE';
    }
    private function row($sql, $args) { $s=$this->db->prepare($sql); $s->execute($args); return $s->fetch(PDO::FETCH_ASSOC); }
    private function run($sql, $args) { $s=$this->db->prepare($sql); $s->execute($args); return $s; }
    private function text($p,$key,$max=100) { $v=isset($p[$key])?trim((string)$p[$key]):''; if ($v==='' || strlen($v)>$max) throw new ProductionError('Thiếu hoặc sai trường '.$key,422); return $v; }
    private function role() { return $this->user['role']==='ADMIN'?'ADMIN':(!empty($this->user['workshop_role'])?$this->user['workshop_role']:$this->user['role']); }
    private function allow($roles) { if ($this->role()!=='ADMIN' && !in_array($this->role(),$roles,true)) throw new ProductionError('Không có quyền thực hiện',403); }
    private function audit($action,$id,$detail) { $this->run('INSERT INTO tt_production_audit(actor_id,action,entity_id,detail_json,created_at) VALUES(?,?,?,?,?)',array($this->user['id'],$action,$id,json_encode($detail),date('Y-m-d H:i:s'))); }
    public static function meters($value) {
        $s=(string)$value;
        if (!preg_match('/^\d{1,7}(?:\.\d{1,2})?$/D',$s)) throw new ProductionError('Chiều dài phải là số không âm, tối đa hai chữ số thập phân',422);
        $parts=explode('.',$s); return (int)$parts[0]*100+(isset($parts[1])?(int)str_pad($parts[1],2,'0'):0);
    }
    private function decimal($units) { return sprintf('%d.%02d',(int)floor($units/100),$units%100); }
    public function write($action,$p,$key) {
        if (!preg_match('/^[A-Za-z0-9_-]{16,100}$/D',(string)$key)) throw new ProductionError('Thiếu Idempotency-Key hợp lệ',422);
        // Canonicalize maps, preserving list order for batch semantics.
        $canonical=$this->canonical($p); unset($canonical['_evidence_filename']); $hash=hash('sha256',json_encode($canonical));
        $this->db->beginTransaction();
        try {
            // User row serializes replay lookup/insertion for requests from one actor.
            $active=$this->row('SELECT * FROM tt_users WHERE id=?'.$this->lock,array($this->user['id']));
            if (!$active || (int)$active['status']!==1) throw new ProductionError('Phiên không còn hiệu lực',401);
            if (isset($this->user['session_version']) && (int)$active['session_version']!==(int)$this->user['session_version']) throw new ProductionError('Phiên đã bị thu hồi',401);
            $old=$this->row('SELECT * FROM tt_production_requests WHERE actor_id=? AND action=? AND request_key=?',array($this->user['id'],$action,$key));
            if ($old) {
                if (!hash_equals($old['payload_hash'],$hash)) throw new ProductionError('Khóa yêu cầu đã dùng với nội dung khác',409);
                $this->db->commit(); return json_decode($old['response_json'],true);
            }
            $result=$this->dispatch($action,$p);
            $result['ok']=true;
            $this->run('INSERT INTO tt_production_requests(actor_id,action,request_key,payload_hash,response_json,created_at) VALUES(?,?,?,?,?,?)',array($this->user['id'],$action,$key,$hash,json_encode($result),date('Y-m-d H:i:s')));
            $this->db->commit(); return $result;
        } catch (Exception $e) { if ($this->db->inTransaction()) $this->db->rollBack(); throw $e; }
    }
    private function canonical($value) { if (!is_array($value)) return $value; if (array_keys($value)!==range(0,count($value)-1)) ksort($value); foreach($value as $k=>$v) $value[$k]=$this->canonical($v); return $value; }
    private function tool($p) {
        if (!empty($p['tool_instance_id'])) $t=$this->row('SELECT * FROM tt_tool_instances WHERE id=?'.$this->lock,array((int)$p['tool_instance_id']));
        else $t=$this->row('SELECT * FROM tt_tool_instances WHERE tool_code=?'.$this->lock,array($this->text($p,'tool_code',50)));
        if (!$t) throw new ProductionError('Không tìm thấy cá thể dao',404);
        // MySQL collations may be case/accent insensitive. Require byte-identical code.
        if (isset($p['tool_code']) && $t['tool_code']!==trim((string)$p['tool_code'])) throw new ProductionError('Mã dao phải khớp chính xác',422);
        return $t;
    }
    public function resolve($code) {
        $this->allow(array('WAREHOUSE','CNC','INSPECTOR','SUPERVISOR','ACCOUNTANT'));
        $t=$this->tool(array('tool_code'=>$code));
        return array('ok'=>true,'tool'=>$t);
    }
    public function workbench($before=0,$wipBefore=0) {
        $role=$this->role();
        $this->allow(array('WAREHOUSE','CNC','ENGINEER','INSPECTOR','SUPERVISOR','ACCOUNTANT'));
        $sql='SELECT m.*,t.tool_code,t.tool_name,t.current_location FROM tt_tool_movements m JOIN tt_tool_instances t ON t.id=m.tool_instance_id';
        $args=array();
        if ($role==='CNC') { $sql.=' WHERE m.holder_user_id=?';$args[]=$this->user['id']; }
        elseif ($role==='ENGINEER') $sql.=' WHERE 1=0';
        if($before>0){$sql.=(strpos($sql,' WHERE ')!==false?' AND':' WHERE').' m.id<?';$args[]=$before;}
        $s=$this->run($sql.' ORDER BY m.id DESC LIMIT 200',$args);
        $people=array();$stock=array();
        if (in_array($role,array('ADMIN','WAREHOUSE'),true)) {
            $people=$this->db->query('SELECT id,full_name,employee_code FROM tt_users WHERE status=1 ORDER BY full_name')->fetchAll(PDO::FETCH_ASSOC);
            $stock=$this->db->query("SELECT s.id,s.product_id,s.location_code,s.qty_on_hand,s.qty_reserved,p.sku,p.name_vn,p.unit FROM tt_stock_items s JOIN tt_products p ON p.id=s.product_id WHERE p.unit IN ('m','M','Mét','mét','met') ORDER BY p.sku LIMIT 200")->fetchAll(PDO::FETCH_ASSOC);
        }
        $wsql='SELECT * FROM tt_wip_materials';$wargs=array();
        if ($role==='ENGINEER') {$wsql.=' WHERE engineer_user_id=?';$wargs[]=$this->user['id'];}
        elseif ($role==='CNC') $wsql.=' WHERE 1=0';
        if($wipBefore>0){$wsql.=(strpos($wsql,' WHERE ')!==false?' AND':' WHERE').' id<?';$wargs[]=$wipBefore;}
        $tools=$this->db->query('SELECT id,tool_code,tool_name,oem_specs,current_location,current_status,self_checkout_enabled FROM tt_tool_instances ORDER BY tool_code LIMIT 10000')->fetchAll(PDO::FETCH_ASSOC);
        return array('ok'=>true,'role'=>$role,'user_id'=>$this->user['id'],'people'=>$people,'stock'=>$stock,'tools'=>$tools,'movements'=>$s->fetchAll(PDO::FETCH_ASSOC),'wip'=>$this->run($wsql.' ORDER BY id DESC LIMIT 200',$wargs)->fetchAll(PDO::FETCH_ASSOC));
    }
    public function remnant($code) {
        $this->allow(array('WAREHOUSE','ENGINEER','SUPERVISOR','ACCOUNTANT'));
        $r=$this->row("SELECT id,stock_item_id,remnant_qr_code,available_length_meters,project_code,rack_location FROM tt_wip_materials WHERE remnant_qr_code=? AND status='RETURNED_REMNANT'",array($code));
        if(!$r||$r['remnant_qr_code']!==$code||self::meters((string)$r['available_length_meters'])<=0)throw new ProductionError('Không còn cuộn lẻ phù hợp',404);
        return array('ok'=>true,'remnant'=>$r);
    }
    private function dispatch($a,$p) {
        $now=date('Y-m-d H:i:s');
        if ($a==='production_tool_issue_reverse') {
            $this->allow(array());$reason=$this->text($p,'reason',500);
            if(empty($p['physical_return_confirmed']))throw new ProductionError('Admin phải xác nhận đã thấy dao thực tế trong kho',422);
            $id=isset($p['movement_id'])?(int)$p['movement_id']:0;
            $m=$this->row('SELECT * FROM tt_tool_movements WHERE id=?'.$this->lock,array($id));
            if(!$m||$m['returned_at']!==null)throw new ProductionError('Chỉ đảo phiếu cấp nhầm còn mở',409);
            $t=$this->tool(array('tool_instance_id'=>$m['tool_instance_id']));
            if($t['current_location']!=='CNC_SHOP')throw new ProductionError('Trạng thái dao cần đối soát',409);
            $other=$this->row('SELECT id FROM tt_tool_movements WHERE tool_instance_id=? AND returned_at IS NULL AND id<>?',array($t['id'],$id));
            if($other)throw new ProductionError('Có nhiều phiếu mở; cần đối soát lịch sử',409);
            $this->run('INSERT INTO tt_production_corrections(actor_id,movement_id,original_json,reason,created_at) VALUES(?,?,?,?,?)',array($this->user['id'],$id,json_encode($m),$reason,$now));
            $this->run('UPDATE tt_tool_movements SET voided_at=?,returned_at=? WHERE id=?',array($now,$now,$id));
            $this->run("UPDATE tt_tool_instances SET current_location='WAREHOUSE',assigned_operator=NULL,total_uses=CASE WHEN total_uses>0 THEN total_uses-1 ELSE 0 END WHERE id=?",array($t['id']));
            $this->audit($a,$id,array('reason'=>$reason,'physical_return_confirmed_by_admin'=>true));
            return array('message'=>'Đã lập bút toán đảo phiếu cấp nhầm; lịch sử gốc được giữ lại');
        }
        if ($a==='production_wip_return_request') {
            $this->allow(array('ENGINEER','WAREHOUSE'));
            $id=isset($p['wip_id'])?(int)$p['wip_id']:0;$w=$this->row('SELECT * FROM tt_wip_materials WHERE id=?'.$this->lock,array($id));
            if(!$w||$w['status']!=='ADVANCED_TO_FLOOR')throw new ProductionError('Phiếu không còn mở',409);
            if($this->role()==='ENGINEER'&&(int)$w['engineer_user_id']!==(int)$this->user['id'])throw new ProductionError('Chỉ đề nghị trả vật tư của mình',403);
            $length=self::meters(isset($p['returned_length_meters'])?$p['returned_length_meters']:'');
            if($length>self::meters((string)$w['advance_length_meters']))throw new ProductionError('Lượng trả vượt lượng cấp',422);
            $this->run('UPDATE tt_wip_materials SET return_requested_at=?,return_requested_length=? WHERE id=?',array($now,$this->decimal($length),$id));
            $this->audit($a,$id,array('requested_length'=>$length));return array('message'=>'Đã đề nghị trả; tồn chỉ cập nhật sau khi thủ kho nhận thực tế');
        }
        if ($a==='production_tool_create') {
            $this->allow(array());
            $code=$this->text($p,'tool_code',50);$name=$this->text($p,'tool_name',150);$category=$this->text($p,'category_prefix',20);
            if ($this->row('SELECT id FROM tt_tool_instances WHERE tool_code=?',array($code))) throw new ProductionError('Mã cá thể đã tồn tại',409);
            $this->run("INSERT INTO tt_tool_instances(tool_code,tool_name,oem_specs,category_prefix,current_status,current_location,total_uses,self_checkout_enabled) VALUES(?,?,?,?,'NEW','WAREHOUSE',0,0)",array($code,$name,isset($p['oem_specs'])?$this->text($p,'oem_specs',100):'',$category));
            $id=$this->db->lastInsertId();$this->audit($a,$id,array('tool_code'=>$code));return array('tool_id'=>$id,'message'=>'Đã thêm cá thể, chưa mở tự nhận');
        }
        if ($a==='production_tool_eligibility') {
            $this->allow(array());$t=$this->tool($p);$reason=$this->text($p,'reason',500);
            $enabled=isset($p['enabled'])&&(int)$p['enabled']===1?1:0;
            if($enabled&&($t['current_location']!=='WAREHOUSE'||$t['current_status']==='SCRAPPED'))throw new ProductionError('Chỉ mở tự nhận cho dao sẵn sàng đã đối soát',409);
            $this->run('UPDATE tt_tool_instances SET self_checkout_enabled=? WHERE id=?',array($enabled,$t['id']));$this->audit($a,$t['id'],array('before'=>$t['self_checkout_enabled'],'after'=>$enabled,'reason'=>$reason));
            return array('message'=>'Đã cập nhật quyền tự nhận');
        }
        if ($a==='production_tool_relabel') {
            $this->allow(array('WAREHOUSE'));$t=$this->tool($p);$reason=$this->text($p,'reason',500);
            $this->audit($a,$t['id'],array('tool_code'=>$t['tool_code'],'reason'=>$reason,'identity_unchanged'=>true));return array('tool_code'=>$t['tool_code'],'message'=>'Đã ghi cấp lại tem cùng mã. Đối chiếu với cán trước khi dán.');
        }
        if ($a==='production_change_password') {
            $old=isset($p['current_password'])?(string)$p['current_password']:'';
            $new=isset($p['new_password'])?(string)$p['new_password']:'';
            $record=$this->row('SELECT * FROM tt_users WHERE id=?',array($this->user['id']));
            if (!$record||!password_verify($old,$record['password_hash'])) throw new ProductionError('Mật khẩu hiện tại không đúng',403);
            if (strlen($new)<12||strlen($new)>72||$new===$old) throw new ProductionError('Mật khẩu mới phải khác mật khẩu cũ, dài 12-72 byte',422);
            $this->run('UPDATE tt_users SET password_hash=?,must_change_password=0,session_version=session_version+1 WHERE id=?',array(password_hash($new,PASSWORD_BCRYPT),$this->user['id']));
            $this->audit($a,$this->user['id'],array('password_changed'=>true));
            return array('message'=>'Đã đổi mật khẩu. Vui lòng đăng nhập lại.','reauthenticate'=>true);
        }
        if ($a==='production_scan_create') {
            $this->allow(array('WAREHOUSE','CNC')); $t=$this->tool($p); $drawing=$this->text($p,'drawing_code');
            if ($t['current_location']!=='WAREHOUSE'||$t['current_status']==='SCRAPPED') throw new ProductionError('Dao chưa sẵn sàng',409);
            $token=bin2hex(openssl_random_pseudo_bytes(32));
            $this->run('INSERT INTO tt_production_scans(token_hash,actor_id,tool_id,drawing_code,expires_at) VALUES(?,?,?,?,?)',array(hash('sha256',$token),$this->user['id'],$t['id'],$drawing,time()+120));
            if (!empty($p['_evidence_filename'])) $this->run('INSERT INTO tt_production_evidence(token_hash,actor_id,filename,created_at) VALUES(?,?,?,?)',array(hash('sha256',$token),$this->user['id'],$p['_evidence_filename'],date('Y-m-d H:i:s')));
            return array('scan_token'=>$token,'expires_in'=>120);
        }
        if ($a==='production_tool_checkout'||$a==='production_self_checkout') {
            $self=$a==='production_self_checkout'; $this->allow($self?array('CNC'):array('WAREHOUSE'));
            $t=$this->tool($p); $drawing=$this->text($p,'drawing_code');
            if ($t['current_location']!=='WAREHOUSE'||$t['current_status']==='SCRAPPED') throw new ProductionError('Dao không ở trạng thái sẵn sàng',409);
            if ($this->row('SELECT id FROM tt_tool_movements WHERE tool_instance_id=? AND returned_at IS NULL',array($t['id']))) throw new ProductionError('Dao đang có phiếu mượn',409);
            if ($self && empty($t['self_checkout_enabled'])) throw new ProductionError('Dao chưa được phép tự nhận',403);
            $scan=isset($p['scan_token'])?(string)$p['scan_token']:'';
            if ($scan!=='') {
                $s=$this->row('SELECT * FROM tt_production_scans WHERE token_hash=?'.$this->lock,array(hash('sha256',$scan)));
                if (!$s||$s['consumed_at']!==null||(int)$s['expires_at']<=time()||(int)$s['actor_id']!==(int)$this->user['id']||(int)$s['tool_id']!==(int)$t['id']||$s['drawing_code']!==$drawing) throw new ProductionError('Phiên quét hết hạn hoặc không khớp',409);
                $this->run('UPDATE tt_production_scans SET consumed_at=? WHERE token_hash=?',array($now,$s['token_hash']));
            } else {
                if ($self) throw new ProductionError('Cần quét tem trước khi tự nhận',422);
                $this->text($p,'manual_reason',500);
            }
            $holder=$self?(int)$this->user['id']:(isset($p['holder_user_id'])?(int)$p['holder_user_id']:0);
            $person=$this->row('SELECT id,full_name,status FROM tt_users WHERE id=?',array($holder));
            if (!$person||(int)$person['status']!==1) throw new ProductionError('Chọn nhân sự thật đang hoạt động',422);
            $this->run('INSERT INTO tt_tool_movements(tool_instance_id,drawing_code,operator_name,programmer_name,issued_at,issued_status,warehouse_staff,holder_user_id,issued_by,is_self_checkout,note) VALUES(?,?,?,?,?,?,?,?,?,?,?)',array($t['id'],$drawing,$person['full_name'],isset($p['programmer_name'])?$p['programmer_name']:'',$now,$t['current_status'],$this->user['name'],$holder,$this->user['id'],$self?1:0,isset($p['manual_reason'])?$p['manual_reason']:''));
            $id=$this->db->lastInsertId();
            $this->run("UPDATE tt_tool_instances SET current_location='CNC_SHOP',assigned_operator=?,total_uses=total_uses+1 WHERE id=?",array($person['full_name'],$t['id']));
            $this->audit($a,$id,array('tool_id'=>$t['id'],'holder_id'=>$holder,'drawing'=>$drawing,'scan_hash'=>$scan!==''?hash('sha256',$scan):null));
            return array('movement_id'=>$id,'tool_code'=>$t['tool_code'],'message'=>'Đã ghi nhận cấp dao');
        }
        if ($a==='production_tool_batch_checkin') {
            $this->allow(array('WAREHOUSE'));
            if (empty($p['items'])||!is_array($p['items'])||count($p['items'])>100) throw new ProductionError('Lô nhận trả không hợp lệ',422);
            $ids=array(); foreach($p['items'] as $item) $ids[]=(int)$item['movement_id'];
            if (count(array_unique($ids))!==count($ids)) throw new ProductionError('Trùng phiếu trong lô',422);
            sort($ids,SORT_NUMERIC); foreach($ids as $id) $this->dispatch('production_tool_checkin',array('movement_id'=>$id));
            return array('processed_count'=>count($ids),'message'=>'Đã nhận lô vào khu chờ kiểm định');
        }
        if (in_array($a,array('production_return_request','production_tool_checkin','production_tool_inspect','production_night_reconcile'),true)) {
            $id=isset($p['movement_id'])?(int)$p['movement_id']:0;
            $m=$this->row('SELECT * FROM tt_tool_movements WHERE id=?'.$this->lock,array($id));
            if (!$m) throw new ProductionError('Không tìm thấy phiếu',404);
            $t=$this->tool(array('tool_instance_id'=>$m['tool_instance_id']));
            if ($a==='production_return_request') {
                if ((int)$m['holder_user_id']!==(int)$this->user['id']) $this->allow(array('WAREHOUSE'));
                if ($m['returned_at']!==null) throw new ProductionError('Đã nhận trả',409);
                $this->run('UPDATE tt_tool_movements SET return_requested_at=? WHERE id=?',array($now,$id));
            } elseif ($a==='production_tool_checkin') {
                $this->allow(array('WAREHOUSE'));
                if ($m['returned_at']!==null||$t['current_location']!=='CNC_SHOP') throw new ProductionError('Đã trả hoặc trạng thái không khớp',409);
                $this->run('UPDATE tt_tool_movements SET returned_at=?,received_by=? WHERE id=?',array($now,$this->user['id'],$id));
                $this->run("UPDATE tt_tool_instances SET current_location='INSPECTION',assigned_operator=NULL WHERE id=?",array($t['id']));
            } elseif ($a==='production_tool_inspect') {
                $this->allow(array('INSPECTOR'));
                if ($m['returned_at']===null||$m['inspected_at']!==null||$t['current_location']!=='INSPECTION') throw new ProductionError('Dao chưa ở hàng chờ kiểm định',409);
                $status=$this->text($p,'returned_status',20);
                if (!in_array($status,array('USED_1X','OLD','SCRAPPED'),true)) throw new ProductionError('Phân loại không hợp lệ',422);
                if($status==='SCRAPPED')$this->text($p,'note',500);
                $vb=isset($p['flank_wear_vb_mm'])&&$p['flank_wear_vb_mm']!==''?$p['flank_wear_vb_mm']:null;
                if ($vb!==null && (!is_numeric($vb)||$vb<0||$vb>99.99)) throw new ProductionError('Độ mòn không hợp lệ',422);
                $this->run('UPDATE tt_tool_movements SET returned_status=?,flank_wear_vb_mm=?,inspector_name=?,inspected_by=?,inspected_at=? WHERE id=?',array($status,$vb,$this->user['name'],$this->user['id'],$now,$id));
                $this->run('UPDATE tt_tool_instances SET current_status=?,current_location=? WHERE id=?',array($status,$status==='SCRAPPED'?'SCRAP_BIN':'WAREHOUSE',$t['id']));
            } else {
                $this->allow(array('WAREHOUSE'));
                if (empty($m['is_self_checkout'])||$m['reconciled_at']!==null) throw new ProductionError('Phiếu không cần đối soát',409);
                $this->run('UPDATE tt_tool_movements SET reconciled_at=?,reconciled_by=? WHERE id=?',array($now,$this->user['id'],$id));
            }
            $this->audit($a,$id,$p); return array('movement_id'=>$id,'message'=>'Đã ghi nhận thao tác');
        }
        if ($a==='production_wip_advance'||$a==='production_wip_return') return $this->wip($a,$p);
        throw new ProductionError('Chức năng chưa được mở trong bản này',404);
    }
    private function ledger($stock,$delta,$code,$note) {
        $balance=self::meters((string)$stock['qty_on_hand'])+$delta;
        if ($balance<self::meters((string)$stock['qty_reserved'])) throw new ProductionError('Tồn khả dụng không đủ',409);
        $this->run('UPDATE tt_stock_items SET qty_on_hand=? WHERE id=?',array($this->decimal($balance),$stock['id']));
        $this->run('INSERT INTO tt_stock_ledger(trans_code,trans_type,product_id,qty_change,balance_after,location_code,created_by,note) VALUES(?,?,?,?,?,?,?,?)',array($code,$delta>=0?'ADJUST_IN':'ADJUST_OUT',$stock['product_id'],($delta<0?'-':'').$this->decimal(abs($delta)),$this->decimal($balance),$stock['location_code'],$this->user['id'],$note));
    }
    private function wip($action,$p) {
        $this->allow(array('WAREHOUSE'));
        if ($action==='production_wip_advance') {
            $stockId=isset($p['stock_item_id'])?(int)$p['stock_item_id']:0;
            $stock=$this->row('SELECT * FROM tt_stock_items WHERE id=?'.$this->lock,array($stockId));
            if (!$stock) throw new ProductionError('Chọn nguồn tồn thực tế',422);
            $product=$this->row('SELECT * FROM tt_products WHERE id=?',array($stock['product_id']));
            if (!$product||!in_array($product['unit'],array('m','M','Mét','mét','met'),true)) throw new ProductionError('Chưa xác minh đơn vị mét cho vật tư',422);
            $length=self::meters(isset($p['advance_length_meters'])?$p['advance_length_meters']:'');
            if ($length<=0) throw new ProductionError('Chiều dài cấp phải lớn hơn 0',422);
            $parentId=!empty($p['parent_wip_id'])?(int)$p['parent_wip_id']:null;
            if ($parentId) {
                $parent=$this->row('SELECT * FROM tt_wip_materials WHERE id=?'.$this->lock,array($parentId));
                if (!$parent||$parent['status']!=='RETURNED_REMNANT'||(int)$parent['stock_item_id']!==$stockId||self::meters((string)$parent['available_length_meters'])<$length) throw new ProductionError('Cuộn nguồn không đủ số dư hoặc sai vị trí',409);
                $this->run('UPDATE tt_wip_materials SET available_length_meters=? WHERE id=?',array($this->decimal(self::meters((string)$parent['available_length_meters'])-$length),$parentId));
            } else {
                $fit=$this->row("SELECT id FROM tt_wip_materials WHERE stock_item_id=? AND status='RETURNED_REMNANT' AND available_length_meters>=? ORDER BY available_length_meters,id LIMIT 1",array($stockId,$this->decimal($length)));
                if($fit)$this->text($p,'remnant_override_reason',500);
                // Stock includes remnants already returned; do not double-allocate them as whole rolls.
                $reserved=$this->row("SELECT COALESCE(SUM(available_length_meters),0) AS n FROM tt_wip_materials WHERE stock_item_id=? AND status='RETURNED_REMNANT'",array($stockId));
                if (self::meters((string)$stock['qty_on_hand'])-self::meters((string)$stock['qty_reserved'])-self::meters((string)$reserved['n'])<$length) throw new ProductionError('Phải chọn cuộn lẻ hoặc tồn nguyên cuộn không đủ',409);
            }
            $project=$this->text($p,'project_code'); $engineerId=isset($p['engineer_user_id'])?(int)$p['engineer_user_id']:0;
            $engineer=$this->row('SELECT * FROM tt_users WHERE id=? AND status=1',array($engineerId));
            if (!$engineer) throw new ProductionError('Chọn kỹ sư thật đang hoạt động',422);
            $code='ADV-'.date('Ymd').'-'.bin2hex(openssl_random_pseudo_bytes(6));
            $this->ledger($stock,-$length,$code,'WIP issue '.$project);
            $this->run("INSERT INTO tt_wip_materials(advance_code,parent_wip_id,product_id,project_code,engineer_name,advance_length_meters,status,rack_location,issued_at,stock_item_id,engineer_user_id) VALUES(?,?,?,?,?,?,'ADVANCED_TO_FLOOR',?,?,?,?)",array($code,$parentId,$stock['product_id'],$project,$engineer['full_name'],$this->decimal($length),$stock['location_code'],date('Y-m-d H:i:s'),$stockId,$engineerId));
            $id=$this->db->lastInsertId();$this->audit($action,$id,$p);return array('wip_id'=>$id,'advance_code'=>$code);
        }
        $id=isset($p['wip_id'])?(int)$p['wip_id']:0;
        // Lock source stock before WIP consistently with advance to avoid inverted lock order.
        $hint=$this->row('SELECT stock_item_id FROM tt_wip_materials WHERE id=?',array($id));
        if (!$hint||empty($hint['stock_item_id'])) throw new ProductionError('Phiếu cũ chưa đối soát nguồn tồn',409);
        $stock=$this->row('SELECT * FROM tt_stock_items WHERE id=?'.$this->lock,array($hint['stock_item_id']));
        $w=$this->row('SELECT * FROM tt_wip_materials WHERE id=?'.$this->lock,array($id));
        if (!$w||$w['status']!=='ADVANCED_TO_FLOOR'||!$stock) throw new ProductionError('Phiếu không còn mở',409);
        $returned=self::meters(isset($p['returned_length_meters'])?$p['returned_length_meters']:'');
        $advance=self::meters((string)$w['advance_length_meters']);
        if ($returned>$advance) throw new ProductionError('Lượng trả vượt lượng cấp',422);
        $method=$this->text($p,'measurement_method',30);
        if (!in_array($method,array('LASER_MARKING','WEIGHT_TARE','MANUAL_TAPE'),true)) throw new ProductionError('Phương pháp đo không hợp lệ',422);
        $restocked=$returned>=200?$returned:0;$scrap=$returned-$restocked;$consumed=$advance-$returned;
        $qr=$restocked?'REM-'.date('Ymd').'-'.bin2hex(openssl_random_pseudo_bytes(6)):null;
        if ($restocked) $this->ledger($stock,$restocked,'WIP-RET-'.$id,'WIP remnant '.$w['project_code']);
        $this->run('UPDATE tt_wip_materials SET returned_at=?,measured_return_meters=?,returned_length_meters=?,consumed_length_meters=?,scrap_length_meters=?,available_length_meters=?,status=?,remnant_qr_code=?,measurement_method=? WHERE id=?',array(date('Y-m-d H:i:s'),$this->decimal($returned),$this->decimal($restocked),$this->decimal($consumed),$this->decimal($scrap),$this->decimal($restocked),$restocked?'RETURNED_REMNANT':'FULLY_CONSUMED',$qr,$method,$id));
        if($w['unit_cost_landed_vnd']!==null)$this->run('UPDATE tt_wip_materials SET consumed_cost_vnd=? WHERE id=?',array(number_format($consumed/100*(float)$w['unit_cost_landed_vnd'],2,'.',''),$id));
        $this->audit($action,$id,array('consumed'=>$consumed,'restocked'=>$restocked,'scrap'=>$scrap));
        return array('wip_id'=>$id,'consumed_length_meters'=>$this->decimal($consumed),'returned_length_meters'=>$this->decimal($restocked),'scrap_length_meters'=>$this->decimal($scrap),'remnant_qr_code'=>$qr);
    }
}
