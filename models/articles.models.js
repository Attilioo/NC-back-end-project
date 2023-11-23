const { response } = require("../app");
const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let queryString = `
  SELECT 
    articles.*, 
    COUNT(comments.comment_id) AS comment_count
  FROM 
    articles
  JOIN 
    comments ON articles.article_id = comments.article_id
  WHERE 
    articles.article_id = $1
  GROUP BY 
    articles.article_id
`;

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

exports.selectArticles = (topic) => {
  const checkTopicQuery = "SELECT * FROM topics WHERE slug = $1";
  return db
    .query(checkTopicQuery, [topic])
    .then(({ rows }) => {
      if (topic && rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Topic does not exist",
        });
      }

      const topicArray = [];
      let queryString =
        "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";

      if (topic) {
        queryString += " WHERE topic = $1";
        topicArray.push(topic);
      }

      queryString += " GROUP BY articles.article_id ORDER BY created_at DESC;";

      return db.query(queryString, topicArray);
    })
    .then(({ rows }) => {
      if (rows.length === 0) return [];
      return rows;
    });
};

exports.updateArticle = (body, article_id) => {
  const incomingVotes = body.inc_votes;
  const valuesArray = [incomingVotes, article_id];
  if (!incomingVotes) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  return db.query(queryString, valuesArray).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Not found",
      });
    }
    return rows;
  });
};
