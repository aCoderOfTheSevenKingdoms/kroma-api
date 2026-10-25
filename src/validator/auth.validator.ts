import type { Request, Response, NextFunction } from "express";
import {body, query, validationResult} from "express-validator";

function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export const validateUserRegistration = [
    body("email")
       .isEmail().withMessage("Invalid email format"),
    body("contact")
       .notEmpty().withMessage("Contact is required")
       .matches(/^\d{10}$/).withMessage("Contact must be a 10-digit number"),
    body("password")
       .isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("fullname")
       .notEmpty().withMessage("Full name is required"),
    body("user_type")
       .isIn(["buyer", "seller"]).withMessage("User type must be either 'buyer' or 'seller'"),
    validateRequest
]

export const validateUserLogin = [
    body("email")
       .isEmail().withMessage("Invalid email format"),
    body("password")
       .notEmpty().withMessage("Password is required"),
    validateRequest
]

export const validateEmailVerification = [
    query("token")
       .notEmpty().withMessage("Verification token is required"),
    validateRequest
]
