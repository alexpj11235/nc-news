const { patchCommentsByIdMod } = require("../models/comments-models");

exports.patchCommentsById = (req, res, next) => {
  console.log("got to contorller");
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
