/*******************************

		Sign-up Page
	
********************************/

function get_url(){
	// website url
	return "http://flip3.engr.oregonstate.edu:6735/sign-up/creds";
};
	
function post_url(){
	// website url
	return "http://flip3.engr.oregonstate.edu:6735/sign-up";
};
	
function get_credentials() {
	// returns a JSON object with the desired credentials the user has entered on the page
	var credentials = {};
	credentials.username = document.getElementById("signup-username").value;
	credentials.pwd = document.getElementById("signup-password").value;
	credentials.email = document.getElementById("signup-email").value;
	credentials.player_type = null;
	
	var radioButtons = document.getElementsByName("player_type");
    for(var i = 0; i < radioButtons.length; i++)
    {
        if(radioButtons[i].checked == true) { credentials.player_type = radioButtons[i].value; }
    }
	
	return credentials;
}

function credentials_errors() {
	// check the user's desired credentials for errors
	// returns True if valid, False otherwise
	
	var credentials = get_credentials();
	
	console.log("entered credentials errors function");
	console.log("credentials are:");
	console.log(credentials);
	
	if (credentials.username.length < 3 || credentials.username.length > 25) {
		alert("Error: Username must be between 3 and 25 characters.");
		return false
	}
	
	if (credentials.pwd.length < 8 || credentials.pwd.length > 255) {
		alert("Error: Password must be between 8 and 255 characters.");
		return false
	}
	
	if (credentials.email.length < 7 || credentials.email.length > 255) {
		alert("Error: Please enter a valid email address");
		return false
	}
	
	if (credentials.player_type == null) {
		alert("Error: Please select a user type.");
		return false
	}
	
	return true
}

function credential_error(cred) {
	// displays an alert on the screen telling the user to select another email and/or username.
	
	if (cred != "username and email") {
		alert("Your desired " + cred + " is already in use. Please choose another");
	}
	else {
		alert("Your desired " + cred + " are already in use. You may navigate to the login page with the link below.");
	}
	return
}

function credentials_uniqueness() {
	// check the user's desired credentials for uniqueness against username/emails already in the database
	// if the credentials are unique, calls create_new_user() function to create the users' credentials.
	// returns true if unique, false otherwise
	
	var req = new XMLHttpRequest();
	var credentials = get_credentials();
	var url = get_url();
	
	console.log("sending GET request to " + url + " to test the uniqueness of the desired crednetials");
	
	// send the request
	req.open('GET', url + '?username=' + credentials.username + '&email=' + credentials.email, true);
	
	// listener for response
	req.addEventListener('load',function(){
		console.log('GET request received for crednetial validation')
		  if(req.status >= 200 && req.status < 400){
			console.log(req);
			if (req.responseText != "1") {
				credential_error(req.responseText);
				return false
			}
			else if (req.responseText == "1") {
				// create the new user if the credentials are valid.
				console.log("credentials were unique. Creating new user");
				create_new_user();
				return true
			} 
		  } else {
			console.log("Error in network request: " + req.statusText);
			console.log(req.responseText);
			alert("Error in network request. Please try again later.");
			return false
		  }});
	req.send();
	console.log('GET request sent to verify credential uniqueness');
	event.preventDefault();
}

function create_new_user() {
	// POST request to create the new user
	
	console.log("entered the create_new_user() function");
	
	var req = new XMLHttpRequest();
	var payload = get_credentials();
	var url = post_url();
	
	req.open('POST', url, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
	if(req.status >= 200 && req.status < 400){
		// does the new page automatically or do we now have our cookies and can manually request the new page?

		// below just for reference:
		// var response = JSON.parse(req.responseText);
		// document.getElementById('binResult').textContent = response.data;

		/***************************************************
				... POST code...
		****************************************************/
		console.log("POST - success response received");
		console.log("My response text is... :");
		console.log(req.responseText);
		window.location = req.responseText;   // <-- redirect the user to the page given in the response.

	} else {
		console.log("Error in network request");
	}});
	//req.send(payload);  
	req.send(JSON.stringify(payload));
	console.log('POST request sent to create new users.');
	event.preventDefault(); // unsure if the second one is needed here.
}

window.addEventListener('DOMContentLoaded', function() {
	
	document.getElementById("signup-button").addEventListener("click", function () {
		// Clicking Sign-In will trigger a series of steps to validate their proposed credentials and if successful, create their profile & login automatically
		event.preventDefault();
		console.log("entered event listener");
		var continue_bool = credentials_errors();
		if (continue_bool) {continue_bool = credentials_uniqueness()};
		//if (continue_bool) {create_new_user()};  <-- this was being executed before the GET request returned.
		
	});
});
