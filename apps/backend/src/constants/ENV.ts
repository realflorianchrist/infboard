import { z } from 'zod';
import {NodeEnvs} from "@src/constants/index";

const envSchema = z.object({
    // Environment
    NODE_ENV: z.nativeEnum(NodeEnvs),

    // Server
    PORT: z.coerce.number(),
    HOST: z.string(),

    // Frontend
    FRONTEND_URL: z.string().url(),

    // Logger
    JET_LOGGER_MODE: z.string(),
    JET_LOGGER_FILEPATH: z.string(),
    JET_LOGGER_TIMESTAMP: z.coerce.boolean(),
    JET_LOGGER_FORMAT: z.string(),

    // MongoDB
    MONGO_HOST: z.string(),
    MONGO_DATABASE: z.string(),
    MONGO_USER: z.string(),
    MONGO_PASSWORD: z.string(),

    // S3
    S3_REGION: z.string(),
    S3_ENDPOINT: z.string().url(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_BUCKET: z.string(),
    S3_UPLOAD_FOLDER: z.string(),
    S3_EXPIRE_URL_SECONDS: z.coerce.number(),
});

export const ENV = envSchema.parse(process.env);
