const {
  selectUsers,
  selectUsersByUsername,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;
  return selectUsersByUsername(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};
