const knexMaker = require("knex");

const dbConfig = require("../knexfile");

const connection = knexMaker(dbConfig);

module.exports = connection;
