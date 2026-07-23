import cors from "cors"
import express from "express"
import helmet from "helmet"
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { error } from "console";

export function createApp() {
    const app = express();

    //why helmet?
    //it adds http security headers
    app.use(helmet());

    //controls which frontends should call this app
    app.use(cors());

    //this is a middleware
    //allows express app to read JSON request bodies.
    //without this req.body would be undefined for json apis
    app.use(express.json());

    app.get("/health", (_request, response) => {
        response.status(200).json({
            status: "ok",
            service: "TransIt-backend"
        })
    })

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}