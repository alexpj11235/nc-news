const knex = require("../db/connection");

exports.fetchTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .then(topics => {
      return topics;
    });
};
