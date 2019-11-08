const commentsRouter = require("express")();

const { patchCommentsById } = require("../controllers/comments-controllers");
const { handle405 } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsById)
  .all(handle405);

module.exports = commentsRouter;
