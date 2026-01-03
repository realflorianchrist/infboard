import express, {Router} from "express";
import {handleRequest} from "@src/api/utils/handleRequest";
import {ErrorType, FileMeta, FileValidationErrorType, NewFileInput, UpdateFileMeta} from "@workspace/types";
import {StatusCodes} from "http-status-codes";
import {ApiError} from "@src/api/utils/apiError";
import {FileModel, FileSchema, UpdateFileSchema} from "@src/models/File";
import {generateFileKey, generatePresignedDownloadUrl, generatePresignedUploadUrl} from "@src/services/s3Service";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {apiRoutes} from "@workspace/routes";
import {validateOrThrow} from "@src/api/utils/validateOrThrow";
import logger from "jet-logger";
import {validateMoveItem} from "@src/api/controllers/utils/moveDataValidation";
import {createFileSnapshot} from "@src/services/dataService";

const fileController: Router = express.Router();


fileController.post(
    apiRoutes.files.add,
    handleRequest<{ file: NewFileInput }, { file: FileMeta }>(
        async (req) => {

            const validated = validateOrThrow(FileSchema, req.body.file);

            const {name, parentFolderId} = validated;

            const existing = await FileModel.findOne({name, parentFolderId})
                .setOptions({includeDeleted: true});

            if (existing) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
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
                    userName: req.user?.username,
                });

                newFile.previousVersions.push(
                    createFileSnapshot(newFile, {updatedBy: req.user?.username!, reason: 'create'})
                );

                newFile.s3Key = generateFileKey(newFile.id);

                await newFile.save();

                const url = await generatePresignedUploadUrl(
                    newFile.s3Key, newFile.contentType
                );

                return {
                    status: StatusCodes.OK,
                    data: {
                        file: fileDocumentToFileMapper(newFile, url),
                    },
                };
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
            }
        }
    )
);


fileController.put(
    apiRoutes.files.update,
    handleRequest<{ file: UpdateFileMeta }, { file: FileMeta }>(
        async (req) => {

            const validated = validateOrThrow(UpdateFileSchema, req.body.file);

            const file = await FileModel.findById(validated.id)
                .setOptions({includeDeleted: true});

            if (!file) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FILE_NOT_FOUND);
            }

            try {
                if (validated.parentFolderId) {
                    await validateMoveItem(validated, validated.parentFolderId);
                }

                Object.assign(file, validated, {userName: req.user?.username});

                file.version++;

                file.previousVersions.push(
                    createFileSnapshot(file, {updatedBy: req.user?.username!, reason: 'update'})
                );

                await file.save();

                return {
                    status: StatusCodes.OK,
                    data: {
                        file: fileDocumentToFileMapper(file)
                    }
                };

            } catch (error: any) {
                if (error.code === 11000) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                        validationErrors: [FileValidationErrorType.FILE_ALREADY_EXISTS]
                    });
                }

                throw new error;
            }
        }
    )
);

fileController.put(
    apiRoutes.files.downloadUrlById(':id'),
    handleRequest<{}, { url: string, file: FileMeta }, { id: string }, { includeDeleted: string }>(
        async (req) => {

            const {id} = req.params;
            const includeDeleted = req.query.includeDeleted === 'true';
            const findOpts = includeDeleted ? {includeDeleted: true} : undefined;

            const fileDoc = await FileModel.findByIdAndUpdate(
                id,
                {$inc: {downloads: 1}},
                {timestamps: false, new: true},
            ).setOptions(findOpts ?? {});

            if (!fileDoc) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FILE_NOT_FOUND);
            }

            if (!fileDoc.s3Key) {
                logger.warn(`S3Key missing for file: ${fileDoc.id}`);
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FILE_NOT_FOUND);
            }

            const url = await generatePresignedDownloadUrl(fileDoc.s3Key);

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
    apiRoutes.files.downloadUrlsByFolderId(':folderId'),
    handleRequest<{}, { url: string, file: FileMeta }[], { folderId: string }, { includeDeleted: string }>(
        async (req) => {

            const {folderId} = req.params;
            const includeDeleted = req.query.includeDeleted === 'true';
            const findOpts = includeDeleted ? {includeDeleted: true} : undefined;

            const fileDocs = await FileModel.find({parentFolderId: folderId})
                .setOptions(findOpts ?? {});

            await Promise.all(
                fileDocs.map((file) =>
                    FileModel.findByIdAndUpdate(file._id, {$inc: {downloads: 1}}, {timestamps: false})
                        .setOptions(findOpts ?? {})
                )
            );

            const results = await Promise.all(
                fileDocs.map(async (file) => {

                    if (!file.s3Key) {
                        logger.warn(`S3Key missing for file: ${file.id}`);
                        throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FILE_NOT_FOUND);
                    }

                    const url = await generatePresignedDownloadUrl(file.s3Key);
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
    apiRoutes.files.rollback(':id'),
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