import express, {Router} from "express";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {StatusCodes} from "http-status-codes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FolderModel} from "@src/models/Folder";
import {Folder} from "@workspace/types/data";
import {getFolderContents, getFolderTree} from "@src/services/dataService";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";
import {FileModel} from "@src/models/File";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";

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


export default folderController;