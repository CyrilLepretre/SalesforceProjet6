var bookTitle = '';
var bookAuthor = '';
const newBookTitle = document.querySelector("#myBooks h2.h2");
newBookTitle.innerHTML = "<h2 class=\"h2\">Nouveau Livre</h2><button id=\"buttonAddABook\"type=\"button\">Ajouter un livre</button>";

const buttonAddABook = document.getElementById("buttonAddABook");
buttonAddABook.addEventListener('click', function(event) {
	openFormAddBook();
});

openFormAddBook = () => {
	newBookTitle.innerHTML = '<div>Titre du livre</div><div><input type="text" id="bookTitle" placeholder="Titre" /></div><div>Auteur</div><div><input type="text" id="bookAuthor" placeholder="Auteur"/></div><div><button id=\"buttonSearchBook\"type=\"button\">Rechercher</button></div><div><button id=\"buttonCancelSearchBook\"type=\"button\">Annuler</button></div>';
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
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
			var response = JSON.parse(this.responseText);
			console.log(response);
		}
	};
	request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + bookTitle);
	request.send();
}