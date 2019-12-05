<?php
	//connection to database
	require_once('serverconnect.php');

	//get user id and stock id
	$sid = $_GET['sid'];
	$uid= $_GET['uid'];
	
	//query to delete stocks from owner where stock id and user id match
	$query = "DELETE FROM owner WHERE '$sid'=sid and '$uid' = uid";

	//connect and query
	$con->query("$query");
	
	//return user id
	echo "$uid";
