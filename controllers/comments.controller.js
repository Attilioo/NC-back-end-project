const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentById,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return selectCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  return insertCommentByArticleId(body, article_id)
    .then((comment) => {
      res.status(201).send(comment[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return deleteCommentById(comment_id)
    .then((response) => {
      return res.status(204).send(response);
    })
    .catch((err) => {
      next(err);
    });
};
