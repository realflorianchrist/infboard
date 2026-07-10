import {Data, ErrorType, FolderValidationErrorType, isFolder, UpdateFileMeta, UpdateFolder} from "@workspace/types";
import {FolderModel} from "@src/models/Folder";
import {FileModel} from "@src/models/File";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";

/**
 * Checks whether a folder (childId) is a descendant of another folder (parentId).
 *
 * Behavior:
 * - Walks up the folder hierarchy starting from `childId` by repeatedly loading its parent.
 * - Returns `true` if it encounters `parentId` in the ancestry chain.
 * - Stops when it reaches `ROOT_FOLDER_ID` or a folder without `parentFolderId`.
 * - `ROOT_FOLDER_ID` is never considered a descendant of anything.
 *
 * @param {string} parentId The potential ancestor folder id.
 * @param {string} childId The folder id to test as a descendant.
 * @returns {Promise<boolean>} `true` if `childId` is a descendant of `parentId`, otherwise `false`.
 */
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

/**
 * Validates whether an item (folder or file) can be moved into a target folder.
 *
 * Folder-specific validation:
 * - Prevents moving a folder into itself.
 * - Prevents moving a folder into any of its descendants (would create a cycle).
 *
 * Existence validation:
 * - If `item.id !== ROOT_FOLDER_ID`, verifies the referenced folder/file exists in the database.
 * - Throws `FOLDER_NOT_FOUND` or `FILE_NOT_FOUND` with HTTP 404 if missing.
 *
 * Errors:
 * - Throws {@link ApiError} with `400 VALIDATION_ERROR` for invalid folder moves,
 *   including `CANNOT_MOVE_INTO_SELF_OR_DESCENDANT`.
 *
 * @param {Data | UpdateFileMeta | UpdateFolder} item The item being moved.
 * @param {string} targetFolderId The destination folder id.
 * @throws {ApiError} If the move is invalid or the item does not exist.
 * @returns {Promise<void>} Resolves if the move is valid.
 */
export const validateMoveItem = async (item: Data | UpdateFileMeta | UpdateFolder, targetFolderId: string): Promise<void> => {
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