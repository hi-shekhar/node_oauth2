import { Router, Response, Request } from "express";
import { isAuthenticated } from "../auth/setup";
const router: Router = Router();
export default router;

router.get("/", isAuthenticated, (req: Request, res: Response) => {
  res.render("index", {
    data: req.user,
  });
});
