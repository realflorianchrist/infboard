import {Data, isFolder} from "@workspace/types/src/data";
import {FolderModel} from "@src/models/Folder";
import {FileModel} from "@src/models/File";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";
import {FolderValidationErrorType} from "@workspace/types/src/modelValidation";
import {ErrorType} from "@workspace/types/src/apiResponses";

export const isDescendant = async (parentId: string, childId: string): Promise<boolean> => {
    if (childId === ROOT_FOLDER_ID) return false;

    let current = await FolderModel.findById(childId).lean();

    while (current?.parentFolderId) {
        if (current.parentFolderId === parentId) return true;
        if (current.parentFolderId === ROOT_FOLDER_ID) break;

        current = await FolderModel.findById(current.parentFolderId).lean();
    }

    return false;
};

export const validateMoveItem = async (item: Data, targetFolderId: string): Promise<void> => {
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