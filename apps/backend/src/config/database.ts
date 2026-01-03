import mongoose from "mongoose";
import {ENV} from "@src/constants/ENV";
import logger from "@src/utils/logger";

/**
 * MongoDB connection credentials and configuration.
 *
 * Notes:
 * - Username and password are URL-encoded to support special characters.
 * - Authentication uses the configured database as `authSource`.
 * - A replica set is assumed (`replicaSet=rs0`).
 */
const username = encodeURIComponent(ENV.MONGO_USER);
const password = encodeURIComponent(ENV.MONGO_PASSWORD);
const database = ENV.MONGO_DATABASE;
const authSource = ENV.MONGO_DATABASE;
const mongoHost = ENV.MONGO_HOST;

/**
 * MongoDB connection URI.
 */
const uri = `mongodb://${username}:${password}@${mongoHost}/${database}?authSource=${authSource}&replicaSet=rs0`;

/**
 * Establishes a connection to MongoDB using Mongoose.
 *
 * Behavior:
 * - Attempts to connect using the configured connection URI.
 * - Logs a success message when the connection is established.
 * - Logs the error and terminates the process if the connection fails.
 *
 * Intended use:
 * - Called once during application startup.
 *
 * @throws {never} Terminates the Node.js process on connection failure.
 * @returns {Promise<void>} Resolves when the database connection is established.
 */
export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(uri);
        logger.info(`Successfully connected to MongoDB`);
    } catch (error) {
        logger.err(`Connection to MongoDB failed: ${error}`);
        process.exit(1);
    }
}