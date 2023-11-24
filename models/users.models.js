const db = require("../db/connection");

exports.selectUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users")
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectUsersByUsername = (username) => {
  const queryString = `SELECT * FROM users WHERE username = $1`;

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  return db.query(queryString, [username]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "User does not exist",
      });
    }
    return rows;
  });
};
