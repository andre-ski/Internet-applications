<?php
	//Get the latitude and longitude
	$lat = $_GET["lat"];
	$lng = ($_GET["lng"]);

	$url = "https://api.sunrise-sunset.org/json?lat=" . $lat . "&lng=". $lng. "&date=today" ."&formatted=0";
	//Default return type is json
 
	//Using curl
  	$process = curl_init($url);
  	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
  	$return = curl_exec($process);

	//Return
  	echo $return;
  	curl_close($process);
