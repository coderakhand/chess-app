import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { db } from "../db";
import csrfProtection from "../middleware/csrf";

const router = express.Router();

router.post("/signup", csrfProtection, async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Signup request:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        res.status(500).send("Error logging in after signup.");
        return;
      }
      res.json({
        message: "Signup successful",
        user: {
          id: user.id,
          username: user.username,
          ratings: {
            bullet: user.bulletRating,
            blitz: user.blitzRating,
            rapid: user.rapidRating,
          },
        },
      });
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).send("Signup failed: " + err.message);
  }
});

router.post(
  "/login",
  csrfProtection,
  passport.authenticate("local"),
  (req, res) => {
    const user = req.user as any;
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        ratings: {
          bullet: user.bulletRating,
          blitz: user.blitzRating,
          rapid: user.rapidRating,
        },
      },
    });
  }
);

router.post("/logout", csrfProtection, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error during logout.");
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully." });
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.FRONTEND_URL}/play`,
    failureRedirect: `${process.env.FRONTEND_URL}/`,
  })
);

export default router;
