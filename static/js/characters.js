/***********************************************

		Characters page

***********************************************/

function createCharacter() {
	var characterName = document.getElementById('character-name-input').value;
	var characterClass = document.getElementById('character-class-input').value;
	var characterTraits = document.getElementById('character-traits-input').value;

	if (characterName && characterClass && characterTraits) {
		var newCharacter = {character_name: characterName, character_class: characterClass, character_traits: characterTraits}
		alert("Sending new character to database via POST request:\n\n" + JSON.stringify(newCharacter));
		// ** push fields to db via POST request.
		// ...
		clearCreateForm();
		hideCreateForm();
	} else {alert('You must specify all fields!');}
}

function displayCreateForm() {
	document.getElementById('modal-backdrop').classList.remove('hidden');
	document.getElementById('create-character-modal').classList.remove('hidden');
}

function hideCreateForm() {
	document.getElementById('modal-backdrop').classList.add('hidden');
	document.getElementById('create-character-modal').classList.add('hidden');
	clearCreateForm();
}

function clearCreateForm() {
	var characterInputElems = document.getElementsByClassName('character-input-element');
	for (var i = 0; i < characterInputElems.length; i++) {
		var input = characterInputElems[i].querySelector('input, textarea');
		input.value = '';
	}
}

function editCharacter() {
	var id = document.getElementById('edit-character-id-input').value;
	var characterName = document.getElementById('edit-character-name-input').value;
	var characterClass = document.getElementById('edit-character-class-input').value;
	var characterTraits = document.getElementById('edit-character-traits-input').value;
	var updatedCharacter = {character_id: id, character_name: characterName, character_class: characterClass, character_traits: characterTraits};

	if (characterName && characterClass && characterTraits) {
		alert("Pushing Character UPDATE to database via POST\n\n" + JSON.stringify(updatedCharacter));
		// ** send data to DB via POST request
		hideEditForm();
	} else {alert('You must specify all fields!');}
}

function displayEditForm() {
	document.getElementById('modal-backdrop').classList.remove('hidden');
	document.getElementById('edit-character-modal').classList.remove('hidden');
}

function hideEditForm() {
	document.getElementById('modal-backdrop').classList.add('hidden');
	document.getElementById('edit-character-modal').classList.add('hidden');
	clearEditForm();
}

function clearEditForm() {
	var characterInputElems = document.getElementsByClassName('edit-characterinput-element');
	for (var i = 0; i < characterInputElems.length; i++) {
		var input = characterInputElems[i].querySelector('input, textarea');
		input.value = '';
	}
}

window.addEventListener('DOMContentLoaded', function () {

	// 'Create Character' - Button Listeners
	document.getElementById('create-character-button').addEventListener('click', displayCreateForm);
	document.querySelector('#create-character-modal .modal-close-button').addEventListener('click', hideCreateForm);
	document.querySelector('#create-character-modal .modal-cancel-button').addEventListener('click', hideCreateForm);
	document.querySelector('#create-character-modal .modal-accept-button').addEventListener('click', createCharacter);

	// 'Edit Character' - Button Listeners
	var editCharacterButtons = document.getElementsByClassName('edit-character-button');
	console.log(editCharacterButtons);
	for (let i=0; i<editCharacterButtons.length; i++) {
		let buttonvar = editCharacterButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.getElementsByClassName("character-id")[0].innerHTML;
			var name = buttonvar.parentElement.getElementsByClassName("character-name")[0].innerHTML;
			var class_name = buttonvar.parentElement.getElementsByClassName("character-class")[0].innerHTML;
			var traits = buttonvar.parentElement.getElementsByClassName("character-traits")[0].innerHTML;
			
			document.getElementById("edit-character-id-input").value = id;
			document.getElementById("edit-character-name-input").value = name;
			document.getElementById("edit-character-class-input").value = class_name;
			document.getElementById("edit-character-traits-input").value = traits;

			displayEditForm();
		});
	}
	
	// continued -> 'Edit Character' - Button Listeners
	document.querySelector('#edit-character-modal .modal-close-button').addEventListener('click', hideEditForm);
	document.querySelector('#edit-character-modal .modal-cancel-button').addEventListener('click', hideEditForm)
	document.querySelector('#edit-character-modal .modal-accept-button').addEventListener('click', editCharacter)
	
	// 'Del Character' - Button Listeners
	var delCharacterButtons = document.getElementsByClassName('delete-character-button');
	console.log(delCharacterButtons);
	for (let i=0; i<delCharacterButtons.length; i++) {
		let buttonvar = delCharacterButtons[i];
		buttonvar.addEventListener('click', function() {
			var id = buttonvar.parentElement.getElementsByClassName("character-id")[0].innerHTML;
			var name = buttonvar.parentElement.getElementsByClassName("character-name")[0].innerHTML;
			alert("The character id=" + id + " (" + name + ") will be deleted.\n\nFor now this is a static webpage and the character will remain.");
			// ** Delete character via POST request to DB.
		});
	}	
});