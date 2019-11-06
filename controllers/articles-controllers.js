const {
  fetchArticleById,
  patchArticleById,
  postComToArtMod
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
