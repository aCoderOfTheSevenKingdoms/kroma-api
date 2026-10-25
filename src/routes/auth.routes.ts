import {Router} from "express";
import { validateUserRegistration, validateUserLogin, validateEmailVerification } from "../validator/auth.validator.js";
import { registerUser, loginUser, verifyEmail } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.get('/verify-email', validateEmailVerification, verifyEmail);

export default router;
