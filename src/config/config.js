require("dotenv").config();

const config = {
  development: {
    url:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/url_shortener_dev",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    url:
      process.env.TEST_DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/url_shortener_test",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = config;
