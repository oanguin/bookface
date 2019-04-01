$(document).ready(function () {
    $("#formUser").hide();
});


function toggleLoginUser() {

    if ($("#formLogin").is(":visible")) {
        $("#toggle-login").attr("value", "Login");
        $("#formLogin").hide();
        $("#formUser").show();
    } else {
        $("#toggle-login").attr("value", "Create User");
        $("#formLogin").show();
        $("#formUser").hide();
    }
}