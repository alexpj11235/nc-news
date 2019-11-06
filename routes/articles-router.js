const articlesRouter = require("express")();

const {
  getArticleById,
  patchArticles,
  postComToArt
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticles);

articlesRouter.route("/:article_id/comments").post(postComToArt);

module.exports = articlesRouter;
