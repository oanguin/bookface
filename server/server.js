const express = require("express");
const bodyParser = require("body-parser");
var _ = require("lodash");
var morgan = require("morgan");
var fs = require("fs");
var path = require("path");
var rfs = require("rotating-file-stream");
var auhtors = require("./author/authors");

const app = express();
const port = 3000;
/* pug templating configuration*/
app.set("view engine", "pug");
app.set("views", `./client`);
/*End pug configuration */

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

/*START Rest End Point Routes*/
const AUTHOR = "authors";
app.use(`/${AUTHOR}`, auhtors);
/*END of End Point Routes*/

/*START Views*/
/*app.get("/", (req, res) => {
  res.render("index");
});*/

app.get("/test-template", (req, res) => {
  res.render("test-template/index", { data: authors });
});

app.get("/show_authors", (req, res) => {
  res.render("author/list", { data: authors });
});
/*End of Views */

/*Middleware to catch all errors which are not managed.
Note that the signiture with the error at the beginning is needed. */
app.use((err, req, res, next) => {
  console.log(`Error Caught.${err}`);
  res.statusCode = 503;
  res.json(`Error: ${err}`);
});

app.listen(port, () => console.log(`Listening on ${port}`));
