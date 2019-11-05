const { fetchUserByName } = require("../models/users-models");

exports.getUserByName = (req, res, next) => {
  let userName = req.params.username;
  fetchUserByName(userName)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
