import { Sequelize } from "sequelize-typescript";
import { User } from "./user";
import { Url } from "./url";
import config from "../config/config.js";

export const sequelize = new Sequelize(config?.development?.url, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
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
