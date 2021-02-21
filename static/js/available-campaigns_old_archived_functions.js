/*
 *  * This function checks whether all of the required inputs were supplied by
 *   * the user and, if so, inserts a new twit into the page using these inputs.
 *    * If the user did not supply a required input, they instead recieve an alert,
 *     * and no new twit is inserted.
 *      */
function handleModalAcceptClick() {

  var campaignName = document.getElementById('join-camapign-name-input').value;
  var campaignCharacter = document.getElementById('selected-character').value;

  /*
 *    * Only generate the new twit if the user supplied values for both the twit
 *       * text and the twit attribution.  Give them an alert if they didn't.
 *          */
  if (campaignName && campaignCharacter) {
/*
    allCharacters.push({
      name: characterName,
      class: characterClass,
      traits: characterTraits
    });

    clearSearchAndReinsertCharacter();
*/
    hideJoinCamapignModal();

  } else {

    alert('You must specify all fields!');

  }
}


/*
 *   this function shows the modal to create a character when the "create character"
 *   * button is clicked.
 *    */
function showJoinCampaignModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var joinCampaignModal = document.getElementById('join-campaign-modal');

  // Show the modal and its backdrop.
  modalBackdrop.classList.remove('hidden');
  joinCampaignModal.classList.remove('hidden');
}


/*
 *  * This function clears any value present in any of the character input elements.
 *   */
function clearCampaignInputValues() {

  var campaignInputElems = document.getElementsByClassName('join-campaign-input-element');
  for (var i = 0; i < campaignInputElems.length; i++) {
    var input = campaignInputElems[i].querySelector('input, textarea');
    input.value = '';
  }

}
/*
 *  * This function hides the modal to create a character and clears any existing
 *   * values from the input fields whenever any of the modal close actions are
 *    * taken.
 *     */
function hideJoinCampaignModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var joinCampaignModal = document.getElementById('join-campaign-modal');

  // Hide the modal and its backdrop.
 modalBackdrop.classList.add('hidden');
  joinCampaignModal.classList.add('hidden');

  clearCampaignInputValues();

}

//leave campaign funcitons
function handleLeaveModalAcceptClick() {

  var campaignName = document.getElementById('leave-camapign-name-input').value;

  /*
 *    * Only generate the new twit if the user supplied values for both the twit
 *       * text and the twit attribution.  Give them an alert if they didn't.
 *          */
  if (campaignName) {
/*
    allCharacters.push({
      name: characterName,
      class: characterClass,
      traits: characterTraits
    });

    clearSearchAndReinsertCharacter();
*/
    hideLeaveCamapignModal();

  } else {

    alert('You must specify all fields!');

  }
}


function showLeaveCampaignModal() {

  var modalBackdrop = document.getElementById('leave-modal-backdrop');
  var leaveCampaignModal = document.getElementById('leave-campaign-modal');

  // Show the modal and its backdrop.
  modalBackdrop.classList.remove('hidden');
  leaveCampaignModal.classList.remove('hidden');
}


/*
 *  * This function clears any value present in any of the character input elements.
 *   */
function clearCampaignInputValues() {

  var campaignInputElems = document.getElementsByClassName('leave-campaign-input-element');
  for (var i = 0; i < campaignInputElems.length; i++) {
    var input = campaignInputElems[i].querySelector('input, textarea');
    input.value = '';
  }

}
/*
 *  * This function hides the modal to create a character and clears any existing
 *   * values from the input fields whenever any of the modal close actions are
 *    * taken.
 *     */
function hideLeaveCampaignModal() {

  var modalBackdrop = document.getElementById('leave-modal-backdrop');
  var leaveCampaignModal = document.getElementById('leave-campaign-modal');

  // Hide the modal and its backdrop.
 modalBackdrop.classList.add('hidden');
  leaveCampaignModal.classList.add('hidden');

  clearCampaignInputValues();

}


 
 
 
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
