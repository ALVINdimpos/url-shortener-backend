import "reflect-metadata";
import express from "express";
import cors from "cors";
import session, { SessionOptions } from "express-session";
import passport from "./passport-config";
import authRoutes from "./routes/auth";
import urlRoutes from "./routes/url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { sequelize } from "./models";
import cookieParser from "cookie-parser";

// Express session options
declare module "express-session" {
  interface SessionData {
    passport: { user: number };
  }
}

const app = express();

// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts", "./src/swagger-docs.ts"],
};

// CORS options
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// JSON parser
app.use(express.json());

// URL encoded parser
app.use(express.urlencoded({ extended: true }));

// Session config
const sessionConfig: SessionOptions = {
  secret: process.env.SESSION_SECRET || "",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Session middleware
app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });

// Swagger specs
const specs = swaggerJsdoc(swaggerOptions);

// Auth routes
app.use("/auth/users", authRoutes);

// API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// URL routes
app.use("/urls", urlRoutes);

const PORT = process.env.PORT || 3000;

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
