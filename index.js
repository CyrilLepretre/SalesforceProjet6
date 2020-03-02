var bookTitle = '';
var bookAuthor = '';
var searchResultsHtml;
const maxDescriptionSize = 199; // +1 for string[0]
// title replaced by logo
document.getElementsByClassName("title")[0].innerHTML = "<div id=\"logo\"><img class=\"logo\" src=\"/img/logo.png\" alt=\"Logo\" srcset=\"/img/logo.svg\" /></div>";

// Replace h2 class by h2 id to not inherit it to children that will be created
document.getElementsByClassName("h2")[0].innerHTML = "<h2 id=\"h2\">Nouveau Livre</h2>";

const newBookTitle = document.querySelector("#myBooks h2");
const elementAddBook = document.createElement("div");
newBookTitle.appendChild(elementAddBook);
elementAddBook.innerHTML = "<div><button id=\"buttonAddABook\"type=\"button\"><i class=\"fas fa-plus-circle\"></i> Ajouter un livre</button></div>";

const pochList = document.querySelector("#content h2");

const buttonAddABook = document.getElementById("buttonAddABook");
buttonAddABook.addEventListener('click', function(event) {
	openFormAddBook();
});

openFormAddBook = () => {
	//elementAddBook.classList.remove("h2");
	elementAddBook.innerHTML = '<br /><div>Titre du livre</div><div><input type="text" id="bookTitle"/></div>'
		+ '<div>Auteur</div><div><input type="text" id="bookAuthor"/></div>'
		+ '<div><button id=\"buttonSearchBook\"type=\"button\"><i class="fas fa-search"></i> Rechercher</button></div>'
		+ '<div><button id=\"buttonCancelSearchBook\"type=\"button\"><i class="fas fa-times"></i> Annuler</button></div>';
	// get Title entered by user
	const bookTitleInput = document.getElementById('bookTitle');
	bookTitleInput.addEventListener('input', function(e) {
		bookTitle = e.target.value;
	});

	// get Author entered by user
	const bookAuthorInput = document.getElementById('bookAuthor');
	bookAuthorInput.addEventListener('input', function(e) {
		bookAuthor = e.target.value;
	});

	const searchButton = document.getElementById('buttonSearchBook');
	searchButton.addEventListener('click', function(event){
		callGoogleBooksAPI(bookTitle, bookAuthor);
	});
}

function callGoogleBooksAPI (bookTitle, bookAuthor) {
	if (isValidInput(bookTitle, bookAuthor)) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				var response = JSON.parse(this.responseText);

				const searchResultsHtml = '<h2>Résultats de recherche</h2><div id="searchResults"></div>';
				pochList.innerHTML = searchResultsHtml;

				const searchResultsZone = document.getElementById('searchResults');
				for (let i=0; i<response.items.length; i++) {
					const elementBookCard = document.createElement('div');
					searchResultsZone.appendChild(elementBookCard);
					elementBookCard.innerHTML = createHtmlBookCard(response.items[i]);
				}
				
			}
		};
		request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + bookTitle);
		request.send();
	} else {
		window.alert("Merci de saisir un titre ou un auteur");
	}
}

function isValidInput(bookTitle, bookAuthor) {
	result = ((bookTitle == '') && (bookAuthor == '')) ? false : true;
	return result;
}

function createHtmlBookCard(responseItem) {
	htmlBookCard = '<div class="bookCard">';
	htmlBookCard += '<span class="bookTitle">Titre : ' + responseItem.volumeInfo.title + '</span><br/><hr class="hrCard"><br/>';
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
		descriptionHtml = '<span class="bookDescription">Description : Information manquante</span><br /><br />';
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