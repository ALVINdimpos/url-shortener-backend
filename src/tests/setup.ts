import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Configure test environment
process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  "postgres://postgres:postgres@localhost:5432/url_shortener_test";
process.env.SESSION_SECRET = "test-secret";
process.env.JWT_SECRET = "test-jwt-secret";
