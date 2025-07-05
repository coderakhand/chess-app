import express from "express";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import csurf from "csurf";
import "./auth";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "cat",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const csrfProtection = csurf({ cookie: true });

app.use((err: any, req: any, res: any, next: any) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  res.status(403).send("Invalid CSRF token.");
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.user.findUnique({ where: { username } });
      if (!user) return done(null, false, { message: "Incorrect username." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return done(null, false, { message: "Incorrect password." });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).send("Not authenticated.");
  }
}

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post("/signup", csrfProtection, async (req, res): Promise<void> => {
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

app.post(
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

app.post("/logout", csrfProtection, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error during logout.");
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully." });
  });
});

app.get("/me", requireAuth, (req, res) => {
  const user = req.user as any;
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      ratings: {
        bullet: user.bulletRating,
        blitz: user.blitzRating,
        rapid: user.rapidRating,
      },
    },
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.FRONTEND_URL}/play`,
    failureRedirect: `${process.env.FRONTEND_URL}/`,
  })
);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
