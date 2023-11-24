const { getUsers, getUsersByUsername } = require("../controllers/users.controllers");

const usersRouters = require("express").Router();

usersRouters.route("/").get(getUsers);

usersRouters.route("/:username").get(getUsersByUsername);

module.exports = usersRouters;
