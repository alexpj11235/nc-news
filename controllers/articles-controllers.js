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
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticles = (req, res, next) => {
  let articleId = req.params.article_id;
  let votes = req.body.inc_votes;

  patchArticleById(articleId, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComToArt = (req, res, next) => {
  let articleId = req.params.article_id;
  let comment = req.body;
  postComToArtMod(articleId, comment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComsById = (req, res, next) => {
  let articleId = req.params.article_id;
  getComsByIdMod(articleId, req.query.order, req.query.sort_by)
    .then(comments => {
      res.status(200).send(comments);
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
      res.status(200).send(articles);
    })
    .catch(next);
};
