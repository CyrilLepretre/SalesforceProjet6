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
	elementAddBook.innerHTML = '<br /><div>Titre du livre</div><div><input type="text" id="bookTitle" placeholder="Titre" /></div>'
		+ '<div>Auteur</div><div><input type="text" id="bookAuthor" placeholder="Auteur"/></div>'
		+ '<div><button id=\"buttonSearchBook\"type=\"button\">Rechercher</button></div>'
		+ '<div><button id=\"buttonCancelSearchBook\"type=\"button\">Annuler</button></div>';
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
				//console.log(response);
				searchResultsHtml = '';
				for (let i=0; i<response.items.length; i++) {
					searchResultsHtml += "<span>Titre:" + response.items[i].volumeInfo.title + "</span><br/>";
					searchResultsHtml += (response.items[i].id) ? 
						"<span>Id : "+response.items[i].id+"</span><br />" : 
						"<span>Id : Information manquante</span><br />";
					searchResultsHtml += (response.items[i].volumeInfo.authors && response.items[i].volumeInfo.authors[0]) ? 
						"<span>Auteur : " + response.items[i].volumeInfo.authors[0] + "</span><br/>" : 
						"<span>Auteur : Information manquante</span><br />";
					let descriptionHtml;
					if (response.items[i].volumeInfo.description){
						descriptionHtml = (response.items[i].volumeInfo.description.length < 200) ? 
							"<span>Description : "+response.items[i].volumeInfo.description+"</span><br />"  :
							"<span>Description : "+response.items[i].volumeInfo.description.substring(0, maxDescriptionSize)+"...</span><br />"
					} else {
						descriptionHtml = "<span>Description : Information manquante</span><br />";
					}
					searchResultsHtml += descriptionHtml;
					/*searchResultsHtml += (response.items[i].volumeInfo.description) ? 
						"<span>Description : "+response.items[i].volumeInfo.description.substring(0, maxDescriptionSize)+"</span><br />" :
						"<span>Description : Information manquante</span><br />";*/
					
					searchResultsHtml += "<br />";
				}
				pochList.innerHTML = searchResultsHtml;
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
