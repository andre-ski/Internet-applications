<?php
	//connection to database
	require_once('serverconnect.php');
	
	//get the user id
	$id = $_GET['uid'];
	
	//query to select all from owner where user id matches
	$query1 = "select * from owner where '$id' = uid";
	
	//result of query
	$result1 = $con->query($query1);

	//while the result is going through table rows
	while($row = $result1->fetch()) {
		$sid = $row['sid'];
		//select all from stocks where stock id matches users stock id
		$query2 = "select * from Stocks where id = '$sid'";
		$result2 = $con->query($query2);

		while($row = $result2->fetch()) {
			//id information
			$info = $row['id'];
			//call popup function and give it id
			echo "<div onclick='javascript:popup(\"" . $info . "\");'>";	
			echo $row['companyname'] ;
			echo "</br>";
			echo "</div>";	
  		} 
	//button to list all available stocks
  	}echo "<button onclick='listAllStocks()'>Show Available Stocks</button>";
  	
