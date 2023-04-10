import * as dotenv from "dotenv";
dotenv.config({ path: "./../../.env" });

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";

import { getUserById, getUserByAuthId, saveUsers } from "../users/db";

//* https://www.passportjs.org/packages/passport-google-oauth20/

/**
 * OAuth Strategy Overview
 * 
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *   - Check if it's a new user.
 *     - Provide consent screen for login
 *     - Create a new account in Database
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      getUserByAuthId(profile.id)
        .then((activeUser: any) => {
          if (activeUser) {
            done(null, activeUser);
          } else {
            saveUsers({
              name: profile.displayName,
              authid: profile.id,
            }).then((newUser: any) => {
              done(null, newUser);
            });
          }
        })
        .catch((err) => done(err));
    }
  )
);

/**
 * To maintain a login session,
 * Passport serializes and deserializes user information to and from the session.
 * The information that is stored is determined by the application,
 * which supplies a serializeUser and a deserializeUser function.
 * 
 */

//* Here the serialize means, user id will be stored in the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

//* Here the deserialize means, id key from session is used to findout the user details
passport.deserializeUser((id: number, done) => {
  getUserById(id)
    .then((user: any) => {
      done(null, user);
    })
    .catch((err: any) => {
      done(err);
    });
});

/**
 * Login Required middleware.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/logout");
};
