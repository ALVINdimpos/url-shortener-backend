import { verifyToken } from "../utils/jwt";
import { User } from "../models";
import { RequestHandler } from "express";

// Extend Express Request
declare module "express" {
  interface Request {
    user?: User;
  }
}

interface JwtPayload {
  id: string;
  email: string;
}

export const isLoggedIn: RequestHandler = (req, res, next): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const decoded = verifyToken(token) as JwtPayload;
  if (!decoded) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.user = decoded as unknown as User;
  next();
};
