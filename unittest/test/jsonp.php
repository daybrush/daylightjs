<?
header('Content-type: application/json');
?>
<?echo $_GET["callback"];?>({"a" : "aaa"});