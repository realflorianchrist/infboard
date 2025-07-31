import express, {Router} from "express";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {StatusCodes} from "http-status-codes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FolderModel, FolderSchema, UpdateFolderSchema} from "@src/models/Folder";
import {Folder, UpdateFolder} from "@workspace/types/data";
import {getFolderContents, getFolderTree} from "@src/services/dataService";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";
import {validateOrThrow} from "@src/api/utils/validateOrThrow";
import {FileValidationErrorType, FolderValidationErrorType} from "@workspace/types/modelValidation";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";


const folderController: Router = express.Router();

folderController.get(
    ApiRoutes.folders.all,
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
    ApiRoutes.folders.byId(':id'),
    handleRequest<{}, { folder: Folder }, { id: string }>(
        async (req) => {
            const {id} = req.params;

            const folder = await getFolderContents(id);

            if (!folder) throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.FOLDER_NOT_FOUND);

            return {
                status: StatusCodes.OK,
                data: {folder},
            };
        }
    )
);

folderController.post(
    ApiRoutes.folders.add,
    handleRequest<{ name: string, parentFolderId?: string }, { folder: Folder }>(
        async (req) => {

            const validated = validateOrThrow(FolderSchema, req.body);

            const { name, parentFolderId } = validated;

            const existing = await FolderModel.findOne({ name, parentFolderId });

            if (existing) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.ALREADY_EXISTS, {
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
    ApiRoutes.folders.update,
    handleRequest<{ folder: UpdateFolder }, { folder: Folder }>(
        async (req) => {

            const validated = validateOrThrow(UpdateFolderSchema, req.body.folder);

            const updatedFolder = await FolderModel.findByIdAndUpdate(
                validated.id,
                {...validated},
                {new: true}
            );

            if (!updatedFolder) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.NOT_FOUND);
            }

            return {
                status: StatusCodes.OK,
                data: {
                    folder: folderDocumentToFolderMapper(updatedFolder),
                },
            };
        }
    )
);

folderController.delete(
    ApiRoutes.folders.delete(':id'),
    handleRequest<{ id: string }, { folder: Folder }>(
        async (req) => {

            const {id} = req.body;

            const folder = await FolderModel.findById(id);
            if (!folder) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.NOT_FOUND);
            }

            await folder.deleteOne();

            return {
                status: StatusCodes.OK,
                data: {
                    folder: folderDocumentToFolderMapper(folder),
                },
            };
        }
    )
);


export default folderController;