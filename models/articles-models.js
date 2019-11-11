const knex = require("../db/connection");

exports.fetchArticleById = articleId => {
  const article_Ids = knex("articles")
    .returning("article_id")
    .select("article_id")
    .then(article_ids => {
      return article_ids.map(article => {
        return article.article_id;
      });
    });
  const articleArr = knex("articles")
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
  const fetchArticleByIdPromises = [article_Ids, articleArr];

  return Promise.all(fetchArticleByIdPromises);
};

exports.patchArticleById = (articleId, newVotes) => {
  const articleArr = knex("articles")
    .where({ article_id: articleId })
    .increment("votes", newVotes)
    .returning("*")
    .then(article => {
      return article;
    });
  const article_Ids = knex("articles")
    .returning("article_id")
    .select("article_id")
    .then(article_ids => {
      return article_ids.map(article => {
        return article.article_id;
      });
    });
  const patchArticlesPromises = [article_Ids, articleArr];

  return Promise.all(patchArticlesPromises);
};

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
  const article_Ids = knex("articles")
    .returning("article_id")
    .select("article_id")
    .then(article_ids => {
      return article_ids.map(article => {
        return article.article_id;
      });
    });

  const comments = knex("comments")
    .where({ article_id: articleId })
    .returning("*")
    .orderBy(query || "created_at", order || "desc")
    .then(comments => {
      return comments;
    });
  const comsPromises = [article_Ids, comments];

  return Promise.all(comsPromises);
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
      if (articles.length === 0 && topicstr) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      }
      if (articles.length === 0 && authorname) {
        return Promise.reject({ status: 404, msg: "author not found" });
      } else {
        return articles;
      }
    });
};
