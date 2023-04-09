import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import passport from "passport";
import authRoutes from "./auth/router";
import userRoutes from "./users/router";

const app = express();
const PORT = process.env.PORT;
require("./auth/setup");

// Use the session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY as string,
    cookie: { maxAge: 60000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// define a route handler for the default home page
app.get("/", (req, res) => {
  // render the index template
  res.render("index", { data: req.user });
});

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT} ...`);
});
