import express from "express";
import bodyParser from "body-parser";

import * as dotenv from "dotenv";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// define a route handler for the default home page
app.get("/", (req, res) => {
  // render the index template
  res.render("index", {
        auth: true
    });
});

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT} ...`);
});
