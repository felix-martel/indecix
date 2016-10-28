<?php

require('database.php');
$message = "";
// Récupération des données du lien d'activation
$user = $_GET['user'];
$key = $_GET['key'];

// Récupération des données stockées en bdd
$dbh = Database::connect();
$sth = $dbh->prepare('SELECT name, mail, authkey, verified FROM user WHERE name = :user AND authkey = :key');
$sth->execute(array(
	'user' => $user,
	'key' => $key
));

if ($sth->rowCount() == 1){
	// -- Succès
	$sth = $dbh->prepare('UPDATE user SET verified = 1 WHERE name = :user');
	$sth->execute(array(
		'user' => $user
	));
	$message = 'Your account has been successfully activated !';
}
else {
	$message = 'Your activation link is invalid';
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
		<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="css/indecix.css"/>
		<meta content="width=device-width, initial-scale=1.0, 	maximum-scale=1.0, user-scalable=no" name="viewport">
		<script type="text/javascript" src="js/jquery-2.1.4.js"></script>
		<script type="text/javascript" src="js/mustache.js"></script>
		<script type="text/javascript" src="js/cordova.js"></script>
		<script type="text/javascript" src="js/fastclick.js"></script>
	</head>
	<body>
		<div id="logo">
		khotes 
		</div>
		<div class="alert">
		 	<?php echo $message ?>
		</div>
		<script type="text/javascript" src="js/index.js"></script>
	</body>
</html>