const articlesRouter = require("express")();

const {
  getArticleById,
  patchArticles,
  postComToArt,
  getComsById,
  getArticles
} = require("../controllers/articles-controllers");
const { handle405 } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticles)
  .all(handle405);

articlesRouter
  .route("/:article_id/comments")
  .post(postComToArt)
  .get(getComsById)
  .all(handle405);

articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405);

module.exports = articlesRouter;
