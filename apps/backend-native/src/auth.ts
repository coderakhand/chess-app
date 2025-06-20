import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { db } from "./db";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await db.user.findUnique({
          where: { email: profile.emails?.[0]?.value },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              username:
                profile.displayName.replace(" ", "_") +
                Math.floor(Math.random() * 1000),
              email: profile.emails?.[0]?.value || "",
              password: "", 
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
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
