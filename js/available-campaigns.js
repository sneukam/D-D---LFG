/****************************************

	Available Campaigns page

****************************************/


// Set event listeners after DOM loaded.
window.addEventListener('DOMContentLoaded', function () {
  
	// Event Listeners - Join campaign buttons
	var joinCampaignButtons = document.getElementsByClassName('join-campaign-button');
	console.log(joinCampaignButtons);
	for (let i=0; i<joinCampaignButtons.length; i++) {
		let buttonvar = joinCampaignButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.parentElement.parentElement.children[0].innerHTML;
			var name = buttonvar.parentElement.parentElement.parentElement.children[1].innerHTML;		
			alert("You just joined campaign: " + name + "\nid: " + id + "\n\nThis will be sent to the db via a POST request");
			buttonvar.setAttribute('hidden', 0);
			buttonvar.parentElement.parentElement.parentElement.children[9].innerHTML = 'Y';
		});
	}
	
	// Event Listeners - Leave campaign buttons
	var joinCampaignButtons = document.getElementsByClassName('leave-campaign-button');
	console.log(joinCampaignButtons);
	for (let i=0; i<joinCampaignButtons.length; i++) {
		let buttonvar = joinCampaignButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.parentElement.parentElement.children[0].innerHTML;
			var name = buttonvar.parentElement.parentElement.parentElement.children[1].innerHTML;		
			alert("You just left campaign: " + name + "\nid: " + id + "\n\nThis will be sent to the db via a POST request");
			buttonvar.setAttribute('hidden', 0);
			buttonvar.parentElement.parentElement.parentElement.children[9].innerHTML = '';
			// page should refresh. if not, put html in for the 'join' button.
		});
	}
});
