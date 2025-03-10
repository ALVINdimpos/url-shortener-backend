import { Strategy as PassportStrategy } from "passport";
import { Strategy } from "passport-google-oauth20";

declare module "passport-google-oauth20" {
  export interface Strategy extends PassportStrategy {}
}
