function addFavouriteBook(book_id) {
    //Set book as favourite and update local object so the ui to reflect change
    fetch(`/api/book/${book_id}/mark-favourite`, { method: 'post' })
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
    fetch(`/api/book/${book_id}/unmark-favourite`, { method: 'post' })
        .then(response => {
            $(`icon[name="nonfavourite-${book_id}"]`).show();
            $(`icon[name="favourite-${book_id}"]`).hide();
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        });

}