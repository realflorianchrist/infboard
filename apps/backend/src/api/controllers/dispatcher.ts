import express, {Router} from 'express';
import folderController from "@src/api/controllers/folder";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import fileController from "@src/api/controllers/file";


const dispatcher: Router = express.Router();

dispatcher.use(ApiRoutes.folders.base, folderController);
dispatcher.use(ApiRoutes.files.base, fileController);

export default dispatcher;
