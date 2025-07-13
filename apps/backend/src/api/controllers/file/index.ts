import express, {Router} from "express";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FileMeta, NewFileInput} from "@workspace/types/data";
import {StatusCodes} from "http-status-codes";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";
import {FileModel} from "@src/models/File";
import {
    generatePresignedDownloadUrl,
    generatePresignedUploadUrl
} from "@src/services/s3Service";
import logger from "jet-logger";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {ApiRoutes} from "@workspace/routes/apiRoutes";

const fileController: Router = express.Router();


fileController.post(
    ApiRoutes.files.add,
    handleRequest<{ file: NewFileInput }, { file: FileMeta }>(
        async (req) => {

            const {file} = req.body;

            try {
                const newFile = await FileModel.create({
                    name: file.name,
                    contentType: file.contentType,
                    size: file.size,
                    comment: file.comment,
                    parentFolderId: file.parentFolderId,
                });

                const url = await generatePresignedUploadUrl(
                    newFile._id.toString(), newFile.contentType
                );

                const fileDto = fileDocumentToFileMapper(newFile, url);

                return {
                    status: StatusCodes.OK,
                    data: {
                        file: fileDto,
                    },
                };
            } catch (error) {
                logger.err(error);
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
            }
        }
    )
);

fileController.put(
    ApiRoutes.files.downloadUrlById(':id'),
    handleRequest<{}, { url: string, file: FileMeta }, { id: string }>(
        async (req) => {

            const {id} = req.params;

            const url = await generatePresignedDownloadUrl(id);

            const fileDoc = await FileModel.findByIdAndUpdate(
                id,
                {$inc: {downloads: 1}},
                {timestamps: false, new: true},
            );

            if (!fileDoc) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FILE_NOT_FOUND);
            }

            return {
                status: StatusCodes.OK,
                data: {
                    url: url,
                    file: fileDocumentToFileMapper(fileDoc)
                },
            };
        }
    )
);

fileController.put(
    ApiRoutes.files.delete(':id'),
    handleRequest<{}, { success: boolean }, { id: string }>(
        async (req) => {

            const {id} = req.params;

            await FileModel.findByIdAndUpdate(
                id,
                {$set: {deleted: true}},
                {timestamps: false}
            );

            return {
                status: StatusCodes.OK,
                data: {
                    success: true,
                },
            };
        }
    )
);

export default fileController;