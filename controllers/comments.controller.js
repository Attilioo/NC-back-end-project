const { selectCommentsByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id);

  return selectCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
