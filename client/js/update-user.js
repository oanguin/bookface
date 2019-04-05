function updateUser(user_id) {
  console.log("Updating the User.");
  data = {};
  $("form#formUser :input").each(function() {
    var input = $(this);
    if (input.attr("type") !== "button") {
      data[input.attr("name")] = input.val();
    }
  });
  fetch(`/api/user/${user_id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "put",
    body: JSON.stringify(data)
  })
    .then(result => {
      window.location = "/profiles";
    })
    .catch(exception => {
      alert("Error Updating User.");
    });
}
