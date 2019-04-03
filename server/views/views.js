var Comment = require("../models/comment");
var Book = require("../models/book");
var express = require("express");
var router = express.Router();
var User = require("../models/user");

/*START Views*/
router.get("/", (req, res) => {

  User.findOne({
      _id: req.user._id
    }).populate({
      path: 'favouriteBooks',
      populate: {
        path: 'authors'
      }
    })
    .then(user => {
      console.log('returned user before getting comments...', user);
      Comment.find({
        book: user.favouriteBooks
      }, {
        limit: 10
      }).sort({
        created_at: 'desc'
      }).populate(['user', 'book']).select(['comment', 'created_at']).exec((error, comments) => {
        console.log('returned comments...', comments);
        console.log('returned user...', user.favouriteBooks);

        Book.find({}, {
          limit: 10
        }).sort({
          created_at: 'desc'
        }).select(['title', 'picture', '_id']).exec((error, books) => {
          res.render("index", {
            logged_in_user: user,
            favouriteBooks: user.favouriteBooks,
            latestComments: comments,
            books: books
          });
        });
      });
    });

});

router.get("/books", (req, res) => {
  Book.find({}).populate('authors').exec(function (error, data) {
    //Mark favourite books here.
    var userFavouriteBooks;
    User.findById(req.user._id, (err, doc) => {
      userFavouriteBooks = doc.favouriteBooks;

      console.log('Users Favourites', userFavouriteBooks)
      res.render("books/books", {
        books: data,
        users_favourites: userFavouriteBooks,
        logged_in_user: req.user
      });
    });
  })
});

router.get("/book/:id", (req, res) => {
  console.log("Getting Book By ID");
  console.log('Param ID', req.param('id'));
  Book.findById(req.param('id')).populate('authors').then(book => {
    return book;
  }).then(book => {
    Comment.find({
      book: book
    }).populate('user').exec((error, comments) => {
      console.log('Found Comments', comments);
      res.render(`books/book`, {
        book: book,
        comments: comments,
        logged_in_user: req.user
      });
    })
  });


});

router.get("/logout", (req, res) => {
  res.clearCookie("x_access_token");
  res.render("/");
});

router.get("/addbook", (req, res) => {
  /*Add at least one author to book [{}]*/
  res.render("books/addbook", {
    authors: [{}],
    logged_in_user: req.user
  });
});

router.get("/about", (req, res) => {
  console.log('About from Views...')
  res.render("about", {
    authors: [{}],
    logged_in_user: req.user
  });
});

router.get("/diagrams", (req, res) => {
  res.render("diagrams", {
    diagrams: [{
      title: "Database Diagram",
      url: "/diagrams/database/Database_Diagram.svg"
    }],
    logged_in_user: req.user
  });
});

router.get("/profile/:id", (req, res, next) => {
  console.log('Getting profile with id')
  const user_id = req.params.id && req.params.id !== '' ? req.params.id : req.user._id;
  req.params.id = user_id;

  ProcessProfile(req, res);
});

router.get("/profile", (req, res) => {
  console.log('Getting Profile for user id...', req.user._id);
  req.params.id = req.user._id;
  ProcessProfile(req, res);
});

function ProcessProfile(req, res) {
  User.findOne({
    _id: req.params.id
  }).then(user => {
    res.render("user/view-user", {
      logged_in_user: user
    });
  });
}

router.get("/show_authors", (req, res) => {
  Author.find((error, authors) => {
    console.log("Authors Found Really:" + authors);
    if (error) next(error);
    else
      res.render("index", {
        data: authors,
        logged_in_user: req.user
      });
  });
});

router.get("/profiles", (req, res) => {
  console.log('Getting Users...')
  User.find((error, users) => {
    if (error) {
      next(error);
    } else {
      console.log('Users...', users)
      res.render("user/users", {
        users: users,
        logged_in_user: req.user
      });
    }
  });
});


router.get("/profile/:id/edit", (req, res, next) => {
  console.log('Logged in Request', req)
  User.findOne({
    _id: req.params.id
  }, (error, user) => {
    if (error) {
      next(error);
    } else {
      console.log('User...', user)
      console.log('Logged in ...', req.user)
      res.render("user/user", {
        user: user,
        logged_in_user: req.user
      });
    }
  });
});
/*End of Views */

module.exports = router;