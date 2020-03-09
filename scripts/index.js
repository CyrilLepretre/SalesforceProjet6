var bookTitle = '';
var bookAuthor = '';
var newSearch = true;
var searchResultsHtml;
var response; // to store WS response
var pochListFavorites = new Map();
const maxDescriptionSize = 199; // +1 for string[0]
const maxResults = 20; // maximum authorized is 40

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
	const elementDivNewBook = document.createElement('div');
	elementDivNewBook.id = 'newBook';
	elementPrincipalDiv.replaceChild(elementDivNewBook, elementH2class);
	initAddBook(elementDivNewBook);
	// replace h2 pochList by a div to display search results and pochlist
	const elementContentDiv = document.getElementById('content');
	const elementH2PochList = document.querySelector('#content h2');
	const elementSearchResults = document.createElement('div');
	elementSearchResults.id = 'searchResults';
	elementContentDiv.replaceChild(elementSearchResults, elementH2PochList);
	const elementDivPochList = document.createElement('div');
	elementDivPochList.id = 'pochList';
	initPochList(elementDivPochList);
	elementContentDiv.appendChild(elementDivPochList);
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
	//<link rel="shortcut icon" href="/img/logo.png"></link>
}

function initPochList (div) {
	const elementTitle = document.createElement('h2');
	const textTitle = document.createTextNode('Ma poch\'liste');
	elementTitle.appendChild(textTitle);
	elementTitle.classList.add('h2');
	elementTitle.classList.add('h2poch');
	div.appendChild(elementTitle);
	const pochListContent = document.createElement('div');
	pochListContent.id = 'pochListContent';
	div.appendChild(pochListContent);
}

function initAddBook (elementDivNewBook) {
	addTitleInDiv(elementDivNewBook, 'Nouveau Livre', 'h2', 'h2');
	const elementAddSearchBook = document.createElement('div');
	elementAddSearchBook.id = 'addSearchBook';
	elementDivNewBook.appendChild(elementAddSearchBook);
	elementAddSearchBook.appendChild(createButton('buttonAddABook', '<i class="fas fa-plus-circle"></i> Ajouter un livre', elementAddSearchBook));
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
			//console.log('No listener for ' + buttonId + ' button');
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
			//console.log('No listener for ' + inputId + ' input');
			break;
	}
	divInputText.appendChild(elementInputText);
	return divInputText;
}

addSearchFormBook = (elementDivNewBook) => {
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
	newSearch = true;
}

function callGoogleBooksAPI (bookTitle, bookAuthor) {
	if (isValidInput(bookTitle, bookAuthor)) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				response = JSON.parse(this.responseText);
				//console.log(JSON.stringify(response));
				// Clean searchResults before displaying results
				if (!newSearch) {
					const toClean = document.getElementById('searchResults');
					toClean.innerHTML = '';
				}
				// Check if there are results, otherwise display a message for no results found
				if (response.items) {
					let resultSummary;
					if (response.totalItems > maxResults) {
						resultSummary = maxResults + ' résultats affichés parmi ' + response.totalItems + ' trouvés,';
						resultSummary += ' veuillez affiner votre recherche.';
					} else {
						resultSummary = response.totalItems + ' résultats trouvés.';
					}
					addResultsSummaryAndInitialize(resultSummary);
					const elementDivResults = document.getElementById('searchResultsCards');
					for (let i=0; i<response.items.length; i++) {
						elementDivResults.appendChild(createBookCard(response.items[i]), false);
					}
				} else {
					/*const noResult = document.createElement('span');
					noResult.appendChild(document.createTextNode('Aucun résultat trouvé'));
					elementDivResults.appendChild(noResult);*/
					addResultsSummaryAndInitialize('Aucun résultat trouvé');
				}
				newSearch = false;
			}
		};
		//request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + bookTitle);
		request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=intitle:" + bookTitle + '+inauthor:' + bookAuthor + '&maxResults=' + maxResults);
		request.send();
	} else {
		//window.alert("Merci de saisir un titre et un auteur");
	}
}

function addResultsSummaryAndInitialize(textSummary) {
	const searchResultDiv = document.getElementById('searchResults');
	addTitleInDiv(searchResultDiv, 'Résultats de recherche', 'h2', 'h2');

	const summary = document.createElement('span');
	summary.appendChild(document.createTextNode(textSummary));
	searchResultDiv.appendChild(summary);

	const elementDivResults = document.createElement('div');
	elementDivResults.id = 'searchResultsCards';
	elementDivResults.classList.add('cardsList');
	searchResultDiv.appendChild(elementDivResults);
	
}

function isValidInput(bookTitle, bookAuthor) {
	result = ((bookTitle == '') || (bookAuthor == '')) ? false : true;
	//result = ((bookTitle == '') || (bookAuthor == '')) ? false : true;
	// Change style of input if there are invalid
	if (bookTitle == '') {
		const titleInput = document.getElementById('bookTitle');
		//titleInput.setAttribute('placeholder','Veuillez saisir un titre');
		titleInput.classList.add('error');
	}
	if (bookAuthor == '') {
		const authorInput = document.getElementById('bookAuthor');
		//authorInput.setAttribute('placeholder','Veuillez saisir un auteur')
		authorInput.classList.add('error');
	}
	return result;
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
			console.log('Delte clicked : ' + event.target.id);
			deleteFromFavorites(event.target.id);
		});
	} else {
		bookmarkLink.classList.add("clicBookmark");
		bookmarkLink.innerHTML = '<i class="fas fa-bookmark" id="'+responseItem.id+'"></i>';
		bookmarkLink.addEventListener('click', event => {
			console.log('bookmark clicked : ' + event.target.id);
			addToFavorites(event.target.id, responseItem);
		});
	}
	bookmarkCard.appendChild(bookmarkLink);

	headerCard.appendChild(bookmarkCard);
	return headerCard;
}

function createContentBookCard(responseItem, pochList) {
	//console.log(JSON.stringify(responseItem));
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

function createBookCard(responseItem, pochList) {
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

function addToFavorites(idToAdd, itemToAdd) {
	//console.log(JSON.stringify(pochListFavorites));
	if (!pochListFavorites) {
		// pochList empty, just add the favorite
		pochListFavorites.set(idToAdd,itemToAdd);
		updateSessionStorage();
	} else {
		// pochlist not empty, check before to add the favorite
		console.log('pochlist dans addToFavorites ' + pochListFavorites);
		if (!pochListFavorites.get(idToAdd)) {
			// The id doesn't exist in favorites list
			pochListFavorites.set(idToAdd,itemToAdd);
			updateSessionStorage();
			refreshPochListContent();
		} else {
			alert('Vous ne pouvez ajouter deux fois le même livre');
		}
	}
}

function deleteFromFavorites(idToDelete) {
	pochListFavorites.delete(idToDelete);
	updateSessionStorage();
	refreshPochListContent();
}

function updateSessionStorage() {
	// Serialize Map pochListFavorites
	let pochListFavoriteString = JSON.stringify(Array.from(pochListFavorites.entries()));
	sessionStorage.setItem('pochlib',pochListFavoriteString);
	console.log('pochList updated String : ' + pochListFavoriteString);
}

function refreshPochListContent() {
	const pochListContainer = document.getElementById('pochList');
	const oldPochListContent = document.getElementById('pochListContent');

	const newPochListContent = document.createElement('div');
	newPochListContent.id = 'pochListContent';
	newPochListContent.classList.add('cardsList');
	if (pochListFavorites) {
		for (let [favoriteId, favoriteContent] of pochListFavorites) {
			//console.log('Favori ID pochlist : ' + favoriteId);
			newPochListContent.appendChild(createBookCard(favoriteContent, true));
		}
	}
	// Replace old content of poshlist by the new content
	pochListContainer.replaceChild(newPochListContent, oldPochListContent);
}

function initializeMapFromSession() {
	let sessionStorageValue = sessionStorage.getItem('pochlib');
	if (sessionStorageValue) {
		pochListFavorites = new Map(JSON.parse(sessionStorageValue));
		console.log('pochList iniliazed String : ' + JSON.stringify(pochListFavorites));
		//console.log(JSON.stringify(pochListFavorites));
	}
}