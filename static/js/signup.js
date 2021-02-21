/*******************************
	Sign-up Page
********************************/

window.addEventListener('DOMContentLoaded', login_listener);

function signup_listener() {
	
	// Check if we already have an active session
	// ... this actually might be done on the server side. Backend server receives request for <page>, check sessions, if true, serve up the Campaigns Page. If not, Login page.
	// If yes and user type is 'Player' -> Campaigns Page
	// If yes and user type is 'DM' -> ... discuss with Ethan
	
	/***************************************************
					... code...
	****************************************************/
	
	document.getElementById("sign-button").addEventListener("click", function () {
		event.preventDefault();
		var username_string = document.getElementById("signup-username").value;
		var password_string = document.getElementById("signup-password").value;
		var email_string = document.getElementById("signup-email").value;
		var type_char = document.getElementById("signup-type").value;
		
		// Login - POST Request
		var req = new XMLHttpRequest();
		var payload = {username:username_string, pass:password_string};
		req.open('POST', 'http://flip3.oregonstate.edu:<portnum>/signup-request', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){	
			// does the new page automatically or do we now have our cookies and can manually request the new page?
			
			// below just for reference:
			//var response = JSON.parse(req.responseText);
			//document.getElementById('binResult').textContent = response.data;
			
			/***************************************************
					... code...
			****************************************************/
			
		  } else {
			console.log("Error in network request");
		  }});
		req.send(JSON.stringify(payload));
		//event.preventDefault(); // needed?
	});
});
