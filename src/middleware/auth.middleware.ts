import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

type TokenPayload = {
    id?: string;
    userId?: string;
    user_type?: string;
};

export type AuthenticatedRequest = Request & {
    userId: string;
    userType: string | undefined;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        if (typeof decoded === "string") {
            return res.status(401).json({ error: "Invalid session" });
        }

        const payload = decoded as TokenPayload;
        const userId = payload.id ?? payload.userId;

        if (!userId) {
            return res.status(401).json({ error: "Invalid session" });
        }

        const authenticatedReq = req as AuthenticatedRequest;
        authenticatedReq.userId = userId;
        authenticatedReq.userType = payload.user_type;

        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired session" });
    }
}
