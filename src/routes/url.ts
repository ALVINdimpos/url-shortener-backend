import { Router } from "express";
import {
  shortenUrl,
  getUrlByShortCode,
  deleteUrlByShortCode,
  updateUrlByShortCode,
  getAllUrlsForUser,
  getUrlStatsByShortCode,
} from "../controllers/url.controller";
import { isLoggedIn } from "../middleware/is_loggedin";

const router = Router();

// Shorten a URL
router.post("/shorten", isLoggedIn, shortenUrl);

// Get URL by short code
router.get("/:short_code", getUrlByShortCode);

// Delete URL by short code
router.delete("/:short_code", isLoggedIn, deleteUrlByShortCode);

// Update URL by short code
router.patch("/:short_code", isLoggedIn, updateUrlByShortCode);

// Get all URLs for a user
router.get("/", isLoggedIn, getAllUrlsForUser);

// Get URL stats by short code
router.get("/stats/:short_code", isLoggedIn, getUrlStatsByShortCode);

export default router;
