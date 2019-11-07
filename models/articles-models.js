const knex = require("../db/connection");

exports.fetchArticleById = articleId => {
  return knex("articles")
    .where({ article_id: articleId })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return article;
      }
    })
    .then(article => {
      return knex("comments")
        .where({ article_id: article[0].article_id })
        .then(comments => {
          return [article[0], comments.length];
        })
        .then(article => {
          article[0].comment_count = article[1];

          return [article[0]];
        });
    });
};

exports.patchArticleById = (articleId, newVotes) => {
  return knex("articles")
    .where({ article_id: articleId })
    .increment("votes", newVotes)
    .returning("*")
    .then(article => {
      return article;
    })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return article;
      }
    });
};

exports.postComToArtMod = (articleId, comment) => {
  return knex("comments")
    .insert({
      body: comment.body,
      author: comment.username,
      article_id: articleId
    })
    .returning("*");
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

exports.getArticlesMod = (order, sort_by, authorname, topicstr) => {
  return knex("articles")
    .select("articles.*")
    .where(article => {
      if (authorname) {
        article.where("articles.author", "=", authorname);
      }
    })
    .where(article => {
      if (topicstr) {
        article.where("articles.topic", "=", topicstr);
      }
    })

    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")

    .then(articles => {
      articles.forEach(article => {
        delete article.body;
      });

      return articles;
    });
};
