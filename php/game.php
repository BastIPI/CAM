<?php 
include "database.php";

$data = $dbh->prepare("SELECT idcard FROM deckscards WHERE iddeck = :iddeck");
$data->bindParam(':iddeck', $iddeck);

// Récupération de la liste des decks
$decks = json_decode($_POST["decks"]);

// Execution de la requête pour chaque deck selectionné
$cards = array();
for ($i = 0;$i < count($decks);$i++) {
	$iddeck = $decks[$i];
	$data->execute();
	
	// Création du tableau contenant toutes les cartes
	foreach ($data as $row) {
		if (!in_array($row["idcard"], $cards)) {
			array_push($cards, $row["idcard"]);
		}
	}
	
}
// Si le nombre de cartes est suffisant pour la difficulté demandée
if (count($cards) >= $_POST["difficulty"]) {
	
	// Initialisation du tableau de jeu
	$board = array();
	$boardSize = $_POST["difficulty"];

	// Mélange des cartes
	for ($k = 0 ; $k < count($cards) ; $k++) {
		$rnd = mt_rand(0, count($cards) - 1);
		$temp = $cards[$k];
		$cards[$k] = $cards[$rnd];
		$cards[$rnd] = $temp;
	}

	// Remplissage du tableau du plateau de jeu
	$i = 0;
	$board = array_fill("0", $boardSize * 2, 0);
	
	while ($i < $boardSize) {
		// On choisi les cartes du plateau aléatoirement
		$rndCard = mt_rand(0, count($cards) - 1);
		
		// Si la carte n'est pas déjà dans le plateau
		if (!in_array($cards[$rndCard] . "a", $board) and !in_array($cards[$rndCard] . "b", $board)) {
			
			// On place les cartes à des emplacements libres
			for ($j = 0 ;$j <= 1; $j++) {
				do {
					$rndBoard = mt_rand(0, count($board) - 1);
				} while ($board[$rndBoard] != "0");
				$board[$rndBoard] = $cards[$rndCard] . ($j == 0 ? "a" : "b"); 
			}
			$i++;
		}
	}
	echo json_encode($board);
}
else {
	echo "-1";
}

include "kill.php";
?> 