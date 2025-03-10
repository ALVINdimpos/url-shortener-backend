import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

declare module "express" {
  interface Request {
    user?: User;
  }
}

export const isLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as User;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
