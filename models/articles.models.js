const { response } = require("../app");
const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let queryString = "SELECT * FROM articles WHERE article_id=$1";
  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request",
      });
    }
    return rows;
  });
};

exports.selectArticles = () => {
  let queryString =
    "SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;";
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticle = (body, article_id) => {
  const incomingVotes = body.inc_votes;
  const valuesArray = [incomingVotes, article_id];
  const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  return db.query(queryString, valuesArray).then(({ rows }) => {
    return rows;
  });
};
