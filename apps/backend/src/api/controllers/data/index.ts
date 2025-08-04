import express, {Router} from "express";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {Data, isFileMeta, isFolder} from "@workspace/types/data";
import {StatusCodes} from "http-status-codes";
import {FolderModel} from "@src/models/Folder";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";
import {FileModel, FileVersion} from "@src/models/File";
import mongoose from "mongoose";
import {ROOT_FOLDER_ID} from "@workspace/constants/index";
import {FileValidationErrorType, FolderValidationErrorType} from "@workspace/types/modelValidation";

const isDescendant = async (parentId: string, childId: string): Promise<boolean> => {
    if (childId === ROOT_FOLDER_ID) return false;

    let current = await FolderModel.findById(childId).lean();

    while (current?.parentFolderId) {
        if (current.parentFolderId === parentId) return true;
        if (current.parentFolderId === ROOT_FOLDER_ID) break;

        current = await FolderModel.findById(current.parentFolderId).lean();
    }

    return false;
};

const validateMoveItem = async (item: Data, targetFolderId: string): Promise<void> => {
    if (isFolder(item)) {
        if (item.id === targetFolderId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                validationErrors: [FolderValidationErrorType.CANNOT_MOVE_INTO_SELF_OR_DESCENDANT],
            });
        }

        const isInvalid = await isDescendant(item.id, targetFolderId);
        if (isInvalid) {
            throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                validationErrors: [FolderValidationErrorType.CANNOT_MOVE_INTO_SELF_OR_DESCENDANT],
            });
        }
    }

    if (item.id !== ROOT_FOLDER_ID) {
        const exists = isFolder(item)
            ? await FolderModel.exists({_id: item.id})
            : await FileModel.exists({_id: item.id});

        if (!exists) {
            throw new ApiError(StatusCodes.NOT_FOUND, isFolder(item) ? ErrorType.FOLDER_NOT_FOUND : ErrorType.FILE_NOT_FOUND);
        }
    }
};

const moveItem = async (item: Data, targetFolderId: string, session: mongoose.ClientSession) => {
    if (isFolder(item)) {
        await FolderModel.updateOne({_id: item.id}, {
            parentFolderId: targetFolderId
        }, {session});
    } else if (isFileMeta(item)) {
        const file = await FileModel.findById(item.id).session(session);
        if (!file) return;

        const versionBackup: FileVersion = {
            version: file.version ?? 1,
            name: file.name,
            contentType: file.contentType,
            size: file.size,
            updatedAt: file.updatedAt,
            userName: file.userName,
            parentFolderId: file.parentFolderId,
            comment: file.comment,
        };

        await FileModel.updateOne(
            { _id: item.id },
            {
                parentFolderId: targetFolderId,
                $inc: { version: 1 },
                $push: { previousVersions: versionBackup }
            },
            { session }
        );
    }
};


const dataController: Router = express.Router();

dataController.put(
    ApiRoutes.data.move,
    handleRequest<{ data: Data[]; targetFolderId: string }, {}>(
        async (req) => {
            const {data, targetFolderId} = req.body;

            const session = await mongoose.startSession();

            try {
                session.startTransaction();

                if (targetFolderId !== ROOT_FOLDER_ID) {
                    const targetFolder = await FolderModel.findById(targetFolderId).session(session);
                    if (!targetFolder) {
                        throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FOLDER_NOT_FOUND);
                    }
                }


                for (const item of data) {
                    try {
                        await validateMoveItem(item, targetFolderId);
                        await moveItem(item, targetFolderId, session);

                    } catch (error: any) {
                        if (error.code === 11000 && isFileMeta(item)) {
                            throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                                validationErrors: [FileValidationErrorType.FILE_ALREADY_EXISTS],
                            });
                        } else if (error.code === 11000 && isFolder(item)) {
                            throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                                validationErrors: [FolderValidationErrorType.FOLDER_ALREADY_EXISTS],
                            });
                        }

                        throw error;
                    }
                }

                await session.commitTransaction();

                return {
                    status: StatusCodes.OK,
                    data: {},
                };

            } catch (error) {
                await session.abortTransaction();
                throw error;

            } finally {
                await session.endSession();
            }
        }
    )
);


export default dataController;