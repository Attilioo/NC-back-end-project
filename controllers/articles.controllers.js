const { selectArticleById } = require("../models/articles.models");

exports.getArticlebyId = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};


exports.getArticles