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
    handleRequest<{ id: string }, { url: string }>(
        async (req) => {

            const {id} = req.body;

            const url = await generatePresignedDownloadUrl(id);

            await FileModel.findByIdAndUpdate(
                id,
                {$inc: {downloads: 1}},
                {timestamps: false}
            );

            return {
                status: StatusCodes.OK,
                data: {
                    url: url,
                },
            };
        }
    )
);

fileController.put(
    ApiRoutes.files.delete(':id'),
    handleRequest<{ id: string }, { success: boolean }>(
        async (req) => {

            const {id} = req.body;

            await FileModel.findByIdAndUpdate(
                id,
                { $set: { deleted: true } },
                { timestamps: false }
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