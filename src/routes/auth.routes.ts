import {Router, type Request, type Response} from "express";
import { validateUserRegistration, validateUserLogin, validateEmailVerification } from "../validator/auth.validator.js";
import { registerUser, loginUser, verifyEmail, getCurrentUser, logoutUser, googleAuthCallback } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.get('/verify-email', validateEmailVerification, verifyEmail);
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', logoutUser);

// ============  GOOGLE OAUTH 2.0 ===============

router.get('/google', 
   passport.authenticate("google", {scope: ["profile", "email"], session: false})
);

router.get("/google/callback", 
    passport.authenticate("google", {
        failureRedirect: `${config.CLIENT_BASE_URL}/login`,
        session: false
    }),
    googleAuthCallback
);

export default router;
