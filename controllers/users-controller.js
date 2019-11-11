const { fetchUserByName } = require("../models/users-models");

exports.getUserByName = (req, res, next) => {
  let userName = req.params.username;
  fetchUserByName(userName)
    .then(([user_names, user]) => {
      if (!user_names.includes(userName)) {
        return Promise.reject({
          status: 404,
          msg: `No user found for user_name: ${userName}`
        });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};
