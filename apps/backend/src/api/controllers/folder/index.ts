import express, {Router} from "express";
import {Routes} from "@workspace/routes/routes";
import {StatusCodes} from "http-status-codes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FolderModel} from "@src/models/Folder";
import {Folder} from "@workspace/types/data";
import {getFolderTree} from "@src/services/folderService";

const folderController: Router = express.Router();

folderController.get(
    Routes.folders.all,
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
    Routes.folders.byId(':id'),
    handleRequest<{}, { message: string }, { id: string }>(
        async (req) => {
            const {id} = req.params;

            const projects = await FolderModel.create({ name: 'Projects' });
            const archive = await FolderModel.create({ name: 'Archive' });

            // Projects subtree
            const alpha = await FolderModel.create({ name: 'Project Alpha', parentId: projects._id });
            const beta = await FolderModel.create({ name: 'Project Beta', parentId: projects._id });

            await FolderModel.create({ name: 'Designs', parentId: alpha._id });
            await FolderModel.create({ name: 'Reports', parentId: alpha._id });
            await FolderModel.create({ name: 'Specs', parentId: beta._id });

            // Archive subtree
            const y2022 = await FolderModel.create({ name: '2022', parentId: archive._id });
            const y2023 = await FolderModel.create({ name: '2023', parentId: archive._id });

            await FolderModel.create({ name: 'Q1', parentId: y2023._id });

            return {
                status: StatusCodes.OK,
                data: {message: `success${id}`},
            };
        }
    )
);


export default folderController;