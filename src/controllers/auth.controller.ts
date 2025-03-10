import { Request, Response } from "express-serve-static-core";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { generateToken } from "../utils/jwt";
import {
  create_user_service,
  login_user_service,
  get_all_users_service,
  get_user_by_id_service,
  update_user_by_id_service,
  delete_user_by_id_service,
} from "../services/auth.services";
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

// Login a user
export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await login_user_service(email, password);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });
    res.json({ data: { token }, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a user
export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password, username } = req.body;

  try {
    const user = await create_user_service(email, password, username);
    if (!user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    res.status(201).json({ data: user, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await get_all_users_service();
  res.json({ data: users, message: "Users fetched successfully" });
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  const user = await get_user_by_id_service(req.params.id);
  if (user) {
    res.json({ data: user, message: "User fetched successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Update a user by ID
export const updateUserById = async (req: Request, res: Response) => {
  const user = await update_user_by_id_service(req.params.id, req.body);
  if (user) {
    res.json({ data: user, message: "User updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  const user = await delete_user_by_id_service(req.params.id);
  if (user) {
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Error logging out" });
    res.status(204).json({ message: "Logged out successfully" });
  });
};
