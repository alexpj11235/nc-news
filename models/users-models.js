const knex = require("../db/connection");

exports.fetchUserByName = userName => {
  return knex("users").where({ username: userName });
};
