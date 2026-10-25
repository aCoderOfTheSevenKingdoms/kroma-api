import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import { sendEmail } from "../services/mail.service.js";
import { verifyEmailTemplate } from "../templates/verifyEmail.template.js";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

type RegisterBody = {
    email: string;
    password: string;
    contact: string;
    fullname: string;
    user_type: "buyer" | "seller";
};

type LoginBody = {
    email: string;
    password: string;
};

function toPublicUser(user: {
    _id: unknown;
    email: string;
    contact: string;
    fullname: string;
    user_type: string;
}) {
    return {
        id: String(user._id),
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        user_type: user.user_type
    };
}

function setAuthTokenCookie(res: Response, user: { _id: unknown; user_type: string }) {
    const token = jwt.sign(
        { id: String(user._id), user_type: user.user_type },
        config.JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: config.NODE_ENV === "production",
        maxAge: TOKEN_MAX_AGE
    });
}

export async function registerUser(req: Request, res: Response) {
    try {
        const { email, password, contact, fullname, user_type } = req.body as RegisterBody;
        const normalizedEmail = email.trim().toLowerCase();

        let user = null; 

        user = await userModel.findOne({ email: normalizedEmail });
        if (user && user.is_verified) {
            return res.status(409).json({ error: "A verified account with this email already exists" });
        }

        if(!user) {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            user = await userModel.create({
                email: normalizedEmail,
                password: hashedPassword,
                contact,
                fullname,
                user_type
            });
        }

        // SEND VERIFICATION LINK TO USER'S EMAIL
        const emailVerificationToken = jwt.sign({
            email: user.email 
        }, config.JWT_SECRET); 

        const verificationLink = `${config.API_BASE_URL}/api/auth/verify-email?token=${emailVerificationToken}`;

        await sendEmail({
            to: user.email,
            subject: "Verify your account on Kroma",
            html: verifyEmailTemplate({username: user.fullname || "there", verificationLink})
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: toPublicUser(user)
        });
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: number }).code === 11000
        ) {
            return res.status(409).json({ error: "An account with this email already exists" });
        }

        console.error("Register error:", error);
        return res.status(500).json({ error: "Something went wrong while registering the user" });
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body as LoginBody;
        const normalizedEmail = email.trim().toLowerCase();

        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if(!user.is_verified) {
            return res.status(401).json({error: "Email not verified"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        setAuthTokenCookie(res, user);

        return res.status(200).json({
            message: "Logged in successfully",
            user: toPublicUser(user)
        });
    } catch (error: unknown) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Something went wrong while logging in" });
    }
}

export async function verifyEmail(req: Request, res: Response) {
    try {
        const token = req.query.token;

        if (typeof token !== "string") {
            return res.status(400).json({ error: "Verification token is required" });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        if (typeof decoded === "string" || typeof decoded.email !== "string") {
            return res.status(401).json({ error: "Invalid or expired verification token" });
        }

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.is_verified = true;
        await user.save();

        setAuthTokenCookie(res, user);

        return res.status(200).json({
            message: "Email verified successfully",
            user: toPublicUser(user)
        });
    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Verification token has expired" });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid verification token" });
        }

        console.error("Verify email error:", error);
        return res.status(500).json({ error: "Something went wrong while verifying the email" });
    }
}