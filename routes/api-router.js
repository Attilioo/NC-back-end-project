const { getApi } = require("../controllers/general.controllers");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouters = require("./user-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getApi);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouters);

module.exports = apiRouter;
