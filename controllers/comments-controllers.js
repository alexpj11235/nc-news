const {
  patchCommentsByIdMod,
  deleteCommentMod,
  checkComId
} = require("../models/comments-models");

exports.patchCommentsById = (req, res, next) => {
  let commentId = req.params.comment_id;
  let votes = req.body.inc_votes;

  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: "patch must include valid inc_votes"
    }).catch(next);
  } else {
    patchCommentsByIdMod(commentId, votes)
      .then(comment => {
        res.status(200).send({ comment });
      })
      .catch(next);
  }
};

exports.deleteComment = (req, res, next) => {
  let commentId = req.params.comment_id;
  checkComId(commentId)
    .then(commentIdArr => {
      if (!commentIdArr.includes(Number(commentId))) {
        if (Number(commentId)) {
          return Promise.reject({
            status: 404,
            msg: `No comment found for comment_id: ${commentId}`
          });
        }
      }
      if (!Number(commentId)) {
        return Promise.reject({
          status: 400,
          msg: `Bad request`
        });
      } else {
        deleteCommentMod(commentId).then(() => {
          res.status(204).send();
        });
      }
    })

    .catch(next);
};
