const commentsRouter = require("express")();

const {
  patchCommentById,
  deleteComment
} = require("../controllers/comments-controllers");
const { handle405 } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteComment)
  .all(handle405);

module.exports = commentsRouter;
