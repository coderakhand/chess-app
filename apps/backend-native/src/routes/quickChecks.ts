import express from "express";
import { db } from "../db";

const router = express.Router();

router.get("/username/:username", async (req, res) => {
  const username = req.params.username;
  if (!username) return res.json({ error: "Username is required" });
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      return res.json({
        doesUsernameExist: true,
      });
    }

    return res.json({
      doesUsernameExist: false,
    });
  } catch (e) {
    return res.json({ error: "Unable to reach Database" });
  }
});

export default router;
