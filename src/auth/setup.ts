import * as dotenv from "dotenv";
dotenv.config({ path: "./../../.env" });

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";

import { getUserById, getUserByAuthId, saveUsers } from "../users/db";

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

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

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
