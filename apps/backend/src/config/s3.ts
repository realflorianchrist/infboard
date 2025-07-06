import ENV from "@src/common/constants/ENV";
import {CreateBucketCommand, HeadBucketCommand, S3Client} from "@aws-sdk/client-s3";
import logger from "jet-logger";

const s3 = new S3Client({
    region: ENV.S3Region,
    endpoint: ENV.S3Endpoint,
    credentials: {
        accessKeyId: ENV.S3AccessKey,
        secretAccessKey: ENV.S3SecretKey
    },
    forcePathStyle: true
});

export const ensureBucketExists = async () => {
    try {
        await s3.send(new HeadBucketCommand({Bucket: ENV.S3Bucket}));
        logger.info(`Bucket "${ENV.S3Bucket}" already exists`);
    } catch (err: any) {
        if (err.$metadata?.httpStatusCode === 404) {
            await s3.send(new CreateBucketCommand({Bucket: ENV.S3Bucket}));
            logger.info(`Bucket "${ENV.S3Bucket}" created`);
        } else {
            logger.err("Error checking/creating bucket", err);
            throw err;
        }
    }
}