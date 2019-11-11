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
    .then(([articleIds, article]) => {
      if (!articleIds.includes(Number(articleId))) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`
        });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.patchArticles = (req, res, next) => {
  let articleId = req.params.article_id;
  let votes = req.body.inc_votes;
  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: `patch must include valid inc_votes`
    }).catch(next);
  } else {
    patchArticleById(articleId, votes)
      .then(([articleIds, articleArr]) => {
        if (articleIds.includes(Number(articleId))) {
          res.status(200).send({ article: articleArr });
        }
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`
        });
      })
      .catch(next);
  }
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
  const sort_by = req.query.sort_by;

  getComsByIdMod(articleId, req.query.order, req.query.sort_by)
    .then(([articleIdsArr, commentsArr]) => {
      if (!articleIdsArr.includes(Number(articleId))) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`
        });
      } else {
        return res.status(200).send({ comments: commentsArr });
      }
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
