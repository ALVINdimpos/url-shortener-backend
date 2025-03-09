"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: ".env.test" });
// Configure test environment
process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
    "postgres://postgres:postgres@localhost:5432/url_shortener_test";
process.env.SESSION_SECRET = "test-secret";
process.env.JWT_SECRET = "test-jwt-secret";
