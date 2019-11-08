const {
  fetchArticleById,
  patchArticleById,
  postComToArtMod,
  getComsByIdMod,
  getArticlesMod
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  let articleId = req.params.article_id;
  if (!Number(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "article not valid"
    }).catch(next);
  } else {
    fetchArticleById(articleId)
      .then(article => {
        res.status(200).send(article[0]);
      })
      .catch(next);
  }
};

exports.patchArticles = (req, res, next) => {
  let articleId = req.params.article_id;
  let votes = req.body.inc_votes;
  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: "patch must include valid inc_votes"
    }).catch(next);
  } else {
    patchArticleById(articleId, votes)
      .then(article => {
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.postComToArt = (req, res, next) => {
  let articleId = req.params.article_id;
  let comment = req.body;
  if (!Number(articleId)) {
    return Promise.reject({ status: 400, msg: "article not valid" }).catch(
      next
    );
  } else {
    if (
      Number(articleId) &&
      (Number(articleId) > 12 || Number(articleId) < 1)
    ) {
      return Promise.reject({ status: 404, msg: "article not found" }).catch(
        next
      );
    } else {
      postComToArtMod(articleId, comment)
        .then(comment => {
          res.status(201).send({ comment });
        })
        .catch(next);
    }
  }
};

exports.getComsById = (req, res, next) => {
  let articleId = req.params.article_id;
  const sort_by = req.query.sort_by;
  if (
    sort_by &&
    (sort_by !== "author" &&
      sort_by !== "topic" &&
      sort_by !== "title" &&
      sort_by !== "article_id" &&
      sort_by !== "created_at" &&
      sort_by !== "votes" &&
      sort_by !== "comment_count")
  ) {
    return Promise.reject({
      status: 400,
      msg: "sort_by column not found"
    }).catch(next);
  } else {
    if (!Number(articleId)) {
      return Promise.reject({
        status: 400,
        msg: "article not valid"
      }).catch(next);
    } else {
      getComsByIdMod(articleId, req.query.order, req.query.sort_by)
        .then(comments => {
          res.status(200).send(comments);
        })
        .catch(next);
    }
  }
};

exports.getArticles = (req, res, next) => {
  const sort_by = req.query.sort_by;
  if (
    sort_by &&
    (sort_by !== "author" &&
      sort_by !== "topic" &&
      sort_by !== "title" &&
      sort_by !== "article_id" &&
      sort_by !== "created_at" &&
      sort_by !== "votes" &&
      sort_by !== "comment_count")
  ) {
    return Promise.reject({
      status: 400,
      msg: "sort_by column not found"
    }).catch(next);
  } else {
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
  }
};
