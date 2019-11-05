const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex
        .insert(topicData)
        .into("topics")
        .returning("*");
    })
    .then(() => {
      return knex
        .insert(userData)
        .into("users")
        .returning("*");
    })
    .then(() => {
      return knex
        .insert(formatDates(articleData))
        .into("articles")
        .returning("*");
    })
    .then(articles => {
      let artRef = makeRefObj(articles);
      return knex.insert(formatComments(commentData, artRef)).into("comments");
    });
};
