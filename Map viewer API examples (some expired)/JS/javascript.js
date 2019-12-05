//Global variables for storing town names, and lists of names etc
var mymap;
var town;
var townName;
var indTown;
var _list=[];

//Function to display the map with the set view to NZ
function mapTemplate() {
	mymap = L.map('mapid').setView([-38.68333, 176.08333],12);
	
	//API attributes and access token 
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, 	Imagery © <a 		href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiYWpvMjAiLCJhIjoiY2p2YnJwb3JyMDJ6dDN5b2RicGhseGNzdSJ9.sVPhd-lPC9xoSXne-4uIJQ'
	}).addTo(mymap);
}
//loads the map on page load
window.onload = mapTemplate;


//Fetch the location using the map quest api to return long / lat as json response
function fetchLocation(){
	//Check that user has inputted a value first
	if (document.getElementById("townValue").value != "")
	{
	fetch("https://www.mapquestapi.com/geocoding/v1/address?key=Gb2pZmSu0BPMTB0Gj7ziWDA5y2IlxI5w&location=" + getLocation() +"+NZ&maxResults=1")
	.then(response => response.json())   //parses the json from the response
	.then(json => updateMap(json)); 	// call update map function
	}
	else{
	alert("Please enter a town name");
	}
}

//Get the town name that has been entered into the document
function getLocation(){
	var location= document.getElementById("townValue").value;
	return location;
}

//Update the map with the response function
function updateMap(response){

	//Get the first town from the returned response from fetchLocation function
	town = response.results[0].locations[0];
	var country = town.adminArea1; // setting country to appropriate json values 
	var latitude = town.latLng.lat;	// setting latitude to appropriate json values 
	var longitude = town.latLng.lng; // setting longitude to appropriate json values 
	

	//Set new map view to updated latitude and longitude				
	mymap.setView([latitude,longitude],13);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, 	Imagery © 		<a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiYWpvMjAiLCJhIjoiY2p2YnJwb3JyMDJ6dDN5b2RicGhseGNzdSJ9.sVPhd-lPC9xoSXne-4uIJQ'
	}).addTo(mymap);

	
	//Store recent town search into an object
	storeRecent(town);
	//Passes the longitude and latitude values into the sunsetInfo function
	sunsetInfo(latitude,longitude);
	//Passes the longitude and latitude values into the weatherInfo function
	weatherInfo(latitude,longitude);
}

//Update the map with value of selected town
function updateMapfromRecent(selectedTown)
	{
	//Same to fetch code above aside from the value being the town which is selected
	fetch("https://www.mapquestapi.com/geocoding/v1/address?key=Gb2pZmSu0BPMTB0Gj7ziWDA5y2IlxI5w&location=" + selectedTown +"+NZ&maxResults=1")
	.then(response => response.json())   //parses the json from the response
	.then(json => updateMap(json));
}

//Sunset information function, passed lat and long
function sunsetInfo(lat,lng){
	fetch("PHP/sunset.php?lat=" + lat + "&lng=" + lng ) //fetch request to php script
	.then(response => response.json())
	//Call show sunset function with json response (sunset info)
	.then(json => showSunset(json));

}

//Funciton to showSunset information
function showSunset(info){
	
	//Convert the UTC time into NZ time for rise and set
	var utcDateRise = info.results.sunrise
	var localDateRise = new Date(utcDateRise);

	var utcDateSet = info.results.sunset
	var localDateSet = new Date(utcDateSet);

	//Display the sunset information of selected town, date and time
	var display = indTown + " currently: " + "Sun rise on " + localDateRise.toLocaleString("en-NZ") + " and set on " + localDateSet.toLocaleString("en-NZ");
	document.getElementById("sunset").innerHTML = display;
}

//Weather info function passed lat and long
function weatherInfo(lat,lng){
	//Key to use weather info API
	var key= '367cc364cb004882de694e5a89df2362';
	//XML request and url statement
	var request = new XMLHttpRequest();
	var url = "PHP/weather.php?lat=" + lat + "&lng=" + lng + "&key=" + key;
	request.open("GET",url);
	//Check that request is ready and accepted
	request.onreadystatechange = function(){
		if(request.readyState == 4) {
	    		if (request.status == 200) {
				//Set result to the responseXML and display
	    			result = request.responseXML;
	    			displayInfo(result);
				}
		}
	};
	//Send request
	request.send();
}

//Display information regarding the weather ie. temp, wind, direction
function displayInfo(xmlDoc){
	main = xmlDoc.getElementsByTagName("weather")[0]; //weather ie rain
	temp = xmlDoc.getElementsByTagName("temperature")[0]; //temperature
	speed = xmlDoc.getElementsByTagName("speed")[0]; //speed of wind
	direction = xmlDoc.getElementsByTagName("direction")[0]; //direction of wind
	
	//Display all the information in a nice to read format
	var display2 = "Current Weather Data: " + speed.getAttribute('name') + " directed " + direction.getAttribute('name') + " with " + main.getAttribute('value') + ", Temperatures: " + " MIN: " + 		temp.getAttribute('min') +"&#8451"+ " MAX: " + temp.getAttribute('max') +"&#8451";
	document.getElementById("weather").innerHTML = display2;
}

//Store the recent town function, passed town value
function storeRecent(town){
	indTown=town.adminArea5; //Individual town value is adminArea5 on json response
	var node = document.createElement("div"); //Create a div to store info on recent town
	for(var i in _list) //Loop through each town value in the list of town values
	{	
		townName=_list[i].adminArea5; //Set the town name to whatever is at that index of list array on adminArea5
		if(townName===indTown){	//If that town is already stored on the recent list, show message in console and do not add it again
				console.log("duplicate recent");
				return;		
		}
	}
		//Else add town to recent town list and push it to the anode label inside the node div
		var anode=document.createElement("label");
		_list.push(town);
		anode.innerHTML = indTown.toString();
		node.appendChild(anode);//Append to update
		document.getElementById('recent').appendChild(node); //Append the document to update it
		node.setAttribute('onclick', 'updateMapfromRecent("'+ indTown +'");');//When one of the entered town values is clicked, it calls the updateMapfromRecent function
}
