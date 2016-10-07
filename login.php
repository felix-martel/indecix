<?php
ini_set('session.use_cookies', 0);
ini_set('session.use_only_cookies', 0);
ini_set('session.use_trans_sid', 1);
session_name('MODAL');
session_start();



header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 01 Jul 1980 05:00:00 GMT');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin:*');

// tableau pour la gestion des erreurs
$msgJson = array();


$msg = array('session_id' => session_id());
array_push($msgJson, $msg);

// Vérification des champs input envoyés par POST
if (isset($_POST['username'], $_POST['password']) && !empty($_POST['username']) &&  !empty($_POST['password'])) {
    require('database.php');
    $dbh = Database::connect();
    
    $query = 'SELECT user_id, name, password FROM user WHERE name=:username AND password=:pwd';
    $sth = $dbh->prepare($query);
    $sth->execute(array(
    	'username' => $_POST['username'],
    	'pwd' => $_POST['password']
    	));

    $result = $sth->rowCount();
    if ($result === 1) {
        // on stocke un message de succès dans un tableau
        $msg = array('success' => 'Success');
        // on enregistre le user_id dans $_SESSION
        $user_id = $sth->fetch()['user_id'];
        //echo 'user_id = '. $user_id;
        $_SESSION['user_id'] = $user_id;
    } else {
        $msg = array('error' => 'Fail');
    }
} else {
    $msg = array('error' => 'Login or password is not set');
}
 
// on affiche l'erreur ou le succès
array_push($msgJson, $msg);
echo json_encode($msgJson);
//header('Location: index.html#all');
?>