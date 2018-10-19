const express = require("express");
const bodyParser = require("body-parser");
var _ = require("lodash");

const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hi from book app.");
});

/*Author Rleated Endpoints - Will need to be moved later*/
const AUTHOR = "authors";

let authors = [];
let id = 0;

app.get(`/${AUTHOR}`, (req, res) => {
  res.statusCode = 200;
  res.json(authors);
});

app.post(`/${AUTHOR}`, (req, res) => {
  let author = req.body;
  id++;
  author.id = id + "";

  authors.push(author);
  res.statusCode = 200;
  res.send(author);
});

app.patch(`/${AUTHOR}/:id`, (req, res) => {
  let existingAuthorIndex = _.findIndex(authors, { id: req.params.id });

  let editedAuthor = req.body;
  if (editedAuthor.id) {
    delete editedAuthor.id;
  }

  if (!authors[existingAuthorIndex]) {
    res.statusCode = 404;
    res.json("Not Found");
  } else {
    res.statusCode = 201;
    /*Using new spread operator to merge objects.
    The right most object values with overwrite existing values. */
    authors[existingAuthorIndex] = {
      ...authors[existingAuthorIndex],
      ...editedAuthor
    };
    res.json(authors[existingAuthorIndex]);
  }
});
/*End of Author Rleated Endpoints*/

app.listen(port, () => console.log(`Listening on ${port}`));
