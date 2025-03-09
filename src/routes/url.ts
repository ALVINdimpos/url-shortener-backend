import { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Url, User } from "../models";
import { v4 as uuidv4 } from "uuid";
import { isLoggedIn } from "../middleware/is_loggedin";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

const router = Router();

// Shorten a URL
router.post(
  "/shorten",
  isLoggedIn,
  asyncHandler(async (req: Request, res: Response) => {
    const { long_url } = req.body;
    const short_code = uuidv4().substring(0, 6);
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const url = await Url.create({
      long_url,
      short_code,
      user_id,
    });

    res.status(201).json({
      data: url,
      message: "URL shortened successfully",
    });
  })
);

// Get URL by short code
router.get(
  "/:short_code",
  asyncHandler(async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const url = await Url.findOne({ where: { short_code } });

    if (url) {
      // Increment clicks
      url.clicks = (url.clicks || 0) + 1;
      await url.save();

      res.status(200).json({
        data: url,
        message: "URL found successfully",
      });
    } else {
      res.status(404).json({
        message: "URL not found",
      });
    }
  })
);

// Delete URL by short code
router.delete(
  "/:short_code",
  isLoggedIn,
  asyncHandler(async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const url = await Url.findOne({
      where: {
        short_code,
        user_id: req.user?.id,
      },
    });

    if (url) {
      await url.destroy();
      res.status(200).json({
        message: "URL deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "URL not found",
      });
    }
  })
);

// Update URL by short code
router.put(
  "/:short_code",
  isLoggedIn,
  asyncHandler(async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const { long_url } = req.body;
    const url = await Url.findOne({
      where: {
        short_code,
        user_id: req.user?.id,
      },
    });

    if (url) {
      url.long_url = long_url;
      await url.save();
      res.status(200).json({
        data: url,
        message: "URL updated successfully",
      });
    } else {
      res.status(404).json({
        message: "URL not found",
      });
    }
  })
);

// Get all URLs for a user
router.get(
  "/",
  isLoggedIn,
  asyncHandler(async (req: Request, res: Response) => {
    const urls = await Url.findAll({
      where: { user_id: req.user?.id },
    });

    res.status(200).json({
      data: urls,
      message: "URLs fetched successfully",
    });
  })
);

// Get URL stats by short code
router.get(
  "/stats/:short_code",
  isLoggedIn,
  asyncHandler(async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const url = await Url.findOne({ where: { short_code } });

    if (url) {
      res.status(200).json({
        data: {
          short_code: url.short_code,
          long_url: url.long_url,
          clicks: url.clicks,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt,
        },
        message: "URL stats fetched successfully",
      });
    } else {
      res.status(404).json({
        message: "URL not found",
      });
    }
  })
);

export default router;
