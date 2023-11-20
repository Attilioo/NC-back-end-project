const db = require("../db/connection");

exports.selectTopics = () => {
  let queryString = "SELECT * FROM topics";
  const extraQueries = [];

  return db
    .query(queryString, extraQueries)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject({
        status: 400,
        msg: "Wrong Input",
      });
    });
};
