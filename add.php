<?php
ini_set('session.use_cookies', 0);
ini_set('session.use_only_cookies', 0);
ini_set('session.use_trans_sid', 1);
session_name('MODAL');
session_start();

require_once('database.php');

header('Access-Control-Allow-Origin:*');

function add_khote($user_id, $khoteur, $khote) 
{
	if (strlen($khoteur)>0 && strlen($khote)>0)
	{
		$bdd = Database::connect();

		// Insertion de la khote
		$query = $bdd->prepare('INSERT INTO khote (khoteur, khote, author) VALUES (:khoteur, :khote, :auth)');
		$query->execute(array(
			'khote' => $khote,
			'khoteur' => $khoteur,
			'auth' => $user_id
			));

		//Récupèration de l'identifiant de la khote nouvellement insérée
		$khote_id = $bdd->lastInsertId();

		// Création d'une nouvelle relation user/khote
		$query = $bdd->prepare('INSERT INTO relation (user_id, khote_id, author) VALUES (:auth, :khot, TRUE)');
		$query->execute(array(
			'auth' => $user_id,
			'khot' => $khote_id
		));
	}
}

// Ajout et redirection
add_khote($_SESSION['user_id'], $_POST['khoteur'], $_POST['khote']);
//header('Location: index.html#all');


?>
