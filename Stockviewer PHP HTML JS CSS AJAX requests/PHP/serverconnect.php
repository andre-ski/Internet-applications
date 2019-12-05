<?php
   //this is the connection to my database using my details 
   try{
   	$con = new PDO("mysql:host=mysql.cms.waikato.ac.nz;dbname=ajo20","ajo20","my10916879sql");
   	} catch (PDOException $e) {
		//error if cannot connect
   		echo "Database connection error " . $e->getMessage();
   	}
   
