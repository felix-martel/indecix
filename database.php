<?php
class Database {
	public static function connect() {
		$dsn = 'mysql:dbname=indecix;host=127.0.0.1';
		$user = 'root';
		$pwd = ''; //modal
		$dbh = null;

		/*
		$dsn  = "mysql:dbname=db646744700;host=db646744700.db.1and1.com";
		$database   = "db646744700";
		$user  = "dbo646744700";
		$pwd   = "Khotes!X2015";
		*/
		
		try {
			$dbh = new PDO($dsn, $user, $pwd, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		catch (PDOException $e) {
			echo 'Echec de connexion : ' .$e->getMessage();
			exit(0);
		}
		return $dbh;
	}

}