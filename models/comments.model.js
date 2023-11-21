const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  let queryString =
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 400,
        msg: "Article not existent",
      });
    }
    return rows;
  });
};
