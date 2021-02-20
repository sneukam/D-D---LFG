/***********************************************
	
		Account Page

************************************************/

function clearEditForm() {
	var accountInputs = document.getElementsByClassName('account-edit-input');
	for (var i = 0; i < characterInputElems.length; i++) {
		characterInputElems[i].value = "";
	}
}

function submit_edit_form() {
	
	// populate edit form
	
	// show edit form
	
	var username = document.getElementById('account-username').value;
	var name = document.getElementById('account-name').value;
	var email = document.getElementById('account-email').value;
	var playstyle = document.getElementById('account-playstyle').value;
	var campaign_history = document.getElementById('account-campaignhistory').value;
	var updatedAccount = {username: username, name: name, email: email, playstyle: playstyle, campaign_history: campaign_history};

	if (characterName && characterClass && characterTraits) {
		alert("Pushing account UPDATE to database via POST\n\n" + JSON.stringify(updatedCharacter));
		// ** send data to DB via POST request
		hideEditForm();
	} else {alert('You must specify all fields!');}
}

function displayEditForm() {
	document.getElementById('modal-backdrop').classList.remove('hidden');
	document.getElementById('edit-account-modal').classList.remove('hidden');
}

function hideEditForm() {
	document.getElementById('modal-backdrop').classList.add('hidden');
	document.getElementById('edit-account-modal').classList.add('hidden');
	clearEditForm();
}

function initializeEditForm() {
	/* Sets the values of each field on the edit form to the user's account info */
	document.getElementById("account-username-p").innerHTML = document.getElementById("account-username").innerHTML;
	document.getElementById("account-name-input").value = document.getElementById("account-name").innerHTML;
	document.getElementById("account-email-input").value = document.getElementById("account-email").innerHTML;
	document.getElementById("account-playertype-p").innerHTML = document.getElementById("account-playertype").innerHTML;
	document.getElementById("account-playstyle-input").value = document.getElementById("account-playstyle").innerHTML;
	document.getElementById("account-campaignhistory-input").value = document.getElementById("account-campaignhistory").innerHTML;
}

function clearEditForm() {
	var accountInputElems = document.getElementsByClassName('account-edit-input');
	for (var i = 0; i < accountInputElems.length; i++) {
		accountInputElems[i].value = "";
	}
}

window.addEventListener('DOMContentLoaded', function() {
	
	// Edit button click: Display Edit form
	document.getElementById("account-edit").addEventListener("click", function () {
		event.preventDefault();
		/*flipFormReadonly(1);*/
		
		// show the edit modal
		clearEditForm();
		initializeEditForm();
		displayEditForm();
	});
	
	
	document.getElementsByClassName("modal-cancel-button")[0].addEventListener("click", function () {
		event.preventDefault();
		clearEditForm();
		hideEditForm();
	});
	
	document.getElementsByClassName("modal-accept-button")[0].addEventListener("click", function() {
		event.preventDefault();
		
		account_info = {};		
		account_info.name = document.getElementById("account-name-input").value;
		account_info.email = document.getElementById("account-email-input").value;
		account_info.password_ = document.getElementById("account-password-input").value;
		account_info.playstyle = document.getElementById("account-playstyle-input").value;
		account_info.campaign_history = document.getElementById("account-campaignhistory-input").value;
		
		console.log(document.getElementById("account-password-input"));
		
		if (account_info.password_ == "") {
			// send to handler 1
			delete account_info.password_
			alert("password not updated. Collected values: \n\n" + JSON.stringify(account_info));
		}
		else {
			// get pw and send to handler 2
			alert("Password updated. Collected values: \n\n" + JSON.stringify(account_info));
		}
		
		clearEditForm();
		hideEditForm();
	});
	
	
	// Save button click: Account field values pushed, fields become read-only
	document.getElementById("account-save").addEventListener("click", function () {
		event.preventDefault();
		// collect account info in JSON object
		var account_info = {username:null, name:null, email:null, playstyle:null, campaign_history:null};
		account_info.username = document.getElementById("account-username").value;
		account_info.name = document.getElementById("account-name").value;
		account_info.email = document.getElementById("account-email").value;
		account_info.playstyle = document.getElementById("account-playstyle").value;
		account_info.campaign_history = document.getElementById("account-campaignhistory").value;
		console.log(account_info);
		alert("Account info will be sent to the database in a POST request\n\n" + JSON.stringify(account_info));
		// push fields to db via POST request
		// if error display popup and exit function
		// else set form to read-only
		flipFormReadonly(0);
	});

	// Changes Account form between: Readonly (flag=0) or Editable (flag=1)
	function flipFormReadonly(flag) {
		
		if (flag==0) {console.log("setting account form to read-only");}
		else if (flag==1) {console.log("setting account form to editable");}
		
		// Change input fields between editable/readonly
		var form_children = document.getElementById("account-form").children;
		for (var i=0; i<form_children.length; i++) {
			var elem = form_children[i];
			if (elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement) {
				if (flag==0) {
					elem.setAttribute("readonly", true);
				}
				else if (flag==1) {
					elem.removeAttribute("readonly", 0);
				}
			}
		}
		document.getElementById("account-playertype").setAttribute("readonly", true);
		
		// Hide/Display the Edit/Save Buttons. Update Border from Yellow/Black
		if (flag==0) {
			document.getElementById("account-save").setAttribute("hidden", true);
			document.getElementById("account-edit").removeAttribute("hidden", 0);
			document.getElementById("account-container").setAttribute("style", "border: solid black;");
		}
		else if (flag==1) {
			document.getElementById("account-save").removeAttribute("hidden", 0);
			document.getElementById("account-edit").setAttribute("hidden", true);
			document.getElementById("account-container").setAttribute("style", "border: solid yellow;");
		}
	};
});