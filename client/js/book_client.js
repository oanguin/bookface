function addFavouriteBook(book_id) {
    //Set book as favourite and update local object so the ui to reflect change
    fetch(`/api/book/${book_id}/mark-favourite`, {
            method: 'post'
        })
        .then(response => {
            console.log(response.data);
            $(`icon[name="nonfavourite-${book_id}"]`).hide();
            $(`icon[name="favourite-${book_id}"]`).show();
        })
        .catch(error => {
            console.log(error)
        });
}

function removeFavouriteBook(book_id) {
    //Remove book as favourite and update local object so the ui to reflect change
    fetch(`/api/book/${book_id}/unmark-favourite`, {
            method: 'post'
        })
        .then(response => {
            $(`icon[name="nonfavourite-${book_id}"]`).show();
            $(`icon[name="favourite-${book_id}"]`).hide();
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        });

}

function addBook() {
    console.log('Add Book Method')
    //Build List of Authors
    var authors = [];
    const authorDivs = $('div[name=author]');
    authorDivs.each((index, element) => {
        const lastName = $(element).find('input[id^=last_name]').val();
        const firstName = $(element).find('input[id^=last_name]').val();
        authors.push({
            last_name: lastName,
            first_name: firstName
        });
    });

    //Get Picture
    var picture = $('#picture').prop('files');

    //Get Book Title
    var bookTitle = $('#title').val();

    //Get Book Pages
    var bookPages = $('#pages').val();

    var formData = new FormData();
    formData.append('title', bookTitle);
    formData.append('pages', bookPages);
    formData.append('authors', JSON.stringify(authors));

    if (picture.length > 0) {
        formData.append('picture', picture[0]);
    }

    //Do request
    fetch('/api/book', {
        method: "post",
        body: formData
    }).then(result => {
        console.log('Result', result);
        window.location.href = "/books";
    }).catch(exception => {
        console.log('Exception', exception);
    });
}