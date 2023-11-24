const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();
app.use(express.json());

//ROUTED
app.use("/api", apiRouter);

const handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
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
