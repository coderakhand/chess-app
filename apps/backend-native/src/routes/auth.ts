import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { db } from "../db";
import csrfProtection from "../middleware/csrf";
import { generateOtp, verifyOtp } from "../utils/otp";
import { sendOtpEmail } from "../utils/email";
import {
  otpRateLimiter,
  otpVerificationRateLimiter,
} from "../middleware/rateLimit";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "cat";
const router = express.Router();

router.post(
  "/login",
  csrfProtection,
  passport.authenticate("local"),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign(
      {
        isGuest: false,
        id: user.id,
        username: user.username,
        ratings: {
          bullet: user.bulletRating,
          blitz: user.blitzRating,
          rapid: user.rapidRating,
        },
      },
      JWT_SECRET,
      {
        expiresIn: "28d",
      }
    );

    res.json({
      message: "Login successful",
      authToken: token,
      id: user.id,
      username: user.username,
      email: user.email,
      ratings: {
        bullet: user.bulletRating,
        blitz: user.blitzRating,
        rapid: user.rapidRating,
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
    successRedirect: `${process.env.FRONTEND_URL}/`,
    failureRedirect: `${process.env.FRONTEND_URL}/`,
  })
);

router.post("/send-otp", csrfProtection, otpRateLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = generateOtp(email);
  try {
    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent" });
  } catch (e) {
    console.log(e);
  }
});

router.post("/signup", otpVerificationRateLimiter, async (req, res) => {
  const { username, email, password, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP are required" });

  const Otp = Number(otp);
  const valid = verifyOtp(email, Otp);
  if (!valid) return res.status(400).json({ error: "Invalid or expired OTP" });

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

      const token = jwt.sign(
        {
          isGuest: false,
          id: user.id,
          username: user.username,
          ratings: {
            bullet: user.bulletRating,
            blitz: user.blitzRating,
            rapid: user.rapidRating,
          },
        },
        JWT_SECRET,
        { expiresIn: "28d" }
      );

      res.json({
        message: "Signup successful",
        authToken: token,
        id: user.id,
        username: user.username,
        email: user.email,
        ratings: {
          bullet: user.bulletRating,
          blitz: user.blitzRating,
          rapid: user.rapidRating,
        },
      });
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).send("Signup failed: " + err.message);
  }
});

export default router;
