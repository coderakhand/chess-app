import passport from "passport";
import "./auth";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { db } from "./db";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.user.findUnique({ where: { username } });
      if (!user) return done(null, false, { message: "Incorrect username." });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password." });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      if (!profile.emails?.[0]) return;
      try {
        const email = profile.emails?.[0].value;
        const username = profile.displayName || email?.split("@")[0];

        if (!email) {
          return done(null, false, {
            message: "No email found in Google profile",
          });
        }

        let user = await db.user.findUnique({ where: { email } });

        if (!user) {
          user = await db.user.create({
            data: {
              username: username || "google-user",
              email,
              password: "",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
