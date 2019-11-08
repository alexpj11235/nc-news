const topicsRouter = require("express")();

const { getTopics } = require("../controllers/topics-controllers");
const { handle405 } = require("../errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405);

module.exports = topicsRouter;
