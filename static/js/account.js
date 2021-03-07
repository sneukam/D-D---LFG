/***********************************************
	
		Account Page

************************************************/

function get_post_url_account() {
	// returns the URL used for the POST request to create a new campaign
	return 'http://flip3.engr.oregonstate.edu:6735/account';
}

function cleanString(input_string) {
	// removes all single quote or double quote characters that are found inside a string.
	return input_string.replace(/['"]+/g, '');
}

function clearEditForm() {
	var accountInputs = document.getElementsByClassName('account-edit-input');
	for (var i = 0; i < characterInputElems.length; i++) {
		characterInputElems[i].value = "";
	}
}

function accountErrors(account) {
	// returns true if there are account errors, false otherwise. Alerts displayed based on errror.
	
	if (account.name == '' || account.email == '') {
		alert("account name and email cannot be blank");
		return true;
	}
	else if (account.name.length > 50 || account.name.length < 3) {
		alert("name must be between 3 and 50 characters");
		return true;
	}
	else if (account.email.length > 255 || account.email.length < 7) {
		alert("email must be between 7 and 255 characters");
		return true;
	}
	else if (account.pw != '' && (account.pw.length > 255 || account.pw.length < 5)) {
		alert("password must be between 5 and 255 characters");
		return true;
	}
	else if (account.campaign_history.length > 255) {
		alert("campaign history must be less than 255 characters");
		return true;
	}
	
	return false;
}

function continueIfChangePw(account) {
	// if the user has changed their password, ask them if they want to continue
	
	if (account.pw != '') {
		var con_tinue = confirm('You have entered a new password. You will be required to login again. Continue?')
	}
	else {
		return true
	}

	if (con_tinue) {
		return true;
	}
	return false;
}

function submit_edit_form() {
	// Submits account changes via POST request
	
	// get account changes & error check
	var account = getAccountInfo();
	if (accountErrors(account)) {
		return false;
	}
	if (continueIfChangePw(account) != true) {
		return false;
	}
	
	// POST request
	var payload = account;
	var req = new XMLHttpRequest();
	var payload = account;
	req.open('POST', get_post_url_account(), true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log('success!');
			window.location.reload();
		} else {
			console.log("Error in network request: " + req.statusText);
			alert("error in network request.");
		}
	});
	req.send(JSON.stringify(payload));
}

function getAccountInfo() {
	// retrieve and return the edited account info from the edit form
	
	var account = {username:null, name:null, pw:null, email:null, playstyle:null, campaign_history:null};
	account.name = cleanString(document.getElementById('account-name-input').value);
	account.email = cleanString(document.getElementById('account-email-input').value);
	account.pw = document.getElementById('account-password-input').value;
	account.playstyle = document.getElementById('account-playstyle-input').options[document.getElementById('account-playstyle-input').value].text
	account.campaign_history = cleanString(document.getElementById('account-campaignhistory-input').value);
	return account;
}

function displayEditForm() {
	document.getElementById('modal-backdrop').classList.remove('hidden');
	document.getElementById('edit-account-modal').classList.remove('hidden');
}

function hideEditForm() {
	document.getElementById('modal-backdrop').classList.add('hidden');
	document.getElementById('edit-account-modal').classList.add('hidden');
}

function initializeEditForm() {
	// Populate edit form with user's account info
	
	document.getElementById("account-username-p").innerHTML = document.getElementById("account-username").innerHTML;
	document.getElementById("account-name-input").value = document.getElementById("account-name").innerHTML;
	document.getElementById("account-email-input").value = document.getElementById("account-email").innerHTML;
	document.getElementById("account-playertype-p").innerHTML = document.getElementById("account-playertype").innerHTML;
	document.getElementById("account-campaignhistory-input").value = document.getElementById("account-campaignhistory").innerHTML;
	
	users_playstyle = document.getElementById("account-playstyle").innerHTML;
	account_playstyle_select = document.getElementById('account-playstyle-input')
	for (var i=0; i<account_playstyle_select.length; i++) {
		if (account_playstyle_select[i].innerHTML == users_playstyle) {
			account_playstyle_select[i].selected = true;
		}
	}	
}

function clearEditForm() {
	var accountInputElems = document.getElementsByClassName('account-edit-input');
	for (var i = 0; i < accountInputElems.length; i++) {
		accountInputElems[i].value = "";
	}
}

window.addEventListener('DOMContentLoaded', function() {
	
	// display edit form
	document.getElementById("account-edit").addEventListener("click", function () {
		event.preventDefault();
		initializeEditForm();
		displayEditForm();
	});
	
	// cancel edit form
	document.getElementsByClassName("modal-cancel-button")[0].addEventListener("click", function () {
		event.preventDefault();
		clearEditForm();
		hideEditForm();
	});
	
	// submit edit form (update account info)
	document.getElementsByClassName("modal-accept-button")[0].addEventListener("click", function() {
		// submit account changes
		event.preventDefault();
		submit_edit_form();
		clearEditForm();
		hideEditForm();
	});
	
	/*
	// Submit button click: Account field values pushed, fields become read-only
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
	*/
});