import express, {Router} from "express";
import {apiRoutes} from "@workspace/routes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {
    Data,
    ErrorType,
    FileValidationErrorType,
    FolderValidationErrorType,
    isFileMeta,
    isFolder
} from "@workspace/types";
import {StatusCodes} from "http-status-codes";
import {FolderModel} from "@src/models/Folder";
import {ApiError} from "@src/api/utils/apiError";
import {FileModel} from "@src/models/File";
import mongoose from "mongoose";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {validateMoveItem} from "@src/api/controllers/utils/moveDataValidation";
import {createFileSnapshot, createFolderSnapshot} from "@src/services/dataService";


const moveItem = async (
    item: Data,
    targetFolderId: string,
    userName: string,
    session: mongoose.ClientSession
) => {
    if (isFolder(item)) {
        const folder = await FolderModel.findById(item.id).session(session);
        if (!folder) return;

        folder.parentFolderId = targetFolderId;
        folder.userName = userName;
        folder.version++;

        folder.previousVersions.push(
            createFolderSnapshot(folder, { updatedBy: userName, reason: 'update' })
        );

        await folder.save({ session });
        return;
    }

    if (isFileMeta(item)) {
        const file = await FileModel.findById(item.id).session(session);
        if (!file) return;

        file.parentFolderId = targetFolderId;
        file.userName = userName;
        file.version++;

        file.previousVersions.push(
            createFileSnapshot(file, { updatedBy: userName, reason: 'update' })
        );

        await file.save({ session });
    }
};


const dataController: Router = express.Router();

dataController.put(
    apiRoutes.data.move,
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
                        await moveItem(item, targetFolderId, req.user?.username!, session);

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