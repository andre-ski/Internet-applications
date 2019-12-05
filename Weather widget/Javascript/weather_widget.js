/*
 * Constructor function for a WeatherWidget instance.
 * 
 *container_element : a DOM element inside which the widget will place its UI
 *
 */
function WeatherWidget(container_element) {

	//declare the data properties of the object 
	
	var _list = [];   //an array of currently downloaded weather listings as WeatherLine objects
	var _request ;    //the XHR request object
	var _currentSortOrder =1 ;    //keep track of how the data is sorted, default is 1 = sort by name
	/**
		//declare an inner object literal to represent the widget's UI	*/

		var _ui = {     //an inner object literal representing the widget's UI
		
		sortByTownName :   	null,    //a button to sort by name
		sortByTemperature :   	null,    // a button to sort by id
		townEntry :   	    	null,    // for entering a name to find
		townFind :   		null,    //button to find name
		container :		null,	// the container for all of the UI elements
		titlebar :		null,	//div to organise UI elements
		toolbar : 		null,   //div to organise UI elements
		list : 			null,  //the div area which will hold the WeatherLine object UIs
		town : 			null,	//radio button for town sort
		temperature : 		null,	//radio button for temperature sort
		};

		//write a function to create and configure the DOM elements for the UI
		var _createUI = function(container){
		
			//create the container for all of the UI elements and set up the titlebar
			_ui.container = container_element;
			_ui.container.className = "monitor";
			_ui.titlebar = document.createElement("div");
			_ui.titlebar.className = "title";
			_ui.titlebar.label = document.createElement("span");
			_ui.titlebar.label.innerHTML = "Weather Widget";
			_ui.titlebar.appendChild(_ui.titlebar.label);
			
			//now create and set up the toolbar elements
			_ui.toolbar = document.createElement("div");
			_ui.toolbar.label = document.createElement("span");
			_ui.toolbar.label.innerHTML = "Select Town: ";
		
			_ui.toolbar.label2 = document.createElement("span");
			_ui.toolbar.label2.innerHTML = "Sort By: ";
			
			_ui.toolbar.label3 = document.createElement("span");
			_ui.toolbar.label3.innerHTML = "Town";
			
			_ui.toolbar.label4 = document.createElement("span");
			_ui.toolbar.label4.innerHTML = "Temperature";
		
			_ui.townEntry = document.createElement("select");
			var option = document.createElement("option");
			option.text="";
			_ui.townEntry.add(option);

			var option_1 = document.createElement("option");
			option_1.text= "Hamilton";
			_ui.townEntry.add(option_1);
			var option_2 = document.createElement("option");
			option_2.text= "Auckland";
			_ui.townEntry.add(option_2);
			var option_3 = document.createElement("option");
			option_3.text= "Christchurch";
			_ui.townEntry.add(option_3);
			var option_4 = document.createElement("option");
			option_4.text= "Dunedin";
			_ui.townEntry.add(option_4);
			var option_5 = document.createElement("option");
			option_5.text= "Tauranga";
			_ui.townEntry.add(option_5);
			var option_6 = document.createElement("option");
			option_6.text= "Wellington";
			_ui.townEntry.add(option_6);_ui.dom_element = document.createElement('div');
		
			//add things like the button label and onclick behaviour
			_ui.town = document.createElement("INPUT");
			_ui.temperature = document.createElement("INPUT");
			_ui.town.setAttribute("name", container_element.id);
	  		_ui.town.setAttribute("type", "radio");
			
			_ui.temperature.setAttribute("name", container_element.id);
	  		_ui.temperature.setAttribute("type", "radio");
			

			//append all of the other elements needed to toolbar in the same way
			var br = document.createElement("br");	
			_ui.toolbar.appendChild(_ui.toolbar.label);
			_ui.toolbar.appendChild(_ui.townEntry);
			_ui.toolbar.appendChild(br);
			_ui.toolbar.appendChild(_ui.toolbar.label2);
			_ui.toolbar.appendChild(_ui.town);
			_ui.toolbar.appendChild(_ui.toolbar.label3);
			_ui.toolbar.appendChild(_ui.temperature);
			_ui.toolbar.appendChild(_ui.toolbar.label4);
			
			//onclick events to activate appropriate functions
			_ui.townEntry.onchange=function(){_addTown(_ui.townEntry.value);}
			_ui.town.onclick=function(){_doSort(1);}
			_ui.temperature.onclick=function(){_doSort(2);}

			
			//finally create the div which will hold the TownList items

			_ui.list = document.createElement("div");
			
			//add the three components to the _ui container

			_ui.container.appendChild(_ui.titlebar);
			_ui.container.appendChild(_ui.toolbar);
			_ui.container.appendChild(_ui.list);

			//end of UI creation function
		};

	
	//add any other methods required for the functionality
	
	function ajaxRequest(method, url, data, callback){	
	_request.open(method,url+data,true);
	//if post then set request header
	if(method == "POST"){
		_request.setRequestHeader      
		('Content-Type','application/x-www-form-urlencoded');
	}
	//if ready state is 4 (ready) and request status is 200 (request successful) then
	_request.onreadystatechange = function(){
		if (_request.readyState == 4) {
			if (_request.status == 200) {
				response = _request.responseText;
				
				callback(response);	
				} 
				else	
				{
				//else handle error
				handleError(_request.statusText);
				}
			}
  		 }
	_request.send(data);
	}
	
	//handle error function mostly used for error testing 
	function handleError(errorText){
	alert("An error occurred " + errorText);
	}

	 /**
	  *  function to add a new name to the list
	  * first checks if name is already displayed
	  * if not then makes the AJAX request to get the details for this name
	  */  
	var _addTown = function(name){
		//first check if this town is already in the list
		//by iterating over the _list array
		//if they are already there let the user know
		for(var i in _list)
		{	
			townName = _list[i].getTown();

			if(townName=== name)
			{
				alert("Town already exists");
				return;	
			}	

		}
				//otherwise make an AJAX request
				_request = new XMLHttpRequest();
				var url = "PHP/weather.php";
				var data = "?town=" + name;
				//  etc. usual AJAX setup and send
				ajaxRequest("GET",url,data,_addNewWeatherListItem);
	}


	/**
	 *  AJAX Callback function 
	 *  Checks if data was returned
	 *  if yes then create a new TownLine item with the data and add to _list array
	 *  calls _refreshWeatherList to update the UI display with the new data
	 */
	 	var _addNewWeatherListItem = function(){
			//alert(_request.responseText);
			if (_request.readyState == 4) {
				if (_request.status == 200) {
					var data = JSON.parse(_request.responseText);
					if(data.length == 0){
						alert("No such town");
						return;
					}
					//console.log(data);
					
					var n = data[0].town;
					var o = data[0].outlook;
					var m = data[0].min_temp;
					var x = data[0].max_temp;
				
					var witem = new WLine(n,o,m,x); //create a WeatherLine instance
					
					_list.push(witem);   //add it to the _list array
					_refreshWeatherList();  //refresh the UI display on the page

				}
			}
		}
	
	
	 /**
	 * private method to refresh the weatherlist display
	 * first removes all displayed items
	 * then makes sure sort order for _list is correct
	 * then adds each item in _list to the _ui display
	 */
	 var _refreshWeatherList = function() {
	 	//first remove all child nodes of the ui.list div
	 	if(_ui.list == null)
	 		return;
	 	while(_ui.list.hasChildNodes()){
	 		_ui.list.removeChild(_ui.list.lastChild);
	 	}
	 	//make sure the data is correctly sorted

		if(_currentSortOrder == 1){
	 		_list.sort(_namesort);
	 	} else {
	 		_list.sort(_temperaturesort);
	 	}
	 	
	 	//add all items back to the UI
	 	for(var i = 0; i < _list.length; i++){
	 		var pline = _list[i];
	 		_ui.list.appendChild(pline.getDomElement());
	 	}
	 }

	/**
	 *  private method to sort the data - sets the _currentSortParameter and then
	 *  calls _refreshWeatherList where the sorting occurs and display is updated
	 */
	  
	 var _doSort = function(sortBy){
	 	if(sortBy == 1){
	 	_currentSortOrder = 1;	 	
	 	}
	 	else{
	 		_currentSortOrder = 0;
	 	}
		 	_refreshWeatherList();
	 }
	 
	 /**
	  *  Comparator functions for sorting weatherlist items
	  */	  
	var _temperaturesort = function(a,b){
		return b.getmax() - a.getmax();
	}
	
	var _namesort = function(a, b){
		if(a.getTown() > b.getTown())
			return 1;
		else if (a.getTown() < b.getTown())
			return -1;
		else
			return 0;
		}

	 /**
	  * private method to intialise the widget's UI on start up
	  * this method is complete
	  */
	  var _initialise = function(container_element){
	  	_createUI(container_element);
	  	}
	  	
	  	
	/*********************************************************
	* Constructor Function for the inner WLine object to hold the 
	* full weather data for a town
	********************************************************/
	
	var WLine = function(wtown, woutlook, wmin, wmax){
		
		//declare the data properties for the object
		var _town = wtown;
		var _outlook = woutlook;
		var _min = wmin;
		var _max = wmax;		

		//declare an inner object literal to represent the widget's UI
		
		var _ui = {			//an object literal representing the UI for the name info			
			dom_element  : null,   //the dom element for each line of data
			name_label   : null,   //label for the visible data - name
			outlook_label  : null,   //label for the visible data - outlook
			min_label  : null,   //label for the visible data - min
			max_label  : null,   //label for the visible data - max
		};

		//write a function to create and configure the DOM elements for the UI
		var _createUI = function(container){
			_ui.dom_element = document.createElement('div');
			_ui.name_label = document.createElement('span');
			_ui.outlook_label = document.createElement('span');
			_ui.min_label = document.createElement('span');
			_ui.max_label = document.createElement('span');
			
			_ui.dom_element.className="value";

			_ui.name_label.innerHTML = _town;
			_ui.outlook_label.innerHTML = _outlook;
			_ui.min_label.innerHTML = _min; 
			_ui.max_label.innerHTML = _max;

			_ui.dom_element.appendChild(_ui.name_label);
			_ui.dom_element.appendChild(_ui.outlook_label);
			_ui.dom_element.appendChild(_ui.min_label);
			_ui.dom_element.appendChild(_ui.max_label);
		};
		
		//Add any remaining functions you need for the object
	
		this.getDomElement = function(){
			return _ui.dom_element;
		}
	
		this.getTown = function(){
			
			return _town;
		}	
	
		this.getWeather = function(){
			return _outlook;
		}
	
		this.getmin = function(){
			return _min;
		}

		this.getmax = function(){
			return _max;
		}
	
		//_createUI() method is called when the object is instantiated
		_createUI();


	 
  	};  //this is the end of the constructor function for the WLine object 
	
	
	//  _initialise method is called when a WeatherWidget object is instantiated
	 _initialise(container_element);

}//end of constructor function for WeatherWidget 	 
	 
	 
