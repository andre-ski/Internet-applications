<?php
	//connection to database
	require_once('serverconnect.php');

	//get stock id
	$sid = $_GET['sid'];

	//query to get all stocks with same stock id
	$query = "Select * from Stocks where '$sid' = id";

	//result of the query
	$result = $con->query($query);

	//while the result is going through table rows
	while($row = $result->fetch()) {
			//show company details
			echo "Company name: " ;
			echo $row['companyname'] ;
			echo "</br>";
			echo "Current price: " ;
			echo $row['currentprice'] ;
			echo "</br>";
			echo "Recent change: " ;
			echo $row['recentchange'];
			echo "</br>";
			echo "Annual trend: ";
			echo $row['annualtrend'];
			echo "</br>";
			echo "Recent change direction: ";
			echo $row['recentchangedirection'];
			echo "</br>";
			//clicking this button calls function to remove stock
			echo "<button onclick='removeStock(); '>Remove Stock</button>";

	}
