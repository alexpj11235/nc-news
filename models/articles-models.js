const knex = require("../db/connection");

exports.fetchArticleById = articleId => {
  return knex("articles")
    .where({ article_id: articleId })
    .then(article => {
      return article;
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
