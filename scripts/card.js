const maxDescriptionSize = 199; // +1 for string[0]
import {pochListFavorites, refreshPochListContent} from './pochList.js';

export default function createBookCard(responseItem, pochList) {
	const bookCard = document.createElement('div');
	bookCard.classList.add('bookCard');
	if (pochList) {
		bookCard.classList.add('pochListCard');
	}
	bookCard.appendChild(createHeaderBookCard(responseItem, pochList));
	bookCard.appendChild(createContentBookCard(responseItem, pochList));
	const elementImageCard = document.createElement('div');
	elementImageCard.classList.add('thumbnail');
	const imageCard = document.createElement('img');
	imageCard.classList.add('thumbnailImg');
	let imageSrc = responseItem.volumeInfo.imageLinks ? 
		(responseItem.volumeInfo.imageLinks.thumbnail ? 
			responseItem.volumeInfo.imageLinks.thumbnail : 
			'/img/unavailable.png') :
		'/img/unavailable.png'; 
	imageCard.setAttribute('src', imageSrc);
	elementImageCard.appendChild(imageCard);
	bookCard.appendChild(elementImageCard);
	return bookCard;
}

function createHeaderBookCard(responseItem, pochList) {
	const headerCard = document.createElement('div');
	headerCard.classList.add('float');
	const bookTitleCard = document.createElement('div');
	bookTitleCard.classList.add('bookTitle');
	bookTitleCard.appendChild(document.createTextNode('Titre : ' + responseItem.volumeInfo.title +' '));
	headerCard.appendChild(bookTitleCard);
	const bookmarkCard = document.createElement('div');
	bookmarkCard.classList.add('bookmark');
	const bookmarkLink = document.createElement('a');
	if (pochList) {
		bookmarkLink.classList.add("clicDeleteBook");
		bookmarkLink.innerHTML = '<i class="fas fa-times" id="'+responseItem.id+'"></i>';
		bookmarkLink.addEventListener('click', event => {
			deleteFromFavorites(event.target.id);
		});
	} else {
		bookmarkLink.classList.add("clicBookmark");
		// change color if already added to favorites
		if (pochListFavorites.get(responseItem.id)) {
			bookmarkLink.innerHTML = '<i class="fas fa-bookmark addedToFavorite" id="'+responseItem.id+'"></i>';
		} else {
			bookmarkLink.innerHTML = '<i class="fas fa-bookmark" id="'+responseItem.id+'"></i>';
		}
		bookmarkLink.addEventListener('click', event => {
			addToFavorites(event.target.id, responseItem);
		});
	}
	bookmarkCard.appendChild(bookmarkLink);
	headerCard.appendChild(bookmarkCard);
	return headerCard;
}

function createContentBookCard(responseItem, pochList) {
	let textSpan;
	const contentCard = document.createElement('div');
	contentCard.classList.add('noFloat');
	const hrCard = document.createElement('hr');
	if (pochList) {
		hrCard.classList.add('hrCardPochList');
	} else {
		hrCard.classList.add('hrCard');
	}
	contentCard.appendChild(hrCard);
	// Id
	textSpan = (responseItem.id) ? 'Id : ' + responseItem.id : 'Id : Information manquante';
	contentCard.appendChild(createSpanCard('bookId', textSpan));
	// Author
	textSpan = (responseItem.volumeInfo.authors && responseItem.volumeInfo.authors[0]) ? 
		'Auteur : ' + responseItem.volumeInfo.authors[0] : 'Auteur : Information manquante';
	contentCard.appendChild(createSpanCard('bookAuthor', textSpan));
	// Description
	if (responseItem.volumeInfo.description){
		textSpan = (responseItem.volumeInfo.description.length < 200) ? 
			'Description : ' + responseItem.volumeInfo.description :
			'Description : ' + responseItem.volumeInfo.description.substring(0, maxDescriptionSize) + '...';
	} else {
		textSpan = 'Description : Information manquante';
	}
	contentCard.appendChild(createSpanCard('bookDescription', textSpan));
	return contentCard;
}

function createSpanCard(classSpan, textSpan) {
	const spanCard = document.createElement('span');
	spanCard.classList.add(classSpan);
	const spanContent = document.createTextNode(textSpan);
	spanCard.appendChild(spanContent);
	return spanCard;
}

function addToFavorites(idToAdd, itemToAdd) {
	if (!pochListFavorites) {
		// pochList empty, just add the favorite
		pochListFavorites.set(idToAdd,itemToAdd);
		updateSessionStorage();
	} else {
		// pochlist not empty, check before to add the favorite
		if (!pochListFavorites.get(idToAdd)) {
			// The id doesn't exist in favorites list
			pochListFavorites.set(idToAdd,itemToAdd);
			updateSessionStorage();
			refreshPochListContent();
			// Change the color of bookmark icon
			document.getElementById(idToAdd).classList.add('addedToFavorite');
		} else {
			alert('Vous ne pouvez ajouter deux fois le même livre');
		}
	}
}

function deleteFromFavorites(idToDelete) {
	pochListFavorites.delete(idToDelete);
	updateSessionStorage();
	refreshPochListContent();
	// Change the color of bookmark icon if displayed on searchResults
	if (document.getElementById(idToDelete)) {
		document.getElementById(idToDelete).classList.remove('addedToFavorite');
	}
}

function updateSessionStorage() {
	// Serialize Map pochListFavorites
	let pochListFavoriteString = JSON.stringify(Array.from(pochListFavorites.entries()));
	sessionStorage.setItem('pochlib',pochListFavoriteString);
}