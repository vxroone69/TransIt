import type {
    ErrorRequestHandler
} from "express";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    console.log(error);

    response.status(500).json({
        success: false,
        error: {
            message: "Server error."
        },
        details: env.nodeEnv === "development" ? String(error) : undefined
    })
}