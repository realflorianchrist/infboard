import {CreateBucketCommand, HeadBucketCommand, S3Client} from "@aws-sdk/client-s3";
import {ENV} from "@src/constants/ENV";
import logger from "@src/utils/logger";

export const s3 = new S3Client({
    region: ENV.S3_REGION,
    endpoint: ENV.S3_ENDPOINT,
    credentials: {
        accessKeyId: ENV.S3_ACCESS_KEY,
        secretAccessKey: ENV.S3_SECRET_KEY
    },
    forcePathStyle: true
});

export const ensureBucketExists = async () => {
    try {
        await s3.send(new HeadBucketCommand({Bucket: ENV.S3_BUCKET}));
        logger.info(`Bucket "${ENV.S3_BUCKET}" already exists`);
    } catch (err) {
        if (err.$metadata?.httpStatusCode === 404) {
            await s3.send(new CreateBucketCommand({Bucket: ENV.S3_BUCKET}));
            logger.info(`Bucket "${ENV.S3_BUCKET}" created`);
        } else {
            logger.err("Error checking/creating bucket", err);
            throw err;
        }
    }
}