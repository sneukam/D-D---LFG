/***********************************************

		Characters page

***********************************************/

function get_post_url_character() {
	// returns the URL used for the POST request to create a new campaign
	return 'http://flip3.engr.oregonstate.edu:6735/characters';
}

function submitCharacter() {
	// submits character via POST request. Handles Create/Update/Delete of character
	
	character = getCharacterSubmission();
	if (errorCheckCharacter(character) == false) {
		return;
	}
	
	console.log('sending character in POST request');
	console.log(character);
	
	var req = new XMLHttpRequest();
	var payload = character;
	req.open('POST', get_post_url_character(), true);
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
	hideCharacterForm();
}

function getCharacterSubmission() {
	// returns the character submission from the Character form (Create/Edit)
	character = {action:null, id:null, name:null, class_:null, traits:null}
	
	character.action = document.getElementById('character-action').value;
	character.id = document.getElementById('character-id-input').value;
	character.name = cleanCharacterValue(document.getElementById('character-name-input').value);
	character.class_ = cleanCharacterValue(document.getElementById('character-class-input').value);
	character.traits = cleanCharacterValue(document.getElementById('character-traits-input').value);
	return character;
}

function cleanCharacterValue(input_string) {
	// cleans a string argument by removing all ' or " characters that are found within the string
	return input_string.replace(/['"]+/g, '');
}

function errorCheckCharacter(character) {
	// returns true if the character fields are OK, false if not
	// if there is an error, this function will display the specific error message
	
	// empty fields
	if (character.action == '' || character.name == '' || character.class_ == '' || character.traits == '') {
		alert("character fields cannot be empty");
		return false
	}
	
	// field lengths
	if (character.name.length > 60 || character.class_.length > 50 || character.traits.length > 255) {
		alert("character info can only be a certain lenght: name(60), class(50), traits(255)");
		return false
	}
	
	return true
}

function displayCharacterForm(header, action, id, name, class_, traits) {
	// display the character form with data
	
	document.getElementById('character-action').value = action;
	document.getElementById('character-form-header').innerHTML = header;
	document.getElementById('modal-backdrop').classList.remove('hidden');
	document.getElementById('create-character-modal').classList.remove('hidden');
	
	document.getElementById("character-id-input").value = id;
	document.getElementById("character-name-input").value = name;
	document.getElementById("character-class-input").value = class_;
	document.getElementById("character-traits-input").value = traits;
	
	if (action == 'delete') {
		document.getElementById("character-name-input").readOnly = true;
		document.getElementById("character-class-input").readOnly = true;
		document.getElementById("character-traits-input").readOnly = true;
		document.getElementById("character-name-input").style.backgroundColor = "#e5e5e5";
		document.getElementById("character-class-input").style.backgroundColor = "#e5e5e5";
		document.getElementById("character-traits-input").style.backgroundColor = "#e5e5e5";
	}
}

function hideCharacterForm() {
	clearCharacterForm()
	document.getElementById('modal-backdrop').classList.add('hidden');
	document.getElementById('create-character-modal').classList.add('hidden');
}

function clearCharacterForm() {
	var characterInputElems = document.getElementsByClassName('character-input-element');
	for (var i = 0; i < characterInputElems.length; i++) {
		var input = characterInputElems[i].querySelector('input, textarea');
		input.value = '';
		document.getElementById("character-name-input").readOnly = false;
		document.getElementById("character-class-input").readOnly = false;
		document.getElementById("character-traits-input").readOnly = false;
		
		document.getElementById("character-name-input").style.backgroundColor = "white";
		document.getElementById("character-class-input").style.backgroundColor = "white";
		document.getElementById("character-traits-input").style.backgroundColor = "white";
	}
}

window.addEventListener('DOMContentLoaded', function () {

	// 'Create Character' - Button Listeners
	document.getElementById('create-character-button-two').addEventListener('click', function() {
		displayCharacterForm('Create a Character', 'create', '', '', '', '');
	});
	document.querySelector('#create-character-modal .modal-close-button').addEventListener('click', hideCharacterForm);
	document.querySelector('#create-character-modal .modal-cancel-button').addEventListener('click', hideCharacterForm);
	document.querySelector('#create-character-modal .modal-accept-button').addEventListener('click', submitCharacter);

	// 'Edit Character' - Button Listeners
	var editCharacterButtons = document.getElementsByClassName('edit-character-button');
	console.log(editCharacterButtons);
	for (let i=0; i<editCharacterButtons.length; i++) {
		let buttonvar = editCharacterButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.getElementsByClassName("character-id")[0].innerHTML;
			var name = buttonvar.parentElement.getElementsByClassName("character-name")[0].innerHTML;
			var class_ = buttonvar.parentElement.getElementsByClassName("character-class")[0].innerHTML;
			var traits = buttonvar.parentElement.getElementsByClassName("character-traits")[0].innerHTML;
			displayCharacterForm('Edit Character', 'update', id, name, class_, traits);
		});
	}
	
	// 'Delete Character' - Button Listeners
	var delCharacterButtons = document.getElementsByClassName('delete-character-button');
	console.log(delCharacterButtons);
	for (let i=0; i<delCharacterButtons.length; i++) {
		let buttonvar = delCharacterButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.getElementsByClassName("character-id")[0].innerHTML;
			var name = buttonvar.parentElement.getElementsByClassName("character-name")[0].innerHTML;
			var class_ = buttonvar.parentElement.getElementsByClassName("character-class")[0].innerHTML;
			var traits = buttonvar.parentElement.getElementsByClassName("character-traits")[0].innerHTML;
			displayCharacterForm('Delete Character', 'delete', id, name, class_, traits);
		});
	}	
});