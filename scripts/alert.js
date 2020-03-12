function addAlertModal() {
	const alertModal = document.createElement('div');
	alertModal.classList.add('modal');
	alertModal.id = 'alert';

	const modalContent = document.createElement('div');
	const closeButtonContainer = document.createElement('span');
	closeButtonContainer.classList.add('close');
	
	const closeButton = document.createElement('a');
	closeButton.innerHTML = '<i class="fas fa-times" id="closeModal"></i>';
	closeButtonContainer.appendChild(closeButton);

	const textAlert = document.createElement('p');
	textAlert.appendChild(document.createTextNode('Vous ne pouvez ajouter deux fois le même livre'));
	textAlert.classList.add('alertText');
	modalContent.appendChild(closeButtonContainer);
	modalContent.appendChild(textAlert);
	modalContent.classList.add('modal-alert');

	alertModal.appendChild(modalContent);
	document.getElementsByTagName('body')[0].appendChild(alertModal);

	window.onclick = function(event) {
		if (event.target == alertModal) {
			alertModal.style.display = "none";
		}
	}

	closeButtonContainer.onclick = function() {
		alertModal.style.display = "none";
	}
}

export {addAlertModal};