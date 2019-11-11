const commentsRouter = require("express")();

const {
  patchCommentsById,
  deleteComment
} = require("../controllers/comments-controllers");
const { handle405 } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsById)
  .delete(deleteComment)
  .all(handle405);

module.exports = commentsRouter;
