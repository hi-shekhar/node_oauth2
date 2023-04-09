import { Router, Response, Request } from "express";
import { isAuthenticated } from "../auth/setup";
const router: Router = Router();
export default router;

router.get("/", isAuthenticated, (req: Request, res: Response) => {
    // res.send('profile');
    console.log("iuser data ****************88");
  res.render("partials/loggedin", {
    data: req.user,
  });
});
