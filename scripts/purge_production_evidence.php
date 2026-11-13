<?php
// CLI-only scheduled retention. Removes only expired opaque JPEG evidence in its fixed folder.
if(PHP_SAPI!=='cli')exit;
require dirname(__DIR__).'/public/office/config.php';
$dir=realpath(dirname(__DIR__).'/public/office/storage/production-evidence');
if(!$dir){echo "No evidence directory.\n";exit;}
$cutoff=time()-90*86400;$removed=0;
foreach(new DirectoryIterator($dir) as $file){
    if(!$file->isFile()||$file->isLink()||!preg_match('/^[a-f0-9]{48}\.jpg$/D',$file->getFilename())||$file->getMTime()>=$cutoff)continue;
    if(unlink($file->getPathname()))$removed++;
}
echo 'Expired evidence removed: '.$removed."\n";
