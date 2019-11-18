const knex = require("../db/connection");

exports.postComToArtMod = (articleId, comment) => {
  if (!comment.body || !comment.username) {
    return Promise.reject({
      status: 400,
      msg: "post must have username and body"
    });
  } else {
    return knex("comments")
      .insert({
        body: comment.body,
        author: comment.username,
        article_id: articleId
      })
      .returning("*")
      .then(comment => {
        return comment;
      });
  }
};

exports.getComsByIdMod = (articleId, order, query) => {
  return knex("comments")
    .where({ article_id: articleId })
    .returning("*")
    .orderBy(query || "created_at", order || "desc")
    .then(comments => {
      return comments;
    });
};

exports.patchCommentByIdMod = (commentId, newVotes) => {
  return knex("comments")
    .where({ comment_id: commentId })
    .increment("votes", newVotes)
    .returning("*")
    .then(res => {
      return res;
    });
};

exports.checkComId = commentId => {
  return knex("comments")
    .select("*")
    .where({ comment_id: commentId })
    .then(([comment_id]) => {
      if (!comment_id) {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      }
    });
};

exports.deleteCommentMod = commentId => {
  return knex("comments")
    .select("*")
    .where({ comment_id: commentId })
    .del();
};
