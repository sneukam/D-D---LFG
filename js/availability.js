/**************************************

		My Availability Page
	
**************************************/

window.addEventListener('DOMContentLoaded', function () {	
	document.getElementById("availability-submit-button").addEventListener("click", function(){
		event.preventDefault();
		alert("Updated availability will be sent to the db via a POST request\n\nWebpage is static at the moment so you will not be automatically removed from the campaign on the left-hand table... yet");
	});
});

function call_day_availability_update() {
	// this could be more clean... better design to put in a loop that gets the days and checked/unchecked values and passes it into the update function.
	update('monday');
	update('tuesday');
	update('wednesday');
	update('thursday');
	update('friday');
	update('saturday');
	update('sunday');
}

function update(day_) {
	var available;
	var username;
	var user_id;	// we can get this via the handlebars hidden tag method, sessions?, or query the DB right now. Affects Post code below.
	
	// query to get the user's ID?
	
	if (document.getElementById(day).checked == true) {available = "1"}
	else {available = "0"}
	
	// create query string? Nah, POST request can handle that, I don't think this is needed.
	// UPDATE <tablename> WHERE user_id = " + user_id_string + " SET " + day + " = " + available;
	
	// On getting a response display a message to the user (update successful).
	
	// POST Request to Update Day Available
	var req = new XMLHttpRequest();
	var payload = {username, day:day_, available};
	req.open('POST', 'http://httpbin.org/post', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
	  if(req.status >= 200 && req.status < 400){
		console.log('request received')
		console.log(req.response)
		var response = JSON.parse(req.responseText);
		console.log(response)
		document.getElementById('availability_results').textContent = response.success;
	  } else {
		console.log("Error in network request: " + req.statusText);
	  }});
	req.send(JSON.stringify(payload));
	event.preventDefault();
	
}