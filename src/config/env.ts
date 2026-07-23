import dotenv from "dotenv"

// loads var from .env into process.env
dotenv.config();

interface Env {
    port: number;
    nodeEnv: string;
}

export const env: Env = {
    port: Number(process.env.PORT) || 4000,
    nodeEnv: process.env.NODE_ENV || "development"
};

