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
$serverURL = "";

try {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    assert(!empty($username));
    assert(!empty($email));
    assert(strlen($password) > 5);
}
catch (Exception $e) {
    $msg = array('error' => 'unset_field');
}
catch(AssertException $e){
    $msg = array('error' => 'empty_field');
}

// Vérification des champs input envoyés par POST
if (isset($_POST['username'], $_POST['password']) && !empty($_POST['username']) && !empty($_POST['password'])) {
    require('database.php');
    $dbh = Database::connect();
    // Unicité du pseudo utilisateur
    $query = 'SELECT user_id FROM user WHERE name=:username';
    $sth = $dbh->prepare($query);
    $sth->execute(array(
        'username' => $_POST['username'],
    ));
    if ($sth->rowCount() > 0) {
        $msg = array('error' => 'username_already_exists');
        array_push($msgJson, $msg);
    }
    // Unicité de l'adresse email
    $query = 'SELECT user_id FROM user WHERE mail=:email';
    $sth = $dbh->prepare($query);
    $sth->execute(array(
        'email' => $email,
    ));
    if ($sth->rowCount() > 0) {
        $msg = array('error' => 'email_already_exists');
        array_push($msgJson, $msg);
    }
    // Insertion de l'utilisateur
    $verif_key = md5(microtime(TRUE)*100000);
    $sth = $dbh->prepare("INSERT INTO user (name, mail, password, authkey) VALUES (:username, :email, :password, :key)"); 
    $sth->execute(array(
        'username' => $username,
        'email' => $email, 
        'password' => $password,
        'key' => $verif_key
    ));
    // Envoi du mail de confirmation
    $recipient = $email;
    $title = "Activate your KHOTE account";
    $header = "From: activation@khote.com";
    $activation_link = $serverURL."auth.php?user=".urlencode($username).'&key='.urlencode($key);
    $login_link = $serverURL."index.html#login";

    $message = 'Hi,
     Thanks for signing up to KHOTE !

     To activate your account, click on this link : '.$activation_link.'
     After you have activated your account, you can login at '.$login_link.'

     Best regards,
     Jacques Biot, CEO of KHOTE

     ---

     Please do not reply, I\'m very busy right now';
     mail($recipient, $title, $message, $header);

} else {
    $msg = array('error' => 'Login or password is not set');
}

// on affiche l'erreur ou le succès
array_push($msgJson, $msg);
echo json_encode($msgJson);
//header('Location: index.html#all');
?>