/*
 *  * This function checks whether all of the required inputs were supplied by
 *   * the user and, if so, inserts a new twit into the page using these inputs.
 *    * If the user did not supply a required input, they instead recieve an alert,
 *     * and no new twit is inserted.
 *      */
function handleModalAcceptClick() {

  var campaignName = document.getElementById('camapign-name-input').value;
  var campaignPlayers = document.getElementById('camapign-players-input').value;
  var campaignDesiredHistory = document.getElementById('character-desired-history-input').value;
  var campaignPlaystyle = document.getElementById('camapign-playstyle-input').value;

  /*
 *    * Only generate the new twit if the user supplied values for both the twit
 *       * text and the twit attribution.  Give them an alert if they didn't.
 *          */
  if (campaignName && campaignPlayers && campaignDesiredHistory && campaignPlaystyle) {
/*
    allCharacters.push({
      name: characterName,
      class: characterClass,
      traits: characterTraits
    });

    clearSearchAndReinsertCharacter();
*/
    hideCreateCamapignModal();

  } else {

    alert('You must specify all fields!');

  }
}


/*
 *   this function shows the modal to create a character when the "create character"
 *   * button is clicked.
 *    */
function showCreateCampaignModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var createCampaignModal = document.getElementById('create-campaign-modal');

  // Show the modal and its backdrop.
  modalBackdrop.classList.remove('hidden');
  createCampaignModal.classList.remove('hidden');
}


/*
 *  * This function clears any value present in any of the character input elements.
 *   */
function clearCampaignInputValues() {

  var campaignInputElems = document.getElementsByClassName('campaign-input-element');
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
function hideCreateCampaignModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var createCampaignModal = document.getElementById('create-campaign-modal');

  // Hide the modal and its backdrop.
 modalBackdrop.classList.add('hidden');
  createCampaignModal.classList.add('hidden');

  clearCampaignInputValues();

}
/*   twit
 *  * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 *   */
window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('create-campaign-button').addEventListener('click', showCreateCampaignModal);
    document.querySelector('#create-campaign-modal .modal-close-button').addEventListener('click', hideCreateCampaignModal);
    document.querySelector('#create-campaign-modal .modal-cancel-button').addEventListener('click', hideCreateCampaignModal);
	document.querySelector('#create-campaign-modal .modal-accept-button').addEventListener('click', handleModalAcceptClick);
	
	// 'Close Campaign' - Click Event Listerns
	var closeCampaignButtons = document.getElementsByClassName('close-button');
	console.log(closeCampaignButtons);
	for (let i=0; i<closeCampaignButtons.length; i++) {
		let buttonvar = closeCampaignButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.getElementsByClassName("campaign-id")[0].innerHTML;
			alert("Setting campaign id " + id + " to closed in the database via POST request.");
		});
	}
	
});
