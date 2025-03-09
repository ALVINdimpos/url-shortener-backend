"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = exports.User = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const url_1 = require("./url");
Object.defineProperty(exports, "Url", { enumerable: true, get: function () { return url_1.Url; } });
const config_js_1 = __importDefault(require("../config/config.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// LOAD ENV VARIABLES
const { DATABASE_URL } = process.env;
exports.sequelize = new sequelize_typescript_1.Sequelize((_a = config_js_1.default === null || config_js_1.default === void 0 ? void 0 : config_js_1.default.development) === null || _a === void 0 ? void 0 : _a.url, {
    dialect: "postgres",
    dialectOptions: {
        ssl: (DATABASE_URL === null || DATABASE_URL === void 0 ? void 0 : DATABASE_URL.includes("localhost")) ? false : {
            require: true,
            rejectUnauthorized: false,
        },
    },
    define: {
        underscored: true,
        timestamps: true,
    },
    models: [user_1.User, url_1.Url],
    logging: false,
});
