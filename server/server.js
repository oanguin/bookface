const express = require("express");
const bodyParser = require("body-parser");
<<<<<<< HEAD
var _ = require("lodash");
var morgan = require("morgan");
var fs = require("fs");
var path = require("path");
var rfs = require("rotating-file-stream");
=======
const _ = require("lodash");
const morgan = require("morgan");
>>>>>>> 2d5d2da12cd7e573603ad06a51a569d55e224d1c

const app = express();
const port = 3000;

/*Logging Configuration*/
// log only 4xx and 5xx responses to console
app.use(
  morgan("dev", {
    skip: function(req, res) {
      return res.statusCode < 400;
    }
  })
);

// log all requests to logs/access.log
// ensure log directory exists
var logDirectory = path.join(__dirname, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory
});
app.use(
  morgan("common", {
    stream: accessLogStream
  })
);
/*End of Logging Configuration*/
app.use(express.static("client"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hi from book app.");
});

/*Author Rleated Endpoints - Will need to be moved later*/
const AUTHOR = "authors";

let authors = [];
let id = 0;

/*The Id will be added to the request body as req.body.id */
var updateId = function(req, res, next) {
  id += 1;
  req.body.id = id + "";
  next();
};

/*For every path with id this middleware will be called then next operation
will take place. A author will be returned in the the request object as req.author */
app.param("id", (req, res, next, id) => {
  let index = _.findIndex(authors, {
    id: req.params.id
  });
  req.author = authors[index];
  next();
});

app.get(`/${AUTHOR}`, (req, res) => {
  res.statusCode = 200;
  res.json(authors);
});

/*Use updateId function to add id to req.body */
app.post(`/${AUTHOR}`, updateId, (req, res) => {
  let author = req.body;

  authors.push(author);
  res.statusCode = 200;
  res.send(author);
});

app.patch(`/${AUTHOR}/:id`, (req, res) => {
  let existingAuthorIndex = _.findIndex(authors, {
    id: req.author.id
  });
  let editedAuthor = req.body;
  delete editedAuthor.id;

  if (!editedAuthor) {
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

/*Middleware to catch all errors which are not managed.
Note that the signiture with the error at the beginning is needed. */
app.use((err, req, res, next) => {
  console.log(`Error Caught.${err}`);
  res.statusCode = 503;
  res.json(`Error: ${err}`);
});

app.listen(port, () => console.log(`Listening on ${port}`));
