import express, {Router} from "express";
import {Routes} from "@workspace/routes/routes";
import {StatusCodes} from "http-status-codes";
import {handleRequest} from "@src/api/utils/handleRequest";

const folderController: Router = express.Router();

folderController.get(
    Routes.folders.byId(':id'),
    handleRequest<{}, { message: string }, { id: string }>(
        async (req) => {
            const {id} = req.params;
            return {
                status: StatusCodes.OK,
                data: {message: `success${id}`},
            };
        }
    )
);


export default folderController;