import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  shorten_url_service,
  get_url_by_short_code_service,
  get_all_urls_for_user_service,
  get_url_stats_by_short_code_service,
  delete_url_by_short_code_service,
  update_url_by_short_code_service,
} from "../services/url.services";
import { Url } from "../models";
import { getPagination, getPagingData } from "../utils/pagination";
// Shorten a URL
export const shortenUrl = asyncHandler(async (req: Request, res: Response) => {
  const { long_url } = req.body;
  const user_id = req.user?.id;
  console.log(user_id);
  if (!user_id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const url = await shorten_url_service(long_url, user_id);
    res.status(201).json({
      data: url,
      message: "URL shortened successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get URL by short code
export const getUrlByShortCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const url = await get_url_by_short_code_service(short_code);

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
  }
);

// Delete URL by short code
export const deleteUrlByShortCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const url = await Url.findOne({ where: { short_code, user_id } });
    if (!url) {
      res.status(404).json({ message: "URL not found or not owned by user" });
      return;
    }

    await delete_url_by_short_code_service(short_code);
    res.status(200).json({ message: "URL deleted successfully" });
  }
);

// Update URL by short code
export const updateUrlByShortCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const { long_url } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const url = await Url.findOne({ where: { short_code, user_id } });
    if (!url) {
      res.status(404).json({ message: "URL not found or not owned by user" });
      return;
    }

    await update_url_by_short_code_service(short_code, { long_url });
    res.status(200).json({ message: "URL updated successfully" });
  }
);

// Get all URLs for a user
export const getAllUrlsForUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.user?.id;
    if (!user_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const urls = await get_all_urls_for_user_service(user_id);

    res.status(200).json({
      data: urls,
      message: "URLs fetched successfully",
    });
  }
);

// Get URL stats by short code
export const getUrlStatsByShortCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { short_code } = req.params;
    const url = await get_url_stats_by_short_code_service(short_code);

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
  }
);
