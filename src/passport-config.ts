import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { User } from "./models";
import dotenv from "dotenv";
import { Request } from "express";
import { Op } from "sequelize";

dotenv.config();

// a custom VerifyCallback type
type VerifyCallback = (error: Error | null, user?: any, options?: any) => void;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        "https://url-shortener-backend-5qi6.onrender.com/auth/users/google/callback",

      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      params: any,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        let user = await User.findOne({
          where: {
            [Op.or]: [{ google_id: profile.id }],
          },
        });

        if (!user) {
          // Create a new user if they don't exist
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            google_id: profile.id,
          });
        } else {
          // Optionally update existing user info
          user.username = profile.displayName;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL:
        "https://url-shortener-backend-5qi6.onrender.com/auth/users/github/callback",
      passReqToCallback: false,
      scope: ["user:email"],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("Email not provided by GitHub profile"));
      }

      let user = await User.findOne({
        where: { [Op.or]: [{ github_id: profile.id }] },
      });
      if (!user) {
        user = await User.create({
          username: profile.displayName,
          github_id: profile.id,
          email: email,
        });
      } else {
        user.username = profile.displayName;
        await user.save();
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done: (error: null, id?: any) => void) => {
  done(null, user.id);
});

passport.deserializeUser(
  async (id: number, done: (error: null, user?: any) => void) => {
    const user = await User.findByPk(id);
    done(null, user);
  }
);

export default passport;
