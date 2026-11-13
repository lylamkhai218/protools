<?php
// Local smoke verification; no production writes and no secret output.
if(PHP_SAPI!=='cli')exit;
require dirname(__DIR__).'/public/office/config.php';
$db=get_db();
echo json_encode(array('php'=>PHP_VERSION,'driver'=>$db->getAttribute(PDO::ATTR_DRIVER_NAME),'database_version'=>$db->getAttribute(PDO::ATTR_SERVER_VERSION),'note'=>'Do not infer inventory correctness from runtime availability.'),JSON_PRETTY_PRINT)."\n";
