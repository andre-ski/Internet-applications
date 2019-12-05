<?php
	//Get lat, long, apikey
	$lat = $_GET["lat"];
	$lng = ($_GET["lng"]);
	$apikey = $_GET["key"];
	//explicitly ask for response as xml
	$url = "https://api.openweathermap.org/data/2.5/weather?lat=" . $lat . "&lon=". $lng . "&APPID=" . $apikey . "&mode=xml" . "&units=metric";
	
	//using curl
  	$process = curl_init($url);
  	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
  	$return = curl_exec($process);
	//check if it has been returned as xml or else die
	$xml=simplexml_load_string($return) or die("Error: Cannot create object");
	header('Content-type: text/xml');
    	echo $xml->asXML();
  	curl_close($process);
