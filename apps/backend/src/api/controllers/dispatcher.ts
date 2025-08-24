import express, {Router} from 'express';
import folderController from "@src/api/controllers/folder";
import {ApiRoutes} from "@workspace/routes";
import fileController from "@src/api/controllers/file";
import authController from "@src/api/controllers/auth";
import dataController from "@src/api/controllers/data";


const dispatcher: Router = express.Router();

dispatcher.use(ApiRoutes.auth.base, authController);
dispatcher.use(ApiRoutes.folders.base, folderController);
dispatcher.use(ApiRoutes.files.base, fileController);
dispatcher.use(ApiRoutes.data.base, dataController);

export default dispatcher;
