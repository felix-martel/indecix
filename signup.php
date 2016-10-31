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
                $statusMessage['detail'] = 'Username or password is empty';
                break;
            case 'user_doesnt_exist':
                $statusMessage['detail'] = 'This user/password does not match any existing user';
                break;
            case 'unverified_account':
                $statusMessage['detail'] = 'Your account has not been verified. Please click on the activation link';
                break;
            case 'username_already_exists':
                $statusMessage['detail'] = 'This username already exists. Please choose another one';
                break;
            case 'email_already_exists':
                $statusMessage['detail'] = 'This e-mail address is already associated with an account. Please use another one';
                break;
            case 'email_not_sent':
                $statusMessage['detail'] = 'There was an issue sending the activation e-mail. Please verify your e-mail adress or contact the webmaster.';
                break;
            default:
                $statusMessage['detail'] = 'Unknown error';
                break;
        }
    }
}

$serverURL = "http://s621682634.onlinehome.fr/";

try {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    assert(!empty($username));
    assert(!empty($email));
    assert(strlen($password) > 5);
} catch (Exception $e) {
    setStatus(false, 'empty_field');
    //$msg = array('error' => 'empty_field');
} catch (AssertException $e) {
    setStatus(false, 'empty_field');
    //$msg = array('error' => 'empty_field');
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
        setStatus(false, 'username_already_exists');
        //$msg = array('error' => 'username_already_exists');
        //array_push($msgJson, $msg);
    } else {
        // Unicité de l'adresse email
        $query = 'SELECT user_id FROM user WHERE mail=:email';
        $sth = $dbh->prepare($query);
        $sth->execute(array(
            'email' => $email,
        ));
        if ($sth->rowCount() > 0) {
            setStatus(false, 'email_already_exists');
            //$msg = array('error' => 'email_already_exists');
            //array_push($msgJson, $msg);
        } else {
            // Insertion de l'utilisateur
            $verif_key = md5(microtime(TRUE) * 100000);
            $sth = $dbh->prepare("INSERT INTO user (name, mail, password, authkey) VALUES (:username, :email, SHA1(:password), :key)");
            $sth->execute(array(
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'key' => $verif_key
            ));
            setStatus(true, '');

            // Envoi du mail de confirmation
            $recipient = $email;
            $title = 'Activate your KHOTE account';
            $header = "MIME-Version: 1.0\r\n";
            $header .= "From: Jacques Biot, CEO of KHOTES <activation@khote.com>\r\n";
            $header .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $header .= "X-Mailer: PHP/" . phpversion();
            $activation_link = $serverURL . 'auth.php?user=' . urlencode($username) . '&key=' . urlencode($verif_key);

            $message = "Hi,\r\nThanks for signing up to KHOTE !\r\n\r\nTo activate your account, click on this link : " . $activation_link . "\r\nAfter you have activated your account, you can login via your mobile app.\r\n\r\nBest regards,\r\nJacques Biot, CEO of KHOTE\r\n\r\n---\r\n\r\nPlease do not reply, I'm very busy right now";
            if (mail($recipient, $title, $message, $header)) {
                setStatus(true, '');
            } else {
                setStatus(false, 'email_not_sent');
            }
        }
    }
} else {
    $msg = array('error' => 'Login or password is not set');
}

// on affiche l'erreur ou le succès
array_push($msgJson, $statusMessage);
echo json_encode($msgJson);
//header('Location: index.html#all');
?>