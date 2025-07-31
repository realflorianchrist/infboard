import express, {Router} from "express";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FileMeta, NewFileInput, UpdateFileMeta} from "@workspace/types/data";
import {StatusCodes} from "http-status-codes";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";
import {FileModel, FileSchema, UpdateFileSchema} from "@src/models/File";
import {generatePresignedDownloadUrl, generatePresignedUploadUrl} from "@src/services/s3Service";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {validateOrThrow} from "@src/api/utils/validateOrThrow";
import {FileValidationErrorType} from "@workspace/types/modelValidation";

const fileController: Router = express.Router();


fileController.post(
    ApiRoutes.files.add,
    handleRequest<{ file: NewFileInput }, { file: FileMeta }>(
        async (req) => {

            const validated = validateOrThrow(FileSchema, req.body.file);

            const {name, parentFolderId} = validated;

            const existing = await FileModel.findOne({name, parentFolderId});

            if (existing) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.ALREADY_EXISTS, {
                    validationErrors: [FileValidationErrorType.FILE_ALREADY_EXISTS]
                });
            }

            try {
                const newFile = await FileModel.create({
                    name: validated.name,
                    contentType: validated.contentType,
                    size: validated.size,
                    comment: validated.comment,
                    parentFolderId: validated.parentFolderId,
                    userName: req.user?.username
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
    ApiRoutes.files.update,
    handleRequest<{ file: UpdateFileMeta }, { file: FileMeta }>(
        async (req) => {

            const validated = validateOrThrow(UpdateFileSchema, req.body.file);

            const updatedFile = await FileModel.findByIdAndUpdate(
                validated.id,
                {...validated},
                {new: true}
            );

            if (!updatedFile) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.NOT_FOUND);
            }

            return {
                status: StatusCodes.OK,
                data: {
                    file: fileDocumentToFileMapper(updatedFile),
                },
            };
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
    ApiRoutes.files.downloadUrlsByFolderId(':folderId'),
    handleRequest<{}, { url: string, file: FileMeta }[], { folderId: string }>(
        async (req) => {

            const {folderId} = req.params;

            const fileDocs = await FileModel.find({parentFolderId: folderId});

            await Promise.all(
                fileDocs.map((file) =>
                    FileModel.findByIdAndUpdate(file._id, {$inc: {downloads: 1}}, {timestamps: false})
                )
            );

            const results = await Promise.all(
                fileDocs.map(async (file) => {
                    const url = await generatePresignedDownloadUrl(file._id.toString());
                    return {
                        url,
                        file,
                    };
                })
            );

            return {
                status: StatusCodes.OK,
                data: results.map(({url, file}) => ({
                    url: url,
                    file: fileDocumentToFileMapper(file),
                })),
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