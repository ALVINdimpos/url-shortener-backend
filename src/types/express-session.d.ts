import "express-session";
import { User } from "../models";

declare module "express-session" {
  interface SessionData {
    returnTo: string;
  }
}

declare module "express" {
  interface Request {
    user?: User;
  }
}
