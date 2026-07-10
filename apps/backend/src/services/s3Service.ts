import {GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {s3} from "@src/config/s3";
import {ENV} from "@src/constants/ENV";

/**
 * Generates a deterministic S3 object key for a file.
 *
 * Behavior:
 * - Uses `ENV.S3_UPLOAD_FOLDER` as a fixed key prefix.
 * - If a version is provided, appends `-v{version}` to the file id.
 * - If no version is provided, the key represents the latest version.
 *
 * @param {string} fileId The unique identifier of the file.
 * @param {number} [version] Optional file version number.
 * @returns {string} The generated S3 object key.
 */
export const generateFileKey = (fileId: string, version?: number): string => {
    return version
        ? `${ENV.S3_UPLOAD_FOLDER}/${fileId}-v${version}`
        : `${ENV.S3_UPLOAD_FOLDER}/${fileId}`;
};

/**
 * Generates a presigned S3 URL for uploading a file.
 *
 * Behavior:
 * - Creates a `PutObjectCommand` for the configured bucket.
 * - Restricts the upload to the given `Content-Type`.
 * - The URL expires after `ENV.S3_EXPIRE_URL_SECONDS`.
 *
 * Intended use:
 * - The client uploads the file directly to S3 using HTTP PUT.
 * - No AWS credentials are exposed to the client.
 *
 * @param {string} s3Key The S3 object key where the file will be uploaded.
 * @param {string} contentType The MIME type of the file to upload.
 * @returns {Promise<string>} A presigned URL for uploading the file.
 */
export const generatePresignedUploadUrl = async (s3Key: string, contentType: string): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: ENV.S3_BUCKET,
        Key: s3Key,
        ContentType: contentType,
    });

    return await getSignedUrl(s3, command, {expiresIn: ENV.S3_EXPIRE_URL_SECONDS});
};

/**
 * Generates a presigned S3 URL for downloading a file.
 *
 * Behavior:
 * - Creates a `GetObjectCommand` for the configured bucket.
 * - The URL expires after `ENV.S3_EXPIRE_URL_SECONDS`.
 *
 * Intended use:
 * - The client downloads the file directly from S3 using HTTP GET.
 * - Access is time-limited and does not require AWS credentials.
 *
 * @param {string} s3Key The S3 object key of the file to download.
 * @returns {Promise<string>} A presigned URL for downloading the file.
 */
export const generatePresignedDownloadUrl = async (s3Key: string): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: ENV.S3_BUCKET,
        Key: s3Key,
    });

    return await getSignedUrl(s3, command, {expiresIn: ENV.S3_EXPIRE_URL_SECONDS});
};