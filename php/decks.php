<?php
include "database.php";

// Fonction de création de deck dans la base (INSERT)
function createDeck($name, $cards) {
	
	global $dbh;
	
	// Insert du deck
	$dbh->prepare("INSERT INTO decks (iduser, nom) VALUES (?, ?)")->execute([$_POST["userId"], $name]);
	
	// Récupération de l'id du deck ajouté
	$data = $dbh->prepare("SELECT id FROM decks ORDER BY id DESC LIMIT 1");
	$data->execute();
	$iddeck = $data->fetch();
	
	// Ajout des liaisons cartes-decks
	addCardOfDeck($iddeck["id"], $cards);

	// Retourne le nom du deck
	echo $name;
}

// Fonction de modification de deck dans la base (UPDATE)
function modifyDeck($id, $name, $cards) {
	
	global $dbh;
	
	// Update du deck
	$data = $dbh->prepare("UPDATE decks SET nom =? WHERE id =?")->execute([$name, $id]);

	// Suppression des liaisons cartes-decks existantes et création des nouvelles
	deleteCardOfDeck($id);
	addCardOfDeck($id, $cards);
	
	// Retourne le nom du deck
	echo $name;
}

// Fonction de suppression de deck dans la base (DELETE)
function deleteDeck($id) {
	global $dbh;
	
	// Récupération du nom du deck
	$data = $dbh->prepare("SELECT nom FROM decks WHERE id = ?");
	$data->execute([$id]);
	$name = $data->fetch();
	
	// Suppresion du deck
	$data = $dbh->prepare("DELETE FROM decks WHERE id = ?")->execute([$id]);
	
	// Suppression des liaisons cartes-decks
	deleteCardOfDeck($id);
	
	// Retourne le nom du deck
	echo $name["nom"];
}

// Fonction d'ajout des associations cartes/deck 
function addCardOfDeck($id, $cardsJson) {
	
	global $dbh;
	$data = $dbh->prepare("INSERT INTO deckscards (iddeck, idcard) VALUES (?, ?)");

	$cards = json_decode($cardsJson);

	for ($i = 0;$i < count($cards);$i++) {
		$data->execute([$id, $cards[$i]]);
	}
}

// Fonction de suppression des associations cartes/deck 
function deleteCardOfDeck($id) {
	global $dbh;
	
	// Suppression des liaisons cartes-decks
	$data = $dbh->prepare("DELETE FROM deckscards WHERE iddeck = ?")->execute([$id]);
}

switch ($_POST["mode"]) {
    case "create":
		createDeck($_POST["nom"], $_POST["cards"]);
        break;
    case "modify":
		modifyDeck($_POST["iddeck"], $_POST["nom"], $_POST["cards"]);
		break;
    case "delete":
		deleteDeck($_POST["iddeck"]);
        break;
}

include "kill.php";
?>