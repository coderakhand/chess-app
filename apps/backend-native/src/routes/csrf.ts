import express from "express";
import csrfProtection from "../middleware/csrf";
const router = express.Router();
import { Request, Response } from "express";

router.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default router;
