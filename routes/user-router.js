const { getUsers } = require("../controllers/users.controllers");

const usersRouters = require("express").Router();

usersRouters.route("/").get(getUsers);

module.exports = usersRouters;
