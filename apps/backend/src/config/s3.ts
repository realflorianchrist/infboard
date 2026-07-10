import {CreateBucketCommand, HeadBucketCommand, S3Client} from "@aws-sdk/client-s3";
import {ENV} from "@src/constants/ENV";
import logger from "@src/utils/logger";

/**
 * Preconfigured AWS S3 client instance.
 *
 * Configuration:
 * - Uses region and endpoint from environment variables.
 * - Supports S3-compatible storage via a custom endpoint.
 * - Uses path-style URLs, required by some S3-compatible providers.
 * - Authenticates using access key and secret key credentials.
 *
 * Intended use:
 * - Reused across the application for all S3 operations.
 */
export const s3 = new S3Client({
    region: ENV.S3_REGION,
    endpoint: ENV.S3_ENDPOINT,
    credentials: {
        accessKeyId: ENV.S3_ACCESS_KEY,
        secretAccessKey: ENV.S3_SECRET_KEY
    },
    forcePathStyle: true
});


/**
 * Ensures that the configured S3 bucket exists.
 *
 * Behavior:
 * - Checks for bucket existence using `HeadBucketCommand`.
 * - If the bucket does not exist (HTTP 404), creates it.
 * - Logs whether the bucket already existed or was newly created.
 * - Rethrows unexpected errors after logging.
 *
 * Intended use:
 * - Call once during application startup.
 * - Safe to call multiple times, the operation is idempotent.
 *
 * @throws {unknown} Rethrows errors other than "bucket not found".
 * @returns {Promise<void>} Resolves when the bucket exists or has been created.
 */
export const ensureBucketExists = async (): Promise<void> => {
    try {
        await s3.send(new HeadBucketCommand({Bucket: ENV.S3_BUCKET}));
        logger.info(`Bucket "${ENV.S3_BUCKET}" already exists`);
    } catch (err: any) {
        if (err.$metadata?.httpStatusCode === 404) {
            await s3.send(new CreateBucketCommand({Bucket: ENV.S3_BUCKET}));
            logger.info(`Bucket "${ENV.S3_BUCKET}" created`);
        } else {
            logger.err(`Error checking/creating bucket ${err}`);
            throw err;
        }
    }
}