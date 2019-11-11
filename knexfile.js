const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const dbConfig = {
  development: {
    client: "pg",
    connection: {
      database: "nc_news",
      username: "alexpj",
      password: "password"
    },
    seeds: {
      directory: "./db/seeds"
    },
    migrations: {
      directory: "./db/migrations"
    }
  },
  test: {
    client: "pg",
    connection: {
      database: "nc_news_test",
      username: "alexpj",
      password: "password"
    },
    seeds: {
      directory: "./db/seeds"
    },
    migrations: {
      directory: "./db/migrations"
    }
  },
  production: {
    client: "pg",
    connection: `${DB_URL}?ssl=true`,
    seeds: {
      directory: "./db/seeds"
    },
    migrations: {
      directory: "./db/migrations"
    }
  }
};

module.exports = dbConfig[ENV];
