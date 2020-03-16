require("../styles/style.scss");
import {callGoogleBooksAPI, updateNewSearch} from './searchResults.js';
import {refreshPochListContent, initializeMapFromSession} from './pochList.js';
import {addAlertModal} from './alert.js';
var bookTitle = '';
var bookAuthor = '';

// Initialize global html structure
document.body.onload = init();

/***********************************
			FUNCTIONS
************************************/
function init () {
	addFavIcon();
	// replace title by the logo in a div
	const elementPrincipalDiv = document.getElementById('myBooks');
	const elementTitle = document.getElementsByClassName('title')[0];
	const elementDivLogo = document.createElement('div');
	elementDivLogo.id = 'logo';
	elementDivLogo.innerHTML = '<img class="logo" src="/img/logo.png" alt="Logo" srcset="/img/logo.svg" />'
	elementPrincipalDiv.replaceChild(elementDivLogo, elementTitle);
	// replace h2 class h2 by a div for new book button/search book
	const elementH2class = document.querySelector('#myBooks h2');
	elementPrincipalDiv.replaceChild(initAddBook(), elementH2class);
	// replace h2 pochList by a div to display search results and pochlist
	const elementContentDiv = document.getElementById('content');
	const elementH2PochList = document.querySelector('#content h2');
	const elementSearchResults = document.createElement('div');
	elementSearchResults.id = 'searchResults';
	elementContentDiv.replaceChild(elementSearchResults, elementH2PochList);
	elementContentDiv.appendChild(initPochList());
	// Add the alert modal, hidden
	addAlertModal();
	// Before refreshing the content of the pochlist, pochListFavorites map is initialized with the session storage content
	initializeMapFromSession();
	// Refresh the content of the pochlist with the content of pochListFavorites map
	refreshPochListContent();
}

function addFavIcon() {
	const headContent = document.getElementsByTagName('head');
	const linkFavIcon = document.createElement('link');
	linkFavIcon.setAttribute('rel', 'shortcut icon');
	linkFavIcon.setAttribute('href', '/img/logo.png');
	headContent[0].appendChild(linkFavIcon);
}

function initPochList () {
	const elementDivPochList = document.createElement('div');
	elementDivPochList.id = 'pochList';
	const elementTitle = document.createElement('h2');
	const textTitle = document.createTextNode('Ma poch\'liste');
	elementTitle.appendChild(textTitle);
	elementTitle.classList.add('h2');
	elementTitle.classList.add('h2poch');
	elementDivPochList.appendChild(elementTitle);
	const pochListContent = document.createElement('div');
	pochListContent.id = 'pochListContent';
	elementDivPochList.appendChild(pochListContent);
	return elementDivPochList;
}

function initAddBook () {
	const elementDivNewBook = document.createElement('div');
	elementDivNewBook.id = 'newBook';
	addTitleInDiv(elementDivNewBook, 'Nouveau Livre', 'h2', 'h2');
	const elementAddSearchBook = document.createElement('div');
	elementAddSearchBook.id = 'addSearchBook';
	elementDivNewBook.appendChild(elementAddSearchBook);
	elementAddSearchBook.appendChild(createButton('buttonAddABook', '<i class="fas fa-plus-circle"></i> Ajouter un livre', elementAddSearchBook));
	return elementDivNewBook;
}

function addTitleInDiv (div, title, elementInput, classInput) {
	const element = document.createElement(elementInput);
	const textTitle = document.createTextNode(title);
	element.appendChild(textTitle);
	element.classList.add(classInput);
	div.appendChild(element);
}

function createButton (buttonId, innerToAdd, div) {
	const elementButton = document.createElement('button');
	elementButton.setAttribute('type', 'button');
	elementButton.id = buttonId;
	elementButton.innerHTML = innerToAdd;
	// EventLister depending on button id
	switch (buttonId) {
		case 'buttonAddABook' :
			elementButton.addEventListener('click', function() {
				div.removeChild(elementButton);
				addSearchFormBook(div);
			});
			break;
		case 'buttonSearchBook' :
			elementButton.addEventListener('click', function(){
				callGoogleBooksAPI(bookTitle, bookAuthor);
			});
			break;
		case 'buttonCancelSearchBook' :
			elementButton.addEventListener('click', function(){
				cancelSearch();
			});
			break;
		default :
			break;
	}
	return elementButton;
}

function createInputTitle (inputClass, InputText) {
	const elementInputTitle = document.createElement('div');
	elementInputTitle.classList.add(inputClass);
	elementInputTitle.appendChild(document.createTextNode(InputText));
	return elementInputTitle;
}

function createInputText (inputClass, inputId) {
	const divInputText = document.createElement('div');
	divInputText.classList.add(inputClass);
	const elementInputText = document.createElement('input');
	elementInputText.setAttribute('type', 'text');
	elementInputText.setAttribute('required', 'required');
	elementInputText.id = inputId;
	switch (inputId) {
		case 'bookTitle' :
			elementInputText.setAttribute('placeholder','Veuillez saisir un titre');
			elementInputText.addEventListener('input', function(e) {
				// remove error class on input if exists
				if (elementInputText.classList.contains('error')){
					elementInputText.classList.remove('error');
				}
				bookTitle = e.target.value;
			});
			break;
		case 'bookAuthor' : 
			elementInputText.setAttribute('placeholder','Veuillez saisir un auteur');
			elementInputText.addEventListener('input', function(e) {
				// remove error class on input if exists
				if (elementInputText.classList.contains('error')){
					elementInputText.classList.remove('error');
				}
				bookAuthor = e.target.value;
			});
			break;
		default :
			break;
	}
	divInputText.appendChild(elementInputText);
	return divInputText;
}

function addSearchFormBook(elementDivNewBook) {
	elementDivNewBook.appendChild(createInputTitle('inputFormTitle', 'Titre du livre'));
	elementDivNewBook.appendChild(createInputText('inputFormText', 'bookTitle'));
	elementDivNewBook.appendChild(createInputTitle('inputFormTitle', 'Auteur'));
	elementDivNewBook.appendChild(createInputText('inputFormText', 'bookAuthor'));
	const searchButton = document.createElement('div');
	searchButton.appendChild(createButton('buttonSearchBook', '<i class="fas fa-search"></i> Rechercher'), '');
	elementDivNewBook.appendChild(searchButton);
	const cancelButton = document.createElement('div');
	cancelButton.appendChild(createButton('buttonCancelSearchBook', '<i class="fas fa-times"></i> Annuler'), '');
	elementDivNewBook.appendChild(cancelButton);
}

function cancelSearch() {
	const searchResultDiv = document.getElementById('searchResults');
	searchResultDiv.innerHTML = '';
	const bookTitleArea = document.getElementById('bookTitle');
	bookTitleArea.value = '';
	if (bookTitleArea.classList.contains('error')){
		bookTitleArea.classList.remove('error');
	}
	const bookAuthorArea = document.getElementById('bookAuthor');
	bookAuthorArea.value = '';
	if (bookAuthorArea.classList.contains('error')){
		bookAuthorArea.classList.remove('error');
	}
	bookTitle = '';
	bookAuthor = '';
	updateNewSearch(true);
}