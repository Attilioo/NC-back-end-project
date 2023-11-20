const format = require("pg-format");

const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("FROM THE MODEL");

  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};
