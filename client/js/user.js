$(document).ready(function () {
    $("#formUser").hide();
});


function toggleLoginUser() {

    if ($("#formLogin").is(":visible")) {
        $("#formLogin").hide();
        $("#formUser").show();
    } else {
        $("#formLogin").show();
        $("#formUser").hide();
    }
}