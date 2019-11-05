const knex = require("../db/connection");

exports.fetchUserByName = userName => {
  return knex("users")
    .where({ username: userName })
    .then(user => {
      return user;
    });
};
