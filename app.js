const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/general.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

module.exports = app;
