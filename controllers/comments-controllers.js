const {
  patchCommentByIdMod,
  deleteCommentMod,
  checkComId,
  postComToArtMod,
  getComsByIdMod
} = require("../models/comments-models");
const { checkArtId } = require("../models/articles-models");

exports.postComToArt = (req, res, next) => {
  let articleId = req.params.article_id;
  let comment = req.body;

  postComToArtMod(articleId, comment)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.getComsById = (req, res, next) => {
  let articleId = req.params.article_id;
  const sort_by = req.query.sort_by;
  Promise.all([
    getComsByIdMod(articleId, req.query.order, req.query.sort_by),
    checkArtId(articleId)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  let commentId = req.params.comment_id;
  let votes = req.body.inc_votes;
  Promise.all([patchCommentByIdMod(commentId, votes), checkComId(commentId)])
    .then(([comment]) => {
      res.status(200).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  let commentId = req.params.comment_id;

  Promise.all([deleteCommentMod(commentId), checkComId(commentId)])
    .then(() => {
      res.status(204).send();
    })

    .catch(next);
};
