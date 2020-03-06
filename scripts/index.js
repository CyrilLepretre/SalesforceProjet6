var bookTitle = '';
var bookAuthor = '';
var searchResultsHtml;
const maxDescriptionSize = 199; // +1 for string[0]

// Initialize global html structure
document.body.onload = init();

/***********************************
			FUNCTIONS
************************************/
function init () {
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
}

function initPochList (div) {
	const elementTitle = document.createElement('h2');
	const textTitle = document.createTextNode('Ma poch\'liste');
	elementTitle.appendChild(textTitle);
	elementTitle.classList.add('h2');
	div.appendChild(elementTitle);
}

function initAddBook (elementDivNewBook) {
	/*const elementAddBookTitle = document.createElement('h2');
	const textAddBookTitle = document.createTextNode('Nouveau Livre');
	elementAddBookTitle.appendChild(textAddBookTitle);
	elementAddBookTitle.classList.add('h2');
	elementDivNewBook.appendChild(elementAddBookTitle);*/
	addTitleInDiv(elementDivNewBook, 'Nouveau Livre', 'h2', 'h2');
	const elementAddSearchBook = document.createElement('div');
	elementAddSearchBook.id = 'addSearchBook';
	elementDivNewBook.appendChild(elementAddSearchBook);
	//addAddBookButton(elementAddSearchBook);
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
			console.log('No listener for ' + buttonId + ' button');
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
	elementInputText.id = inputId;
	switch (inputId) {
		case 'bookTitle' :
			elementInputText.addEventListener('input', function(e) {
				bookTitle = e.target.value;
			});
			break;
		case 'bookAuthor' : 
			elementInputText.addEventListener('input', function(e) {
				bookAuthor = e.target.value;
			});
			break;
		default :
			console.log('No listener for ' + inputId + ' input');
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
	document.getElementById('bookTitle').value = '';
	document.getElementById('bookAuthor').value = '';
	bookTitle = '';
	bookAuthor = '';
}

function callGoogleBooksAPI (bookTitle, bookAuthor) {
	if (isValidInput(bookTitle, bookAuthor)) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				var response = JSON.parse(this.responseText);

				const searchResultDiv = document.getElementById('searchResults');
				addTitleInDiv(searchResultDiv, 'Résultats de recherche', 'h2', 'h2');

				const elementDivResults = document.createElement('div');
				elementDivResults.id = 'searchResultsCards';
				searchResultDiv.appendChild(elementDivResults);

				for (let i=0; i<response.items.length; i++) {
					/*const elementBookCard = document.createElement('div');
					elementDivResults.appendChild(elementBookCard);
					elementBookCard.innerHTML = createHtmlBookCard(response.items[i]);*/
					elementDivResults.innerHTML = createHtmlBookCard(response.items[i]);
				}
				// Add event listener on bookmark buttons
				document.querySelectorAll('.clicBookmark').forEach(item => {
					item.addEventListener('click', event => {
						console.log('bookmark clicked : ' + event.target.id);
						console.log(event.target);
					})
				})
			}
		};
		request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + bookTitle);
		request.send();
	} else {
		window.alert("Merci de saisir un titre et un auteur");
	}
}

function isValidInput(bookTitle, bookAuthor) {
	result = ((bookTitle == '') && (bookAuthor == '')) ? false : true;
	//result = ((bookTitle == '') || (bookAuthor == '')) ? false : true;
	return result;
}

function createHtmlBookCard(responseItem) {
	htmlBookCard = '<div class="bookCard">';
	//htmlBookCard += '<span class="bookTitle">Titre : ' + responseItem.volumeInfo.title + '</span><br/><hr class="hrCard"><br/>';
	htmlBookCard += '<div><div class="bookTitle">Titre : ' + responseItem.volumeInfo.title + '</div>';
	htmlBookCard += '<div class="bookmark"><a class="clicBookmark"><i class="fas fa-bookmark" id="'+responseItem.id+'"></i></a></div></div>'
	htmlBookCard += '<div class="noFloat"><hr class="hrCard"><br/>';
	htmlBookCard += (responseItem.id) ? 
		'<span class="bookId">Id : '+responseItem.id+'</span><br /><br/>' : 
		'<span class="bookId">Id : Information manquante</span><br /><br/>';
	htmlBookCard += (responseItem.volumeInfo.authors && responseItem.volumeInfo.authors[0]) ? 
		'<span class="bookAuthor">Auteur : ' + responseItem.volumeInfo.authors[0] + '</span><br/><br/>' : 
		'<span class="bookAuthor">Auteur : Information manquante</span><br /><br/>';
	let descriptionHtml;
	if (responseItem.volumeInfo.description){
		descriptionHtml = (responseItem.volumeInfo.description.length < 200) ? 
			'<span class="bookDescription">Description : '+responseItem.volumeInfo.description+'</span><br /><br />'  :
			'<span class="bookDescription">Description : '+responseItem.volumeInfo.description.substring(0, maxDescriptionSize)+'...</span><br /><br />';
	} else {
		descriptionHtml = '<span class="bookDescription">Description : Information manquante</span><br /><br /></div>';
	}
	htmlBookCard += descriptionHtml;
	// ImageLink
	htmlBookCard += '<div class="thumbnail"><img class="thumbnailImg" src=';
	htmlBookCard += responseItem.volumeInfo.imageLinks ? 
		(responseItem.volumeInfo.imageLinks.thumbnail ? responseItem.volumeInfo.imageLinks.thumbnail : '"/img/unavailable.png"') :'"/img/unavailable.png"';
	htmlBookCard += '></div>';
	/*if (responseItem.volumeInfo.imageLinks){
		if (responseItem.volumeInfo.imageLinks.thumbnail){
			
		}
	}*/
	htmlBookCard += '</div>';
	return htmlBookCard;
}