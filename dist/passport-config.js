"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const models_1 = require("./models");
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://url-shortener-backend-5qi6.onrender.com/auth/users/google/callback",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, params, profile, done) => {
    try {
        let user = await models_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { google_id: profile.id },
                    { email: profile.emails[0].value },
                ],
            },
        });
        if (!user) {
            // Create a new user if they don't exist
            user = await models_1.User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                google_id: profile.id,
            });
        }
        else {
            // Optionally update existing user info
            user.username = profile.displayName;
            await user.save();
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://url-shortener-backend-5qi6.onrender.com/auth/users/github/callback",
    passReqToCallback: false,
    scope: ["user:email"],
}, async (_accessToken, _refreshToken, profile, done) => {
    var _a, _b;
    const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
    if (!email) {
        return done(new Error("Email not provided by GitHub profile"));
    }
    let user = await models_1.User.findOne({
        where: { [sequelize_1.Op.or]: [{ github_id: profile.id }, { email }] },
    });
    if (!user) {
        user = await models_1.User.create({
            username: profile.displayName,
            github_id: profile.id,
            email: email,
        });
    }
    else {
        user.username = profile.displayName;
        await user.save();
    }
    return done(null, user);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const user = await models_1.User.findByPk(id);
    done(null, user);
});
exports.default = passport_1.default;
