import express, {Router} from "express";
import {apiRoutes} from "@workspace/routes";
import {StatusCodes} from "http-status-codes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FolderModel, FolderSchema, UpdateFolderSchema} from "@src/models/Folder";
import {ErrorType, Folder, FolderValidationErrorType, UpdateFolder} from "@workspace/types";
import {createFolderVersion, getFolderContents, getFolderTree} from "@src/services/dataService";
import {ApiError} from "@src/api/utils/apiError";
import {validateOrThrow} from "@src/api/utils/validateOrThrow";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";
import {isDescendant, validateMoveItem} from "@src/api/controllers/utils/moveDataValidation";
import {FileModel} from "@src/models/File";


const folderController: Router = express.Router();

folderController.get(
    apiRoutes.folders.all,
    handleRequest<{}, { folders: Folder[] }>(
        async () => {

            const folders = await getFolderTree();

            return {
                status: StatusCodes.OK,
                data: {folders},
            };
        }
    )
);

folderController.get(
    apiRoutes.folders.byId(':id'),
    handleRequest<{}, { folder: Folder }, { id: string }, { includeDeleted: string }>(
        async (req) => {
            const {id} = req.params;
            const includeDeleted = req.query.includeDeleted === 'true';

            const folder = await getFolderContents(id, includeDeleted);

            if (!folder) throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FOLDER_NOT_FOUND);

            return {
                status: StatusCodes.OK,
                data: {folder},
            };
        }
    )
);

folderController.get(
    apiRoutes.folders.hasDeletedFiles(':id'),
    handleRequest<{}, { hasDeletedFiles: boolean }, { id: string }>(
        async (req) => {
            const {id} = req.params;

            const count = await FileModel.countDocuments({
                parentFolderId: id,
                deleted: true,
            });
            const hasDeletedFiles = count > 0;

            return {
                status: StatusCodes.OK,
                data: {
                    hasDeletedFiles: hasDeletedFiles,
                },
            }
        }
    )
);

folderController.post(
    apiRoutes.folders.add,
    handleRequest<{ name: string, parentFolderId?: string }, { folder: Folder }>(
        async (req) => {

            const validated = validateOrThrow(FolderSchema, req.body);

            const {name, parentFolderId} = validated;

            const existing = await FolderModel.findOne({name, parentFolderId});

            if (existing) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                    validationErrors: [FolderValidationErrorType.FOLDER_ALREADY_EXISTS]
                });
            }

            try {
                const newFolder = await FolderModel.create(validated);

                return {
                    status: StatusCodes.OK,
                    data: {
                        folder: folderDocumentToFolderMapper(newFolder),
                    },
                };
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
            }
        }
    )
);

folderController.put(
    apiRoutes.folders.update,
    handleRequest<{ folder: UpdateFolder }, { folder: Folder }>(
        async (req) => {

            const validated = validateOrThrow(UpdateFolderSchema, req.body.folder);

            if (validated.id === validated.parentFolderId) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                    validationErrors: [FolderValidationErrorType.CANNOT_MOVE_INTO_SELF_OR_DESCENDANT],
                });
            }


            const folder = await FolderModel.findById(validated.id);
            if (!folder) throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.NOT_FOUND);

            try {
                if (validated.parentFolderId) {
                    await validateMoveItem(validated, validated.parentFolderId);
                }

                const versionBackup = createFolderVersion(folder, validated);

                folder.previousVersions = [...(folder.previousVersions ?? []), versionBackup];

                Object.assign(folder, validated);

                folder.version = (folder.version) + 1;

                await folder.save();

                return {
                    status: StatusCodes.OK,
                    data: {
                        folder: folderDocumentToFolderMapper(folder),
                    },
                };

            } catch (error: any) {
                if (error.code === 11000) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                        validationErrors: [FolderValidationErrorType.FOLDER_ALREADY_EXISTS],
                    });
                }

                throw error;
            }
        }
    )
);

export default folderController;