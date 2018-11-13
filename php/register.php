<?php
include "database.php";

// Insert du nouvel utilisateur
$dbh->prepare("INSERT INTO user (pseudo, mdp) VALUES (?, ?)")->execute([$_REQUEST["pseudo"], password_hash($_REQUEST["mdp"], PASSWORD_DEFAULT)]);

// On récupère l'enregistrement créé
$data = $dbh->prepare("SELECT id, pseudo FROM user ORDER BY id DESC LIMIT 1");
$data->execute();
$newUser = $data->fetch();

// Enregistrement du fichier de l'image
move_uploaded_file($_FILES["blob"]["tmp_name"], "../img/users/" . $newUser["id"] . ".png");

// On renvoi les données du nouvel utilisateur
echo json_encode($newUser);

include "kill.php";
?>