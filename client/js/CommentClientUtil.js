function removeComment(commentid) {
    fetch(`/api/comment/${commentid}`, {
        method: 'delete'
    }).then(response => {
        $(`div[id=${commentid}]`).remove();
    }).catch(exception => {
        console.log('Failed Delete', exception);
    });
};

function getString() {
    console.log("Inside Function...");
    return "Get String";
}

function checkDeleteAllowance() {
    const accessToken = Cookies.get('x_access_token');
    var user = jwt_decode(accessToken);

    //Remove delete button is the user is not admin
    if (user && !user.is_admin) {
        $(document).ready(function () {
            $('icon.ti-close').remove();
        });
    }
}