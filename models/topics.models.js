const db = require("../db/connection");

exports.selectTopics = () => {
  let queryString = "SELECT * FROM topics";

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
