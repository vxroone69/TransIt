import type { Request, Response } from "express"

//middleware to route no matching incoming req

export function notFoundHandler(request: Request, response: Response) {
    response.status(404).json({
        success: false,
        error: {
            message: `Route not found: ${request.method} ${request.originalUrl}`
        }
    })
}