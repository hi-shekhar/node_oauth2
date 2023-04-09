import { Router, Response, Request } from "express";
import passport from "passport";
const router: Router = Router();
export default router;

router.get("/", async (req: Request, res: Response) => {
  res.render("index", { user: req.user });
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  (req, res, next) => {
    console.log("here im");
    res.redirect("/user");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});
