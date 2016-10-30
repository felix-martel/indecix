<?php

ini_set('session.use_cookies', 0);
ini_set('session.use_only_cookies', 0);
ini_set('session.use_trans_sid', 1);
session_name('MODAL');
session_start();

header('Access-Control-Allow-Origin:*');

require_once('database.php');

function action($user_id, $action, $id) {
    $action_array = array('up', 'down', 'fav', 'flag', 'report');

    if (in_array($action, $action_array)) {
        // Connexion
        $dbh = Database::connect();

        // On regarde si l'user a déjà réagit à la khote
        $query = 'SELECT ' . $action . 'ed FROM relation WHERE user_id = :user_id AND khote_id = :id';
        $sth = $dbh->prepare($query);
        $sth->execute(array(
            'user_id' => $user_id,
            'id' => $id
        ));

        $numrow = $sth->rowCount();
        if ($numrow === 1) {
            $result = $sth->fetch();
            if ($result[$action + 'ed'] == 0) {
                $operand = '+';
            } else {
                $operand = '-';
            }
        } else {
            $query = 'INSERT INTO relation (id, user_id, khote_id, author) VALUES (NULL,:user_id,:id,0)';
            $sth = $dbh->prepare($query);
            $sth->execute(array(
                'id' => $id,
                'user_id' => $user_id
            ));
            $operand = '+';
        }

        // On met à jour la table de relation khote-user
        $query = 'UPDATE relation SET ' . $action . 'ed = ' . $action . 'ed ' . $operand . ' 1 WHERE khote_id = :id AND user_id = :user_id';
        $sth = $dbh->prepare($query);
        $sth->execute(array(
            'id' => $id,
            'user_id' => $user_id
        ));

        // On met à jour la table des khotes
        $query = 'UPDATE khote SET ' . $action . ' = ' . $action . ' ' . $operand . ' 1 WHERE khote_id = :id';
        $sth = $dbh->prepare($query);
        $sth->execute(array(
            'id' => $id
        ));
    }
}

action($_SESSION['user_id'], $_POST['action'], $_POST['id']);

/*
  function getQueryUpdate($field){
  return 'UPDATE relation SET '.$field.' = CASE '.$field.' WHEN 1 THEN 0 ELSE 1 WHERE id = :id';
  }
  function getQuerySelect($field){
  return 'SELECT id, '.$field.' AS value FROM relation WHERE user_id = :user AND khote_id = :khote';
  }
  function getQueryInsert($field){
  return 'INSERT INTO relation (user_id, khote_id, '.$field.') VALUES (:user, :khote, 1)';
  }
  function getQueryFinal($field, $decrement){
  if ($decrement) {
  return 'UPDATE khote SET '.$field.' = '.$field.'- 1 FROM khote WHERE khote_id = :id';
  }
  else {
  return 'UPDATE khote SET '.$field.' = '.$field.'+ 1 FROM khote WHERE khote_id = :id';
  }
  }

  function react($action, $user_id, $khote_id){
  $field_list = array(
  "fav" => "faved",
  "up" => "uped",
  "down" => "downed",
  "report" => "reported"
  );
  $field = $field_list[$action];

  $bdd = Database::connect();
  $query = $bdd->prepare(getQuerySelect($field));
  $query->execute(array(
  'khote' => $khote_id,
  'user' => $user_id
  ));
  $decrement = false;
  if ($query->rowCount() > 0){
  $result = $query->fetch();
  $decrement = ($result['value'] == 1);
  $query = $bdd->prepare(getQueryUpdate($field));
  $query->execute(array(
  'id' => $result['id']
  ));

  }
  else {
  $query = $bdd->prepare(getQueryInsert($field));
  $query->execute(array(
  'user' => $user_id,
  'khote' => $khote_id
  ));
  }
  $query = $bdd->prepare(getQueryFinal($field, $decrement));
  $query->execute(array(
  'id' => $result['id']
  ));
  }


  // Ajout et redirection
  react($_POST['action'], $_SESSION['user_id'], $_POST['id']);
 */
?>