<?php
	//connection to database
	require_once('serverconnect.php');

	//get username and password
	$username = $_GET['user'];
	$password = $_GET['pass'];
	
	//query to select user whos details match username and password in database
	$sql = "SELECT * FROM login WHERE '$username'= username and '$password' = password";

	//result of the query
	$result = $con->query($sql);
	
	//while the result is going through table rows
	while($row = $result->fetch()) {
		//return user id
		echo $row['uid'];
		return;
	}
	//else return 99, shows wrong details entered
  	echo -99;
	
