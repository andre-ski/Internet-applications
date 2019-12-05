<?php

	/**************************
	 * Add your code to connect to your database here
	 */   try{
   	$con = new PDO("mysql:host=mysql.cms.waikato.ac.nz;dbname=ajo20","ajo20","my10916879sql");
   	} catch (PDOException $e) {
		//error if cannot connect
   		echo "Database connection error " . $e->getMessage();
   	}
 
   /***************************
    * 
    * Add code here to query the DB for weather information for the given town
    * */
	
	$town = $_GET['town'];
	
	$query = "Select * from weather where '$town' = town";

	//result of the query
	$result = $con->query($query);
	
	$json_array = array();
	
	//while the result is going through table rows
	while($row = $result->fetch()) {
	$json_array[]=$row;
	}
	
    /*
    * Construct a PHP array object containing the weather data 
    * and return as JSON
    * 
    */
	echo json_encode($json_array);
	
	
	

   
	


