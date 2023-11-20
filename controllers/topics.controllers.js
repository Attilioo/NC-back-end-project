const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  console.log("FROM THE CONTROLLER");
  return selectTopics().then((data) => {
return res.status(200).send(data);
  });
};
