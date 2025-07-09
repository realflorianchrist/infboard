import express, {Router} from "express";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {StatusCodes} from "http-status-codes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FolderModel} from "@src/models/Folder";
import {Folder} from "@workspace/types/data";
import {getFolderContents, getFolderTree} from "@src/services/dataService";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";

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
    handleRequest<{ name: string, parentFolderId: string | null }, { folder: Folder }>(
        async (req) => {

            const {name, parentFolderId} = req.body;

            try {
                const newFolder = await FolderModel.create({name, parentFolderId});

                return {
                    status: StatusCodes.OK,
                    data: {
                        folder: {
                            id: newFolder._id.toString(),
                            name: newFolder.name,
                            parentFolderId: newFolder.parentFolderId?.toString(),
                        },
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
    handleRequest<{ folder: Folder }, { folder: Folder }>(
        async (req) => {

            const {folder} = req.body;

            const updatedFolder = await FolderModel.findByIdAndUpdate(
                folder.id,
                { name: folder.name },
                { new: true }
            );

            if (!updatedFolder) {
                throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.NOT_FOUND);
            }

            return {
                status: StatusCodes.OK,
                data: {
                    folder: {
                        id: updatedFolder._id.toString(),
                        name: updatedFolder.name,
                        parentFolderId: updatedFolder.parentFolderId?.toString(),
                    },
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
                    folder: {
                        id: folder._id.toString(),
                        name: folder.name,
                        parentFolderId: folder.parentFolderId?.toString(),
                    },
                },
            };
        }
    )
);


export default folderController;