<?php
ini_set('session.use_cookies', 0);
ini_set('session.use_only_cookies', 0);
ini_set('session.use_trans_sid', 1);
session_name('MODAL');
session_start();

header('Access-Control-Allow-Origin:*');

require_once('database.php');

function action($user_id, $action, $id) {


    $dbh = Database::connect();

    $query = 'SELECT '.$action.' FROM relation WHERE user_id = :user_id AND khote_id = :id';
    $sth = $dbh->prepare($query);
    $sth->execute(array(
    'user_id' => $user_id,
    'id' => $id
    ));
    
    $result = $sth->fetch();
    if ($result[$action] == 0) {
        $operand = '+';
    }
    else { $operand = '-';
    }

    $dbh = Database::connect();

    $query = 'UPDATE relation SET '.$action.' = '.$action.' '.$operand.' 1 WHERE khote_id = :id AND user_id = :user_id';
    $sth = $dbh->prepare($query);
    $sth->execute(array(
        'id' => $id,
        'user_id' => $user_id
    ));

    $dbh = Database::connect();

    $query = 'UPDATE khote SET '.$action.' = '.$action.' '.$operand.' 1 WHERE khote_id = :id';
    $sth = $dbh->prepare($query);
    $sth->execute(array(
        'id' => $id
    ));
}

action($_SESSION['user_id'], $_POST['action'], $_POST['id']);

?>