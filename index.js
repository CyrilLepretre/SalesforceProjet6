const newBookTitle = document.querySelector("#myBooks h2.h2");
newBookTitle.innerHTML = "<h2 class=\"h2\">Nouveau Livre</h2><button id=\"buttonAddABook\"type=\"button\">Ajouter un livre</button>";
const buttonAddABook = document.getElementById("buttonAddABook");
buttonAddABook.addEventListener('click', function(event) {
	openFormAddBook();
});

openFormAddBook = () => {
	newBookTitle.innerHTML = '<div>Titre du livre</div><div><input type="text" id="bookTitle" placeholder="Titre" /></div><div>Auteur</div><div><input type="text" id="bookAuthor" placeholder="Auteur"/></div><div><button id=\"buttonSearchBook\"type=\"button\">Rechercher</button></div><div><button id=\"buttonCancelSearchBook\"type=\"button\">Annuler</button></div>';
	const searchButton = document.getElementById('buttonSearchBook');
	searchButton.addEventListener('click', function(event){
		callGoogleBooksAPI();
	});
}

callGoogleBooksAPI = (bookName, bookAuthor) => {
	let request = new XMLHttpRequest();
	request.open("GET", "https://www.googleapis.com/auth/books");
	request.send();
}