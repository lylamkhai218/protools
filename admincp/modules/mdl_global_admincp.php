<?php
    $languagecp = 0;
    $meta_language_admin = array();
    if(!isset($_COOKIE["languagecp"])){
        $expire_languagecp = time()+60*60*24*365;
        setcookie("languagecp",0,$expire_languagecp,$GLOBALS['base_folder'],$GLOBALS["domain"],0);
    }
    else{
        $languagecp = $_COOKIE["languagecp"];
    }
    get_language_of_admincp($languagecp);
    function get_language_of_admincp($languageid){
        $query = "select id,value from language_admin where languageid = $languageid";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result)){
                $GLOBALS["meta_language_admin"][$row[0]] = $row[1];
            }
            return true;
        }
    }

    /**
     * Đồng bộ trạng thái Xuất bản / Gỡ sản phẩm sang Production Frontend
     * $status: 1 = Xuất bản (Hiện), 0 = Gỡ (Ẩn)
     */
    function sync_status_to_production_catalog($contentid, $status){
        $contentid = intval($contentid);
        if($contentid <= 0) return;

        // Chỉ đồng bộ nhóm Sản phẩm (content_group == 6)
        $q_group = "select content_group from content where contentid = $contentid";
        $r_group = mysql_query($q_group, $GLOBALS["con"]);
        $c_group = 6;
        if($r_group && mysql_num_rows($r_group) > 0){
            $row_g = mysql_fetch_array($r_group);
            $c_group = intval($row_g['content_group']);
        }
        if($c_group != 6) return;

        // Lấy mã SKU (code) trong content_info
        $q_code = "select code from content_info where contentid = $contentid";
        $r_code = mysql_query($q_code, $GLOBALS["con"]);
        $sku = "";
        if($r_code && mysql_num_rows($r_code) > 0){
            $row_c = mysql_fetch_array($r_code);
            $sku = trim($row_c['code']);
        }

        // Đường dẫn file lưu trữ trên server
        $target_dir = $_SERVER['DOCUMENT_ROOT'] . '/data';
        $json_file = $target_dir . '/disabled_products.json';
        if(!is_dir($target_dir)){
            @mkdir($target_dir, 0755, true);
        }

        $disabled_items = array();
        if(file_exists($json_file)){
            $raw = @file_get_contents($json_file);
            $decoded = @json_decode($raw, true);
            if(is_array($decoded)){
                $disabled_items = $decoded;
            }
        }

        $identifiers = array(strval($contentid));
        if(!empty($sku)){
            $identifiers[] = $sku;
        }

        if($status == 0){
            // Gỡ / Tắt -> Thêm vào danh sách disabled
            foreach($identifiers as $id_val){
                if(!in_array($id_val, $disabled_items)){
                    $disabled_items[] = $id_val;
                }
            }
        } else {
            // Xuất bản / Bật -> Bỏ khỏi danh sách disabled
            $disabled_items = array_values(array_filter($disabled_items, function($item) use ($identifiers){
                return !in_array(strval($item), $identifiers);
            }));
        }

        @file_put_contents($json_file, json_encode($disabled_items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
?>
