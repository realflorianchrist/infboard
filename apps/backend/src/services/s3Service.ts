import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {s3} from "@src/config/s3";
import {ENV} from "@src/constants/ENV";


export const generateFileKey = (fileId: string) => {
    return `${ENV.S3_UPLOAD_FOLDER}/${fileId}`;
}

export const generatePresignedUploadUrl = async (fileKey: string, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: ENV.S3_BUCKET,
        Key: fileKey,
        ContentType: contentType,
    });

    return await getSignedUrl(s3, command, {expiresIn: ENV.S3_EXPIRE_URL_SECONDS});
}