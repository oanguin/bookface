const EDIT = 'EDIT';
const VIEW = 'VIEW';

editComment = (id) => {
    changeCommentActions(EDIT, id);
}

saveComment = (id) => {
    const comment = $(`#comment_input_${id}`).val();
    fetch(`/api/comment/${id}`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'put',
        body: JSON.stringify({
            comment: comment
        })
    }).then(result => {
        $(`#comment_span_${id}`).empty().append(comment);
        changeCommentActions(VIEW, id);
    });
}

deleteComment = (id) => {
    fetch(`/api/comment/${id}`, {
        method: 'delete',
    }).then(result => {
        $(`#row_${id}`).remove();
    })
}

cancelEditComment = (id) => {
    changeCommentActions(VIEW, id);
}

changeCommentActions = (state, id) => {
    if (state == EDIT) {
        $(`#edit_${id}`).hide();
        $(`#delete_${id}`).hide();
        $(`#save_${id}`).show();
        $(`#cancel_${id}`).show();
        $(`#comment_input_${id}`).show();
        $(`#comment_span_${id}`).hide();
    } else if (state == VIEW) {
        $(`#edit_${id}`).show();
        $(`#save_${id}`).hide();
        $(`#cancel_${id}`).hide();
        $(`#delete_${id}`).show();
        $(`#comment_input_${id}`).hide();
        $(`#comment_span_${id}`).show();
    }
}