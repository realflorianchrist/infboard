import mongoose from "mongoose";
import {ENV} from "@src/constants/ENV";
import logger from "@src/utils/logger";

const username = encodeURIComponent(ENV.MONGO_USER);
const password = encodeURIComponent(ENV.MONGO_PASSWORD);
const database = ENV.MONGO_DATABASE;
const authSource = ENV.MONGO_DATABASE;
const mongoHost = ENV.MONGO_HOST;

const uri = `mongodb://${username}:${password}@${mongoHost}/${database}?authSource=${authSource}&replicaSet=rs0`;

export const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        logger.info(`Successfully connected to MongoDB`);
    } catch (error) {
        logger.err(`Connection to MongoDB failed: ${error}`);
        process.exit(1);
    }
}