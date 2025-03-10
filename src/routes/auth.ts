import { Router } from "express";
import { body } from "express-validator";
import passport, { session } from "passport";
import asyncHandler from "express-async-handler";
import { isLoggedIn } from "../middleware/is_loggedin";
import {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  logoutUser,
} from "../controllers/auth.controller";
import { generateToken } from "../utils/jwt";
import { User } from "../models";

declare module "express-session" {
  interface Session {
    returnTo?: string;
  }
}
const router = Router();

// Google Authentication Route
router.get(
  "/google",
  (req, res, next) => {
    const redirect_url =
      typeof req.query.redirect_url === "string"
        ? req.query.redirect_url
        : undefined;
    req.session.returnTo = redirect_url || `${process.env.CLIENT_URL}/urls`;
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google Authentication Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`,
    session: true,
  }),
  (req, res) => {
    const user = req.user as User;
    const token = generateToken({ id: user?.id, email: user?.email });
    const returnTo = req.session.returnTo || `${process.env.CLIENT_URL}/urls`;
    delete req.session.returnTo;
    res.redirect(`${returnTo}?token=${token}`);
  }
);

// GitHub Authentication Route
router.get(
  "/github",
  (req, res, next) => {
    const redirect_url =
      typeof req.query.redirect_url === "string"
        ? req.query.redirect_url
        : undefined;
    req.session.returnTo = redirect_url || `${process.env.CLIENT_URL}/urls`;
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub Authentication Callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=github_auth_failed`,
    session: true,
  }),
  (req, res) => {
    const user = req.user as User;
    const token = generateToken({ id: user?.id, email: user?.email });
    const returnTo = req.session.returnTo || `${process.env.CLIENT_URL}/urls`;
    delete req.session.returnTo;
    res.redirect(`${returnTo}?token=${token}`);
  }
);
// Logout
router.get("/logout", (req, res) => {
  logoutUser(req, res);
});

// Login a user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  asyncHandler(loginUser)
);

// Create a user
router.post(
  "/",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("username").notEmpty().withMessage("Username is required"),
  ],
  asyncHandler(createUser)
);

// Get all users (Authenticated)
router.get("/", isLoggedIn, asyncHandler(getAllUsers));

// Get a user by id (Authenticated)
router.get("/:id", isLoggedIn, asyncHandler(getUserById));

// Update a user by id (Authenticated)
router.put("/:id", isLoggedIn, asyncHandler(updateUserById));

// Delete a user by id (Authenticated)
router.delete("/:id", isLoggedIn, asyncHandler(deleteUserById));

export default router;
