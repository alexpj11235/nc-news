const {
  fetchArticleById,
  patchArticleById,
  postComToArtMod,
  getComsByIdMod,
  getArticlesMod
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  let articleId = req.params.article_id;

  fetchArticleById(articleId)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`
        });
      }
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.patchArticles = (req, res, next) => {
  let articleId = req.params.article_id;
  let votes = req.body.inc_votes;

  patchArticleById(articleId, votes)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  getArticlesMod(
    req.query.order,
    req.query.sort_by,
    req.query.author,
    req.query.topic
  )
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
