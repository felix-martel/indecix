<?php

ini_set('session.use_cookies', 0);
ini_set('session.use_only_cookies', 0);
ini_set('session.use_trans_sid', 1);
session_name('MODAL');
session_start();

header('Access-Control-Allow-Origin:*');

require_once('database.php');

//Tableau pour la gestion d'erreur
$msgJson = array();
$statusMessage = array('status' => 'error', 'code' => 'default_error', 'detail' => 'Unknown error');

function setStatus($success, $text) {
    global $statusMessage;
    if ($success) {
        $statusMessage['status'] = 'success';
        $statusMessage['code'] = '';
    } else {
        $statusMessage['status'] = 'error';
        $statusMessage['code'] = $text;
        switch ($text) {
            case 'empty_field':
                $statusMessage['detail'] = 'New password field is empty';
                break;
            case 'password_not_match':
                $statusMessage['detail'] = 'Old password is incorrect';
                break;
            default:
                $statusMessage['detail'] = 'Unknown error';
                break;
        }
    }
}


try {
    $password = $_POST['pass'];
    assert(strlen($password) > 5);
} catch (Exception $e) {
    setStatus(false, 'empty_field');
    //$msg = array('error' => 'empty_field');
} catch (AssertException $e) {
    setStatus(false, 'empty_field');
    //$msg = array('error' => 'empty_field');
}

// Connexion
$dbh = Database::connect();

// On vérifie que l'ancien mot de passe est correct
$user_id = $_SESSION['user_id'];
$pass = $_POST['pass'];
$query = 'SELECT * FROM user WHERE user_id = :user_id AND password = SHA1(:pass)';
$sth = $dbh->prepare($query);
$sth->execute(array(
    'user_id' => $user_id,
    'pass' => $pass
));

$numrow = $sth->rowCount();
if ($numrow === 1) {
// On met à jour le mot de passe
    $new_pass = $_POST['new_pass'];
    $query = 'UPDATE user SET password = SHA1(:new_pass) WHERE user_id = :user_id';
    $sth = $dbh->prepare($query);
    $sth->execute(array(
        'new_pass' => $new_pass,
        'user_id' => $user_id
    ));
    setStatus(true, '');
} else {
    setStatus(false, 'password_not_match');
}

// On affiche l'erreur ou le succès
array_push($msgJson, $statusMessage);
echo json_encode($msgJson);
?>