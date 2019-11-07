const knex = require("../db/connection");

exports.fetchUserByName = userName => {
  return knex("users")
    .where({ username: userName })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      } else {
        return user;
      }
    });
};
