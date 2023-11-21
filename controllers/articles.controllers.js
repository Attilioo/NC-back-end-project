const {
  selectArticleById,
  selectArticles,
} = require("../models/articles.models");

exports.getArticlebyId = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      return res.status(200).send(article[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  return selectArticles().then((articlesArray) => {
    return res.status(200).send(articlesArray);
  });
};
