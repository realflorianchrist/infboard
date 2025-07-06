import mongoose from "mongoose";
import logger from "jet-logger";
import ENV from "@src/common/constants/ENV";

const username = encodeURIComponent(ENV.MongoUser);
const password = encodeURIComponent(ENV.MongoPassword);
const database = ENV.MongoDatabase;
const authSource = ENV.MongoDatabase;
const mongoHost = ENV.MongoHost;

const uri = `mongodb://${username}:${password}@${mongoHost}/${database}?authSource=${authSource}`;

export const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        logger.info(`Successfully connected to MongoDB`);
    } catch (error) {
        logger.err("Connection to MongoDB failed:", error);
        process.exit(1);
    }
}