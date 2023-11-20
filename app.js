const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

const handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
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
