function addAuthors() {
    /*Allows Adding More Auhtors to a Book*/
    let existingAuthorDiv = $('div.form-group.authors').children()[0];
    let cloneAuthorDiv = $(existingAuthorDiv).clone();
    let count = $('div.form-group.authors').children().length

    $(cloneAuthorDiv).find('input.form-control').each((input, element) => {
        $(element).attr("name", $(element).attr("name").split('').map((value, index) => {
            if (!isNaN(value)) {
                return count;
            } else {
                return value;
            }
        }).join(""))
    });

    $('div.form-group.authors').append(cloneAuthorDiv);

};