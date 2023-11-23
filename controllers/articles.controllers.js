const {
  selectArticleById,
  selectArticles,
  updateArticle,
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
  const { body } = req;
  const { article_id } = req.params;
  return selectArticles(body, article_id).then((articlesArray) => {
    return res.status(200).send(articlesArray);
  });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  return updateArticle(body, article_id)
    .then((updatedArticle) => {
      return res.status(200).send(updatedArticle);
    })
    .catch((err) => {
      next(err);
    });
};
