import express, {Router} from "express";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FileMeta, NewFileInput} from "@workspace/types/data";
import {StatusCodes} from "http-status-codes";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";
import {FileModel, FileSchema} from "@src/models/File";
import {
    generatePresignedDownloadUrl,
    generatePresignedUploadUrl
} from "@src/services/s3Service";
import logger from "jet-logger";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {validateOrThrow} from "@src/api/utils/validateOrThrow";
import {FolderModel, FolderSchema} from "@src/models/Folder";
import {FileValidationErrorType} from "@workspace/types/modelValidation";
import * as console from "node:console";

const fileController: Router = express.Router();


fileController.post(
    ApiRoutes.files.add,
    handleRequest<{ file: NewFileInput }, { file: FileMeta }>(
        async (req) => {

            const validated = validateOrThrow(FileSchema, req.body.file);

            const { name, parentFolderId } = validated;

            const existing = await FileModel.findOne({ name, parentFolderId });

            if (existing) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.ALREADY_EXISTS, {
                    validationErrors: [FileValidationErrorType.ALREADY_EXISTS]
                });
            }

            try {
                const newFile = await FileModel.create({
                    name: validated.name,
                    contentType: validated.contentType,
                    size: validated.size,
                    comment: validated.comment,
                    parentFolderId: validated.parentFolderId,
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
    handleRequest<{}, { file: FileMeta }, { id: string }>(
        async (req) => {

            const {id} = req.params;

            const fileDoc = await FileModel.findByIdAndUpdate(
                id,
                {$set: {deleted: true}},
                {timestamps: false}
            );

            if (!fileDoc) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FILE_NOT_FOUND);
            }

            return {
                status: StatusCodes.OK,
                data: {
                    file: fileDocumentToFileMapper(fileDoc)
                },
            };
        }
    )
);

fileController.put(
    ApiRoutes.files.rollback(':id'),
    handleRequest<{}, { file: FileMeta }, { id: string }>(
        async (req) => {

            const {id} = req.params;

            const fileDoc = await FileModel.findByIdAndDelete(
                id,
            );

            if (!fileDoc) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FILE_NOT_FOUND);
            }

            return {
                status: StatusCodes.OK,
                data: {
                    file: fileDocumentToFileMapper(fileDoc)
                },
            };
        }
    )
);

export default fileController;