const { removeCommentById } = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(removeCommentById);
module.exports = commentsRouter;
