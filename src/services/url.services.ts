import { Url } from "../models";
import { v4 as uuidv4 } from "uuid";
// Shorten a URL
export const shorten_url_service = async (
  long_url: string,
  user_id: string
) => {
  const short_code = uuidv4().substring(0, 6);
  return await Url.create({ long_url, short_code, user_id });
};

// Get a URL by short code
export const get_url_by_short_code_service = async (short_code: string) => {
  return await Url.findOne({ where: { short_code } });
};

// Get all URLs
export const get_all_urls_service = async () => {
  return await Url.findAll();
};

// Get all URLs for a user
export const get_all_urls_for_user_service = async (
  user_id: string,
  take: number,
  skip: number
) => {
  return await Url.findAndCountAll({
    where: { user_id },
    limit: take,
    offset: skip,
  });
};

// Get URL stats by short code
export const get_url_stats_by_short_code_service = async (
  short_code: string
) => {
  return await Url.findOne({ where: { short_code } });
};

// Delete a URL by short code
export const delete_url_by_short_code_service = async (short_code: string) => {
  return await Url.destroy({ where: { short_code } });
};

// Update a URL by short code
export const update_url_by_short_code_service = async (
  short_code: string,
  url_data: Partial<Url>
) => {
  return await Url.update(url_data, { where: { short_code } });
};
