<?php
// PHP development server equivalent of the deployed Office rewrite rule.
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
if(preg_match('#^/office/san-xuat(?:/.*)?$#',$path)) {require dirname(__DIR__).'/public/office/san-xuat.php';return true;}
return false;
