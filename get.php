<?php
ini_set('session.use_cookies', 0);
ini_set('session.use_only_cookies', 0);
ini_set('session.use_trans_sid', 1);
session_name('MODAL');
session_start();

require_once('database.php');

header('Access-Control-Allow-Origin:*');

function get_khotes($filter, $user_id) 
{
	$queries = array(
	'all' => 	'SELECT khote_id, khoteur, khote, up, down, fav 
				FROM khote 
				ORDER BY date DESC 
				LIMIT 100',
	'top' =>	'SELECT khote_id, khoteur, khote, up, down, fav 
				FROM khote 
				WHERE up + down > 20 AND (down = 0 OR up/down > 2) 
				ORDER BY up/(down+1) DESC 
				LIMIT 100',
	'fav' =>	'SELECT k.khote_id, k.khoteur, k.khote, k.up, k.down, k.fav 
				FROM khote AS k
				LEFT JOIN relation  AS r 
				ON k.khote_id = r.khote_id 
				WHERE r.user_id = :user AND r.faved  
				ORDER BY k.date DESC 
				LIMIT 100',
	);

	$bdd = Database::connect();

	$query = $bdd->prepare($queries[$filter]);
	$query->execute(array('user' => $user_id));

	$rows = array();
	while($row = $query->fetch()) {
		$rows[] = $row;
	}

	echo json_encode($rows);
}

/*
function get_khotes($filter, $user_id) 
{
	$bdd = Database::connect();

	$query = $bdd->prepare('SELECT khote_id, khoteur, khote, up, down, fav FROM khote ORDER BY date DESC');
	$query->execute(array('user' => $user_id));

	$rows = array();
	while($row = $query->fetch()) {
		$rows[] = $row;
	}

	echo json_encode($rows);
}
*/


// Ajout et redirection
if (isset($_SESSION['user_id'])) {
	$user = $_SESSION['user_id'];
	if ((isset($_GET['filter']) && $_GET['filter'] == 'all') || !isset($_GET['filter'])){
		get_khotes('all', $user);
	}
	elseif (isset($_GET['filter']) && $_GET['filter'] == 'top') {
		get_khotes('top', $user);
	}
	elseif (isset($_GET['filter']) && $_GET['filter'] == 'fav') {
		get_khotes('fav', $user);
	}
}
else {
	echo json_encode('not_logged_in');
}

?>
