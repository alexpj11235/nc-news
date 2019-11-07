const articlesRouter = require("express")();

const {
  getArticleById,
  patchArticles,
  postComToArt,
  getComsById,
  getArticles
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticles);

articlesRouter
  .route("/:article_id/comments")
  .post(postComToArt)
  .get(getComsById);

articlesRouter.route("/").get(getArticles);

module.exports = articlesRouter;
