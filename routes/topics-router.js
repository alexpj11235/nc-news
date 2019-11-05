const topicsRouter = require("express")();

const { getTopics } = require("../controllers/topics-controllers");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
