<?php
include "database.php";

// On cherche si la catégorie existe déjà
$data = $dbh->prepare("SELECT id FROM categorie WHERE nom = ? LIMIT 1");
$data->execute([$_POST["categorie"]]);
$categoryReq = $data->fetch();

// Si oui, on récupère l'id
if ($categoryReq["id"]) {
	
}
// Sinon on crée la catégorie
else {
	$dbh->prepare("INSERT INTO categorie (nom) VALUES (?)")->execute([$_POST["categorie"]]);
	$data = $dbh->prepare("SELECT id FROM categorie ORDER BY id DESC LIMIT 1");
	$data->execute();
	$categoryReq = $data->fetch();
}

// Insert de la nouvelle carte
$insert = $dbh->prepare("INSERT INTO cards (idcat, iduser) VALUES (?, ?)")->execute([$categoryReq["id"], $_POST["userId"]]);

// On récupère l'id de la carte créée
$data = $dbh->prepare("SELECT id FROM cards ORDER BY id DESC LIMIT 1");
$data->execute();
$idmax = $data->fetch();

// Enregistrement du fichier de l'image
move_uploaded_file($_FILES["blob"]["tmp_name"], "../img/cards/" . $idmax["id"] . ".png");

echo $idmax["id"];

include "kill.php";
?>