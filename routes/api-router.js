const apiRouter = require("express")();

const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
