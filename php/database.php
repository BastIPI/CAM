<?php

$host_name = "localhost";
$user_name = "root";
$password = "";
$database = "memorycard";

/* $host_name = "db757954298.db.1and1.com";
$database = "db757954298";
$user_name = "dbo757954298";
$password = "AntiHero02#"; */

$dbh = new PDO("mysql:host=$host_name;dbname=$database", $user_name, $password);


?>