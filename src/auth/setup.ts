import * as dotenv from "dotenv";
dotenv.config({ path: "./../../.env" });

import passport, { authenticate, use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";

import { getUserById, getUserByAuthId, saveUsers } from "../users/db";

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      console.log("passport callback function fired:");
      console.log(profile.displayName, profile.id);

      getUserByAuthId(profile.id)
        .then((user: any) => {
          if (user) {
            // something
            done(null, user);
          } else {
            saveUsers({
              name: profile.displayName,
              authid: profile.id,
            }).then((data) => {
              console.log("The user created", data);
              done(null, data);
            });
          }
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done) => {
  console.log(id);
  getUserById(id)
    .then((user: any) => {
      done(null, user);
    })
    .catch((err: any) => {
      console.log('deserializeUser error');
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
  console.log('authenticate....');
  if (req.isAuthenticated()) {
    console.log("user authenticated");
    return next();
  }
  res.redirect("/auth/logout");
};
