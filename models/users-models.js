const knex = require("../db/connection");

exports.fetchUserByName = userName => {
  const user_names = knex("users")
    .returning("username")
    .select("username")
    .then(userNames => {
      return userNames.map(user => {
        return user.username;
      });
    });
  const userArr = knex("users")
    .returning("*")
    .where({ username: userName })
    .then(user => {
      return user;
    });
  const fetchUserByNamePromises = [user_names, userArr];

  return Promise.all(fetchUserByNamePromises);
};
