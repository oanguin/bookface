const express = require("express");
const bodyParser = require("body-parser");
var _ = require("lodash");
var morgan = require("morgan");
var fs = require("fs");
var path = require("path");
var rfs = require("rotating-file-stream");
var authors = require("./routers/authors");
var userRouter = require("./routers/user");
var mongoose = require("mongoose");
var Author = require("./models/author")
methodOverride = require('method-override')
var restful = require('node-restful')
var loginRouter = require("./routers/login")
var bookRouter = require("./routers/book")
const config = require("./config")

const app = express();
//const port = 3000;

// Set default node environment to development 
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*START MongoDB */
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/bookface")
  .then(() => console.log("Database connection succesful"))
  .catch(err => console.error(err));

/*END MongoDB */
/* pug templating configuration*/
app.set("view engine", "pug");
app.set("views", `./client`);
/*End pug configuration */

/*Logging Configuration*/
// log only 4xx and 5xx responses to console
app.use(
  morgan("dev", {
    skip: function (req, res) {
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
app.use(methodOverride());

app.use(morgan("dev"));

/*START Rest End Point Routes*/
const AUTHOR = "authors";
//app.use(`/${AUTHOR}`, authors);
//app.use(authors);
/*var Resource = app.resource = restful.model('resource', Author)
  .methods(['get', 'post', 'put', 'delete']);

Resource.register(app, '/authors');*/
app.use('/api', authors);
app.use('/api', bookRouter);
app.use('/api', loginRouter);
app.use('/api', userRouter);
/*END of End Point Routes*/

/*START Views*/
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/books", (req, res) => {
  /*Add at least one author to book [{}]*/
  res.render("books", {
    authors: [{}]
  });
});

app.get("/test-template", (req, res) => {
  res.render("test-template/index", {
    data: authors
  });
});

app.get("/show_authors", (req, res) => {
  Author.find((error, authors) => {
    console.log('Authors Found Really:' + authors)
    if (error)
      next(error)
    else
      res.render("index", {
        data: authors
      })
  });
});
/*End of Views */

/*Middleware to catch all errors which are not managed.
Note that the signiture with the error at the beginning is needed. */
app.use((err, req, res, next) => {
  console.log(`Error Caught.${err}`);
  res.statusCode = 503;
  res.json(`Error: ${err}`);
});

/*Only start server if not running tests */
if (require.main === module) {
  app.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

module.exports = app;