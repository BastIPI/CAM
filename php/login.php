<?php
include "database.php";

$data = $dbh->query("SELECT * FROM user WHERE pseudo = '" . $_REQUEST["pseudo"] . "' LIMIT 1")->fetch();

if (password_verify($_REQUEST["mdp"], $data["mdp"])) {
	echo json_encode($data);
}
else {
	echo -1;
}

include "kill.php";
?>