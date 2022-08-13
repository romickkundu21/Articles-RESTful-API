const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const articleschema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleschema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticle) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticle);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching found.");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Succesfully updated article");
        } else {
          res.send("Error in updating");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Succesfully updated article");
        } else {
          res.send("Error in updating");
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
      if (!err) {
        res.send("Succesfully deleted article");
      } else {
        res.send("Error in deleting");
      }
    })
  })

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
