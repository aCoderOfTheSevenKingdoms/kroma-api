import {Router, type Request, type Response} from "express";
import { validateUserRegistration, validateUserLogin, validateEmailVerification } from "../validator/auth.validator.js";
import { registerUser, loginUser, verifyEmail, getCurrentUser } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const router = Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.get('/verify-email', validateEmailVerification, verifyEmail);
router.get('/me', requireAuth, getCurrentUser);

// ============  GOOGLE OAUTH 2.0 ===============

router.get('/google', 
   passport.authenticate("google", {scope: ["profile", "email"], session: false})
);

router.get("/google/callback", 
    passport.authenticate("google", {
        failureRedirect: "/api/auth/login-failed",
        session: false
    }),
    (req: Request, res: Response) => {
        const user = req.user as any;

        if(!user) {
            return res.redirect("/api/auth/login-failed");
        }

        const token = jwt.sign(
            {id: String(user._id), user_type: user.user_type},
            config.JWT_SECRET,
            {expiresIn: "7d"}
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: config.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect(`${config.CLIENT_BASE_URL}/home`);
    }
);

router.get("/login-failed", (req: Request, res: Response) => {
    res.status(401).json({message: "Google Authentication Failed"});
});

export default router;
