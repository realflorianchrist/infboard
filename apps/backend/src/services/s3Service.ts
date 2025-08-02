import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {s3} from "@src/config/s3";
import {ENV} from "@src/constants/ENV";


export const generateFileKey = (fileId: string, version?: number) => {
    return version ? `${ENV.S3_UPLOAD_FOLDER}/${fileId}-v${version}` : `${ENV.S3_UPLOAD_FOLDER}/${fileId}`;
}

export const generatePresignedUploadUrl = async (seKey: string, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: ENV.S3_BUCKET,
        Key: seKey,
        ContentType: contentType,
    });

    return await getSignedUrl(s3, command, {expiresIn: ENV.S3_EXPIRE_URL_SECONDS});
}

export const generatePresignedDownloadUrl = async (s3Key: string) => {
    const command = new GetObjectCommand({
        Bucket: ENV.S3_BUCKET,
        Key: s3Key,
    });

    return await getSignedUrl(s3, command, {expiresIn: ENV.S3_EXPIRE_URL_SECONDS});
}

// export const generatePresignedDeleteUrl = async (fileId: string) => {
//     const command = new DeleteObjectCommand({
//         Bucket: ENV.S3_BUCKET,
//         Key: generateFileKey(fileId),
//     });
//
//     return await getSignedUrl(s3, command, {expiresIn: ENV.S3_EXPIRE_URL_SECONDS});
// }