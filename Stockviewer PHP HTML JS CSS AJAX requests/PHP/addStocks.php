<?php
	//connection to database
	require_once('serverconnect.php');

	//get stock id and user id
	$sid = $_GET['sid'];
	$uid=$_GET['uid'];
		//query to insert new values into owner table
		$query="INSERT INTO owner(uid,sid) VALUES('$uid','$sid');";
		if($con->query($query)!= FALSE){
		}
