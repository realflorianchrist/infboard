import express, {Router} from "express";
import {apiRoutes} from "@workspace/routes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {Data} from "@workspace/types";
import {StatusCodes} from "http-status-codes";
import {FolderModel} from "@src/models/Folder";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";
import {FileModel} from "@src/models/File";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";

const searchController: Router = express.Router();

const escapeSearch = (search: string) => {
    return search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

searchController.get(
    apiRoutes.search.preview,
    handleRequest<{}, { searchPreviews: Data[] }, {}, { search: string }>(
        async (req) => {
            const search = req.query.search.trim();

            if (!search) {
                return {
                    status: StatusCodes.OK,
                    data: {searchPreviews: []},
                };
            }

            const PREVIEW_RESULT_LIMIT = 8;

            const escapedSearch = escapeSearch(search);
            const regex = new RegExp(`^${escapedSearch}`, "i");

            const folders = await FolderModel
                .find({name: regex})
                .limit(PREVIEW_RESULT_LIMIT);

            let results: Data[] = folders.map(folderDocumentToFolderMapper);

            if (results.length < PREVIEW_RESULT_LIMIT) {
                const files = await FileModel
                    .find({name: regex})
                    .limit(PREVIEW_RESULT_LIMIT - results.length);

                results = results.concat(files.map(f => fileDocumentToFileMapper(f)));
            }

            return {
                status: StatusCodes.OK,
                data: {searchPreviews: results},
            };
        }
    )
);

export default searchController;
