const usersRouter = require("express")();

const { getUserByName } = require("../controllers/users-controller");
const { handle405 } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserByName)
  .all(handle405);

module.exports = usersRouter;
