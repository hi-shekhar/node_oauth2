import { Router, Response, Request, NextFunction } from "express";
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
  (req: Request, res: Response) => {
    res.redirect("/user");
  }
);

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});
