/*******************************

		Create Campaign Page
	
********************************/



/*******************************

		Create Campaign
		
********************************/

function get_post_url_create_campaign() {
	// returns the URL used for the POST request to create a new campaign
	return 'http://flip3.engr.oregonstate.edu:6735/create-campaign';
}

function get_post_url_roster() {
	// returns the URL used for obtaining the campaign's roster
	return 'http://flip3.engr.oregonstate.edu:6735/get-campaign-roster';
}

function get_post_url_close_campaign() {
	// returns the URL used for the POST request to create a new campaign
	return 'http://flip3.engr.oregonstate.edu:6735/close-campaign';
}

function createCampaign(campaign_data) {
	// creates a new campaign
	
	var req = new XMLHttpRequest();
	var payload = campaign_data;
	req.open('POST', get_post_url_create_campaign(), true);
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

function get_new_campaign_data() {
	// returns desired new campaign data that user entered on the Create Campaign form
	
	console.log("capturing new campaign data");
	
	var new_campaign = {name:null, num_players:null, desired_history:null, playstyle:null, plays_on:null, num_players:null}
	new_campaign.name = document.getElementById('campaign-name-input').value;
	new_campaign.num_players = document.getElementById('campaign-num-players').options[document.getElementById('campaign-num-players').value].text
	new_campaign.desired_history = document.getElementById('campaign-desired-history').options[document.getElementById('campaign-desired-history').value].text
	new_campaign.playstyle = document.getElementById('campaign-playstyle').options[document.getElementById('campaign-playstyle').value].text
	new_campaign.plays_on = document.getElementById('campaign-plays-on').value
	
	console.log(new_campaign);
	return new_campaign;
}

function handleModalAcceptClick() {
	// Creates a new campaign if data validation passes. POST request to backend.
	
	var campaign_data = get_new_campaign_data();
	var con_tinue = createCampaignDataValidation();
	if (con_tinue) {createCampaign(campaign_data)};
	return;
}

function createCampaignDataValidation() {
	if (document.getElementById('campaign-name-input').value.length > 60) {
		alert("Campaign names must be less than 61 characters.");
		return false;
	}
	return true;
}

function showCreateCampaignModal() {
	// displays the create campaign form
	
	document.getElementById('modal-backdrop').classList.remove('hidden');	
	document.getElementById('create-campaign-modal').classList.remove('hidden');
	return;
}

function clearCreateCampaignForm() {
	// clears the Create Campaign form
	
	document.getElementById('campaign-name-input').value = "";
	document.getElementById('campaign-num-players').selectedIndex = 0;
	document.getElementById('campaign-desired-history').selectedIndex = 0;
	document.getElementById('campaign-playstyle').selectedIndex = 0;
	document.getElementById('campaign-plays-on').selectedIndex = 0;
	console.log("cleared new campaign input values");
	return;
}

function hideCreateCampaignModal() {
	// hides & clears the Create Campaign form
	
	document.getElementById('modal-backdrop').classList.add('hidden');
	document.getElementById('create-campaign-modal').classList.add('hidden');
	document.getElementById('show-roster-modal').classList.add('hidden');
	clearCreateCampaignForm();
	return
}

/*******************************

		Close Campaign
		
********************************/

function close_campaign(campaign_id) {
	// Closes a campaign
	
	var req = new XMLHttpRequest();
	var payload = {id:campaign_id};
	req.open('POST', get_post_url_close_campaign(), true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log('success!');
			window.location.reload();
		} else {
			console.log("Error in network request: " + req.statusText);
			alert("error in network request.");
		}
		//document.location.reload();
	});
	req.send(JSON.stringify(payload));
}

/*******************************

		Roster
		
********************************/

function roster(campaign_id) {
	// parent function for buttton handler: Get and display the roster for a given campaign
	populate_roster(campaign_id);
	display_roster_form();
}

function populate_roster(campaign_id) {
	// returns the roster data for a given campaign as a JSON object
	console.log('sending POST request to get campaign roster data for campaign id: ' + campaign_id);
	
	var req = new XMLHttpRequest();
	var payload = {id:campaign_id};
	req.open('POST', get_post_url_roster(), true); // play around with synchronous request? Browser might stop it.
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log('success!');
			populate_roster_data(req.response);
			// we can also use req.responseText. 
		} else {
			console.log("Error in network request: " + req.statusText);
			alert("error in network request.");
		}
	});
	req.send(JSON.stringify(payload));
}

function populate_roster_data(campaign_player_info) {
	// populate the roster data in the form table
	
	
	var campaigns = JSON.parse(campaign_player_info);
	document.getElementById("roster-campaign-heading").innerHTML = campaigns[0].campaign_name
	var table = document.getElementById("available-campaigns-table-body");
	
	for (var i=0; i<campaigns.length; i++) {
		
		// insert new row w/ <td> elements for each field
		var lastRow = table.rows[table.rows.length-1];
		var row = table.insertRow(lastRow);
		var name_cell = row.insertCell(0);
		var email_cell = row.insertCell(1);
		var playstyle_cell = row.insertCell(2);
		var campaign_history_cell = row.insertCell(3);
		var character_cell = row.insertCell(4);
		var class_cell = row.insertCell(5);
		var traits_cell = row.insertCell(6);
		
		// insert data into cells
		name_cell.innerHTML = campaigns[i].name
		email_cell.innerHTML = campaigns[i].email
		playstyle_cell.innerHTML = campaigns[i].playstyle
		campaign_history_cell.innerHTML = campaigns[i].campaign_history
		character_cell.innerHTML = campaigns[i].character_name
		class_cell.innerHTML = campaigns[i].character_class
		traits_cell.innerHTML = campaigns[i].character_traits
	}
}

function display_roster_form() {
	// displays the roster for a given campaign
	document.getElementById('modal-backdrop').classList.remove('hidden');	
	document.getElementById('show-roster-modal').classList.remove('hidden');
	return;
}

function clear_roster() {
	// clears the roster form
	console.log('clearing the roster table');
	
	document.getElementById("roster-campaign-heading").innerHTML = "";
	var table = document.getElementById("available-campaigns-table-body");
	for (var i=table.rows.length-1; i>-1; i--) {
		table.deleteRow(i);
	}
}

function hide_roster() {
	
	// hide it
	console.log('hiding the roster');
	document.getElementById('show-roster-modal').classList.add('hidden');
	document.getElementById('modal-backdrop').classList.add('hidden');
	
	// clear roster form
	clear_roster();
}

/*******************************

		DOM Content Loaded
		
********************************/

window.addEventListener('DOMContentLoaded', function () {
    // initialize event listeners
	
	// Create Campaign form
	console.log("creating onclick event listeners");
	document.getElementById('create-campaign-button').addEventListener('click', showCreateCampaignModal);
    document.querySelector('#create-campaign-modal .modal-close-button').addEventListener('click', hideCreateCampaignModal);
    document.querySelector('#create-campaign-modal .modal-cancel-button').addEventListener('click', hideCreateCampaignModal);
	document.querySelector('#create-campaign-modal .modal-accept-button').addEventListener('click', handleModalAcceptClick);
	
	// 'Close' Campaign buttons
	var closeCampaignButtons = document.getElementsByClassName('close-button');
	for (let i=0; i<closeCampaignButtons.length; i++) {
		let buttonvar = closeCampaignButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.parentElement.parentElement.getElementsByClassName("campaign-id")[0].innerHTML;
			close_campaign(id);
		});
	}
	
	// 'Roster' buttons
	console.log('creating event listeners for roster buttons');
	var rosterButtons = document.getElementsByClassName('campaign-roster-button');
	console.log(rosterButtons);
	for (let i=0; i<rosterButtons.length; i++) {
		let button_roster = rosterButtons[i];
		console.log(button_roster);
		
		// if campaign has 0 players signed up for it, add 'hidden' attribute to the button
		/*console.log(button_roster.parentElement);
		console.log(button_roster.parentElement.parentElement);
		console.log(button_roster.parentElement.parentElement.previousElementSibling);
		console.log(button_roster.parentElement.parentElement.previousElementSibling.innerHTML);
		if (button_roster.parentElement.parentElement.previousElementSibling.innerHTML == 0) {
			button_roster.setAttribute('hidden', true);
			console.log('roster button set to hidden');
		}*/
		
		// add event listener to button
		button_roster.addEventListener('click', function() {
			var campaign_id = button_roster.parentElement.parentElement.parentElement.getElementsByClassName("campaign-id")[0].innerHTML;
			roster(campaign_id);
		});
	}
	
	// 'Roster' form buttons
	document.querySelector('#show-roster-modal .modal-close-button').addEventListener('click', hide_roster);
	document.querySelector('#show-roster-modal .modal-cancel-button').addEventListener('click', hide_roster);
	
});