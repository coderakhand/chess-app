import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./passport-config";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import csrfRoutes from "./routes/csrf";
import userRoutes from "./routes/user";
import gameRoutes from "./routes/game";
import engineRoutes from "./routes/engine";
import fideRoutes from "./routes/fide";
import checkRoutes from './routes/quickChecks';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cat",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 86400000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((err: any, req: any, res: any, next: any) => {
  if (err.code === "EBADCSRFTOKEN")
    return res.status(403).send("Invalid CSRF token.");
  next(err);
});

app.use(authRoutes);
app.use(csrfRoutes);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);
app.use("/engine", engineRoutes);
app.use("/fide", fideRoutes);
app.use('/check', checkRoutes)

export default app;
