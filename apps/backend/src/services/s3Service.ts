import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {s3} from "@src/config/s3";
import {ENV} from "@src/constants/ENV";


const generateFileKey = (fileId: string) => {
    return `${ENV.S3_UPLOAD_FOLDER}/${fileId}`;
}

export const generatePresignedUploadUrl = async (fileId: string, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: ENV.S3_BUCKET,
        Key: generateFileKey(fileId),
        ContentType: contentType,
    });

    return await getSignedUrl(s3, command, {expiresIn: ENV.S3_EXPIRE_URL_SECONDS});
}

export const generatePresignedDownloadUrl = async (fileId: string) => {
    const command = new GetObjectCommand({
        Bucket: ENV.S3_BUCKET,
        Key: generateFileKey(fileId),
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