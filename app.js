const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/general.controllers");
const {
  getArticlebyId,
  getArticles,
} = require("./controllers/articles.controllers");
const { getCommentsByArticleId } = require("./controllers/comments.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticlebyId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

const handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};
const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
module.exports = app;
