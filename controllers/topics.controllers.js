const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
