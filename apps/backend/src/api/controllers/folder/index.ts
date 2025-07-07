import express, {Router} from "express";
import {Routes} from "@workspace/routes/routes";
import {StatusCodes} from "http-status-codes";

const folderController: Router = express.Router();

folderController.get(Routes.folders.byId(':id'), (req, res) => {
    const {id} = req.params;
    res.status(StatusCodes.OK).json({message: `success${id}`});
});


export default folderController;