import createBookCard from './card.js';
var pochListFavorites = new Map();

function refreshPochListContent() {
	const pochListContainer = document.getElementById('pochList');
	const oldPochListContent = document.getElementById('pochListContent');
	const newPochListContent = document.createElement('div');
	newPochListContent.id = 'pochListContent';
	newPochListContent.classList.add('cardsList');
	if (pochListFavorites) {
		for (let [favoriteId, favoriteContent] of pochListFavorites) {
			newPochListContent.appendChild(createBookCard(favoriteContent, true));
		}
	}
	pochListContainer.replaceChild(newPochListContent, oldPochListContent);
}

function initializeMapFromSession() {
	let sessionStorageValue = sessionStorage.getItem('pochlib');
	if (sessionStorageValue) {
		pochListFavorites = new Map(JSON.parse(sessionStorageValue));
	}
}

export {refreshPochListContent, pochListFavorites, initializeMapFromSession};