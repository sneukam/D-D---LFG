/**************************************

		My Availability Page
	
**************************************/

function get_post_url() {
	return 'http://flip3.engr.oregonstate.edu:6735/availability'
}

function get_availability() {
	// returns the user's availability as a JSON object.
	// ex: {monday:1, tuesday:0, wednesday:1, ...}
	
	var availability = {monday:null, tuesday:null, wednesday:null, thursday:null, friday:null, saturday:null, sunday:null};
	var checkboxes = document.getElementsByClassName("availability_checkboxes");
	for (let i=0; i<checkboxes.length; i++) {
		let day = checkboxes[i];
		if (day.checked == true) {
			availability[day.name] = 1;
		}
		else if (day.checked == false) {
			availability[day.name] = 0;
		}
	}
	return availability;
}

function get_campaigns_removed_from(availability) {
	// returns a string with the names of campaign(s) the user will be removed from, based on their new availability selections on the page.
	// if there are none the user will be removed from, returns an empty string
	// ex: "<CampaignName1>\n<CampaignName2>\n" or ""
	// availability parameter is a JSON object with their availability selections after they hit submit
	// ex: {monday:1, tuesday:0, ...}
	
	var campaigns_removed_from = "";
	var table_body = document.getElementById("campaigns-availability-table-body");
	var r = 0;
	while (row=table_body.rows[r++]) {
		if (availability[row.cells[1].innerText.toLowerCase()] == 0) {
			campaigns_removed_from = campaigns_removed_from + row.cells[0].innerText + "\n";
		}
	}
	return campaigns_removed_from;
}

function update(availability) {
	// Sends a POST request with the user's new availability.
	// (Removing the user from any/applicable campaigns is handled by the backend.)
	
	var req = new XMLHttpRequest();
	var payload = availability;
	req.open('POST', get_post_url(), true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log('success!');
		} else {
			console.log("Error in network request: " + req.statusText);
			alert("error in network request.");
		}
		document.location.reload();
		//alert("availability updated");
	});
	req.send(JSON.stringify(payload));
}

function availability_submit_listener() {
	// Submits the user's new availability selections for UPDATEing.
	// We do not traingulate the delta, simply grab all values and send a POST request.
	// If the user has campaigns they will be removed from because they marked themselves as unnavailable, they are prompted and have the option to cancel.
	
	event.preventDefault();
	var availability = get_availability();
	var removed_from = get_campaigns_removed_from(availability);
	
	// if they have any campaigns they will be removed from, prompt them and give option to cancel
	if (removed_from != "") {
		var con_tinue = confirm("Given your availability updates, you will be removed from the following campaigns:\n\n" + removed_from + "\nDo you want to continue?");
		if (con_tinue == true) {
			update(availability);
		}
		else {
			// user clicked cancel, do nothing.
		}
	}
	// no campaigns they will be removed from, update their availability
	else {
		update(availability);
	}
}

window.addEventListener('DOMContentLoaded', function () {
	document.getElementById("availability-submit-button").addEventListener("click", function(){
		event.preventDefault();
		availability_submit_listener();
	});
});