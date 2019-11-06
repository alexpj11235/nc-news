const articlesRouter = require("express")();

const { getArticleById } = require("../controllers/articles-controllers");

articlesRouter.route("/:article_id").get(getArticleById);

module.exports = articlesRouter;
