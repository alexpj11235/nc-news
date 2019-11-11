const knex = require("../db/connection");

exports.patchCommentsByIdMod = (commentId, newVotes) => {
  return knex("comments")
    .where({ comment_id: commentId })
    .increment("votes", newVotes)
    .returning("*")
    .then(comment => {
      return comment;
    });
};

exports.checkComId = commentId => {
  return knex("comments")
    .returning("comment_id")
    .select("comment_id")
    .then(comment_ids => {
      return comment_ids.map(comment => {
        return comment.comment_id;
      });
    });
};

exports.deleteCommentMod = commentId => {
  return knex("comments")
    .where({ comment_id: commentId })
    .returning("*")
    .del()
    .then(res => {
      return res;
    });
};
