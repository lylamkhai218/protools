<?php 
    $home_access = true;
    if(!isset($_GET['content_group'])){
        $_GET['content_group'] = 6;
    }
    include("content.php");
?>