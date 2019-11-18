const knex = require("../db/connection");

exports.fetchArticleById = articleId => {
  return knex("articles")
    .select(
      "articles.author",
      "articles.topic",
      "articles.article_id",
      "articles.created_at",
      "articles.title",
      "articles.votes",
      "articles.body"
    )
    .where({ "articles.article_id": articleId })
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")

    .then(article => {
      return article;
    });
};

exports.patchArticleById = (articleId, newVotes = 0) => {
  return knex("articles")
    .where({ article_id: articleId })
    .increment("votes", newVotes)
    .returning("*")
    .then(article => {
      return article;
    });
};

exports.getArticlesMod = (order, sort_by, authorname, topicstr) => {
  return knex("articles")
    .select(
      "articles.author",
      "articles.topic",
      "articles.article_id",
      "articles.created_at",
      "articles.title",
      "articles.votes"
    )
    .modify(query => {
      if (authorname) {
        query.where("articles.author", "=", authorname);
      }
      if (topicstr) {
        query.where("articles.topic", "=", topicstr);
      }
    })
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")

    .then(articles => {
      return articles;
    });
};

exports.checkArtId = articleId => {
  return knex("articles")
    .select("*")
    .where({ article_id: articleId })
    .then(([article_id]) => {
      if (!article_id) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
    });
};
