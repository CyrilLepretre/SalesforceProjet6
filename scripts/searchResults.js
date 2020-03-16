import createBookCard from './card.js';
var response;
const maxResults = 20; // maximum authorized is 40
var newSearch = true;

function callGoogleBooksAPI (bookTitle, bookAuthor) {
	if (isValidInput(bookTitle, bookAuthor)) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				response = JSON.parse(this.responseText);
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
					addResultsSummaryAndInitialize('Aucun résultat trouvé');
				}
				newSearch = false;
			}
		};
		request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=intitle:'" 
			+ bookTitle + "'+inauthor:'" + bookAuthor + "'&maxResults=" + maxResults, true);
		request.send();
	}
}

function isValidInput(bookTitle, bookAuthor) {
	let result = ((bookTitle == '') || (bookAuthor == '')) ? false : true;
	// Change style of input if there are invalid
	if (bookTitle == '') {
		const titleInput = document.getElementById('bookTitle');
		titleInput.classList.add('error');
	}
	if (bookAuthor == '') {
		const authorInput = document.getElementById('bookAuthor');
		authorInput.classList.add('error');
	}
	return result;
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

function addTitleInDiv (div, title, elementInput, classInput) {
	const element = document.createElement(elementInput);
	const textTitle = document.createTextNode(title);
	element.appendChild(textTitle);
	element.classList.add(classInput);
	div.appendChild(element);
}

function updateNewSearch (value) {
	newSearch = value;
}

export {callGoogleBooksAPI, response, updateNewSearch};