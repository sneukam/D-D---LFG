/*******************************

	Login Page
	
********************************/

function post_url(){
	// url handler location
	return "http://flip3.engr.oregonstate.edu:6735/login";
};

function get_credentials() {
	credentials = {}
	credentials.username = document.getElementById("login-username").value;
	credentials.pwd = document.getElementById("login-password").value;
	return credentials
}

function login_fields_error_free() {
	// checks the login fields for errors. returns true if no errors, false otherwise
	
	credentials = get_credentials();
	
	if (credentials.username == "" || credentials.pwd == "") {
		alert("username and/or password fields cannot be empty.");
		return false
	}
	return true
}

function authenticate() {	
	// Login - POST Request to authenticate
	var req = new XMLHttpRequest();
	var payload = get_credentials();
	var url = post_url();
	req.open('POST', url, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			
			console.log("POST - success response received");
			console.log("My response text is... :");
			console.log(req.responseText);
			
			if (req.responseText == "0") {
				alert("Credentials invalid.");
				return false
			}
			else {
				document.location.reload()
			}
		} else {
			console.log("Error in network request");
		}});
	req.send(JSON.stringify(payload));
}

window.addEventListener('DOMContentLoaded', function() {
	document.getElementById("login-button").addEventListener("click", function () {
		event.preventDefault();
		if (login_fields_error_free()) {
			authenticate();
		}
	});
});
