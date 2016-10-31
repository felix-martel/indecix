<?php
ini_set('session.use_cookies', 0);
ini_set('session.use_only_cookies', 0);
ini_set('session.use_trans_sid', 1);
session_name('MODAL');
session_start();

header('Access-Control-Allow-Origin:*');

require_once('database.php');



function get_khotes($filter, $user_id, $search='') 
{
	$queries = array(
	// Récupération de toutes les khotes
	'all' =>    'SELECT k.khote_id as khote_id, k.khoteur as khoteur, k.khote as khote, 
				k.up as up, IFNULL(r.uped, 0) as uped, k.down as down, IFNULL(r.downed, 0) as downed,
				k.fav as fav, IFNULL(r.faved, 0) as faved, k.flag as flag, IFNULL(r.flaged, 0) as flagged
				FROM khote AS k
				LEFT JOIN 
                (SELECT * FROM relation 
                 WHERE user_id = :user) AS r
                 ON k.khote_id = r.khote_id 
				ORDER BY k.date DESC 
				LIMIT 100',
	// Récupération des meilleures khotes
	'top' =>	'SELECT k.khote_id as khote_id, k.khoteur as khoteur, k.khote as khote, 
				k.up as up, IFNULL(r.uped, 0) as uped, k.down as down, IFNULL(r.downed, 0) as downed,
				k.fav as fav, IFNULL(r.faved, 0) as faved, k.flag as flag, IFNULL(r.flaged, 0) as flagged
				FROM khote AS k
				LEFT JOIN 
                (SELECT * FROM relation 
                 WHERE user_id = :user) AS r
                 ON k.khote_id = r.khote_id
				WHERE up + down > 20 AND (down = 0 OR up/(down+0.1) > 2) 
				ORDER BY up/(down+0.1) DESC 
				LIMIT 100',
	// Récupération des khotes favorites de l'utilisateur
	'fav' =>	'SELECT k.khote_id as khote_id, k.khoteur as khoteur, k.khote as khote, 
				k.up as up, IFNULL(r.uped, 0) as uped, k.down as down, IFNULL(r.downed, 0) as downed,
				k.fav as fav, IFNULL(r.faved, 0) as faved, k.flag as flag, IFNULL(r.flaged, 0) as flagged
				FROM khote AS k
				LEFT JOIN 
                (SELECT * FROM relation 
                 WHERE user_id = :user) AS r
                 ON k.khote_id = r.khote_id	
				WHERE r.user_id = :user AND r.faved  
				ORDER BY k.date DESC 
				LIMIT 100',
	'search' => 'SELECT k.khote_id as khote_id, k.khoteur as khoteur, k.khote as khote, 
				k.up as up, IFNULL(r.uped, 0) as uped, k.down as down, IFNULL(r.downed, 0) as downed,
				k.fav as fav, IFNULL(r.faved, 0) as faved, k.flag as flag, IFNULL(r.flaged, 0) as flagged
				FROM khote AS k
				LEFT JOIN 
                (SELECT * FROM relation 
                 WHERE user_id = :user) AS r
                 ON k.khote_id = r.khote_id
                 WHERE CONCAT(k.khoteur, " khote ", k.khote) LIKE :search
				ORDER BY k.date DESC 
				LIMIT 100',
	);

	$bdd = Database::connect();
	/*echo '<h1>'.$search;
	echo ($search != '').'</h1>';
	if ($search != ''){
		$arguments = array(
			'user' => $user_id,
			'search' => $search
		);
	}
	else {
		$arguments = array(
			'user' => $user_id
		);
	}*/
	$query = $bdd->prepare($queries[$filter]);
	if ($search != ''){
		$query->execute(array(
			'user' => $user_id,
			'search' => '%'.$search.'%'
		));
	}
	else {
		$query->execute(array(
			'user' => $user_id
		));
	}
	

	$rows = array();
	while($row = $query->fetch()) {
		$rows[] = $row;
	}

	echo json_encode($rows);
}


// Ajout et redirection
if (isset($_SESSION['user_id'])) {
	$user = $_SESSION['user_id'];
	if ((isset($_GET['filter']) && $_GET['filter'] == 'all') || !isset($_GET['filter'])){
		// On affiche toutes les khotes :
		//   soit si la requête spécifie filter=all
		//	 soit si aucun filter n'est spécifié
		get_khotes('all', $user);
	}
	elseif (isset($_GET['filter']) && $_GET['filter'] == 'top') {
		get_khotes('top', $user);
	}
	elseif (isset($_GET['filter']) && $_GET['filter'] == 'fav') {
		get_khotes('fav', $user);
	}
	elseif(isset($_GET['filter']) && $_GET['filter'] == 'search' && isset($_GET['q']) && $_GET['q'] != '') {
		get_khotes('search', $user, $_GET['q']);
	}
}
else {
	echo json_encode('not_logged_in');
}

?>
