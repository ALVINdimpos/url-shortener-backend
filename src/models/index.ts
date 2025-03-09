import { Sequelize } from "sequelize-typescript";
import { User } from "./user";
import { Url } from "./url";
import config from "../config/config.js";
import dotenv from "dotenv";

dotenv.config();

// LOAD ENV VARIABLES
const { DATABASE_URL } = process.env;

export const sequelize = new Sequelize(config?.development?.url, {
  dialect: "postgres",
  dialectOptions: {
    ssl: DATABASE_URL?.includes("localhost") ? false : {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    underscored: true,
    timestamps: true,
  },
  models: [User, Url],
  logging: false,
});

export { User, Url };
