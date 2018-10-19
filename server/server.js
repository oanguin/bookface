const express = require("express");
const bodyParser = require("body-parser");
var _ = require("lodash");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hi from book app.");
});

/*Author Rleated Endpoints - Will need to be moved later*/
const AUTHOR = "authors";

let authors = [];
let id = 0;

app.get(`/${AUTHOR}`, (req, res) => {
  res.setHeader(200);
  res.json(authors);
});

app.post(`/${AUTHOR}`, (req, res) => {
  let author = req.body;
  id++;
  author.id = id;

  authors.pop(author);

  res.send(author);
});
/*End of Author Rleated Endpoints*/

app.listen(port, () => console.log(`Listening on ${port}`));
