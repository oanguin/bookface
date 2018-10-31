var express = require("express");
var router = express.Router();

/*Author Rleated Endpoints - Will need to be moved later*/

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
router.param("id", (req, res, next, id) => {
  let index = _.findIndex(authors, {
    id: req.params.id
  });
  req.author = authors[index];
  next();
});

router.get("/", (req, res) => {
  res.statusCode = 200;
  res.json(authors);
});

/*Use updateId function to add id to req.body */
router.post("/", updateId, (req, res) => {
  let author = req.body;

  authors.push(author);
  res.statusCode = 200;
  res.send(author);
});

router.patch("/:id", (req, res) => {
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

/*Start Views */
router.get("/test-template", (req, res) => {
  res.render("index", { data: authors });
});
/*End Views */

module.exports = router;
/*End of Author Rleated Endpoints*/
