const { selectAPI } = require("../models/general.models");

exports.getApi = (req, res, next) => {
  return selectAPI().then((response) => {
    return res.status(200).send(response);
  });
};
