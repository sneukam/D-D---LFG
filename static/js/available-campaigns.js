/****************************************

	Available Campaigns page

****************************************/

function post_url() {
	return 'http://flip3.engr.oregonstate.edu:6735/available-campaigns'
}

function available_campaigns(join_or_leave, campaign_id, character_id=null) {
	// POST request to Join or Leave campaign
	var req = new XMLHttpRequest();
	var payload = {id:campaign_id, action:join_or_leave};
	var url = post_url();
	req.open('POST', url, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log("POST - success response received");
			console.log("My response text is... :");
			console.log(req.responseText);
		} else {
			console.log("Error in network request");
			alert("Error in network request");
		}
		document.location.reload()
	});
	req.send(JSON.stringify(payload));
}

window.addEventListener('DOMContentLoaded', function () {
	
	/* Refactor the below code to be just ONE loop, adjust class names of buttons on the HTML page as well */
	
	// Event Listeners for "Join" campaign buttons
	var joinCampaignButtons = document.getElementsByClassName('join-campaign-button');
	console.log(joinCampaignButtons);
	for (let i=0; i<joinCampaignButtons.length; i++) {
		let buttonvar = joinCampaignButtons[i];
		buttonvar.addEventListener('click', function() {
			event.preventDefault();
			var id = buttonvar.parentElement.parentElement.parentElement.children[0].innerHTML;
			var name = buttonvar.parentElement.parentElement.parentElement.children[1].innerHTML;		
			//alert("You just joined campaign: " + name + "\nid: " + id + "\n\nThis will be sent to the db via a POST request");
			buttonvar.setAttribute('hidden', 0);
			available_campaigns("Join", id);
			buttonvar.parentElement.parentElement.parentElement.children[9].innerHTML = 'Y';
		});
	}
	
	// Event Listeners for "Leave" campaign buttons
	var leaveCampaignButtons = document.getElementsByClassName('leave-campaign-button');
	console.log(leaveCampaignButtons);
	for (let i=0; i<leaveCampaignButtons.length; i++) {
		let buttonvar = leaveCampaignButtons[i];
		buttonvar.addEventListener('click', function() {
			event.preventDefault();
			var id = buttonvar.parentElement.parentElement.parentElement.children[0].innerHTML;
			var name = buttonvar.parentElement.parentElement.parentElement.children[1].innerHTML;		
			//alert("You just left campaign: " + name + "\nid: " + id + "\n\nThis will be sent to the db via a POST request");
			available_campaigns("Leave", id);
			buttonvar.setAttribute('hidden', 0);
			buttonvar.parentElement.parentElement.parentElement.children[9].innerHTML = '';
		});
	}
});