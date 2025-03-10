// Services for authentication

import { User } from "../models";
import bcrypt from "bcryptjs";
// Create a user
export const create_user_service = async (
  email: string,
  password: string,
  username: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ email, password: hashedPassword, username });
};
// Login a user
export const login_user_service = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid password");

  return user;
};
// Get all users
export const get_all_users_service = async () => {
  return await User.findAll();
};
// Get a user by id
export const get_user_by_id_service = async (id: string) => {
  return await User.findByPk(id);
};
// Update a user by id
export const update_user_by_id_service = async (id: string, userData: User) => {
  return await User.update(userData, { where: { id } });
};
// Delete a user by id
export const delete_user_by_id_service = async (id: string) => {
  return await User.destroy({ where: { id } });
};
// Get a user by email
export const get_user_by_email_service = async (email: string) => {
  return await User.findOne({ where: { email } });
};
// Get a user by username
export const get_user_by_username_service = async (username: string) => {
  return await User.findOne({ where: { username } });
};
