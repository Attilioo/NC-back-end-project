const { use } = require("../app");
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

exports.insertCommentByArticleId = (comment, article_id) => {
  let querystring = `INSERT INTO comments (body,article_id,author,votes) VALUES ($1,$2,$3,$4) RETURNING *`;
  const { body, username } = comment;
  const valuesArray = [body, article_id, username, 0];

  if (typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  return db.query(querystring, valuesArray).then(({ rows }) => {
    return rows;
  });
};
