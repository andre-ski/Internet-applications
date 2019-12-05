//XHR Object variable
var request = new XMLHttpRequest();
var user ="";
var stock= "";
var info="";
var uid = "";
var sid="";

//AJAX Function
function ajaxRequest(method, url, data, callback){	

	request.open(method,url+data,true);
	
	//if post then set request header
	if(method == "POST"){
		request.setRequestHeader      
		('Content-Type','application/x-www-form-urlencoded');
	}
	
	//if ready state is 4 (ready) and request status is 200 (request successful) then
	request.onreadystatechange = function(){
		if (request.readyState == 4) {
			if (request.status == 200) {
				response = request.responseText;
				callback(response);	
				} 
				else	{
				//else handle error
				handleError(request.statusText);
				}
			}
  		 }
	request.send(data);
}

//check login fucntion
function checkLogin(){  
	//get the username and password and then use that data in ajaxrequest to 
	//getLoginInfo, callback displayStock
	user = document.getElementById('user').value;
	var pass = document.getElementById('pass').value;
	var data = "?user=" + user + "&pass=" + pass;
	ajaxRequest("POST","../PHP/getLoginInfo.php",data, displayStock);
}


//callback function to display returned data
function displayStock(response) {
	
	//if response was -99 then dont let user log in
  	if(response === "-99"){
		alert("You are not a registered user <--ERROR " + response + "-->");
	}
	else{	

		//if login successful then show stock divs, welcome div, logout button and heading div
		var display=document.getElementById("stock_list");
		display.style.display="block";
		var display=document.getElementById("welcome");
		display.style.display="block";
		let logout = document.getElementById("logout");
		logout.style.display="block";
		let header1 = document.getElementById("heading");
		header1.style.display="block";

		//welcome message personalised for user
		document.getElementById("welcome").innerHTML="Welcome to Stock Viewer " + user;
		let url = "../PHP/showStocks.php?uid=" + response;
		uid = response;
		//request to show the users stocks
		ajaxRequest("GET",url,"", listStocks);
		}
}

//update stock function used when removing / adding stocks
function updateStock(response){
		document.getElementById("welcome").innerHTML="Welcome to Stock Viewer " + user;
		let url = "../PHP/showStocks.php?uid=" + uid;
		ajaxRequest("GET",url,"", listStocks);
		let input = document.getElementById("add_stocks");
		input.innerHTML = response;
		hideAdd();
}

//lists the stocks
function listStocks(response){
	//hide the login info and show the stock list with stock response
	let input = document.getElementById("login");
	let display = document.getElementById("stock_list");

	input.style.display = "none";
	display.innerHTML = response;
}

//function to get full info on the stocks
function popup(info){
	let url = "../PHP/getFullInfo.php?sid=" + info;
	//set the global variable stock id to passed in value
	sid = info;
	//request showFullDetails with details
	ajaxRequest("GET",url,"",showFullDetails);
}

//show full details with response coming from getFullInfo php with company names etc
function showFullDetails(response){
	//show header and details div
	let header2 = document.getElementById("heading2");
	header2.style.display="block";
	let input = document.getElementById("more_details");
	input.style.display="block";

	//put response text inside more details div
	input.innerHTML = response;
}

//remove stock function
function removeStock(){
	//get the stockid and user id
	data = "?sid=" + sid + "&uid=" + uid;
	//ajaxrequest to call removestock php and then callback updatestock 
	ajaxRequest("GET","../PHP/removeStock.php",data,displayStock);

	//Hiding divs to tidy up page
	let details= document.getElementById("more_details");
	details.style.display="none";
	let header2 = document.getElementById("heading2");
	header2.style.display="none";
	let stocks = document.getElementById("add_stocks");
	stocks.style.display="none";
}

//List all the stocks
function listAllStocks(){
	//get the user id
	data="?uid=" + uid 
	//call show not added stocks php then callback updatestock
	ajaxRequest("GET","../PHP/showNotAddedStocks.php",data,updateStock);


	//more div hiding / showing
	var display=document.getElementById("add_stocks");
	display.style.display="block";
	let header2 = document.getElementById("heading2");
	header2.style.display="none";
}

//addStock and pass in stock id value
function addStock(sid){
	//stock id and user id
	data="?sid=" + sid + "&uid=" + uid;
	//add stock php to process the adding of selected stocks, callback updatestock to show this
	ajaxRequest("GET","../PHP/addStocks.php",data,listAllStocks);
}

//handle error function mostly used for error testing 
function handleError(errorText){
	alert("An error occurred " + errorText);
}

//log out function that asks user to confirm logout and then refreshes the page
function logOut(){
	var okToLogOut = confirm("Do you really want to logout from the page?");
	if (okToLogOut)
	{
		location.reload();
	}
}
	
   //hide add stock div
    function hideAdd()	{
    	var el = document.getElementById("add_stocks");
	//if the div is empty ie no more stocks available
    	if(el.innerHTML == "")	{
    		el.innerHTML = "There are no more stocks left to add!";
		
    	}	else	{
		//else show the div
    		el.style.display = "block";
    	}
    }

