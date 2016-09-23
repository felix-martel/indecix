<?php
session_start();
/*	$host_name  = "db646744700.db.1and1.com";
	$database   = "db646744700";
	$user_name  = "dbo646744700";
	$password   = "Khotes!X2015";

	$connect = mysqli_connect($host_name, $user_name, $password, $database);
 if(mysqli_connect_errno())
    {
    '<p>Échec de la connexion à la base de données : '.mysqli_connect_error().'</p>';
    }
    else
    {
    '<p>Connexion réussie à la base de données.</p>';
    }*/
require_once('database.php');

function add_khote($user_id, $khoteur, $khote) 
{
	if (strlen($khoteur)>0 && strlen($khote)>0)
	{
		/*try
		{
			$bdd = new PDO('mysql:host=localhost;dbname=indecix;charset=utf8', 'root', '0000');
			array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);
		}
		catch (Exception $e)
		{
			die('Erreur : '. $e->getMessage());
		}*/
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
header('Location: index.html#all');


?>
