<?php	
	//connection to database
	require_once('serverconnect.php');

	//get user id
	$uid=$_GET['uid'];
	
	//query to select all stocks
	$query = "Select * from Stocks";

	//result of query
	$result = $con->query($query);
	
	//while the result is going through table rows
	while($row = $result->fetch()) {
	
	//get the stock id
	$sid = $row['id'];
	
	//select owner where uid matches
	$query2 = "select * from owner where uid = '$uid'";

	//result of query
	$result2 = $con->query($query2);
	
	//declaring that they have no stocks by default
	$haveStock=false;
			
			//going through query
			while($row2 = $result2->fetch()) {
				//if there is a stock id in the owner table that is same as stocks in stock table
				if ($row2['sid'] == $sid)
				{	
					
					$haveStock=true;
				}	
		}
		//don't show stocks user already has
		if(!$haveStock) 
		{
			//add button next to company name
			echo "<button onclick='addStock(".$row['id'].")'>+</button>";
			echo $row['companyname'] ;
			echo "<br>";
  		} 		
}
  	
  	

