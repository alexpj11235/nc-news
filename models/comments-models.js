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
