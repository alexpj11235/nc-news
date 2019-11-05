const usersRouter = require("express")();

const { getUserByName } = require("../controllers/users-controller");

usersRouter.route("/:username").get(getUserByName);

module.exports = usersRouter;
