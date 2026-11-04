import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport from "./config/passport.js";
import { config } from "./config/config.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin === config.CLIENT_BASE_URL) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.get("/", (req, res) => {
    res.status(200).json({message: "Server is running"});
});

app.use("/api/auth", authRouter);

export default app;