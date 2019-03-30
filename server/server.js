// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || "prod";

const express = require("express");
const bodyParser = require("body-parser");
var _ = require("lodash");
var morgan = require("morgan");
var fs = require("fs");
var path = require("path");
var rfs = require("rotating-file-stream");
var authors = require("./routers/authors");
var userRouter = require("./routers/user");
var userController = require("./controllers/user");
var mongoose = require("mongoose");
var Author = require("./models/author");
var User = require("./models/user");
var Comment = require("./models/comment");
var Book = require("./models/book");
methodOverride = require("method-override");
var restful = require("node-restful");
var loginRouter = require("./routers/login");
var bookRouter = require("./routers/book");
var commentRouter = require("./routers/comment");
const config =
  process.env.NODE_ENV == "test" ?
  require("./config/config-test") :
  require("./config/config");
const cookieParser = require("cookie-parser");
var jwt = require("express-jwt");
var unless = require("express-unless");
var url = require("url");
var path = require("path");

const USER_UNAUTHORIZED_ERROR_MESSAGE = "User Unathorized";

const app = express();
app.use(cookieParser());

var multer = require('multer')

/*TODO make test cases work with authentication tokens... Then put this back */
/*Parse token from request as needed. */
app.use(
  jwt({
    secret: config.secret,
    credentialsRequired: false,
    getToken: function fromHeaderOrCookie(req) {
      if (req.headers["x-access-token"]) {
        return req.headers["x-access-token"];
      } else if (req.cookies.x_access_token) {
        return req.cookies.x_access_token;
      } else {
        throw Error(USER_UNAUTHORIZED_ERROR_MESSAGE);
      }
    },
    function (req, res) {
      console.log('Logged IN...')
      res.render("/index");
    }
  }).unless(function (req) {
    var ext = path.extname(req.originalUrl);
    var returned = !!~config.authUrlExceptions.indexOf(ext);
    //TODO change Test Cases to use Security Tokens for User related Queries
    //Then have exception list only for end points which do not need security.
    returned =
      returned ||
      req.originalUrl.indexOf("login") > 0 ||
      req.originalUrl.indexOf("user") > 0;
    return returned;
  })
);

/*START MongoDB */
mongoose.Promise = global.Promise;
mongoose
  //.connect("mongodb://localhost/bookface")
  .connect(config.database)
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

/*Upload Files as needed */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'client/images')
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').slice(-1)[0];
    cb(null, file.fieldname + '-' + Date.now() + `.${extension}`);
  }
});
var upload = multer({
  storage: storage
});

app.post('/api/book', upload.single('picture'), function (req, res, next) {
  console.log('File Upload...', req.file);
  req.body.picture = req.file.filename
  next();
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});

/*START Rest End Point Routes*/
const AUTHOR = "authors";
//app.use(`/${AUTHOR}`, authors);
//app.use(authors);
/*var Resource = app.resource = restful.model('resource', Author)
  .methods(['get', 'post', 'put', 'delete']);

Resource.register(app, '/authors');*/
app.use("/api", authors);
app.use("/api", bookRouter);
//app.use("/api", loginRouter);
app.use("/api", userRouter);
app.use("/user", userController);
app.use("/api", commentRouter);
/*END of End Point Routes*/

/*START Views*/
app.get("/", (req, res) => {
  User.findOne({
      _id: req.user._id
    }).populate({
      path: 'favouriteBooks',
      populate: {
        path: 'authors'
      }
    })
    .then(user => {
      console.log('returned user...', user.favouriteBooks);
      res.render("index", {
        user: user,
        favouriteBooks: user.favouriteBooks
      });
    });

});

app.get("/books", (req, res) => {
  Book.find({}).populate('authors').exec(function (error, data) {
    //Mark favourite books here.
    var userFavouriteBooks;
    User.findById(req.user._id, (err, doc) => {
      userFavouriteBooks = doc.favouriteBooks;

      console.log('Users Favourites', userFavouriteBooks)
      res.render("books/books", {
        books: data,
        users_favourites: userFavouriteBooks
      });
    });
  })
});

app.get("/book/:id", (req, res) => {
  console.log("Getting Book By ID");
  console.log('Param ID', req.param('id'));
  Book.findById(req.param('id')).populate('authors').then(book => {
    return book;
  }).then(book => {
    Comment.find({
      book: book
    }).populate('authors').exec((error, comments) => {
      console.log('Found Comments', comments);
      res.render(`books/book`, {
        book: book,
        comments: comments
      });
    })
  });


});

app.get("/addbook", (req, res) => {
  /*Add at least one author to book [{}]*/
  res.render("books/addbook", {
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
    console.log("Authors Found Really:" + authors);
    if (error) next(error);
    else
      res.render("index", {
        data: authors
      });
  });
});
/*End of Views */

/*Middleware to catch all errors which are not managed.
Note that the signiture with the error at the beginning is needed. */
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Not Found"
  });
});

app.use((err, req, res, next) => {
  console.log(`Error Caught. Rendering Index -> ${err.message}`);

  if (err.status === 404) {
    return res.status(400).render("index", {
      messgages: "Sorry Page not found!"
    });
  }

  if (err.status === 500) {
    return res.status(500).render("index");
  }

  return res.status(400).render("index");
});

/*Only start server if not running tests */
if (require.main === module) {
  console.log("HEROKU PORT -> ", process.env.PORT)
  app.listen(process.env.PORT || config.port, config.ip, function () {
    console.log(
      "Express server listening on %d, in %s mode",
      config.port,
      app.get("env")
    );
  });
}

module.exports = app;