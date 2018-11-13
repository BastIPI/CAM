<?php
include "database.php";

switch ($_REQUEST["sqlQuery"]) {
	case "pseudoLike":
		$sql = "SELECT pseudo FROM user WHERE pseudo LIKE '" . $_REQUEST["like"] . "%';";
		break;
	case "pseudoEq":
		$sql = "SELECT pseudo FROM user WHERE pseudo = '". $_REQUEST["pseudo"] . "';";
		break;
	case "profil":
		$sql = "SELECT * FROM user WHERE id = '". $_REQUEST["id"] . "' LIMIT 1;";
		break;
	case "decks":
		$sql = "SELECT decks.*, COUNT(deckscards.idcard) AS nbrCartes FROM decks JOIN deckscards ON decks.id = deckscards.iddeck WHERE decks.iduser = '" . $_REQUEST["userId"] . "' GROUP BY deckscards.iddeck;";
		break;
	case "deck":
		$sql = "SELECT * FROM decks WHERE id = " . $_REQUEST["deckid"] . " LIMIT 1;";
		break;
	case "deckCards":
		$sql = "SELECT deckscards.idcard, decks.nom FROM deckscards INNER JOIN decks ON deckscards.iddeck = decks.id WHERE iddeck = " . $_REQUEST["deckid"] . ";";
		break;
    case "categorie":
        $sql = "SELECT DISTINCT nom FROM categorie " . ((isset($_REQUEST["like"]) and $_REQUEST["like"] != "") ? "WHERE nom LIKE '" . $_REQUEST["like"] . "%'" : "") . "ORDER BY nom";
		break;
	case "cards": 
		$sql = "SELECT cards.id, categorie.nom FROM cards INNER JOIN categorie ON cards.idcat=categorie.id";
		if ($_REQUEST["deck"] != 0) {
			$sql .= " LEFT JOIN (SELECT * FROM deckscards WHERE iddeck = " . $_REQUEST["deck"] . ") cardsDeck ON cards.id=cardsDeck.idcard";
		}
		$sql .= " WHERE cards.iduser = " . $_REQUEST["userId"] . " ORDER BY categorie.nom, cards.id";
		break;
}


echo json_encode($dbh->query($sql)->fetchAll());

include "kill.php";

?>