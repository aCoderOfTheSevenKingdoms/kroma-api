import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";
import { config } from "./config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: config.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: config.GOOGLE_OAUTH_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.trim().toLowerCase();
        
        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        let user = await userModel.findOne({ google_id: profile.id });

        if (!user) {
          user = await userModel.findOne({ email: email });

          if (user && !user.google_id) {
            user.google_id = profile.id;
            user.is_verified = true;
            await user.save();
          }
        }

        if (!user) {
          user = await userModel.create({
            google_id: profile.id,
            email: email,
            fullname: profile.displayName,
            is_verified: true,
          });
        }
         
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;